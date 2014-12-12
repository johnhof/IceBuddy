//
// App Helpers
//

simpleApp.service('Cookie', [function () {
  return function (cookieName, value) {
    if (value) {
      $.cookie(cookieName, value);
    } else {
      var result;

      var cookie = $.cookie(cookieName);
      if (cookie) {
        try {
            result = JSON.parse(cookie);
        } catch (e) {
          console.error(e);
          result = null;
        }
      }

      return result;
    }
  }
}]);



simpleApp.service('Session', ['Cookie', 'Api', '$route', function (Cookie, Api, $route) {
  var session = {
    username   : null,
    email      : null,
    isSignedIn : false,

    // logout and reload the current page
    signOut : function () {
      applyCookie();
      Api.session.destroy($route.reload);
    },

    signIn : function (inputs) {
      Api.session.create(inputs, function (json, headers) {
        applyCookie();
        console.log('\n\n');
        console.log(json);
        console.log(headers);
      }, function (error) {
        applyCookie();
        console.log('\n\n');
        console.log('error returned and handled');
        console.log(error);
      });
    }
  }

  applyCookie();
  function applyCookie () {
    var cookie = Cookie('session') || {};
    session.username   = cookie.username;
    session.email      = cookie.email;
    session.isSignedIn = cookie.isSignedIn || false;
  }

  return session;
}])
