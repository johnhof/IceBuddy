var trackerCtrl = simpleApp.controller('TrackerCtrl', ['$scope', '$routeParams', 'Utils', 'Session', 'Api', function ($scope, $routeParams, Utils, Session, Api) {

  $scope.home = new Team('home');
  $scope.away = new Team('away');


  function Team (name) {
    this.name  = name;
    this.goals = [];
  }
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