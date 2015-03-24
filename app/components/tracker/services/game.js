simpleApp.service('Game', ['Timer', function (Timer) {


  ////////////////////////////////////////////////////////////////////////
  //
  //  Game
  //
  ////////////////////////////////////////////////////////////////////////


  //
  // Expects:
  //
  // Result:
  // {
  //   // properties
  //   period    : Number, // active period number
  //   periods   : Array, // list of period
  //   teams  : {
  //     home : {
  //       goals : Array // list of goals
  //     },
  //     away : {
  //       goals : Array // list of goals
  //     },
  //   }
  //   remaining : Number, // number in milliseconds remaining
  //
  //   // prototyped
  //   currentScore : function, // get the current score { home: Number, away: Numere}
  //   setPeriod    : function, // set the period
  //   shot         : function // track a shot
  //   goal         : function // track a goal
  //   penalty      : function // track a penalty
  //   event        : function // track an event
  //   finalize     : function // return a clean object for DB storage
  // }
  //
  function Game () {
    var periods = [
      new Period(),
      new Period(),
      new Period()
    ];

    this.periods   = periods;
    this.periodNum = 1;
    this.period    = periods[1];
    this.teams     = {
      home : new Team(),
      away : new Team()
    }
  }

  Game.prototype.setTeams = function (teams) {
    if (teams) {
      if (teams.home) {
        this.teams.home.name      = teams.home.name;
        this.teams.home.sourceObj = teams.home;
      }
      if (teams.away) {
        this.teams.away.name      = teams.away.name;
        this.teams.away.sourceObj = teams.away;
      }
    }
  }

  Game.prototype.currentScore = function () {
    return {
      home : teams.home.goals.length,
      away : teams.away.goals.length
    };
  }

  Game.prototype.setPeriod = function (periodNum) {
    periodNum = Math.floor(periodNum);

    if (periodNum >= 1 && periodNum <= 3) {
      this.periodNum = periodNum;
      this.period    = this.periods[periodNum - 1];

      this.period.timer.set({ minutes : 20 });

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
  //  Period
  //
  ////////////////////////////////////////////////////////////////////////

  //
  // Returns:
  // {
  //   // properties
  //   summary : Array // array of events during the period
  //   timer   : Timer // timer instance to track the period
  //
  //    // prototyped
  //    start   ; function // start the period timer
  //    stop    : function // stop the period timer
  //    end     : function // end the period (sets timer to 0)
  //    restart : function // restarts the period
  // }
  //
  //
  function Period () {
    // console.log(this);
    // this = this || {};
    // this.summary = []; // array of events
    // this.timer   = new Timer({
    //   minutes : 20
    // });

    return {
      sumamry : [],
      timer   : new Timer({ minutes : 20 })
    }
  }

  Period.prototype.stop = function () {
    clearInterval(this.interval);
    this.interval = null;
  }

  Period.prototype.end = function () {
    this.timer.set({ minutes: 0, seconds: 0});
    this.timer.stop();
  }

  Period.prototype.restart = function () {
    this.stop();
    this.timeRemaining = 0;
  }


  ////////////////////////////////////////////////////////////////////////
  //
  //  Team
  //
  ////////////////////////////////////////////////////////////////////////


  function Team (name) {
    this.name      = name;
    this.sourceObj = null;
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

  // return Game;
  return Game;
}]);