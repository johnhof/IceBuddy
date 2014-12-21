//
// Global Directives
//


// directive to automatically show any errors bound to the accompanying model (`[name].$error` in a form)
//  error display binds to the `name` attribute
simpleApp.directive("validate", ['$compile', function ($compile) {
  // build template errors
  function  getError(error) {
    var map = {
      required : 'is a required field',
      email    : 'must be a valid email',
      invalid  : 'is invalid'
    };

    return map[error] || map.invalid;
  };

  return {
    require : 'ngModel',
    link : function(scope, element, attr, ctrl) {
      element.after('<div class="input-error" data-matches="' + attr.ngModel + '"></div>');
      var $errorDiv =  element.next('.input-error[data-matches="' + attr.ngModel + '"]');

      scope.$watch(attr.ngModel, function () {
        console.log(ctrl.$error)
        var errors = Object.keys(ctrl.$error);

        if (errors.length) {
          element.addClass('invalid')
          $errorDiv.text(attr.name.capitalize() + ' ' + getError([errors[0]]));
        } else {
          element.removeClass('invalid')
          $errorDiv.empty();
        }
      }, true);
    },
  };
}]);
