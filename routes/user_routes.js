
// user_routes.js

'use strict';

//A new body object containing the parsed data is populated on the request object
var bodyparser = require('body-parser');
var User = require('../models/User');

// this is called in server.js
// An express router is passed in for the "app"
module.exports = function(app, passport, appSecret) {
  app.use(bodyparser.json());   // turns the req.body into an object

  // create a new account on this website
  // called to insert a new user into the database
  // ... and pass a token back to the client
  // ... token to be used for all requests except 'sign_in' and '/create_user'
  // ... by that user
  app.post('/create_user', function(req, res) {

    console.log("in user_routes.js   app.post() about to call new User()");
    var newUser = new User();
    console.dir("req.body");
    console.dir(req.body);
    newUser.basic.email = req.body.basic.email;

    console.log("newUser.basic.email = " + newUser.basic.email);

    // hash the password so that the hash cannot be reversed
    newUser.basic.password = newUser.generateHash(req.body.password);

    console.log("newUser.basic.password = " + newUser.basic.password);

    // mongoose function save()
    // store password in the database
    newUser.save(function(err, user) {
      // database error occured on attempt to save user to database
      if (err) {
        console.log("in user_routes app.post() newUser.save() database err" + err);
        return res.status(500).send({msg: 'could not create user'});
      };

      // the account has been created,
      // ... automatically log in the new user by creating a token
      // ... and sending it back to the user
      user.generateToken(appSecret, function(err, token) {
        // failed to generate token
        if (err) {
          console.log("in user_routes.js app.post()  user.generateToken() failed. err = " + err);
          return res.status(500).send({msg: 'could not generate token'});
        }
        // success -- return token to be stored on the Client machine
        console.log("returning token");
        console.log(token);
        res.json({eat: token});
      })
    });
  });

  // existing user logs into the website
  // user sends email address and password in request
  app.get('/sign_in', passport.authenticate('basic', {session: false}), function(req, res) {

    console.log("in user_routes.js  app.get('/sign_in')");
    // every time the user logs in, the system creates a token (for that session -- even though we don't have sessions)
    req.user.generateToken(appSecret, function(err, token) {
      // failed to generate token
      if (err) {
        console.log("req.user.generateToken() returned err = " + err);
        return res.status(500).send({msg: 'could not generate token'});
      }
      // success -- return token to be stored on the Client machine
      console.log("success req.user.generateToken()");
      console.log("token");
      console.log(token);
      res.json({eat: token});
    });
  });
};
