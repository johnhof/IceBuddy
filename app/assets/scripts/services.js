//
// Global Services
//




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


////////////////////////////////////////////////////////////////////////
//
//  Utilities service
//
////////////////////////////////////////////////////////////////////////

// A collection of general purpose utilities
simpleApp.service('Utils', ['Cookie', 'Api', '$route', '$window', function (Cookie, Api, $route, $window) {
  var $dom = angular.element('html');
  return {

    //
    // Form helper
    //


    formHelper : function (formObj) {
      var $form = angular.element('form[name=' + formObj.$name + ']');
      var form  = {
        // validate and perform passed in action
        apiAction : function (resourceReq, onSuccess) {
          formObj.submitted = true;

          if (form.validate()) {
            resourceReq(onSuccess, form.resErrHandler);
          }
        },
        // validate by pairing visible inputs with their angular model counterparts to find validation errors
        validate : function () {
          var valErrors;

          // only validate visible inputs
          $form.find('input[ng-show]:not(.ng-hide), input:not([ng-show])').each(function () {
            var $input   = $(this);

            // make sure our parent isnt hidden either
            if ($input.closest('[ng-show].ng-hide').length) { return; }

            var angInput = formObj[$input.attr('name')]; // pair name to angular input obj
            if (angInput && Object.keys(angInput.$error || {}).length) {
              valErrors =  true;
            }
          });

          return !valErrors;
        },

        // error handler which appends api errors to the form
        resErrHandler : function (apiError) {
          var errorObj = _.defaults(apiError.data || {}, {
            error   : 'Failed to complete action',
            details : []
          });

          // if its a validation error, set the error text for each problem input
          if (errorObj.error === 'ValidationError') {
            console.log('val error')
            console.log(errorObj)
            _.each(errorObj.details, function (valError) {
              console.log(valError)
              if (!(valError && valError.path && valError.message)) { return; }
console.log(valError.message)
              var $input = $dom.find('error[data-matches="' + valError.path + '"], error[data-matches="inputs.' + valError.path + '"]');
              $input.text(valError.message);
            });

          // if its not a validation error, just display add the error to the form
          } else {
            formObj.globalError = errorObj.error;
          }
        },


        //
        // Miscellaneous utilities
        //


        // prefix /# and redirect
        redirect : function (path) {
          path = /^\//.test(path) ? path : '/' + path
          $location.path('/#' + path);
        }
      }

      return form;
    }
  }
}])