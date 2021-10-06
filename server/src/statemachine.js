import {subscribe, unsubscribe} from './listener';
import {send} from './ws';

import actiontmpl from './actions/actions.json';
import ips from './actions/IPs.json';
import {handle, handlespeech} from './actionhandler';
import {replaceAll} from './utils';

const actions = JSON.parse(Object.keys(ips).reduce((acc, key)=>{
    return replaceAll(acc, `[${key}]`,ips[key]);    
   
},JSON.stringify(actiontmpl)));

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
  
    //for (const row of alist){
      //  console.log("row is ", row);
        for (const actionlist of alist){
          
            //swap in any params
            const _alist = actionlist.map((a)=>{
                const astr = JSON.stringify(a.action);
                var matches = astr.match(/\|(.*?)\|/);
                if (matches){
                    const toreplace = matches[0];
                    const tokens = matches[1].split(":");
                    const delimiter = tokens.length > 1 ? ` ${tokens[1]} ` : ",";
                    return  {...a, action:JSON.parse(JSON.stringify(a.action).replace(toreplace,value.trim().split(" ").join(delimiter)))}
                }
                return a;
            });
            
            parallel.push({list:_alist, cb:()=>{
                send("action", _alist.map(a=>a.action))
            }});
            
            //send("action", _alist);
        }

   
  //  }
    console.log("doing send!");
    await Promise.all(parallel.map(async(p)=>{
        console.log("calling", p.list);
        await callserially(p.list,p.cb);
    }));
    console.log("Success!!");
  
}

const _executespeech = async (lines, value)=>{
   
    if (value && value.trim() != ""){
        const _lines = lines.map(l=>{
            var matches = l.words.match(/\|(.*?)\|/);
            let _words = l.words;

            if (matches){
                const toreplace = matches[0];
                const tokens = matches[1].split(":");
                const delimiter = tokens.length > 1 ? ` ${tokens[1]} ` : ",";
                _words = l.words.replace(toreplace,value.trim().split(" ").join(delimiter));
            }
            return {
                ...l,
                words : _words
            }
        })
        await handlespeech(_lines);
    }else{
        await handlespeech(lines);
    }
}

