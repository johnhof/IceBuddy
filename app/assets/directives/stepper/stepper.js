
// number stepper
//
simpleApp.directive('stepper', ['Utils', function (Utils) {
  return {
    restrict    : 'E',
    replace     : true,
    scope       : {
      model : '=ngModel'
    },
    templateUrl : Utils.partial('stepper'),
    link        : function (scope, element, attrs) {
      scope.max = attrs.max || false;
      scope.min = attrs.min || false;

      // if there is a max, restrict the size to that many characters
      if (scope.max !== false) {
        scope.size = scope.max.toString().length;
      }

      // bump the model value
      scope.up = function () {
        if (scope.max === false || (scope.model < scope.max)) {
          scope.model++;
        }
      }

      // reduce the model value
      scope.down = function () {
        if (scope.min === false || (scope.model > scope.min)) {
          scope.model--;
        }
      }
    }
  };
}]);
