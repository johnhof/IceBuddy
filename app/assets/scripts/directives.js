//
// Global Directives
//


//
// Custon Validators
//


simpleApp.directive('email', ['Patterns', function (Patterns) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.email = function(modelValue, viewValue) {
        return Patterns.email.test(viewValue);
      };
    }
  };
}]);


simpleApp.directive('password', ['Patterns', function (Patterns) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.password = function(modelValue, viewValue) {
        return Patterns.password.test(viewValue);
      };
    }
  };
}]);



simpleApp.directive('match', [ function (Patterns) {
  return {
    require : 'ngModel',
    scope   : {
      match : '@'
    }
    link: function(scope, elm, attrs, ctrl) {
      console.log(scope.match)
      ctrl.$validators.match = function(modelValue, viewValue) {
        return Patterns.password.test(viewValue);
      };
    }
  };
}]);

//
// Validation handler
//

// directive to automatically show any errors bound to the accompanying model (`[name].$error` in a form)
//  error display binds to the `name` attribute
simpleApp.directive("validate", [function () {
  // build template errors
  function  getError(error) {
    var map = {
      required : 'is a required field',
      email    : 'must be a valid email',
      match    : 'does not match'
      invalid  : 'is invalid'
    };

    return map[error] || map.invalid;
  };

  return {
    require : 'ngModel',
    link : function(scope, element, attr, ctrl) {
      element.after('<div class="error" data-matches="' + attr.ngModel + '"></div>');
      var $errorDiv =  element.next('.error[data-matches="' + attr.ngModel + '"]');

      scope.$watch(attr.ngModel, function () {
        var errorsKeys = Object.keys(ctrl.$error || {});
        if (errorsKeys.length) {
          element.addClass('invalid')
          $errorDiv.text(attr.name.capitalize() + ' ' + getError(errorsKeys[0]));
        } else {
          element.removeClass('invalid')
          $errorDiv.empty();
        }
      }, true);
    },
  };
}]);
