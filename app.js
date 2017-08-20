const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/user');
const topicRouter = require('./routes/topic');
require('./services/mongoose_service');
const Errors = require('./errors');
const logger = require('./utils/logger').logger;

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./middlewares/req_log').logRequests())

app.use('/', index);
app.use('/user', users);
app.use('/topic', topicRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if(err instanceof Errors.BaseHTTPError) {
    res.statusCode = err.httpCode;
    res.json({
      code: err.OPCode,
      msg: err.httpMsg,
    })
  } else {
    res.statusCode = 500;
    res.json({
      code: Errors.BaseHTTPError.DEFAULT_OPCODE,
      msg: '服务器好像出错了耶，一会儿再试试吧~'
    })
  }
  logger.error('response error to user', err);
});

module.exports = app;
