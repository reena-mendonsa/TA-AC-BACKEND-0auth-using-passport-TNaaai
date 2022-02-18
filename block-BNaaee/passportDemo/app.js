//  Requiring Packages
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var flash = require('connect-flash');
var passport = require('passport');

require('dotenv').config();
require('./modules/passport');

// Requiring Routes

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Connecting To Database
mongoose.connect(
  'mongodb://localhost/OAuth-Github-Google',
  { useNewUrlParser: true, UseUnifiedTopology: true },
  (err) => {
    console.log(`Connected to database: `, err ? false : true);
  }
);

// Instantiating Application
var app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Using Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Creating Express Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/OAuth-Github-Google' }),
  })
);

// Using OAuth
app.use(passport.initialize());
app.use(passport.session());

// Using Flash
app.use(flash());

// Using Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Catch 404 And Forward To Error Handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error Handler
app.use(function (err, req, res, next) {
  // Set Locals, Only Providing Error In Development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render The Error Page
  res.status(err.status || 500);
  res.render('error');
});

// Exporting Application
module.exports = app;