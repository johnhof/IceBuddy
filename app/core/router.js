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
    when('/session/:action', {
      templateUrl : 'views/session.html',
      controller  : 'SessionCtrl'
    }).

    // 404
    otherwise({
      templateUrl : 'views/404.html',
    });

  }
]);