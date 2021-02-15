import express from 'express';
import { testEnvironmentVariable } from '../settings';
import {send} from '../listener';
import {send as wssend} from '../ws';
import sm from '../statemachine';
import _l1 from '../layers/layer1.json';
import _l2 from '../layers/layer2.json';
import actions from '../actions/actions';
import {handle} from '../actionhandler';

const format = (l)=>{
    return {
        ...l,
        events: l.events.map((e,i)=>{
            return {
                ...e,
                rules: e.rules.map((r,j)=>{
                    return {
                        id: `${e.id}${i}${j}`,
                        ...r,
                    }
                })
            }
        })
    }
}

const l1 = format(_l1);
const l2 = format(_l2);

const events = [l1,l2].reduce((acc,item)=>{
    const startevent = item.start.event;
    const event = item.events.reduce((acc, item)=>{
        if (item.id == startevent){
            return item;
        }
        return acc;
    },null);
    return [...acc, {id:item.id, data:event}];
},[]);

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => res.status(200).json({ message: testEnvironmentVariable }));

const statemachines = [];

const children = (seen, events, node, trigger, actions=[])=>{
    
    if (!node){
        return;
    }
    if (seen.indexOf(node.id) != -1){
        return {
            name: node.id,
            trigger,
        };
    }
    return {
        name: node.id,
        trigger,
        children: (node.rules || []).map(r=>children([...seen,node.id], events, events[r.next], r.id, actions)),
        links : (node.rules || []).reduce((acc, r)=>{
            const key = /*trigger ? `${trigger}` :*/ `${node.id}->${r.next}`;
            return {
                ...acc,
                //[`${node.id}->${r.next}`]: {rid: r.id, actions:r.actions, rule:r.rule}
                [r.id]: {rid: r.id, actions:r.actions, rule:r.rule}
            }
        },{})
    }
    
}


const tree = (layer)=>{
    
    const events = layer.events.reduce((acc, item)=>{
        return {
            ...acc,
            [item.id] : item, 
        }
    }, {});

    return {
        events,
        tree: children([], events, events[layer.start.event],null,[])
    }
}

console.log("tree is" , JSON.stringify(tree(l1),null,4));

indexRouter.get('/layers', (req, res)=>{
    res.status(200).json([tree(l1),tree(l2)]);
});

indexRouter.get('/start', (req, res)=>{
    if (statemachines.length <= 0){
        statemachines.push(sm(l1))
        statemachines.push(sm(l2));
    }else{
        statemachines.map(sm=>sm.reset());
    }
    
    
    res.status(200).json(events);
    
    statemachines.map( async s=>{
       
         for (const alist of s.start.actions){
            const promises =  alist.map(id=>handle(actions[id]));
            await Promise.all(promises);
        }
        

        for (const alist of s.start.actions){
            wssend("action", alist.map(id=>actions[id]));
        }
        
    })
});

indexRouter.get('/press', (req, res)=>{
    const {name} = req.query;
    send("/press", name);
    res.status(200).json({ press: name });
}); 

indexRouter.get('/gesture', (req, res)=>{
    const {gesture} = req.query;
    send("/gesture", gesture);
    res.status(200).json({gesture});
});

indexRouter.get('/speech', (req, res)=>{
    const {speech} = req.query;
    send("/speech", speech);
    res.status(200).json({ speech });
}); 

export default indexRouter;