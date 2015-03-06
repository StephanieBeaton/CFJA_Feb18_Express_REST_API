'use strict';

process.env.MONGO_URI = 'mongodb://localhost/platypusapp_test';
require('../../server.js');
var mongoose = require('mongoose');
var chai     = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

var expect = chai.expect;

describe('platypus api end points', function() {
  before(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should respond to a post request', function(done) {
    chai.request('localhost:3000/api/v1')
        .post('/platypus')
        .send({platypusName: 'Luke', platypusPlaceOfBirth: 'Adelaide, Australia'})
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body).to.have.property('_id');
          expect(res.body.platypusName).to.eql('Luke');
          expect(res.body.platypusPlaceOfBirth).to.eql('Adelaide, Australia');
          done();
        });
  });

  it('should have a default value', function(done) {
    chai.request('localhost:3000/api/v1')
        .post('/platypus')
        .send({platypusAge: '15'})
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.platypusName).to.eql('Fred');
          done();
        });
  });

  describe('already has data in database', function() {
    var id;
    var id2;
    before(function(done){
      chai.request('localhost:3000/api/v1')
        .post('/platypus')
        .send({platypusName: 'Leonardo'})
        .end(function(err, res){
          id = res.body._id;
          chai.request('localhost:3000/api/v1')
            .post('/platypus')
            .send({platypusName: 'Dana'})
            .end(function(err, res){
              id2 = res.body._id;
              done();
            });

        });

    });

    it('should have an index', function(done) {
      chai.request('localhost:3000/api/v1')
        .get('/platypus')
        .end(function(err, res){
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.be.true;
          expect(res.body[0]).to.have.property('platypusName');
          done();
        });
    });

    it('should be able to update a platypus', function(done) {
      chai.request('localhost:3000/api/v1')
        .put('/platypus/' + id)
        .send({platypusName: 'Jose'})
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.platypusName).to.eql('Jose');
          done();
        });
    });

    it('should be able to delete a platypus', function(done) {
      chai.request('localhost:3000/api/v1')
        .del('/platypus/' + id2)
        .end(function(err, res) {
          console.log("delete test id2");
          console.log(id2);
          expect(err).to.eql(null);
          done();
        });
    });

  });
});
