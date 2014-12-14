simpleApp.controller('HomeCtrl', 'Session', ['$scope', 'Session', function ($scope, Session) {
  Session.requireSignIn();

  $scope.session = session;

}]);