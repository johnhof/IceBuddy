////////////////////////////////////////////////////////////////////////
//
//  Session related service
//
////////////////////////////////////////////////////////////////////////

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
      var sess = Cookie('session') || {};
      if (!sess.isSignedIn) {
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
}]);


// Open and close a loading spinner
//
simpleApp.service('Spinner', ['ngDialog', function (ngDialog) {
  var instance    = null;
  var defaultSpin = {
    template        : '<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>',
    plain           : true,
    showClose       : false,
    closeByEscape   : false,
    closeByDocument : false,
    className       : 'ngdialog-theme-default spinner-container'
  };

  return {
    open : function () {
      instance = ngDialog.open(defaultSpin);
    },
    close : function () {
      if (instance) {
        instance.close();
      }
    }
  }
}]);

////////////////////////////////////////////////////////////////////////
//
//  Utilities service
//
////////////////////////////////////////////////////////////////////////

// A collection of general purpose utilities
simpleApp.service('Utils', ['Cookie', 'Api', '$route', '$window', '$location', 'Sizes', function (Cookie, Api, $route, $window, $location, Sizes) {
  var $dom = angular.element('html');
  var utils = {
    // prefix /# and redirect

    redirect : function (path) {
      path = /^\//.test(path) ? path : '/' + path
      $location.path(path);
    },

    reload : function () {
      $route.reload();
    },

    partial : function (name) {
      return '../views/_' + name + '.html';
    },

    displayType : function (win) {
      return $window.innerWidth <= Sizes.mobileBreak ? 'mobile' : 'desktop'
    },

    onResize : function (scope, callback) {
      var w = angular.element($window);

      scope.getWindowDimensions = function () {
        return {
          height      : $window.innerHeight,
          width       : $window.innerWidth,
          displayType : utils.displayType(w) // mobile or desktop
        };
      };

      scope.$watch(scope.getWindowDimensions, function (newSize, oldSize) {
        return callback(newSize, oldSize, newSize.displayType !== oldSize.displayType);
      }, true);

      w.bind('resize', function () {
        scope.$apply();
      });
    },
  }

  return utils
}])