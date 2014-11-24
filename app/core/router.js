simpleApp.config(['$routeProvider', function ($routeProvider) {
  
  $routeProvider.

    // Home
    when('/', {
      templateUrl : 'views/home.html',
      controller  : 'HomeCtrl'
    }).
    when('/example', {
      templateUrl : 'views/404.html',
    }).
    
    // 404
    otherwise({
      templateUrl : 'views/404.html',
    });

  }
]);