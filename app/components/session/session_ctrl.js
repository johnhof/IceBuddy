simpleApp.controller('SessionCtrl', ['$scope', 'Session', 'Patterns', function ($scope, Session, Patterns) {

  $scope.session = Session;

  $scope.patterns = Patterns;

  // Model init and form submission
  $scope.inputs = {
    email    : null,
    password : null
  };

  $scope.submit = function submit () {
    $scope.$apply()

    if (inputs.isSignUp) {

    } else {

    }
  };
}]);