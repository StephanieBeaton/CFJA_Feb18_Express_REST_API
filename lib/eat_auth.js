//eat_auth.js
'use strict';

var eat = require('eat');
var User = require('../models/User');

module.exports = function(appSecret) {
  return function(req, res, next) {

    console.log("in eat_auth.js  eat_auth(appSecret)");

    if (req) {
      console.log("req.body");
      console.log(req.body);
      console.dir("req.headers");
      console.log(req.headers);
    } else {
      console.log("req is null");
    }


    // client could store the token in header or body
    var token = req.headers.eat || req.body.eat;
    // client did not send token in http request
    if (!token) {
      console.log("in eat_auth.js    token is null");
      return res.status(403).send({msg: 'could not authenticate'});
    }

    console.log("in eat_auth.js about to call eat.decode()");
    console.log("token = " + token);
    console.log("appSecret = " + appSecret);

    eat.decode(token, appSecret, function(err, decoded) {
      if (err) {
        console.log("in eat_auth.js  decode of token failed. err = " + err);
        return res.status(403).send({msg: 'could not authenticate'});
      }

      // success - got _id from token and  timestamp
      // ... look up _id in User table in database
      User.findOne({_id: decoded.id}, function(err, user) {
        // database error occurred
        if (err) {
          console.log("in eat_auth   User.findOne database failure");
          return res.status(403).send({msg: 'could not authenticate'});
        }

        // the _id was not in the database, user is not in database
        if(!user) {
          console.log("in eat_auth user " + decoded.id + "was not found in database");
          return res.status(403).send({msg: 'could not authenticate'});
        }

        // found _id in database, set request.user to user
        req.user = user;
        console.log("req.user = user;");
        console.log("req.user =" + req.user);
        // call next() to go to next function in the app.verb(callback()) parameter list
        next();
      });
    });
    next();
  };
};
