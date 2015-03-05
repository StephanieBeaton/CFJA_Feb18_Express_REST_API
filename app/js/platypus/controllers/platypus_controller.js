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

  }]);
};
