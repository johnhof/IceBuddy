simpleApp.controller('HomeCtrl', ['$scope', 'Session', 'Api', function ($scope, Session, Api) {
  // Session.requireSignIn();


  //
  // Team list
  //

  // define player request
  $scope.teams = [];
  $scope.requestTeams = function (name) {
    $scope.activeTeamsRequest = true;
    Api.teams.read({ name : name }, function (result) {
      $scope.teams = result && result.teams ? result.teams : [];
      $scope.activeTeamsRequest = false;
    });
  }

  // invoke player request
  $scope.requestTeams();


  //
  // Player list
  //


  // define player request
  $scope.players = [];
  $scope.requestPlayers = function (name) {
    $scope.activePlayersRequest = true;
    Api.players.read({ name : name }, function (result) {
      $scope.players = result && result.players ? result.players : [];
    $scope.activePlayersRequest = false;
    });
  }

  // invoke player request
  $scope.requestPlayers();

  //
  // General cleanup
  //

  $scope.session = Session;

  $scope.inputs = {};
}]);