import express from 'express';
import fs from 'fs'
import {handle, handlespeech} from '../actionhandler';

const authorRouter = express.Router();
 
authorRouter.post('/save', (req, res)=>{
    const {layer, name} = req.body;
    const files = fs.readdirSync("authored");
    fs.writeFileSync(`authored/${name}.json`, JSON.stringify([layer],null,4));
    res.status(200).json({});
});
 
authorRouter.post('/audiotest', async (req, res)=>{
    const {lines} = req.body;
    await handlespeech(lines);
    res.status(200).json({});
});

authorRouter.get("/authored", (req,res)=>{
    const files = fs.readdirSync("authored");
    const eligible = files.filter(f=>f.endsWith(".json")).map(f=>f.replace(".json",""));
    res.status(200).json({layers:eligible});
});



export default authorRouter;
