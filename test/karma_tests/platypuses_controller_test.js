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

});
