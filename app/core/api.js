
//
// api
//
//  wrapper for simplifying requests to the API
//
//  a set of resources are defined as well
//
//    - session : { create, status, read, destroy }
//    - account : { create, read, destroy }
//
simpleApp.service('Api', ['$http',  '$resource', function ($http, $resource) {

  // return a function which thinly wraps the $http object
  var api = function (settings) {
    return $http(settings);
  }

  //
  // Resources
  //

  //
  // Session
  //
  api.session = $resource('/session', null,  {
    create  : { method : 'POST' },
    status  : { method : 'HEAD' },
    read    : { method : 'GET' },
    destroy : { method : 'DELETE'}
   });

  //
  // Account
  //
  api.account = $resource('/account', null,  {
    create : { method : 'POST' },
    read   : { method : 'GET' },
    update : { method : 'PUT' },
   });

  return api;
}])