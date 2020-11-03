import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import yaml from 'js-yaml';

import indexRouter from './routes/index';


const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/event', indexRouter);


export default app;
