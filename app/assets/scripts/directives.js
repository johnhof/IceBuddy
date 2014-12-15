//
// Global Directives
//


// directive to automatically show any errors bound to the accompanying model (`[name].$error` in a form)
//  error display binds to the `name` attribute
simpleApp.directive("validate", ['$compile', function ($compile) {
  return {
    replace: true,
    transclude: false,
    scope: {},
    link: function(scope, element, attrs) {
      var genericErrors = {
        required : 'required field',
        email    : 'must be an email',

      }
      var error = angular.element('<div class="input-error" ng-show="form.' + attrs.name + '.$error">OH NO!</div>');
      error.insertAfter(element)
      $compile(error)(scope);
      // element.append(error);
    }
  };
}]);