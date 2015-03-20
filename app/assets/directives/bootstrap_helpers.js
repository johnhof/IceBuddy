////////////////////////////////////////////////////////////////////////
//
//  Alias's
//
////////////////////////////////////////////////////////////////////////

// replace with a container/row combo for bootstrap
//
simpleApp.directive('row', [function () {
  return {
    restrict   : 'E',
    replace    : true,
    transclude : true,
    template   : '<div class="container-fluid"><div class="row-fluid"><ng-transclude></ng-transclude></div></div>',
  };
}]);