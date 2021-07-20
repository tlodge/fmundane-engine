import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

import indexRouter from './routes/index';
import authorRouter from './routes/author';
import { execFile} from 'child_process';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/event', indexRouter);
app.use('/author', authorRouter);

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'author')));

app.get("/shutdown", (req,res)=>{
  console.log("shutting down server!");
  execFile("shutdown", ["-h", "now"], (error)=>{
     console.log(error);
  });
});

app.get("/reboot", (req,res)=>{
   console.log("rebooting server!");
  execFile("reboot");
});

app.get('/',  (req, res)=>{
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get("/author", (req,res)=>{
  res.sendFile(path.join(__dirname, 'author', 'index.html'));
});

console.log("dirname is ", __dirname);


export default app;
