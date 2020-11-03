import express from 'express';
import { testEnvironmentVariable } from '../settings';
import {send} from '../listener';
import {send as wssend} from '../ws';
import sm from '../statemachine';
import l1 from '../layers/layer1.json';
import l2 from '../layers/layer2.json';
import actions from '../actions/actions';

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

indexRouter.get('/start', (req, res)=>{
    if (statemachines.length <= 0){
        statemachines.push(sm(l1))
        statemachines.push(sm(l2));
    }else{
        statemachines.map(sm=>sm.reset());
    }
    
    
    res.status(200).json(events);
    
    statemachines.map(s=>{
        console.log("sending actions!", s.start.actions);
        for (const alist of s.start.actions){
            wssend("action", alist.map(id=>actions[id]));
        }
        
    })
});

indexRouter.get('/press', (req, res)=>{
    console.log("seen a press!!");
    console.log(req.query);
    const {name} = req.query;
    send("/press", name);
    res.status(200).json({ press: name });
}); 

indexRouter.get('/speech', (req, res)=>{
    const {speech} = req.query;
    send("/speech", speech);
    res.status(200).json({ speech });
}); 

export default indexRouter;