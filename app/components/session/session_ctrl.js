simpleApp.controller('SessionCtrl', ['$scope', 'Utils', 'Session', 'Api', function ($scope, Utils, Session, Api) {
  // not need to show this page if the user is signed in
  if (Session.isSignedIn) { Utils.redirect('/'); }

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

  //
  // Click listeners
  //


  // Submit sign in or toggle state
  $scope.signUp = function (event) {
    if (!$scope.isSignUp) {
      $scope.form.submitted = false;
      $scope.isSignUp  = true;
    } else {
      $scope.submit(Api.account.create);
    }
  }

  // Submit sign in or toggle state
  $scope.signIn = function (event) {
    if ($scope.isSignUp) {
      $scope.form.submitted = false;
      $scope.isSignUp  = false;
    } else {
      $scope.submit(Api.session.create);
    }
  }


  //
  // generic submit listener
  //
  $scope.submit = function (submitReq) {
    var form = Utils.formHelper($scope.form);

    form.apiAction(submitReq, function success () {
      Session.apply();
      Utils.redirect('/');
    });
  }
}]);