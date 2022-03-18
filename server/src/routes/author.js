import express from 'express';
import fs, { appendFile } from 'fs'
import {handle, handlespeech} from '../actionhandler';
import actiontmpl from '../actions/actions.json';
import ips from '../actions/IPs.json';
import { replaceAll, convertToTwine, renderSpeech } from '../utils';
import request from 'superagent';
const actions = JSON.parse(Object.keys(ips).reduce((acc, key)=>{
    return replaceAll(acc, `[${key}]`,ips[key]);    
   
},JSON.stringify(actiontmpl)));

const authorRouter = express.Router();
 
authorRouter.post('/save', (req, res)=>{
    const {layer, name} = req.body;
    fs.writeFileSync(`authored/${name}.json`, JSON.stringify(layer,null,4));
    res.status(200).json({});
});
 
authorRouter.post('/audiotest', async (req, res)=>{
    const {lines} = req.body;
    await handlespeech(lines);
    res.status(200).json({});
});

authorRouter.post('/actiontest', async (req, res)=>{
    const {actions:_actions} = req.body;
    for (const a of _actions){
        await handle({...a, action:actions[a.action]});
    }
    res.status(200).json({});
});

authorRouter.get("/authored", (req,res)=>{
    const files = fs.readdirSync("authored");
    const eligible = files.filter(f=>f.endsWith(".json")).map(f=>f.replace(".json",""));
    res.status(200).json({layers:eligible});
});

authorRouter.get("/translate", (req,res)=>{
    console.log("server - seen a translate request!");
    const {name} = req.query;
    console.log(`authored/${name}.json`);
    const file = fs.readFileSync(`authored/${name}.json`);
    
    try{
        const layers = JSON.parse(file);
        const html = convertToTwine(name, layers);
        res.status(200).json({html});
    }catch(err){
        console.log(err);
        res.status(200).json({error:"could not parse file"});
    }
    
    
});


const lookup = {
    "Daniel":"p226",
    "Fred":"p228",
    "Richard":"p230",
    "Dave":"p231",
    "Robin":"p234",
    "Charlie":"p236",
    "Kate":"p237",
    "Ed":"p239",
    "Geeta":"p240",
    "Paul":"p241",
    "Eleanor":"p243",
    "Molly":"p245",
    "Izzy":"p248",
    "Holly":"p374",
    "Nadia":"p362",
    "Chloe":"p361",
}


authorRouter.get("/render", async (req, res)=>{
    const {name} = req.query;
    const file = fs.readFileSync(`authored/${name}.json`);
    const layers = JSON.parse(file);
    const results = renderSpeech(layers);
    
    let _layers = [];
    
    for (const layer of results){
        const {node} = layer;
        _layers = [..._layers, node];
    }

    if (_layers.length > 0){
        fs.writeFileSync(`authored/${name}_rendered.json`, JSON.stringify(_layers,null,4));
    }

    for (const layer of results){
       
        const {torender,node} = layer;
       
        for (const line of torender){
            const [name, text, voice] = line;
            const _voice = lookup[voice]||"p300";
            const result = await request.get('http://localhost:5002/api/generate').query({t:text, v:_voice, n:name});
            res.write(text);
        }
    }
    res.end();//status(200).json({data:results.map(r=>r.node)});
})



export default authorRouter;
