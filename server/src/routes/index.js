import express from 'express';
import {send} from '../listener';
import {send as wssend} from '../ws';
import sm from '../statemachine';
import actions from '../actions/actions';
import {handle} from '../actionhandler';
import fs from 'fs'

let _layers = [];

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


//const _layers = fs.readdirSync(__dirname.replace("routes","layers")).filter(f=>f.startsWith("layer")).map(f => format(require(`../layers/${f}`)));
//console.log(_layers);

const events = (layers)=>layers.reduce((acc,item)=>{
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

//indexRouter.get('/', (req, res) => res.status(200).json({ message: testEnvironmentVariable }));

const statemachines = [];

const children = (seen, events, node, trigger, actions=[])=>{
    
    if (!node){
        return;
    }
    if (seen.indexOf(node.id) != -1){
        return {
            id: node.id,
            name: node.name || node.id,
            trigger,
        };
    }
    return {
        id: node.id,
        name: node.name || node.id,
        trigger,
        children: (node.rules || []).map(r=>children([...seen,node.id], events, events[r.next]||"", r.id, actions)).filter(t=>t),
        links : (node.rules || []).reduce((acc, r)=>{
            const key = /*trigger ? `${trigger}` :*/ `${node.id}->${r.next||""}`;
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

    console.log("in tree and events are", JSON.stringify(events,null,4));

    const t = {
        events,
        tree: children([], events, events[layer.start.event],null,[])
    }

    console.log(JSON.stringify(t,null,4));
    return t;
}

indexRouter.get('/layers', (req, res)=>{
    console.log(req.query);
    const {layer="layer1.json"} = req.query;
    console.log("have layer", layer);

    const _lfile = fs.readFileSync(`authored/${layer}`);
    
   

  
    _layers = [format(JSON.parse(_lfile))];
    //console.log("READ IN FILE", JSON.stringify(_layers,null,4));

    res.status(200).json(_layers.map(l=>tree(l)));
});

indexRouter.get('/start', (req, res)=>{
    console.log("ok in start with layers", _layers);
    //const {layer="layer1.json"} = req.query;

    //const _lfile = fs.readFileSync(`authored/${layer}`);
    //const _layers = [JSON.parse(_lfile)];

    //console.log("have layers", _layers);

    if (statemachines.length <= 0){
        for (const l of _layers){
            statemachines.push(sm(l))
        }
    }else{
        statemachines.map(sm=>sm.reset());
    }
    
    
    res.status(200).json(events(_layers));
    
    statemachines.map( async s=>{
       
         for (const alist of s.start.actions){
            const promises =  alist.map(id=>handle(actions[id]));
            await Promise.all(promises);
        }
        
        console.log("statemachine", s);
        for (const alist of s.start.actions){
           await  wssend("action", alist.map(id=>actions[id]));
        }
        wssend("ready", {layer:s.id, event:s.start.event});
        
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
