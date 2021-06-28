


import {subscribe} from './listener';
import {send} from './ws';

import actions from './actions/actions.json';
import {handle, handlespeech} from './actionhandler';

const _fetchrule = async (rule)=>{
    let {evaluate} = await import(`./rules/${rule}.js`);
    return evaluate;
}

const _executeactions = async (alist, value="")=>{

    for (const row of alist){
        for (const actionlist of row){
            //swap in any params
            const _alist = actionlist.map((a)=>{
                const astr = JSON.stringify(a);
                var matches = astr.match(/\|(.*?)\|/);
                if (matches){
                    const toreplace = matches[0];
                    const tokens = matches[1].split(":");
                    const delimiter = tokens.length > 1 ? ` ${tokens[1]} ` : ",";
                    return JSON.parse(JSON.stringify(a).replace(toreplace,value.trim().split(" ").join(delimiter)));
                }
                return a;
            });
            
           

            for (const a of _alist){
                await handle(a);
            }
            
            send("action", _alist);
        }
    }
}

const _executestart = async (alist, value="")=>{
    //swap in any params
    const _alist = alist.map((a)=>{
        const astr = JSON.stringify(a);
        var matches = astr.match(/\|(.*?)\|/);
        if (matches){
            const toreplace = matches[0];
            const tokens = matches[1].split(":");
            const delimiter = tokens.length > 1 ? ` ${tokens[1]} ` : ",";
            return JSON.parse(JSON.stringify(a).replace(toreplace,value.trim().split(" ").join(delimiter)));
        }
        return a;
    });
    
   

    for (const a of _alist){
        await handle(a);
    }
    send("action", _alist);
   
}

const _executespeech = async (lines)=>{
    await handlespeech(lines);
}

const StateMachine =  (config)=>{

    let id = config.id;
    let nexteventid = config.start.event;
    let triggered = "";


    const {events=[]} = config;
    const eventlookup = events.reduce((acc, item)=>{
        return {
            ...acc,
            [item.id] : item,
        }
    },{});
    
    const event = eventlookup[nexteventid];
    
    console.log("***** Event is", event);

    if (event){      
        if (event.onstart){
            console.log("onstart is", event.onstart);
            const __startactions = event.onstart.map(a=>actions[a]);
            //_executestart(__startactions, "");//message.toString());
            _executespeech(event.onstart)
        }
        send("ready", {layer:config.id, event:nexteventid});
        //send("event", {id:config.id,data:eventlookup[nexteventid],triggered});
    }

    const reset = ()=>{
        console.log("ok seen reset!");

        nexteventid = config.start.event;
        const _event = eventlookup[nexteventid];
        if (event){      
            if (event.onstart){
                console.log("onstart is", event.onstart);
                const __startactions = event.onstart.map(a=>actions[a]);
                //_executestart(__startactions, "");//message.toString());
                _executespeech(event.onstart)
            }
            send("ready", {layer:config.id, event:nexteventid});
            //send("event", {id:config.id,data:eventlookup[nexteventid],triggered});
        }
    }

    console.log("ok triggered is", triggered);

    events.map( (e)=>{
       
      
        subscribe(e.subscription,  async(message)=>{
            console.log("event is",e.id, " troggred is", triggered);

            if (e.id == nexteventid){
                console.log("ok have event", e.id);

               const evaluate = await _fetchrule(e.type);
                
                const actionids = e.rules.reduce((acc, item)=>{
                    

                    console.log("have items", item);
                    console.log("evaluating", item.rule.operator, item.rule.operand, message.toString());

                    const result = evaluate(item.rule.operator, item.rule.operand, message.toString());
                    
                    console.log("result is", result);

                    if (result){
                        nexteventid = item.next;
                        triggered = item.id;
                        return [...acc, item.actions];
                    }
                    return acc;
                },[]);
              
                //call next eventid!!
                //do the previous event's actions
                const _actions = actionids.map(arr=>arr.map((arr)=>arr.map(a=>actions[a]||{})));
                await _executeactions(_actions, message.toString());
                
                
                console.log("the next event is", nexteventid);
                const event = eventlookup[nexteventid];
                //then trigger the start of the next event!
               
                if (event.onstart){
                    console.log("onstart is", event.onstart);
                    //const __startactions = event.onstart.map(a=>actions[a]);
                    //console.log(__startactions);
                    send("event", {id:config.id,data:event,triggered});
                    await _executespeech(event.onstart);
                    //await _executestart(__startactions, message.toString());
                }else{
                    console.log("hmm nowt troggerd!");
                }
   //
                send("ready", {layer:config.id, event:nexteventid});
                //send that are ready for input??*/

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
  
  
  
  