import express from 'express';
import {send} from '../listener';
import sm from '../statemachine';
import fs from 'fs'


let _layers = [];

const format = (l)=>{
    return {
        ...l,
        events: l.events.map((e,i)=>{
            return {
                ...e,
                rules: (e.rules||[]).map((r,j)=>{
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

let statemachines = [];
let _seen   = {};

const extractplaceholderfromaction = (actions)=>{
    console.log("extracting placholder", JSON.stringify(actions,null,4));
    const items = {};
    for (const action of actions){
        const placeholders = [];
        const input = JSON.stringify(action,null,4);
        const indexes = [...input].reduce((acc,item,i)=>{
            if (item === "|"){
                return [...acc, i];
            }
            return acc;
        },[]);
        console.log(indexes);
    
  
        for (let i = 0; i < indexes.length; i+=2){
            placeholders.push(input.substring(indexes[i]+1,indexes[i+1]))
        }
        console.log(placeholders)
        items[action.action] = placeholders;
    }
    console.log(JSON.stringify(items,null,4))
    return items;
}

const extractplaceholders = (node)=>{
    const {onstart, rules} = node;
    const {actions: osactions} = onstart;
    const {actions: ractions} = rules;
    const actions = [...(osactions || []), ...(ractions||[])];
    let placeholders = {};

    for (const action of actions){
        if (JSON.stringify(action).indexOf("|") != -1){
            placeholders = {...placeholders, ...extractplaceholderfromaction(action)};
        }
    }
    
    return placeholders;
}

const children = (events, node, trigger, actions=[])=>{
    
    if (!node){
        return;
    }
    if (_seen[node.id])
    {           
        return{
            id: node.id,
            name: node.name || node.id,
            trigger,
        }
    }
    _seen[node.id] = true;

    //this is wheer we add placeholders
    const placeholders = {
        placeholders : extractplaceholders(node)
    }

    return {
        id: node.id,
        name: node.name || node.id,
        trigger,
        children: (node.rules || []).map(r=>children(events, events[r.next]||"", r.id, actions)).filter(t=>t),
        links : (node.rules || []).reduce((acc, r)=>{
            const key = /*trigger ? `${trigger}` :*/ `${node.id}->${r.next||""}`;
            return {
                ...acc,
                //[`${node.id}->${r.next}`]: {rid: r.id, actions:r.actions, rule:r.rule}
                [r.id]: {rid: r.id, actions:r.actions, rule:r.rule}
            }
        },{}),
        ...placeholders,
    }
    
}


const tree = (layer)=>{
    
    const events = layer.events.reduce((acc, item)=>{
        return {
            ...acc,
            [item.id] : item, 
        }
    }, {});

    _seen = {};

    const t = {
        layerid: layer.id,
        events,
        tree: children(events, events[layer.start.event],null,[])
    }

   
    return t;
}

indexRouter.get('/layers', (req, res)=>{
    
    console.log("ok getting layers!!");

    const {layer="layer1.json"} = req.query;
    const _lfile = fs.readFileSync(`authored/${layer}.json`);
    const _ljson = JSON.parse(_lfile);
    
    _layers = _ljson.map(f => format(f));
    //console.log(JSON.stringify(_layers,null,4));
    res.status(200).json(_layers.map(l=>tree(l)));
});

indexRouter.get('/start', async (req, res)=>{
   
    //need to reset everything here..!
    

    if (statemachines.length > 0){
        for (const statem of statemachines){    
            statem.unsubscribe();
        }
    }
    statemachines = [];

    const parallel = [];
    
    if (statemachines.length <= 0){
        for (const l of _layers){
            const smac = sm(l);
            //await smac.init();
            parallel.push(()=>{
                smac.init();
                statemachines.push(smac);
            })
        }
    }else{
        for (const sm of statemachines){
            parallel.push( ()=>{
                 sm.reset();
            })
        }
    }

    await Promise.all(parallel.map(async(p)=>{
        await p();
    }));
   
    res.status(200).json(events(_layers));
});

indexRouter.get('/trigger', (req, res)=>{
    const {node,layer} = req.query;
    send(`/trigger/${layer}`, JSON.stringify({node,layer}));
    res.status(200).json({node});
});

indexRouter.get('/webhook', (req,res)=>{
    console.log("ok seen a webhook come in!");
    const {trigger} = req.query;
    send("/webhook", JSON.stringify({data:trigger}));
    res.status(200).json({trigger});
});

indexRouter.get('/press', (req, res)=>{
    const ts = Date.now();
    const {name, layer} = req.query;
    send("/press", JSON.stringify({data:name, layer, ts}));
    res.status(200).json({ press: name });
}); 

indexRouter.get('/gesture', (req, res)=>{
    const ts = Date.now();
    const {gesture, layer} = req.query;
    send("/gesture", JSON.stringify({data:gesture, layer, ts}));
    res.status(200).json({gesture});
});

indexRouter.get('/speech', (req, res)=>{
    const ts = Date.now();
    const {speech, layer} = req.query;
    send("/speech", JSON.stringify({data:speech, layer, ts}));
    res.status(200).json({ speech });
}); 





export default indexRouter;
