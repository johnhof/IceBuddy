var trackerCtrl = simpleApp.controller('TrackerCtrl', ['$scope', '$routeParams', 'Utils', 'Session', 'Api', function ($scope, $routeParams, Utils, Session, Api) {

}]);

trackerCtrl.directive('actionblock', ['Utils', function (Utils) {
  return {
    restrict    : 'E',
    scope       : true,
    replace     : true,
    templateUrl : Utils.partial('action_block'),
    link        : function (scope, element, attrs) {
      scope.target = attrs.target;
    }
  };
}]);