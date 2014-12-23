//
// Global Services
//

// Parse a cookie and return tit as a JS object, defaulting to {} if the JSON cannot be parsed
simpleApp.service('Cookie', [function () {
  return function (cookieName, value) {
    if (value) {
      $.cookie(cookieName, value);
    } else {
      var result;

      var cookie = $.cookie(cookieName);
      if (cookie) {
        try {
            result = JSON.parse(cookie.replace(/^j:/, ''));
        } catch (e) {
          console.error(e);
          result = null;
        }
      }

      return result;
    }
  }
}]);


// A collection of session data for the current user. Inludes sign in and sign out utilities
simpleApp.service('Session', ['Cookie', 'Api', '$route', '$window', function (Cookie, Api, $route, $window) {
  var session = {
    nickname   : null,
    email      : null,
    isSignedIn : false,
    name       : {
      first : null,
      last  : null
    },

    apply : applyCookie,

    displayName : function () {
      if (session.name &&  session.name.first) {
        return session.name.first;
      } else if (session.username) {
        return session.username;
      } else {
        return 'Guest';
      }
    },

    // logout and reload the current page
    signOut : function () {
      Api.session.destroy(function () {
        applyCookie();
        $route.reload();
      });
    },


    // redirect to sign in page is the user isnt signed in
    requireSignIn : function () {
      if (!Cookie('session').isSignedIn) {
        $window.location.href = '/#/session';
      }
    }
  }

  applyCookie();
  function applyCookie () {
    var cookie = Cookie('session');
    if (cookie) {
      session.username   = cookie.username;
      session.email      = cookie.email;

      session.name       = cookie.name ? {
        first : cookie.name.first,
        last  : cookie.name.last
      } : {};

      session.isSignedIn = cookie.isSignedIn || false;
    }

  }

  return session;
}])