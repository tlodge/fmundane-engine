import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import yaml from 'js-yaml';

import indexRouter from './routes/index';

import e1 from './experiences/experience1.json';
import e2 from './experiences/experience2.json';

import sm from './statemachine';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/event', indexRouter);

const x = yaml.dump(e1);
console.log(x);
sm(e1);
sm(e2);

export default app;
