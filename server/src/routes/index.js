import express from 'express';
import { testEnvironmentVariable } from '../settings';
import {send} from '../listener';

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => res.status(200).json({ message: testEnvironmentVariable }));

indexRouter.get('/press', (req, res)=>{
    console.log("seen a press!!");
    console.log(req.query);
    const {name} = req.query;
    send("/press", name);
    res.status(200).json({ press: name });
}); 

export default indexRouter;