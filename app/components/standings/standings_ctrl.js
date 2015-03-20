simpleApp.controller('StandingsCtrl', ['$scope', 'Session', 'Api', function ($scope, Session, Api) {

  // define games request
  $scope.games = [];
  $scope.standings = [];

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

  $scope.orderKey = 'p';
  $scope.reverse = 'true';
  $scope.previousKey = 'p';

  $scope.sortStandings = function ( team ) {
    if ( $scope.orderKey ) {
      $scope.previousKey = $scope.orderKey;
      if ( $scope.reverse ) {
        return team[$scope.orderKey];
      } else {
        return -team[$scope.orderKey];
      }
    } else {
      return team.p;
    }


  }

  function processGames ( games ) {
    var teams = [];
    var lookUp = {};
    games.forEach(function (game) {
      var homeName = game.home.team.name;
      var homeScore = parseInt(game.home.score, 10);
      var awayName = game.away.team.name;
      var awayScore = parseInt(game.away.score, 10);
      var homeKey = (lookUp[homeName] !== undefined) ? lookUp[homeName] : null;
      var awayKey = (lookUp[awayName] !== undefined) ? lookUp[awayName] : null;

      if ( homeKey === null ) {
        lookUp[homeName] = teams.push({name: homeName, w:0,l:0,t:0,p:0,gf:0,ga:0,gd:0}) - 1;
        homeKey = lookUp[homeName];
      }
      if ( awayKey === null ) {
        lookUp[awayName] = teams.push({name: awayName, w:0,l:0,t:0,p:0,gf:0,ga:0,gd:0}) - 1; 
        awayKey = lookUp[awayName];
      }

      teams[homeKey].gf += homeScore;
      teams[homeKey].ga += awayScore;
      teams[homeKey].gd += homeScore - awayScore;

      teams[awayKey].gf += awayScore;
      teams[awayKey].ga += homeScore;
      teams[awayKey].gd += awayScore - homeScore;


      if ( homeScore > awayScore ) {
        teams[homeKey].w++;
        teams[homeKey].p += 2; 
        teams[awayKey].l++;
      } else if ( homeScore < awayScore ) {
        teams[homeKey].l++;
        teams[awayKey].w++;
        teams[awayKey].p += 2; 
      } else {
        teams[homeKey].t++;
        teams[awayKey].t++;
        teams[homeKey].p++;
        teams[awayKey].p++;
      }
    });
    return teams;
  }

}]);