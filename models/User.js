//Users.js   8:29

'use strict';

var mongoose = require('mongoose');       // to read from, write to the database
var bcrypt   = require('bcrypt-nodejs');  // to encrypt the password
var eat      = require('eat');            // to encrypt the token

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
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// '/sign-in'
// called whenever existing user logs in
userSchema.methods.validPassword = function(password) {
  console.log("in User.js validPassword");
  console.log("password passed in = " + password);
  console.log("this.basic.password = " + this.basic.password);
  return bcrypt.compareSync(password, this.basic.password);
};

// '/sign-in'
// called whenever existing user logs in
userSchema.methods.generateToken = function(appSecret, callback) {
  eat.encode({id: this._id, timestamp: new Date()}, appSecret, callback);
};

module.exports = mongoose.model('User', userSchema);
