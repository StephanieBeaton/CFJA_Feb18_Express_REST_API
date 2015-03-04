'use strict';

var Platypus = require('../models/Platypus');
var bodyparser = require('body-parser');

module.exports = function(app) {
  app.use(bodyparser.json());

  app.get('/platypus', function(req, res) {
    Platypus.find({}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrieve platypus'});

      res.json(data);
    });
  });

  app.post('/platypus', function(req, res) {
    var newPlatypus = new Platypus(req.body);
    newPlatypus.save(function(err, platypus) {
      if (err) return res.status(500).send({'msg': 'could not save platypus'});

      res.json(platypus);
    });
  });

  app.put('/platypus/:id', function(req, res) {
    var updatedPlatypus = req.body;
    delete updatedPlatypus._id;
    Platypus.update({_id: req.params.id}, updatedPlatypus, function(err) {
      if (err) return res.status(500).send({'msg': 'could not update platypus'});

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

  app.delete('/platypus/:id', function(req, res) {
    var deletedPlatypus = req.body;
    //delete deletedPlatypus._id;
    Platypus.remove({_id: req.params.id}, function(err) {
      console.log("req.params.id");
      console.log(req.params.id);
      if (err) return res.status(500).send({'msg': 'could not delete platypus'});

      res.json(req.body);
    });
  });


/*
  db.collection.remove(
   <query>,
   {
     justOne: <boolean>,
     writeConcern: <document>
   }
  )
*/

}
