var trackerCtrl = simpleApp.controller('TrackerCtrl', ['$scope', '$routeParams', 'Utils', 'Session', 'Api', 'Game', function ($scope, $routeParams, Utils, Session, Api, Game) {

  $scope.game = new Game();


  ////////////////////////////////////////////////////////////////////////
  //
  //  Timer helpers
  //
  ////////////////////////////////////////////////////////////////////////

  $scope.timer = {
    editing : false,

    start  :function () {
      $scope.game.period.timer.start(apply);
    },
    stop : function () {
      $scope.game.period.timer.stop();
    },
    edit : {
      start : function () {
        $scope.game.period.timer.stop();
        $scope.timer.editing = true;
      },
      submit : function () {
        $scope.timer.editing = false;
      },
      cancel : function () {
        $scope.timer.editing = false;
      },
    }
  }

  console.log($scope.game)

  ////////////////////////////////////////////////////////////////////////
  //
  //  Internal helpers
  //
  ////////////////////////////////////////////////////////////////////////


  // wrapper to prevent scoping errors
  function apply () {
    $scope.$apply();
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