import {subscribe, unsubscribe} from './listener';
import {send} from './ws';

import actions from './actions/actions.json';
import {handle, handlespeech} from './actionhandler';

const _fetchrule = async (rule)=>{
    let {evaluate} = await import(`./rules/${rule}.js`);
    return evaluate;
}

const callserially = async (list, cb)=>{

   

    for (const a of list){
        await handle(a);
    }
    cb();
}

const _executeactions = async (alist, value="")=>{
    const parallel = [];

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
            
           
            
           
            parallel.push({list:_alist, cb:()=>{send("action", _alist)}});
            
            //send("action", _alist);
        }
    }
    await Promise.all(parallel.map(async(p)=>{
        await callserially(p.list,p.cb);
    }));
  
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

const StateMachine =   (config)=>{

    let id;
    let event;
    const {events = []} = config;
       
    const eventlookup = events.reduce((acc, item)=>{
        return {
            ...acc,
            [item.id] : item,
        }
    },{});

    const reset = async ()=>{
        nexteventid = config.start.event;
     
        if (event){  
            //send the ready early -- or perhaps an init message?

            
            
            if (event.onstart){
                const __startactions = event.onstart.map(a=>actions[a]);
                //_executestart(__startactions, "");//message.toString());
                await _executespeech(event.onstart)
            }
            send("ready", {layer:config.id, event:{id:nexteventid, type:event.type}});    
            //send("event", {id:config.id,data:eventlookup[nexteventid],triggered});
        }
    }

    const _unsubscribe = ()=>{
        events.map( (e)=>{
            console.log("unsubscribing from", e);
            unsubscribe(e.subscription);
        });
    }

    //TODO - onl;y subscribe to the current event!, when there is a change, unsubscribe and subscribe to the next one!
    const init = async()=>{
        id = config.id;
        let eventid = config.start.event;  
        event = eventlookup[eventid];
        
        if (event){      
            if (event.onstart){
                await _executespeech(event.onstart);
            }    
        }

        send("ready", {layer:config.id, event:{id:eventid, type: event.type}});
       
        const sub = (e)=>{
            
            console.log("subscribing to", e.id, e.subscription, id);

            subscribe(e.subscription, id,  async(message)=>{
            
                console.log("********* seen new event", e.subscription, " *************************");

                let nexteventid, triggered;

                const evaluate = await _fetchrule(e.type);

                const actionids = e.rules.reduce((acc, item)=>{ 
                    const result = evaluate(item.rule.operator, item.rule.operand, message.toString());
                    if (result){
                        console.log("triggered ", item.next, "=>", item.id);
                        nexteventid = item.next;
                        triggered = item.id;
                        return [...acc, item.actions];
                    }
                    return acc;
                },[]);

                if (triggered){
                    unsubscribe(e.subscription);
                    const _actions = actionids.map(arr=>arr.map((arr)=>arr.map(a=>actions[a]||{})));
                    await _executeactions(_actions, message.toString());
                    const _e = eventlookup[nexteventid];

                    console.log("my new event is", _e);
                    
                    if (_e){
                        if (_e.onstart){
                            console.log("sending", {id:config.id,data:e,triggered});
                            send("event", {id:config.id,data:_e,triggered});
                            await _executespeech(_e.onstart);
                        }
                        sub(_e);
                        console.log("sending", {layer:config.id, event:{id:nexteventid, type:_e.type}});
                        send("ready", {layer:config.id, event:{id:nexteventid, type:_e.type}});
                    }
                }
            })
        }

        sub(event);
    }

    /*
    const init = async ()=>{
        console.log("OK IN INIT WITH id", config.id);
        id = config.id;
        let nexteventid = config.start.event;
        let triggered = "";

        event = eventlookup[nexteventid];

        if (event){      
            if (event.onstart){
                //const __startactions = event.onstart.map(a=>actions[a]);
                //_executestart(__startactions, "");//message.toString());
                await _executespeech(event.onstart);
            }    
        }
        send("ready", {layer:config.id, event:{id:nexteventid, type: event.type}});

        events.map( (e)=>{
        
            subscribe(e.subscription, id, async(message)=>{
                
                

                if (e.id == nexteventid){
            
                    const evaluate = await _fetchrule(e.type);        
                    const actionids = e.rules.reduce((acc, item)=>{ 
                        const result = evaluate(item.rule.operator, item.rule.operand, message.toString());
                        if (result){
                            console.log("HAVE A RESULT!!");
                            nexteventid = item.next;
                            triggered = item.id;
                            return [...acc, item.actions];
                        }
                        return acc;
                    },[]);
              
                  
                    //do the previous event's actions
                    if (actionids.length > 0){
                        const _actions = actionids.map(arr=>arr.map((arr)=>arr.map(a=>actions[a]||{})));
                        await _executeactions(_actions, message.toString());
                    
                        const event = eventlookup[nexteventid];
                    
                        if (event.onstart){
                            //const __startations = event.onstart.map(a=>actions[a]);
                            console.log("TROGGERING NEW EVENT", event);
                            send("event", {id:config.id,data:event,triggered});
                            await _executespeech(event.onstart);
                            //await _executestart(__startactions, message.toString());
                        }

                        send("ready", {layer:config.id, event:{id:nexteventid, type:event.type}});
                    }
                }
            });
        });
    }*/
   
    return {
        id,
        init,
        state: ()=>state,
        reset,
        unsubscribe: _unsubscribe,
        start: config.start,
    }

}

export default StateMachine;
  
  
  
  