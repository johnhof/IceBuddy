app.directive('resize-header', function($window) {
  return function(scope, element, attr) {

    var win = angular.element($window);
    scope.$watch(function() {
      return {
        'height': win.height(),
        'width': win.width()
      };
    }, function(newValue, oldValue) {
      scope.windowHeight = newValue.height;
      scope.windowWidth = newValue.width;

      scope.resizeWithOffset = function(offsetH) {

        scope.$eval(attr.notifier);

        return {
          'height': (newValue.height - offsetH) + 'px'
            //,'width': (newValue.width - 100) + 'px' 
        };
      };

    }, true);

    win.bind('resize', function() {
      scope.$apply();
    });
  }
});