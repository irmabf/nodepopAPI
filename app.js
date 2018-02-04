const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');

const CustomError= require('./lib/custom-error');
const i18n = require('i18n');

i18n.configure({
  locals:['en', 'es'],
  defaultLocal:'en',
  directory: __dirname + '/locales'
});

const app = express();


//Load db conector
require ('./lib/connect-mongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

var index = require('./routes/index');
var users = require('./routes/users');

//MIDDLEWARE
app.use(i18n.init);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Custom Routes

app.use('/', require('./routes')); 
app.use('/users', require('./routes/users'));


//API routes
app.use('/apiv1/authenticate', require('./routes/apiv1/authenticate'));
app.use('/apiv1/ads', require('./routes/apiv1/ads'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
app.use(function(err, req, res, next) {
  //Express validator error
  if(err.array){
    err.status= 422;
    const errInfo= err.array({onlyFirstError:true})[0];
    err.message= isAPI(req) ? res.__(errInfo.msg) : `Not valid - ${errInfo.param} $errInfo.msg`;

  }res.status(err.status || 500);

  if(isAPI(req)){
    res.json({ success: false, err: err.message });
   return;
  }


  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});//end error handler

function isAPI(req) {
  return req.originalUrl.indexOf('apiv1') === 0;
}


module.exports = app;
