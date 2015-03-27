simpleApp.config(['$routeProvider', function ($routeProvider) {

  $routeProvider.

    // Home
    when('/', {
      templateUrl : 'views/home.html',
      controller  : 'HomeCtrl'
    }).

    // Session
    when('/session', {
      templateUrl : 'views/session.html',
      controller  : 'SessionCtrl'
    }).

    // Standings
    when('/standings', {
      templateUrl : 'views/standings.html',
      controller  : 'StandingsCtrl'
    }).

    // Teams
    when('/teams', {
      templateUrl : 'views/teams.html',
      controller  : 'TeamsCtrl'
    }).

    // Tracker
    when('/tracker', {
      templateUrl : 'views/tracker.html',
      controller  : 'TrackerCtrl'
    }).


    // 404
    otherwise({
      templateUrl : 'views/404.html',
    });

  }
]);