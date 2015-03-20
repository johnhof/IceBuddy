//
// Controller
//


var headerCtrl = angular.module('simpleApp').controller('HeaderCtrl', ['$scope', function ($scope) {

  // on pageload
  $scope.$on('$routeChangeSuccess', function () {
    // close the open nav bar on route change
    angular.element('.navbar-toggle:not(.collapsed)').trigger('click');
  });
}]);
