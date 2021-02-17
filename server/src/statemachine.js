


import {subscribe} from './listener';
import {send} from './ws';

import actions from './actions/actions.json';
import {handle} from './actionhandler';

const _fetchrule = async (rule)=>{
    let {evaluate} = await import(`./rules/${rule}.js`);
    return evaluate;
}



const _executeactions = async (alist, value="")=>{
    for (const row of alist){
        for (const actionlist of row){

            const promises = actionlist.map((a)=>handle(a));
            await Promise.all(promises);
            
            send("action", actionlist.map(a=>{
                const astr = JSON.stringify(a);
                var matches = astr.match(/\|(.*?)\|/);
                if (matches){
                    const toreplace = matches[0];
                    const tokens = matches[1].split(":");
                    const delimiter = tokens.length > 1 ? ` ${tokens[1]} ` : ",";
                    return JSON.parse(JSON.stringify(a).replace(toreplace,value.trim().split(" ").join(delimiter)));
                }
                return a;
            }));

          
        }
    }

    //return new Promise((resolve, reject)=>{
    //    send("action", {id:config.id,data:eventlookup[eventid]});
        //setTimeout(()=>resolve(), 100);
    //});
}

const StateMachine = (config)=>{
   
    let id = config.id;
    let eventid = config.start.event;
    let triggered = "";

    const {events=[]} = config;
    const eventlookup = events.reduce((acc, item)=>{
        return {
            ...acc,
            [item.id] : item,
        }
    },{});


    const reset = ()=>{
        eventid = config.start.event;
    }

    events.map(e=>{
       
        subscribe(e.subscription, async (message)=>{
           
            if (e.id === eventid){
                console.log("fetching rule for", e.type);

                const evaluate = await _fetchrule(e.type);

                console.log("evaluate is", evaluate);
                
                const actionids = e.rules.reduce((acc, item)=>{
                    
                    console.log("evaluating", item.rule.operator, item.rule.operand, message.toString());

                    const result = evaluate(item.rule.operator, item.rule.operand, message.toString());
                    
                    console.log("result is", result);

                    if (result){
                        eventid = item.next;
                        triggered = item.id;
                        return [...acc, item.actions];
                    }
                    return acc;
                },[]);

                const _actions = actionids.map(arr=>arr.map((arr)=>arr.map(a=>actions[a]||{})));
                await _executeactions(_actions, message.toString());
                console.log("SENDING EVENT", {id:config.id,data:eventlookup[eventid],triggered});
                send("event", {id:config.id,data:eventlookup[eventid],triggered});
            }
        });
    });

   

    return {
        id,
        state: ()=>state,
        reset,
        start: config.start,
    }

}

export default StateMachine;
  
  
  
  