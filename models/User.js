//Users.js   8:29

'use strict';

var mongoose = require('mongoose');       // to read from, write to the database
var bcrypt   = require('bcrypt-nodejs');  // to encrypt the password
var eat      = require('eat');            // to encrypt the token

var tempHashedPassword;

var userSchema = new mongoose.Schema({
  basic: {
    email: String,
    password: String
  },
  username: String
});

// '/create_user'
// called when new user wants to create a new account for the website
userSchema.methods.generateHash = function(password) {
  console.log("in User.js   generateHash()");
  console.log("password = " + password);
  var hashedPassword =  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  tempHashedPassword = hashedPassword;
  console.log("hashed password = " + hashedPassword);
  console.log("tempHashedPassword = " + tempHashedPassword);
  return hashedPassword;
};

// '/sign-in'
// called whenever existing user logs in
userSchema.methods.validPassword = function(password) {
  // console.log("in User.js validPassword()");
  // console.log("password passed in = " + password);
  // console.log("this.basic.password = " + this.basic.password);
  // var hashedPassword =  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  // console.log("hashedPassword that was passed into this function = ");
  // console.log(hashedPassword);
  // console.log("tempHashedPassword");
  // console.log(tempHashedPassword);
  var compareSyncResult =  bcrypt.compareSync(password, this.basic.password);
  console.log("compareSyncResult = " + compareSyncResult);
  return compareSyncResult;
};

// '/sign-in'
// called whenever existing user logs in
userSchema.methods.generateToken = function(appSecret, callback) {
  console.log("in User.js generateToken()");
  console.log("this.id = " + this.id);
  console.log("appSecret = " + appSecret);
  console.log("callback = " + callback);
  eat.encode({id: this._id, timestamp: new Date()}, appSecret, callback);
};

module.exports = mongoose.model('User', userSchema);
