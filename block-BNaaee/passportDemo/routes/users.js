var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/success', function (req, res, next) {
  res.render('success');
});

router.get('/failure', function (req, res, next) {
  res.render('failure');
});

router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/users/failure' }),
  (req, res) => {
    res.redirect('/users/success');
  }
);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/failure' }),
  (req, res) => {
    res.redirect('/users/success');
  }
);

module.exports = router;