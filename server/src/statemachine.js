import {subscribe, unsubscribe} from './listener';
import {send} from './ws';

import actiontmpl from './actions/actions.json';
import ips from './actions/IPs.json';
import {handle, handlespeech} from './actionhandler';
import {replaceAll} from './utils';


const actions = JSON.parse(Object.keys(ips).reduce((acc, key)=>{
    return replaceAll(acc, `[${key}]`,ips[key]);    
   
},JSON.stringify(actiontmpl)));


console.log("actiomn are");
console.log(JSON.stringify(actions,null,4));

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

const _executeactions = async (alist, placeholders={})=>{
    const parallel = [];
   

    //for (const row of alist){
      //  console.log("row is ", row);
        for (const actionlist of alist){
          
            //swap in any params
            const _alist = actionlist.map((a)=>{
                const astr = JSON.stringify(a.action);
                var matches = astr.matchAll(/\|(.*?)\|/g);

                for (const match of matches){
                    const toreplace = match[0];
                    const key = match[1].split(":")[0];
                
                    const replacement = (placeholders[key] || "").split(/\s+/);
                    if (replacement){
                        const tokens = match[1].split(":");
                        const delimiter = tokens.length > 1 ? ` ${tokens[1]} ` : ",";
                        astr = replaceAll(astr, toreplace,replacement.join(delimiter));
                       
                    }
                }
                return  {...a, action:JSON.parse(astr)}
            });
          

            parallel.push({list:_alist, cb:()=>{
                send("action", _alist.map(a=>a.action))
            }});
            
            //send("action", _alist);
        }

   
  //  }
  

    await Promise.all(parallel.map(async(p)=>{
     
        await callserially(p.list,p.cb);
    }));


}

const _executespeech = async (lines, placeholders={})=>{
   
    if (placeholders && Object.keys(placeholders).length > 0){
        const _lines = lines.map(l=>{
            var matches = l.words.matchAll(/\|(.*?)\|/g);
            let _words = l.words;

            for (const match of matches){
                
                const toreplace = match[0];
                const key = match[1].split(":")[0];
                const replacement = (placeholders[key] || "").split(/\s+/);

                if (replacement){
                    const tokens = match[1].split(":");
                    const delimiter = tokens.length > 1 ? ` ${tokens[1]} ` : ",";
                    _words = replaceAll(_words,toreplace,replacement.join(delimiter));
                }
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
    let placeholders = {};
    const eventlookup = events.reduce((acc, item)=>{
        return {
            ...acc,
            [item.id] : item,
        }
    },{});

    const formataction = (a)=>{
        console.log("in format action with",a);
        
        if (actions[a.action]) 
            return actions[a.action];

        console.log("NOT FOUND ACTION IN ACTIONS!");

        const method = a.method || "GET";
        
        const base = {
            "type":"request",
            "data":{
               "url":a.action,
               "type": method,
               "contenttype":"application/json"
            }
        }
        if (method == "GET"){
            return {
                ...base,
                query : a.params,
            }
        }else{
            return {
                ...base,
                body : a.params,
            }
        }
    }

    const reset = async ()=>{
        nexteventid = config.start.event;
     
        if (event){  
            //send the ready early -- or perhaps an init message?
            if (event.onstart){
                const {speech=[], actions:_actions=[]} = event.onstart;
                placeholders = {};
                const __startactions =  _actions.map(arr=>(arr||[]).map(a=>{
                    return {
                        ...a, 
                        action: formataction(a)
                    }
                }));

                await Promise.all([await _executeactions(__startactions), await _executespeech(speech)]);
                
            }
            send("ready", {layer:config.id, event:{id:nexteventid, type:event.type}});    
        }
    }

    const _unsubscribe = ()=>{
        events.map( (e)=>{
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
                const __startactions =  _actions.map(arr=>(arr||[]).map(a=>({...a,action:formataction(a)})));
                await Promise.all([await _executeactions(__startactions, placeholders), await _executespeech(speech, placeholders)]);
            }    
            send("ready", {layer:config.id, event:{id:eventid, type: event.type}});
        }
       
    

        //this is a subscripton to manual triggers (either by clicking nodes in the tree or calling webhook /event/trigger);
        subscribe(`/trigger/${id}`, id, async(msg)=>{

            try{
                
                const {node, layer} = msg;
               
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

        const updateplaceholders = (rule, msg)=>{
            //only assign if rule has triggered
            
            if (rule.assign){
                const {name, value=null} = rule.assign;
                placeholders[name] = value || msg;
            }
        }

        const trigger = async (triggered, e, id, nexteventid, actionids, msg)=>{
          

            const {data} = msg;   
            
           

            unsubscribe(e.subscription, id);
            
            const _actions = actionids.map(arr=>(arr||[]).map(a=>({...a, action:formataction(a)})))
          
            await _executeactions(_actions, placeholders);
        
            const _e = eventlookup[nexteventid];
          
            if (_e){
                send("event", {id:config.id,data:_e,triggered});
                if (_e.onstart){
                    const {speech=[], actions:_sactions=[]} = _e.onstart;
                    const __startactions =  _sactions.map(arr=>(arr||[]).map(a=>({...a, action: formataction(a)})));
                    await Promise.all([await _executeactions(__startactions, placeholders), await _executespeech(speech, placeholders)]);
                }
                send("ready", {layer:config.id, event:{id:nexteventid, type:_e.type}});
              
                sub(_e);
            }
        }

        const sub = (e)=>{
            let nexteventid, triggered, timer;
            event = e;
            if (e.timeout){
                timer = setTimeout(async ()=>{

                   
                    const {rules=[]} = e.timeout;
                   

                    if (rules.length > 0){
                      

                        for (const r of rules){
                          
                            let subject, type;
                            let actionids = [[]];

                            if (r.rule.subject){
                           
                                subject = placeholders[r.rule.subject];

                                type = "variable";
                                actionids = [...(r.rule.actions || [])];
                            }
                            const evaluate = await _fetchrule(type || e.type);
                            const result = evaluate(r.rule.operator, r.rule.operand, subject || "");
                           

                            if (result){
                               
                                trigger(e.id, e, e.id, r.next, actionids, JSON.stringify({data:subject||"",ts:Date.now()}));
                                break;
                            }
                        }
                    }else{
                        const next = e.timeout.next;
                        const triggered = e.id;
                        const actionids = [...(e.timeout.actions || [])];
                        trigger(triggered, e, e.id, next, actionids, JSON.stringify({data:"",ts:Date.now()}));
                    }
                }, e.timeout.wait*1000);
                
            }

            subscribe(e.subscription, id,  async(msg)=>{
             
                triggered = false;
                
                const {data, ts} = msg;     
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
                        updateplaceholders(item.rule, data);
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
                        updateplaceholders(defaultrule.rule, data);
                        nexteventid = defaultrule.next;
                        triggered = defaultrule.id;
                        actionids = [...defaultrule.actions];
                    }
                }

                if (triggered){
                    if (timer){
                        clearTimeout(timer);
                    }
                    trigger(triggered, e, id, nexteventid, actionids, msg);
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
  
  
  
  