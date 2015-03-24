//
// App setup
//


var simpleApp = angular.module('simpleApp', [

  // utility modules
  'ngRoute',
  'ngResource',
  'ngDialog',
  'ngAnimate'
]);


simpleApp.run(['$rootScope', '$http', 'ngDialog', function ($rootScope, $http, ngDialog) {
  // Preload large images on app load
  _.each([
      'hero-me.jpg'
    ], function (image) {
      $http.get('../images/' + image);
    });


    //
    // middleware
    //

    // dialogs
    $rootScope.$on( "$routeChangeStart", function (event, next, current) {
      ngDialog.closeAll();
    });
}]);


simpleApp.constant('Patterns', {
  email    : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password : /^.*(?=.{4,10})(?=.*\d)(?=.*[a-zA-Z]).*$/
});


simpleApp.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
      className     : 'ngdialog-theme-default',
      closeByEscape : true,
    });
}]);