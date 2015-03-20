var trackerCtrl = simpleApp.service('Game', ['$scope', 'GameTracker', function ($scope, GameTracker) {


  ////////////////////////////////////////////////////////////////////////
  //
  //  Game
  //
  ////////////////////////////////////////////////////////////////////////


// TODO - fix the timer to use 60 sec instead of 100

  function Game () {
    this.period  = 1;
    this.periods = [];
    this.teams   = {
      home : new Team(),
      away : new Team()
    };

    for (var i = 1; i <= 3; i++) {
      this.periods.push(new Period(i));
    }


    //
    // Period
    //

    function Period () {
      this.timeRemaining = 20.00; // set periods to be 20 min
      this.interval      = null; // keep the interval for garbage collection
      this.summary       = []; // array of events
    }

    Period.prototype.start = function () {
      this.interval = setInterval(function (){
        this.timeRemaining -= 0.01;
      }, 1000);
    }

    Period.prototype.stop = function () {
      clearInterval(this.interval);
    }

    Period.prototype.end = function () {
      this.stop();
      this.timeRemaining = 0;
    }

    Period.prototype.restart = function () {
      this.stop();
      this.timeRemaining = 0;
    }

    Period.prototype.setTime = function (time) {
      if (time > 20) {
        time = 20.00;
      } else if (time < 0) {
        time = 0;
      }

      this.timeRemaining = time;
    }
  }

  Game.prototype.currentScore = function () {
    return {
      home : teams.home.goals.length,
      away : teams.away.goals.length
    };
  }

  Game.prototype.setPeriod = function (period) {
    if (period >= 1 && period <= 3 && period.isInt()) {
      this.periiod = period;
    } else {
      return false;
    }
  }

  // wrappers for `Game.event(type, event)`
  Game.prototype.shot = function (shot) {
    this.event('shot', shot);
  }
  Game.prototype.goal = function (goal) {
    this.event('goal', goal);
  }
  Game.prototype.penalty = function (penalty) {
    this.event('penalty', penalty);
  }

  // take the event and register it for the team
  // then add it to the priod summary
  // then return the event
  Game.prototype.event = function (type, event) {

    // validate inputs
    if (!(type && event.team)) {
      return  false;
    }

    event.team = evemt.team.toLowerCase();
    type = type.toLowerCase();

    if (!(event.team === 'home' || event.team === 'away')) {
      return false;
    }

    var team = this.teams[event.team];

    // track the event at the current time
    event.period = event.period || this.period;
    event.time = event.time || this.timeRemaining;

    // add the event to the team
    var resultEvent = team[type](event);

    // track the resulting event in the game summary
    if (this.periods[this.period]) {
      this.periods[this.period].summary.push(resultEvent);
    }

    return resultEvent;
  }

  Game.prototype.finalize = function () {
    return {};
  }


  ////////////////////////////////////////////////////////////////////////
  //
  //  Team
  //
  ////////////////////////////////////////////////////////////////////////


  function Team (name) {
    this.name      = name;
    this.goals     = [];
    this.roster    = [];
    this.shots     = [];
    this.penalties = [];

  }


  ////////////////////////////////////////////////////////////////////////
  //
  //  Shot
  //
  ////////////////////////////////////////////////////////////////////////


  function Shot (shot) {
    this.player = shot.player || null;
    this.goal    = shot.goal || false;
    this.time    = shot.time || null;
    this.period  = shot.period || null;
  }


  ////////////////////////////////////////////////////////////////////////
  //
  //  Goal
  //
  ////////////////////////////////////////////////////////////////////////


  function Goal (goal) {
    this.player = goal.player || null;

    this.assists = {};

    if (assists.length) {
      this.assists.primary = assists[0];
    }

    if (assists.length > 1) {
      this.assists.secondary = assists[1];
    }

    this.time   = goal.time || null;
    this.period = goal.period || null;
  }


  ////////////////////////////////////////////////////////////////////////
  //
  //  Penalty
  //
  ////////////////////////////////////////////////////////////////////////


 function Penalty (penalty) {
    this.player   = penalty.player || null;
    this.duration = penalty.duration || null;
    this.type     = goal.type || null;
    this.severity = penalty.severity && penalty.severity.toLowerCase() === 'major' ? 'major' : 'minor';
    this.time     = penalty.time || null;
    this.period   = penalty.period || null;
  }

  return Game;
}]);