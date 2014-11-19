simpleApp.config(['$routeProvider', function ($routeProvider) {
  
  $routeProvider.

    // Home
    when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    }).
    when('/:example', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    }).
    
    // 404
    otherwise({
      redirectTo: 'views/404.html'
    });

  }
]);