var User = require('../models/User');

module.exports = {
  loggedInUser: (req, res, next) => {
    if (req.session.passport) {
     return next();
    } else {
      req.flash('error', 'To use this feature, you have to signin first...');
     return res.redirect('/users/signin');
    }
  },

  userInfo: (req, res, next) => {
    if (req.session.passport) {
       var userId = req.session.passport.user;
      User.findById(userId, (err, user) => {
        console.log(user);
        if (err) return next(err);
        req.user = user;
        res.locals.user = user;
        return next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      return next();
    }
  },
};