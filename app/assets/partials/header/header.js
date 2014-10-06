

//
// Controller
//


var headerCtrl = angular.module('simpleApp').controller('HeaderCtrl', ['$scope', function ($scope) {

}]);



//
// Directives
//


// nav bar directive for handling a window resize
headerCtrl.directive('navBar', ['$window', function ($window) {
  return {
    link : function ($scope, $element, $attrs) {
      // set up transition handlers
      var handlers = {
        desktop : function () {
          console.log('desktop')          
        },
        mobile : function () {
          console.log('mobile')
        }
      };

      simpleApp.helpers.onPageBreak($scope, $window, handlers);
    }
  }
}]);