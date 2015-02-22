
//server    8:29pm

'use strict';
var express = require('express');
var mongoose = require('mongoose');
var platypusRoutes = require('./routes/platypus_routes');
var userRoutes  = require('./routes/user_routes');
var passport = require('passport');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/platypusapp_development');

// create an express app
var app = express();
app.set('appSecret', process.env.SECRET || 'changethischangethis!');

// associate path prefix 'basic' with new BasicStrategy() constructor
// ... constructor has callback that looks up email address in db
// ... This would only be done on '/sign-on'
//
// the function passed into use() as the second argument
// ... will be executed whenever the path (or route) of the request sent to the app
// ... is prefixed by the first arg to use().
// if use() does not have a path for the first arg
// ... then the function executes for every request
// ... sent to the app
console.log("calling app.use(passport.initialize()) from server.js");
app.use(passport.initialize());

// associate a path prefix 'basic'
// ... with a constructor to create new BasicStrategy
console.log("calling passport_strat from server.js");
require('./lib/passport_strat')(passport);

// create an express Router
// create an express Router
console.log("in server.js creating platypusRouter");
var platypusRouter = express.Router();
console.log("in server.js creating userRouter");
var userRouter = express.Router();

// associate pairs of paths and verbs
// with callback functions (actions)
// ... (paths for "platypus" resource and
// ...  one of post, get, put, delete http verbs)
console.log("calling platypusRoutes() from server.js");
platypusRoutes(platypusRouter, app.get('appSecret'));

// do the similar as above except for "user" resource
// associate pairs of paths and verbs
// with callback functions (actions)
// ... (paths for "user" resource and
// ...  one of post, get http verbs)
console.log("calling userRoutes() from server.js");
userRoutes(userRouter, passport, app.get('appSecret'));

// the function passed into use() as the second argument
// ... will be executed whenever the path (or route) of the request sent to the app
// ... is prefixed by the first arg to use().
// funcions are executed sequentially
// ... in the order they are added to the app
// ... by app.use()
// So, for each request,
// ... passport.initialize() is executed first
// ... next platypusRouter() is executed
// ... next userRouter() is executed
//  (don't think the order of the last two is important at all)
console.log("in server.js calling app.use(userRouter)");
app.use('/api/v1', userRouter);
console.log("in server.js calling app.use(platypusRouter)");
app.use('/api/v1', platypusRouter);

console.log("in server.js starting webserver by calling app.listen()");
// start up the app to listen for incoming requests on PORT environment variable OR  3000
app.listen(process.env.PORT || 3000, function() {
  console.log('server listening on port ' + (process.env.PORT || 3000));
});
