import express from 'express';
import fs from 'fs'

const authorRouter = express.Router();
 
authorRouter.post('/save', (req, res)=>{
    console.log("yes seen a post!!", req.body);
    const files = fs.readdirSync("authored");
    const filecount = files.reduce((acc, f)=>{
        if (f.startsWith("layer") && f.endsWith(".json")) 
            return acc+1;
        return acc;
    },0);
    fs.writeFileSync(`authored/layer${filecount}.json`, JSON.stringify(req.body,null,4));
    res.status(200).json({});
});

authorRouter.get("/authored", (req,res)=>{
    const files = fs.readdirSync("authored");
    const eligible = files.filter(f=>f.startsWith("layer") && f.endsWith(".json"));
    res.status(200).json({layers:eligible});
});

export default authorRouter;