'use strict';

/**
 * @ngdoc function
 * @name simpleAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the simpleAppApp
 */
angular.module('simpleAppApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
