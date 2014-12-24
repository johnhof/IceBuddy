simpleApp.controller('SessionCtrl', ['$scope', '$location', 'Session', 'Api', function ($scope, $location, Session, Api) {
  if (Session.isSignedIn) {
    $location.path('/');
  }

  // expose services and modules
  $scope.session  = Session;

  // Model init and form submission
  $scope.isSignUp = false;
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



  // Submit sign in or toggle state
  $scope.signUp = function (event) {
    if (!$scope.isSignUp) {
      $scope.submitted = false;
      $scope.isSignUp  = true;
    } else {
      $scope.submit(Api.account.create, $scope.inputs);
    }
  }

  // Submit sign in or toggle state
  $scope.signIn = function (event) {
    if ($scope.isSignUp) {
      $scope.submitted = false;
      $scope.isSignUp  = false;
    } else {
      $scope.submit(Api.session.create, {
        email    : $scope.inputs.email,
        password : $scope.inputs.password
      });
    }
  }

  $scope.submit = function (submitReq, inputs) {
    $scope.submitted = true;

    // check for relevant errors
    var errors = false;
    _.each(inputs, function (value, key) {
      var input = $scope.form[key] || {};
      if (Object.keys(input.$error || {}).length) {
        errors =  true;
      }
    });

    if (!errors) {
      submitReq(inputs, function (u, getResponseHeaders) {
        Session.apply();
        $location.path('/#/');
      }, function (error) {
          $scope.formError = !error.data.error || error.data.error == 'ValidationError' ? 'Failed to complete action' : error.data.error;
      });
    }
  }
}]);