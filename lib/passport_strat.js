// passport_strat.js

'use strict';

var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/User');

// called from server.js
module.exports = function(passport) {

  // the function passed into use() as the second argument
  // ... will be executed whenever the path (or route) of the request sent to the app
  // ... is prefixed by the first arg to use().
  // if use() does not have a path for the first arg
  // ... then the function executes for every request
  // ... sent to the app

  // the callback function "function(email, password, done) {}"
  // ... is called when the user signs in
  passport.use('basic', new BasicStrategy({}, function(email, password, done) {

    // lookup a user in database using an email address from the request
    User.findOne({'basic.email': email}, function(err, user) {
      // database lookup failed
      if (err) {
        console.log("in passport_strat.js   User.findOne database failure");
        return done('could not authenticate');
      };

      // that email address not found in the database
      if (!user) {
        console.log("in passport_start.js  user not found in database. email = " + email);
        return done('could not authenticate');
      };

      // user found, validate the password on the request
      if (!user.validPassword(password)) {
        console.log("in passport_strat.js client sent invalid password = " + password);
        return done('could not authenticate');
      };

      return done(null, user);
    });
  }));
};
