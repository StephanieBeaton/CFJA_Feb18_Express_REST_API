'use strict';

module.exports = function (app) {
  app.controller('platypusController', ['$scope', '$http', function($scope, $http) {
    $scope.platypuses = [];
    $scope.getAll = function() {
      $http({
        method: 'GET',
        url: '/api/v1/platypus'
      })
      .success(function(data) {
        $scope.platypuses = data;
      })
      .error(function(data, status) {
        console.log(data);
      });
    };


    $scope.create = function(platypus) {
      $http({
        method: 'POST',
        url: '/api/v1/platypus',
        data: platypus
      })
      .success(function(data) {
        $scope.platypuses.push(data);
      })
      .error(function(data, status) {
        console.log(data);
      });
    };


    $scope.save = function(platypus) {
      $http({
        method: 'PUT',
        url: '/api/v1/platypus/' + platypus._id,
        data: platypus
      })
      .success(function() {
        platypus.editing = false;
      })
      .error(function(data) {
        console.log(data);
      });
    };

    $scope.remove = function(platypus) {
      $http({
        method: 'DELETE',
        url: '/api/v1/platypus/' + platypus._id
      })
      .success(function() {
        $scope.platypuses.splice($scope.platypuses.indexOf(platypus), 1);
      })
      .error(function(data) {
        console.log(data);
      });
    };

    $scope.editToggle = function(platypus) {
      if (platypus.editing) {
        platypus.platypusName = platypus.oldPlatypusName;
        platypus.editing = false;
      } else {
        platypus.oldPlatypusName = platypus.platypusName;
        platypus.editing = true;
      }
    };
  }]);
};
