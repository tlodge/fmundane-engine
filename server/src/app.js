import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import path from 'path';

import indexRouter from './routes/index';
import authorRouter from './routes/author';
import placeholderRouter from './routes/placeholder';

import { execFile} from 'child_process';
import fs from 'fs';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/event', indexRouter);
app.use('/author', authorRouter);
app.use('/placeholders', placeholderRouter);

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'author')));
app.use('/twine', express.static(path.join(__dirname, 'twine')));
app.use('/wa', express.static(path.join(__dirname, '..', 'webapps')));

console.log(path.join(__dirname, '..', '..', 'placeholders'))
console.log("dirname is", __dirname);

app.use(fileUpload({createParentPath: true, limits: { 
  fileSize: 1000 * 1024 * 1024 * 1024 //1000MB max file(s) size
}}));

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

app.post('/media/upload', (req, res)=>{
  console.log(req.files);
  let mfile = req.files.mediaFile;
  mfile.mv(`../media/${mfile.name}`);
  res.status(200).json({ success:true });
}); 

app.get('/media/list', (req, res)=>{
  const files = fs.readdirSync("../media");
  const eligible = files.filter(f=>f.endsWith(".mp4") || f.endsWith(".mp3") || f.endsWith("wav"));
  res.status(200).json({files:eligible});
})

console.log("dirname is ", __dirname);


export default app;