const StateMachine =   (config)=>{

    let event;
    const {events = [], id=""} = config;
       
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
                const {speech=[], actions:_actions=[]} = event.onstart;
                const __startactions =  _actions.map(arr=>(arr||[]).map(a=>({...a, action:actions[a.action]||{}})));
                await Promise.all([await _executeactions(__startactions), await _executespeech(speech)]);
                
            }
            send("ready", {layer:config.id, event:{id:nexteventid, type:event.type}});    
        }
    }

    const _unsubscribe = ()=>{
        events.map( (e)=>{
            console.log("unsubscribing from", e.subscription);
            unsubscribe(e.subscription, config.id);
            unsubscribe(`/trigger/${config.id}`, config.id);
        });
        
    }


    const init = async()=>{
    
        let eventid = config.start.event;  
        event = eventlookup[eventid];

        if (event){
            send("event", {id:config.id,data:event});      
            if (event.onstart){
                const {speech=[], actions:_actions=[]} = event.onstart;
                const __startactions =  _actions.map(arr=>(arr||[]).map(a=>({...a,action:actions[a.action]||{}})));
                await Promise.all([_executeactions(__startactions), _executespeech(speech)]);
            }    
        }
       
        
    
        send("ready", {layer:config.id, event:{id:eventid, type: event.type}});
    

        //this is a subscripton to manual triggers (either by clicking nodes in the tree or calling webhook /event/trigger);
        subscribe(`/trigger/${id}`, id, async(_layer, message)=>{
          
            try{
                const _e = JSON.parse(message.toString());
                const {node, layer} = _e;
               
                const triggeredevent =  eventlookup[node];
                if (triggeredevent){
                    unsubscribe(event.subscription, layer);
                    send("event", {id:config.id,data:triggeredevent});     
                    sub(triggeredevent);
                    send("ready", {layer:config.id, event:{id:node, type:triggeredevent.type}});
                }
            }
            catch(err){

            }
        });

        const trigger = async (triggered, e, id, nexteventid, actionids, message)=>{
           
            console.log("in trigger with actionids", JSON.stringify(actionids,null, 4));

            const msg = JSON.parse(message.toString());
            const {data} = msg;   

            unsubscribe(e.subscription, id);
            const _actions = actionids.map(arr=>(arr||[]).map(a=>({...a, action:actions[a.action]||{}})));
            console.log("ok, actioms ate", JSON.stringify(_actions,null,4));

            await _executeactions(_actions, message.toString());
            const _e = eventlookup[nexteventid];

            if (_e){
                send("event", {id:config.id,data:_e,triggered});
                if (_e.onstart){
                    const {speech=[], actions:_actions=[]} = _e.onstart;
                    const __startactions =  _actions.map(arr=>(arr||[]).map(a=>({...a, action:actions[a.action]||{}})));
                    await Promise.all([_executeactions(__startactions, message.toString()), _executespeech(speech, data)]);
                }
                send("ready", {layer:config.id, event:{id:nexteventid, type:_e.type}});
                sub(_e);
            }
        }

        const sub = (e)=>{
            let nexteventid, triggered, timer;
            event = e;
            
            const subtime = Date.now();
            

            if (e.timeout){
                timer = setTimeout(()=>{
                    console.log("timed out!!!!!")
                    const next = e.timeout.next;
                    const triggered = e.id;
                    const actionids = [...(e.timeout.actions || [])];
                    trigger(triggered, e, e.id, next, actionids, JSON.stringify({data:"",ts:Date.now()}));
                }, e.timeout.wait*1000);
                console.log("-------------------> setting a timeout", e.timeout.wait);
            }

            subscribe(e.subscription, id,  async(_layer, message)=>{
                triggered = false;
                console.log("subscribed", id, e.subscription);
                const msg = JSON.parse(message.toString());
                const {data, ts} = msg;     

                
                if (_layer != id){
                    return;
               }

                const evaluate = await _fetchrule(e.type);
                

                const defaultrule = e.rules.reduce((acc,item)=>{
                    const {rule} = item; 
                    if (rule.default){
                        return item;
                    }
                    return acc;
                }, null);

            
                let actionids = e.rules.filter(r=>!r.rule.default).reduce((acc, item)=>{ 
                    
                    const result = evaluate(item.rule.operator, item.rule.operand, data);

                    if (result){
                        //if this message was received before we subscribed, discard it!
                        //prevents race condition here - it's possible that the speech on onstart is still being processed by the browser and then sent 
                        //here, and if we've subcribed to the new event, and it is also a speech event then it may receive this speech and act on it..
                        //to get round this we give a little bit of time for this to happen before we subscribe.
                        const sinceaction = ts-subtime;
                        console.log(sinceaction);

                        if (e.type==="speech" && sinceaction<2000){
                            return acc;
                        }
                        nexteventid = item.next;
                        triggered = item.id;
                        return [...acc, ...item.actions];
                    }
                    return acc;
                },[]);

                //if nothing else has triggered and there is a default rule...
                if (!triggered && defaultrule){
                    const result = evaluate(defaultrule.rule.operator, defaultrule.rule.operand, data);
                    
                    if (result){

                        const sinceaction = ts-subtime;
                        console.log(sinceaction);
                        
                        if (e.type==="speech" && sinceaction<2000){
                            return;
                        }

                        nexteventid = defaultrule.next;
                        triggered = defaultrule.id;
                        actionids = [...defaultrule.actions];
                    }
                }

                if (triggered){
                    if (timer){
                        console.log("clearing timer!!");
                        clearTimeout(timer);
                    }
                    trigger(triggered, e, id, nexteventid, actionids, message);

                    /*if (timer){
                        console.log("clearing timer!!");
                        clearTimeout(timer);
                    }
                    unsubscribe(e.subscription, id);
                    const _actions = actionids.map(arr=>(arr||[]).map(a=>({...a, action:actions[a.action]||{}})));
                    await _executeactions(_actions, message.toString());
                    const _e = eventlookup[nexteventid];

                   
                    
                    if (_e){
                        send("event", {id:config.id,data:_e,triggered});
                        if (_e.onstart){
                            const {speech=[], actions:_actions=[]} = _e.onstart;
                          
                           
                            const __startactions =  _actions.map(arr=>(arr||[]).map(a=>({...a, action:actions[a.action]||{}})));
                            console.log("PERFORMING ACTIONS...");
                            await Promise.all([_executeactions(__startactions, message.toString()), _executespeech(speech, data)]);
                            console.log("DONE PERFORMING ACTIONS...");
                        }
                        send("ready", {layer:config.id, event:{id:nexteventid, type:_e.type}});
                        
                        sub(_e);
                     
                        
                    }*/
                }
            })
        }

        sub(event);
    }

   
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
  
  
  
  