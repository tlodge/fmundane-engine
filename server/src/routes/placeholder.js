import express from 'express';
import path from 'path';

const indexRouter = express.Router();

indexRouter.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', '..', '..', 'placeholders', 'placeholders.json'));
}); 

indexRouter.post('/set', (req,res)=>{
    res.status(200).json({ sucess: true });
})

export default indexRouter;