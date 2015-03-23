var trackerCtrl = simpleApp.controller('TrackerCtrl', ['$scope', 'Utils', 'Session', 'Api', 'Game', 'ngDialog',function ($scope, Utils, Session, Api, Game, ngDialog) {

  $scope.game = new Game();


  ////////////////////////////////////////////////////////////////////////
  //
  //  Team Management
  //
  ////////////////////////////////////////////////////////////////////////

  $scope.teamSelectModal = {
    teamList : [],
    search   : function (name) {
      Api.teams.read({ name : name }, function (result) {
        $scope.teamSelectModal.teamList = result && result.teams ? result.teams : [];
      });
    },
    open : function (selectType) {
      $scope.teamSelectModal.selectType = selectType;
      $scope.teamSelectModal.search();

      ngDialog.open({
        templateUrl     : Utils.partial('team_select_prompt'),
        showClose       : false,
        closeByDocument : false,
        scope           : $scope
      });
    }
  }

  $scope.setTeams = function (teams) {

  }

  ////////////////////////////////////////////////////////////////////////
  //
  //  Action helpers
  //
  ////////////////////////////////////////////////////////////////////////

  $scope.activeTeam = 'home';

  $scope.eventModal = {
    message    : '',
    nextPeriod : null,
    open       : function () {
      ngDialog.open({
        templateUrl : Utils.partial('event_details_prompt'),
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
        templateUrl : Utils.partial('period_transition_prompt'),
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

trackerCtrl.directive('actionblock', ['Utils', function (Utils) {
  return {
    restrict    : 'E',
    scope       : true,
    replace     : true,
    templateUrl : Utils.partial('action_block'),
  };
}]);