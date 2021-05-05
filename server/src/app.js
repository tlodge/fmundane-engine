import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

import indexRouter from './routes/index';


const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/event', indexRouter);

console.log("static path sis",path.join(__dirname, 'client'));

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

export default app;
