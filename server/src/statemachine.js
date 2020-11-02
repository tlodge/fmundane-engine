


import {subscribe} from './listener';
import {send} from './ws';

import actions from './actions/actions.json';

const _fetchrule = async (rule)=>{
    let {evaluate} = await import(`./rules/${rule}.js`);
    return evaluate;
}

const _executeactions = async (alist)=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>resolve(), 100);
    });
}

const StateMachine = (config, socket)=>{
   
    let id = config.id;
    let eventid = config.start.event;
    const {events=[]} = config;
    const eventlookup = events.reduce((acc, item)=>{
        return {
            ...acc,
            [item.id] : item,
        }
    },{});



    events.map(e=>{

        subscribe(e.subscription, async (message)=>{
            
            if (e.id === eventid){
                const evaluate = await _fetchrule(e.type);

                const actionids = e.rules.reduce((acc, item)=>{
                    if (evaluate(item.rule.operator, item.rule.operand, message.toString())){
                        eventid = item.next;
                        return [...acc, item.actions];
                    }
                },[]);
                const _actions = actionids.map(arr=>arr.map((arr)=>arr.map(a=>actions[a]||{})));
                await _executeactions(_actions);
                
                send("stateupdate", {id:config.id,data:eventlookup[eventid]});
                console.log(`${config.id}, set state to ${eventid}`);
            }
        });
    });

   

    return {
        id,
        state: ()=>state,
    }

}

export default StateMachine;
  
  
  
  