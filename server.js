'use strict';

var express = require('express');
var mongoose = require('mongoose');
var platypusRoutes = require('./routes/platypus_routes');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/platypusapp_development');

var app = express();
var router = express.Router();

platypusRoutes(router);

app.use('/api/v1', router);

app.listen(process.env.PORT || 3000, function () {
  console.log('server listening on port ' + (process.env.PORT || 3000));
});
