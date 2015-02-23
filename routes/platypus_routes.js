'use strict';

var Platypus = require('../models/Platypus');
var eat_auth = require('../lib/eat_auth');

// A new body object containing the parsed data is populated on the request object
var bodyparser = require('body-parser');

module.exports = function(app, appSecret) {
  console.log("in platypus_routes.js");
  app.use(bodyparser.json());      // turns the req.body into an object

  console.log("in platypus_routes.js about to call app.get('/platypus')");
  // request to get all the platypuses from the database
  app.get('/platypus', eat_auth(appSecret), function(req, res) {
    // .save() is mongoose static method on the "class" Platypus

    console.log("in platypus_routes.js about to call Platypus.find()");
    // We haven't added  "user_id" field to  models/Platypus.js  yet
    // Platypus.find({user_id: req.user._id}, function(err, data) {
    Platypus.find({}, function(err, data) {
      // fetch failed
      if (err) {
        console.log("in platypus_routes.js  app.get() Platypus.find err = " + err);
        return res.status(500).send({'msg': 'could not retrieve platypus'});
      }
      console.log("success in Platypus.find()");
      console.log("data");
      console.log(data);
      console.dir(data);

      // success - return array of all the platypuses to the client
      res.json(data);
    });
  });

  // request to insert new platypus in the database
  app.post('/platypus', eat_auth(appSecret), function(req, res) {
    var newPlatypus = new Platypus(req.body);
    // mongoose method .save()
    newPlatypus.save(function(err, platypus) {
      // attempt to insert new platypus failed
      if (err) return res.status(500).send({'msg': 'could not save platypus'});

      // success - return platypus to client  (including _id field)
      res.json(platypus);
    });
  });

  // request to replace a platypus in the database with another platypus
  app.put('/platypus/:id', function(req, res) {
    var updatedPlatypus = req.body;
    // this is same as setting updatedPlatypus._id = null
    // ... forces update() to use the same _id when replacing the platypus
    delete updatedPlatypus._id;
    Platypus.update({_id: req.params.id}, updatedPlatypus, function(err) {
      // update/replace failed
      if (err) return res.status(500).send({'msg': 'could not update platypus'});

      // success - return the body
      res.json(req.body);
    });
  });

  // http://mongoosejs.com/docs/models.html

  // Models have a static remove method
  // available for removing all documents matching conditions.

  // Tank.remove({ size: 'large' }, function (err) {
  //   if (err) return handleError(err);
  //   // removed!
  // });

  // request a delete of a platypus
  app.delete('/platypus/:id', function(req, res) {
    var deletedPlatypus = req.body;
    //delete deletedPlatypus._id;
    Platypus.remove({_id: req.params.id}, function(err) {
      // delete failed
      if (err) return res.status(500).send({'msg': 'could not delete platypus'});

      // delete succeeded -- return body
      res.json(req.body);
    });
  });

}
