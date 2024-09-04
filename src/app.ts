'use strict';

import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as ejs from 'ejs';
import * as cors from 'cors';

import index from './routes/index';

import { Connection } from './configs/connection';
import { Crypto } from './configs/crypto';

dotenv.config();
const app: express.Express = express();
const crypto = new Crypto();
const hospcode = process.env.HOSPCODE;
const token = process.env.TOKEN;
try {
  crypto.aes_decrypt(token, hospcode);
} catch (err) {
  console.log((!token) ? `You don't have a token` : 'Gatewat error: Token not validated.');
}
//view engine setup
app.set('views', path.join(__dirname, '../public/views'));
app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');
//uncomment after placing your favicon in ../public
//app.use(favicon(path.join(__dirname,'../public','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
app.use((req, res, next) => {
  req.conn = new Connection();
  req.crypto = crypto;
  req.hospcode = hospcode;
  req.token = token;
  next();
});
app.use('/', index);

//catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

//error handlers

//development error handler
//will print stacktrace
if (process.env.NODE_ENV === 'development') {
  app.use((err: Error, req, res, next) => {
    res.status(err['status'] || 500);
    res.render('error', {
      title: 'error',
      message: err.message,
      error: err
    });
  });
}

//production error handler
// no stacktrace leaked to user
app.use((err: Error, req, res, next) => {
  res.status(err['status'] || 500);
  res.render('error', {
    title: 'error',
    message: err.message,
    error: {}
  });
});

export default app;
