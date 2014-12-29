simpleApp.controller('HomeCtrl', ['$scope', 'Session', function ($scope, Session) {
  // Session.requireSignIn();



  $scope.session = Session;
}]);