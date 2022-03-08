import express from 'express';
import fs from 'fs'
import {handle, handlespeech} from '../actionhandler';
import actiontmpl from '../actions/actions.json';
import ips from '../actions/IPs.json';
import { replaceAll, convertToTwine, renderSpeech } from '../utils';

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
        console.log("calling handle", a);
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
    const {name} = req.query;
    const file = fs.readFileSync(`authored/${name}.json`);
    const layers = JSON.parse(file);
    console.log(convertToTwine(layers));
    res.status(200).json({});
});

authorRouter.get("/render", (req, res)=>{
    const {name} = req.query;
    const file = fs.readFileSync(`authored/${name}.json`);
    const layers = JSON.parse(file);
    console.log(renderSpeech(layers));
})



export default authorRouter;
