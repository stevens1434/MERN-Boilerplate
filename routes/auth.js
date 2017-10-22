var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var passport = require('../config/ppConfig');

/* GET /auth/login route */
router.get('/login', function(req, res, next) {
  res.send('GET /auth/login route hit');
});
/* POST /auth/login route */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid username and/or password',
  successFlash: 'You have successfully logged in'
}));

/* GET /auth/signup route */
router.get('/signup', function(req, res, next) {
  res.send('GET /auth/signup route hit');
});
/* POST /auth/signup route */
router.post('/signup', function(req, res, next) {
  // Find by email
  User.findOne({ email: req.body.email }, function(err, user) {
    if (user) {
      req.flash('error', 'Account already exists');
      res.redirect('/auth/signup');
    } else {
      // create and save a user
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }, function(err, user) {
        if (err) {
          res.send(err.message)
        } else {
          passport.authenticate('local', {
            successFlash: 'Account created and logged in'
          })(req, res, function() {
            console.log("WE JUST AUTHENTICATED AFTER A SIGNUP");
            console.log('REQ.USER=' + req.user);
            delete req.user.password;
            res.status(201).send("success");
            next();
          });
        }
      });
    }
  });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  req.flash('success', 'You have logged out. Goodbye!');
  res.redirect('/');
});

module.exports = router;
