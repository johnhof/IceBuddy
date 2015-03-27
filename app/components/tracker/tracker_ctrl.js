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

  // Active team toggle - sets header team being displayed
  $scope.activeTeam = new (function () {
    this.type   = 'home';
    this.object = $scope.game.teams.home;

    this.set = function (type) {
      if (type === 'away' || type === 'home') {
        this.type = type;
        this.object = $scope.game.teams[type];
      }
    }
  });

  // Team selection modal - manages team selection
  $scope.teamSelectModal = new (function () {
    this.teamList   = [];
    this.activeTeam = null;
    this.isEdit     = false;
    this.teams      = {
      home : null,
      away : null
    };

    this.setTeam = function (teamType, team) {
      if ((teamType === 'home' || teamType === 'away')) {
        this.teams[teamType] = team;
      }
    }

    this.search = function (name) {
      Api.teams.read({ name : name }, function (result) {
        this.teamList = result && result.teams ? result.teams : [];
      }.bind(this));
    }

    this.open = function (selectType) {
      this.isEdit = !!selectType;
      this.activeTeam = selectType || 'home';
      this.selectType = selectType;
      this.search();

      ngDialog.open({
        templateUrl     : Utils.partial('team_select_modal'),
        showClose       : false,
        closeByDocument : false,
        scope           : $scope
      });
    }

    this.saveTeam = function () {
      this.teams.home = this.teams.home || null;
      this.teams.away = this.teams.away || null;
      $scope.game.setTeams(this.teams || {});
      return true;
    }
  })();

  ////////////////////////////////////////////////////////////////////////
  //
  //  Action helpers
  //
  ////////////////////////////////////////////////////////////////////////


  // Event modal - event selection and saving
  $scope.eventModal = new (function () {
    this.message    = '';
    this.nextPeriod = null;

    // TODO : actually implement this

    this.open = function () {
      ngDialog.open({
        templateUrl : Utils.partial('event_details_modal'),
        scope       : $scope
      });
    }
  })();

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

  $scope.periodModal = new (function () {
    this.title      = '';
    this.subText    = '';
    this.nextPeriod = null;

    this.open = function () {
      $scope.timer.stop();
      ngDialog.open({
        templateUrl : Utils.partial('period_transition_modal'),
        showClose   : false,
        scope       : $scope
      });
    }
  });

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

  $scope.timer = new (function () {

    // wrapper to start timer
    this.start = function () {
      $scope.game.period.timer.start(apply, periodTimeout);
    },

    // wrapper to stop timer
    this.stop = function () {
      $scope.game.period.timer.stop();
    },

    // edit used to keep state, manage functionality when time is being set
    this.edit = new (function () {
      this.active =  false;
      this.value  = {
        minutes : null,
        seconds : null
      }

      // init the edit values, set the edit.active state to true
      this.start = function () {
        $scope.game.period.timer.stop();
        this.active = true;
        this.value.minutes = $scope.game.period.timer.minutes;
        this.value.seconds = $scope.game.period.timer.seconds;
      }

      // apply the edit timer values to the game. close edit state
      this.submit = function () {
        this.active = false;
        $scope.game.period.timer.set({
          minutes : this.value.minutes,
          seconds : this.value.seconds
        });
      }

      // close edit state, do not apply values
      this.cancel = function () {
        this.active = false;
      }
    })();
  })();

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