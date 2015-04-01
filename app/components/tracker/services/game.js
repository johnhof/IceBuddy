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
  //   setTeams     : function, // set the teams for the game
  //   currentScore : function, // get the current score { home: Number, away: Numere}
  //   setPeriod    : function, // set the period
  //   shot         : function, // track a shot
  //   goal         : function, // track a goal
  //   penalty      : function, // track a penalty
  //   event        : function, // track an event
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

  // Expect:
  // {
  //   home : Object, // `null` or `false` remove the current team
  //   away : Object, // `null` or `false` remove the current team
  // }
  //
  // Set the teams for the game
  Game.prototype.setTeams = function (teams) {
    teams = teams || {};

    if (teams.home !== undefined) {
      this.teams.home.applyTeamObj(teams.home || {});
    }
    if (teams.away !== undefined) {
      this.teams.away.applyTeamObj(teams.away || {});
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
  //
  // Expects
  // {
  //   type  : String // game, penalty, shot
  //   event : {
  //     team   : String, // home or away
  //     period : Period, // OPTIONAL - defaults to current period
  //     time   : Date, // OPTIONAL - defaults to current time
  //     // ...  details specific to event
  //   }
  // }
  Game.prototype.event = function (type, event) {

    // validate inputs
    if (!(type && event.team)) {
      return  false;
    }

    event.team = event.team.toLowerCase();
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
    console.log(resultEvent)
    this.period.summary.push(resultEvent);

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
      summary : [],
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
    this.players   = [];
    this.shots     = [];
    this.penalties = [];
  }

  Team.prototype.applyTeamObj = function (rawTeam) {
    this.name      = rawTeam.name;
    this.players   = rawTeam.players;
    this.sourceObj = rawTeam;
  }


  // Registers a new goal
  //
  // Expects:
  // {
  //   team    : String, // home or away
  //   period  : Period, // period
  //   time    : Date, // time
  //   player  : Object, // player obj
  //   assists : {
  //     primary   : Object, // player obj
  //     secondary : Object // player obj
  //   }
  // }
  //
  // Returns: Goal instance
  Team.prototype.goal = function (goal) {
    goal = new Goal(goal);
    this.goals.push(goal);
    return goal;
  }


  // Registers a new penalty
  //
  // Expects:
  // {
  //     team     : String, // home or away
  //     period   : Period, // period
  //     time     : Date, // time
  //     player   : Object // player obj
  //     type     : String // type of penalty
  //     duration : String // length of penatly
  // }
  //
  // Returns: Penalty instance
  Team.prototype.penalty = function (penalty) {
    penalty = new Penalty(penalty);
    this.penalties.push(penalty);
    return penalty;
  }

  // Registers a newshot
  //
  // Expects:
  // {
  //     team   : String, // home or away
  //     period : Period, // period
  //     time   : Date, // time
  //     player : Object // player obj
  // }
  //
  // Returns: Shot instance
  Team.prototype.shot = function (shot) {
    shot = new Shot(shot);
    this.shots.push(shot);
    return shot;
  }



  ////////////////////////////////////////////////////////////////////////
  //
  //  Shot
  //
  ////////////////////////////////////////////////////////////////////////


  function Shot (shot) {
    this.player = shot.player || null;
    this.time   = shot.time || null;
    this.period = shot.period || null;
  }


  ////////////////////////////////////////////////////////////////////////
  //
  //  Goal
  //
  ////////////////////////////////////////////////////////////////////////


  function Goal (goal) {
    this.player = goal.player || null;
    this.assists = goal.assists || {};
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
    this.type     = penalty.type || null;
    this.severity = penalty.severity && penalty.severity.toLowerCase() === 'major' ? 'major' : 'minor';
    this.time     = penalty.time || null;
    this.period   = penalty.period || null;
  }

  // return Game;
  return Game;
}]);