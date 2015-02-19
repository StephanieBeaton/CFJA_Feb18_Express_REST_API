'use strict';

var mongoose = require('mongoose');

var platypusSchema = new mongoose.Schema({
  platypusName: {type: String, default: 'Fred'},
  platypusAge: String,
  platypusPlaceOfBirth: String
});

module.exports = mongoose.model('Platypus', platypusSchema);
