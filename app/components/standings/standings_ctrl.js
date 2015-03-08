simpleApp.controller('StandingsCtrl', ['$scope', 'Session', 'Api', function ($scope, Session, Api) {

  // define games request
  $scope.games = [];
  $scope.standings = [{
    myTeam : {
      w: 2,
      l: 1,
      t: 0,
      p: 4,
      gf: 10,
      ga: 7,
      gd: 3
    }
  }];
  $scope.requestGames = function () {
    $scope.activeGamesRequest = true;

    Api.games.read({ season_id : $scope.selectedSeason['_id'] }, function (result) {
      $scope.games = result && result.games ? result.games : [];
      $scope.standings = processGames($scope.games);
      $scope.activeGamesRequest = false;
    });
  }

  //Seasons
  $scope.seasons = [];
  $scope.requestSeasons = function (name) {
    $scope.activeSeasonsRequest = true;
    Api.seasons.read({ name : name }, function (result) {
      $scope.seasons = result && result.seasons ? result.seasons : [];
      $scope.activeSeasonsRequest = false;
    });
  }

  // invoke Seasons request
  $scope.requestSeasons();

  function processGames ( games ) {
    var teams = [];
    games.forEach(function (game) {
      var homeName = game.home.team.name;
      var homeScore = parseInt(game.home.score, 10);
      var awayName = game.away.team.name;
      var awayScore = parseInt(game.away.score, 10);

      if ( !teams[homeName] ) {
        teams[homeName] = {w:0,l:0,t:0,p:0,gf:0,ga:0,gd:0};
      }
      if ( !teams[awayName] ) {
        teams[awayName] = {w:0,l:0,t:0,p:0,gf:0,ga:0,gd:0};
      }

      teams[homeName].gf += homeScore;
      teams[homeName].ga += awayScore;
      teams[homeName].gd += homeScore - awayScore;

      teams[awayName].gf += awayScore;
      teams[awayName].ga += homeScore;
      teams[awayName].gd += awayScore - homeScore;


      if ( homeScore > awayScore ) {
        teams[homeName].w++;
        teams[homeName].p += 2; 
        teams[awayName].l++;
      } else if ( homeScore < awayScore ) {
        teams[homeName].l++;
        teams[awayName].w++;
        teams[awayName].p += 2; 
      } else {
        teams[homeName].t++;
        teams[awayName].t++;
        teams[homeName].p++;
        teams[awayName].p++;
      }
    });

    return teams;
  }

}]);