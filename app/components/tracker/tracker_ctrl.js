var trackerCtrl = simpleApp.controller('TrackerCtrl', ['$scope', 'Utils', 'Session', 'Api', 'Game', 'ngDialog',function ($scope, Utils, Session, Api, Game, ngDialog) {

  $scope.game = new Game();


  ////////////////////////////////////////////////////////////////////////
  //
  //  Team Management
  //
  ////////////////////////////////////////////////////////////////////////


  // keep track of whether or not to display both actions based on width
  Utils.onResize($scope, function (newSize) {
    $scope.displaySingleAction = (newSize.width <= 600);
  });


  ////////////////////////////////////////////////////////////////////////
  //
  //  Team Management
  //
  ////////////////////////////////////////////////////////////////////////

  $scope.activeTeam = {
    type   : 'home',
    object : $scope.game.teams.home,
    set    : function (type) {
      if (type === 'away' || type === 'home') {
        $scope.activeTeam.type = type;
        $scope.activeTeam.object = $scope.game.teams[type];
      }
    }
  }


  $scope.teamSelectModal = {
    teamList   : [],
    activeTeam : null,
    isEdit     : false,
    teams      : {
      home       : null,
      away       : null
    },
    setTeam : function (teamType, team) {
      if ((teamType === 'home' || teamType === 'away')) {
        $scope.teamSelectModal.teams[teamType] = team;
      }
    },
    search     : function (name) {
      Api.teams.read({ name : name }, function (result) {
        $scope.teamSelectModal.teamList = result && result.teams ? result.teams : [];
      });
    },
    open : function (selectType) {
      $scope.isEdit = !!selectType;
      $scope.teamSelectModal.activeTeam = selectType || 'home';
      $scope.teamSelectModal.selectType = selectType;
      $scope.teamSelectModal.search();

      ngDialog.open({
        templateUrl     : Utils.partial('team_select_modal'),
        showClose       : false,
        closeByDocument : false,
        scope           : $scope
      });
    },
    saveTeam : function () {
      $scope.teamSelectModal.teams.home = $scope.teamSelectModal.teams.home || null;
      $scope.teamSelectModal.teams.away = $scope.teamSelectModal.teams.away || null;
      $scope.game.setTeams($scope.teamSelectModal.teams || {});
      return true;
    }
  }

  ////////////////////////////////////////////////////////////////////////
  //
  //  Action helpers
  //
  ////////////////////////////////////////////////////////////////////////

  $scope.activeTeamType = 'home';

  $scope.eventModal = {
    message    : '',
    nextPeriod : null,
    open       : function () {
      ngDialog.open({
        templateUrl : Utils.partial('event_details_modal'),
        scope       : $scope
      });
    }
  }

  $scope.newEvent = function (type, team) {
    $scope.timer.stop();
    $scope.eventModal.title = 'New ' + type;

    var type = type.toLowerCase();

    if (type === 'goal') {

    } else if (type === 'penalty') {

    } else if (type === 'shot') {

    }

    $scope.eventModal.open();
  }

  $scope.saveEvent = function (team) {
    $scope.eventModal.open();
  }


  ////////////////////////////////////////////////////////////////////////
  //
  //  Period Management
  //
  ////////////////////////////////////////////////////////////////////////


  $scope.transitionPeriod = function (number) {
    if (number > 3) {
      console.log('saving game');

    } else {
      $scope.game.setPeriod(number);
    }

    return true;
  }

  $scope.periodModal = {
    title      : '',
    subText    : '',
    nextPeriod : null,
    open       : function () {
      $scope.timer.stop();
      ngDialog.open({
        templateUrl : Utils.partial('period_transition_modal'),
        showClose   : false,
        scope       : $scope
      });
    }
  }

  $scope.periodSelect = function (number) {
    if (number !== $scope.game.periodNum) {
      $scope.periodModal.title = 'Transition to ' + periodPrint(number) + ' period';

      if (number < $scope.game.periodNum) {
        $scope.periodModal.subText = ' Stats from the remaining periods will be lost!';
      }

      $scope.periodModal.nextPeriod = number;

      $scope.periodModal.open();
    }
  }

  //
  // helpers
  //

  function periodTimeout () {
    $scope.periodModal.title = periodPrint($scope.game.periodNum) + ' period over'

    if ($scope.game.periodNum < 3) {
      $scope.periodModal.subText = 'Start ' + periodPrint($scope.game.periodNum + 1) + ' period?';
    } else if ($scope.game.periodNum == 3) {
      $scope.periodModal.subText = 'Finalize game?';
    }

    $scope.periodModal.nextPeriod = $scope.game.periodNum + 1;
    $scope.periodModal.open();
  }

  function periodPrint (num) {
    switch (num) {
      case 1  : return '1st';
      case 2  : return '2nd';
      case 3  : return '3rd';
      default : return '';
    }
  }

  ////////////////////////////////////////////////////////////////////////
  //
  //  Timer Management
  //
  ////////////////////////////////////////////////////////////////////////

  $scope.timer = {

    // wrapper to start timer
    start  :function () {
      $scope.game.period.timer.start(apply, periodTimeout);
    },

    // wrapper to stop timer
    stop : function () {
      $scope.game.period.timer.stop();
    },

    // edit used to keep state, manage functionality when time is being set
    edit : {
      active :  false,
      value  : {
        minutes : null,
        seconds : null
      },

      // init the edit values, set the edit.active state to true
      start : function () {
        $scope.game.period.timer.stop();
        $scope.timer.edit.active = true;
        $scope.timer.edit.value.minutes = $scope.game.period.timer.minutes;
        $scope.timer.edit.value.seconds = $scope.game.period.timer.seconds;
      },

      // apply the edit timer values to the game. close edit state
      submit : function () {
        $scope.timer.edit.active = false;
        $scope.game.period.timer.set({
          minutes : $scope.timer.edit.value.minutes,
          seconds : $scope.timer.edit.value.seconds
        });
      },

      // close edit state, do not apply values
      cancel : function () {
        $scope.timer.edit.active = false;
      },
    }
  }

  ////////////////////////////////////////////////////////////////////////
  //
  //  Internal helpers
  //
  ////////////////////////////////////////////////////////////////////////


  // wrapper to prevent scoping errors
  function apply () {
    $scope.$apply();
  }


  ////////////////////////////////////////////////////////////////////////
  //
  //  Initialization
  //
  ////////////////////////////////////////////////////////////////////////


  // if there is a cached game
  if (true) {
    $scope.teamSelectModal.open();

  // if there is a cached game, apply it
  } else {

  }
}]);


////////////////////////////////////////////////////////////////////////
//
//  Directives
//
////////////////////////////////////////////////////////////////////////


trackerCtrl.directive('actionblock', ['Utils', function (Utils) {
  return {
    restrict    : 'E',
    replace     : true,
    templateUrl : Utils.partial('action_block'),
    scope       : true,
    link        : function(scope, element, attrs) {
      if (attrs.target && scope.game.teams[attrs.target]) {
        scope.target = attrs.target;
        scope.team = scope.game.teams[attrs.target];
      }
    }
  };p
}]);


trackerCtrl.directive('eventitem', ['Utils', function (Utils) {
  return {
    restrict    : 'E',
    replace     : true,
    templateUrl : Utils.partial('game_event_row'),
    scope       : {
      event : '@event'
    },
    link : function (scope, element, attrs) {
    }
  };
}]);