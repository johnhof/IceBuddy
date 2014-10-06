//
// App Helpers
//
// bind all helper functions to `simpleApp.helpers`


// find be current page break state
simpleApp.helpers.getPageBreak = function (width) {
  var maxBreak = null;
  for (var pageBreak in simpleApp.appConfig._pageBreaks) {
    if (width > pageBreak) { maxBreak = simpleApp.appConfig._pageBreaks[pageBreak]; }
  }

  return maxBreak;
}


simpleApp.helpers.onPageBreak = function ($scope, $window, handlers) {
  var win = angular.element($window);
  $scope.$watch(function () {
    return win.width();
  }, function (newWidth, oldWidth) {
    var currentWindow = simpleApp.helpers.getPageBreak(newWidth);
    var oldWindow     = simpleApp.helpers.getPageBreak(oldWidth);

    // fire the handler for the current window if it has changed state
    if (currentWindow !== oldWindow && typeof handlers[currentWindow] === 'function') { handlers[currentWindow](); }
  });

  win.bind('resize', function() { $scope.$apply(); });
}