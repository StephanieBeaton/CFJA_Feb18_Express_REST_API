'use strict';

var greet = require('./greet');
var $ = require('jquery');

$('main').append('<p>' + greet() + '</p>');


