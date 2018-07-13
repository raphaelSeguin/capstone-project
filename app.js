var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const config = process.env.PRODUCTION ? {
  oauth: {
      github: {
          id: process.env.OAUTH_GITHUB_ID,
          secret: process.env.OAUTH_GITHUB_SECRET
      },
      facebook: {
          id: process.env.OAUTH_FACEBOOK_ID,
          secret: process.env.OAUTH_FACEBOOK_SECRET
      }
  },
  db: {
      url: process.env.DB_URL
  },
  api: {
      
  }
}
: require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const User = require('./models/user');

// db connection
mongoose.connect(config.db.url);
const db = mongoose.connection;

db.on('err', err => {
  console.log('\nError: database connection failed\n', err)
})
db.once('open', function() {
  console.log('connected successfully');
});

// express app
var app = express();

// middleware 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/build/')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
