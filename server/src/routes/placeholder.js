import express from 'express';
import path from 'path';
import fs from 'fs';

const indexRouter = express.Router();

indexRouter.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', '..', '..', 'placeholders', 'placeholders.json'));
}); 

indexRouter.get('/set', (req,res)=>{
    const fname = path.join(__dirname, '..', '..', '..', 'placeholders', 'placeholders.json');
    let data = fs.readFileSync(fname);
    let placeholders = JSON.parse(data);
    const {key, value} = req.query;
    placeholders[key] = value;
    let wdata = JSON.stringify(placeholders,null,4);
    fs.writeFileSync(fname, wdata);
    res.status(200).json(placeholders);
})

export default indexRouter;