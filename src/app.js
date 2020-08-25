// express сервер, который, логирует, парсит запросы
// отдает статические файлы

import express from 'express';
import cors from 'cors'
import path from 'path';
import logger from 'morgan';
import dotenv from 'dotenv'

import indexRouter from './routes/index';

dotenv.config();

var app = express();
app
  .use(cors())
  .use(logger('dev'))
  .use(express.json())
  .use(express.urlencoded({extended: true}))
  .get('*',express.static(path.resolve(__dirname, '..', 'logistics-management', 'build')))
  .use('/', indexRouter)
  .use('/public', express.static(path.resolve(__dirname, '..', 'public')))

export default app;
