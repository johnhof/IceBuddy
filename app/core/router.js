simpleApp.config(['$routeProvider', function ($routeProvider) {

  $routeProvider.

    // Home
    when('/', {
      templateUrl : 'views/home.html',
      controller  : 'HomeCtrl'
    }).

    //session
    when('/session', {
      templateUrl : 'views/session.html',
      controller  : 'SessionCtrl'
    }).

    //session
    when('/teams', {
      templateUrl : 'views/teams.html',
      controller  : 'TeamsCtrl'
    }).

    // 404
    otherwise({
      templateUrl : 'views/404.html',
    });

  }
]);