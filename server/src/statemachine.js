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
    console.log("in exec actions with", alist);
    //for (const row of alist){
      //  console.log("row is ", row);
        for (const actionlist of alist){
            console.log("action list is", actionlist);
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

        console.log("OK have parallel", parallel);
  //  }
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
                const __startactions =  _actions.map(arr=>(arr||[]).map(a=>actions[a]||{}));
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
        
        console.log(JSON.stringify(event,null,4));

        if (event){
            send("event", {id:config.id,data:event});      
            if (event.onstart){
                const {speech=[], actions:_actions=[]} = event.onstart;
                const __startactions =  _actions.map(arr=>(arr||[]).map(a=>actions[a]||{}));
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

        const sub = (e)=>{
            let nexteventid, triggered;
            event = e;
           
            subscribe(e.subscription, id,  async(_layer, message)=>{
            
                if (_layer != id){
                    return;
                }

                const evaluate = await _fetchrule(e.type);
                
                const actionids = e.rules.reduce((acc, item)=>{ 
                    const result = evaluate(item.rule.operator, item.rule.operand, message.toString());
                    if (result){
                     
                        nexteventid = item.next;
                        triggered = item.id;
                        return [...acc, ...item.actions];
                    }
                    return acc;
                },[]);

                if (triggered){
                   
                    unsubscribe(e.subscription, id);
                    const _actions = actionids.map(arr=>(arr||[]).map(a=>actions[a]||{}));
                    await _executeactions(_actions, message.toString());
                    const _e = eventlookup[nexteventid];

                   
                    
                    if (_e){
                        send("event", {id:config.id,data:_e,triggered});
                        if (_e.onstart){
                            const {speech=[], actions:_actions=[]} = _e.onstart;
                          
                           
                            const __startactions =  _actions.map(arr=>(arr||[]).map(a=>actions[a]||{}));
                            
                            await Promise.all([_executeactions(__startactions), _executespeech(speech)]);
                        
                        }
                        send("ready", {layer:config.id, event:{id:nexteventid, type:_e.type}});
                      
                        
                       
                        //race condition here - it's possible that the speech on onstart is still being processed by the browesr and then sent 
                        //here, and if we've subcribed to the new event, and it is also a speech event then it may receive this speech and act on it..
                        //to get round this we give a little bit of time for this to happen before we subscribe.
                        if (_e.type==="speech"){
                            setTimeout(
                                ()=>{
                                    console.log('subscribing to next event!')
                                    console.log("NEXT EVENT IS", _e);
                                    sub(_e)
                                }
                            ,1000);
                        }else{
                            sub(_e);
                        }
                    }
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
  
  
  
  