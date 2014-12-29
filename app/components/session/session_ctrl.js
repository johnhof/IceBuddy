simpleApp.controller('SessionCtrl', ['$scope', '$routeParams', 'Utils', 'Session', 'Api', function ($scope, $routeParams, Utils, Session, Api) {
  // no need to show this page if the user is signed in
  if (Session.isSignedIn) { Utils.redirect('/'); }

  // expose services and modules
  $scope.session  = Session;

  // Model init and form submission
  $scope.isSignUp = $routeParams.signup;
  $scope.inputs   = {
    email    : null,
    password : null,
    username : null,
    confirm  : {
      email    : null,
      password : null
    },
    name     : {
      first : null,
      last  : null
    }
  };

  //
  // Click listeners
  //


  // Submit sign in or toggle state
  $scope.signUp = function (event) {
    if (!$scope.isSignUp) {
      $scope.form.submitted = false;
      $scope.isSignUp  = true;
    } else {
      $scope.submit($scope.inputs, Api.account.create);
    }
  }

  // Submit sign in or toggle state
  $scope.signIn = function (event) {
    if ($scope.isSignUp) {
      $scope.form.submitted = false;
      $scope.isSignUp  = false;
    } else {
      $scope.submit({
        email    : $scope.inputs.email,
        password : $scope.inputs.password
      }, Api.session.create);
    }
  }


  //
  // generic submit listener
  //
  $scope.submit = function (inputs, submitReq) {
    var form = Utils.formHelper($scope.form,  $scope.inputs);

    form.apiAction(inputs, submitReq, function success () {
      Session.apply();

      if ($routeParams.onComplete) {
        Utils.redirect($routeParams.onComplete);
      } else {
        Utils.reload();
      }
    });
  }
}]);