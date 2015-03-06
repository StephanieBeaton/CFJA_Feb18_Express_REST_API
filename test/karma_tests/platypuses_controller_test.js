'use strict';

require('../../app/js/client');
require('angular-mocks');

describe('platypus controller', function() {
  var $ControllerConstructor;
  var $httpBackend;
  var $scope;

  beforeEach(angular.mock.module('platypusApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $ControllerConstructor = $controller;
  }));

  it('should be able to create a controller', function() {
    var platypusController = $ControllerConstructor('platypusController', {$scope: $scope});
    expect(typeof platypusController).toBe('object');
    expect(Array.isArray($scope.platypuses)).toBe(true);
  });


  describe('REST requests', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have an getAll function', function() {
      $httpBackend.expectGET('/api/v1/platypus').respond(200, [{platypusName: 'Harold'}]);

      var platypusController = $ControllerConstructor('platypusController', {$scope: $scope});
      $scope.getAll();
      $httpBackend.flush();

      expect($scope.platypuses[0].platypusName).toBe('Harold');
    });


    it('should be able to create a new platypus', function() {
      $httpBackend.expectPOST('/api/v1/platypus').respond(200, {_id: 1, platypusName: 'Tutankhamun'});

      var platypusController = $ControllerConstructor('platypusController', {$scope: $scope});
      $scope.create({platypusName: 'Tutankhamun'});
      $httpBackend.flush();

      expect($scope.platypuses[0]._id).toBe(1);
    });

    it('should be able save platypus changes', function() {
      $httpBackend.expectPUT('/api/v1/platypus/1').respond(200);

      var platypusController = $ControllerConstructor('platypusController', {$scope: $scope});
      var platypus = {platypusName: 'Isabella', _id: 1, editing: true};
      $scope.save(platypus);
      $httpBackend.flush();

      expect(platypus.editing).toBe(false);
    });

    it('should be able to delete a platypus', function() {
      $httpBackend.expectDELETE('/api/v1/platypus/1').respond(200);

      $ControllerConstructor('platypusController', {$scope: $scope});
      var platypus = {platypusName: 'Gillian', _id: 1, editing: true};
      $scope.platypuses.push(platypus);
      $scope.remove(platypus);
      $httpBackend.flush();

      expect($scope.platypuses.length).toBe(0);
    });

  });

});
