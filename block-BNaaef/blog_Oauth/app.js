// Requiring the packages
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var passport = require('passport');

require('dotenv').config();

require('./modules/passport');

// Requiring The Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogsRouter = require('./routes/blogs');
var commentsRouter = require('./routes/comments');
var auth = require('./middlewares/auth');

// Connecting To Database
mongoose.connect(
  'mongodb://localhost/OAuth-Blog',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log('Connected To Database: ', err ? false : true);
  }
);

// Instantiating The Application
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

// Creating The Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/OAuth-Blog' }),
  })
);

// Using The Logged In User Information
app.use(auth.userInfo);

// Using OAuth
app.use(passport.initialize());
app.use(passport.session());

// Using Flash To show Error Mesaages
app.use(flash());



// Using The Routes
app.use('/', indexRouter);
// app.use(auth.userInfo);
app.use('/users', usersRouter);
app.use('/blogs', blogsRouter);
app.use('/comments', commentsRouter);

//  Catch 404 And Frward To Error Handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error Handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;