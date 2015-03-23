simpleApp.service('Timer', [function () {
  // millisecond conversions
  var _minute    = 60000;
  var _second    = 1000;
  var _twentyMin = 20 * _minute;
  var _maxTime   = _twentyMin;

  // Expect:
  //   timeInMilliseconds
  //
  // Return:
  // {
  //   minutes : Number
  //   seconds : Number
  // }
  function milliToObj (milliSec) {
    return {
      minutes : Math.floor(milliSec / _minute),
      seconds : ((milliSec % _minute) / _second).toFixed(0)
    }
  }


  // Expect:
  // {
  //   minutes : Number
  //   seconds : Number
  // }
  //
  // Return:
  //   timeInMilliseconds
  function objToMilli (time) {
    time = time || {};

    var milliSec = time.seconds ? (time.seconds * _second) :  0;
    milliSec += time.minutes ? time.minutes * _minute : 0;

    return milliSec;
  }


  // Expect
  //   target : Number // number to restrict bounds
  //   min    : Number // minimum
  //   max    : Number // maximum
  // Return
  //    resutlWithinBounds // Number
  function forceBound (target, min, max) {
    target = target >= max ? max : target;
    target = target <= min ? min : target;
    return target;
  }


  //
  // Expects:
  //   time: (optional)
  //   {
  //     minutes : Number,
  //     seconds : Number
  //   },
  //   callback: (optioanl)
  //     function to execulte every second
  //      `function (timeRemaining) { }`
  //
  // Result:
  // {
  //   // properties
  //   interval  : IntervalObj, // interval object for the timer
  //   active    : Boolean, // is the timer currently operating
  //   callback  : function, // callback executed every second
  //   remaining : Number, // number in milliseconds remaining
  //
  //   // prototyped
  //   start : function, // start the timer
  //   stop  : function, // pauses the timer
  //   set   : function // manually set the time of the timer
  // }
  //
  function Timer (time, callback, onTimeout) {
    this.interval  = null; // keep the interval for garbage collection
    this.active    = false;
    this.callback  = callback;
    this.onTimeout = onTimeout;

    this.remaining = 0;
    this.minutes   = 0;
    this.seconds   = 0;

    // manual time
    if (time) {
      this.set(time);

    // default to 20 min
    } else {
      this.set({
        minutes: 20,
        seconds: 0
      });
    }
  }

  Timer.prototype.start = function (onTimeout) {
    this.onTimeout = onTimeout;
  }

  Timer.prototype.start = function (callback, onTimeout) {
    // if there's time remaining, and there isn't already an active timer
    if (this.remaining > 0 && !this.interval) {
      var _this         = this; // for nested scopes
      var isFirstStep   = true;
      var timeOutCalled = false;

      // set active to true and start the interval
      this.active = true;

      this.onTimeout = onTimeout;

      // invoke and call interval
      step()
      this.interval = setInterval(step, _second);


      function step () {

        // step the timer
        _this.set(_this.remaining - _second);

        //if the callback is defined, execute it
        if (_this.callback) {
          _this.callback(_this.timeRemaining);
        }

        // if the timer reaches 0, stop it
        if (_this.remaining <= 0) {
          _this.stop();

          if (_this.onTimeout && !timeOutCalled) {
            _this.onTimeout();
            timeOutCalled = true;
          }
        }

        if (callback && !isFirstStep) {
          return callback();
        } else {
          isFirstStep = false;
        }
      }
    }
  }

  Timer.prototype.stop = function (callback) {
    clearInterval(this.interval);
    this.interval = null;
    this.active   = false;

    if (callback) {
      return callback(this.remaining);
    }
  }


  // time:
  // {
  //   minutes : Number,
  //   seconds : Number
  // }
  // OR
  // timeInMilliseconds // Number
  Timer.prototype.set = function (time) {
    // no time passed in, noop
    if (!time && time !== 0) {
      return false;
    }

    // build the sanitized times
    var timeObj   = {};
    var timeMilli = null;

    // if it's a number
    if (!isNaN(time)) {
      timeMilli = forceBound(time, 0, _maxTime);
      timeObj   = milliToObj(timeMilli);

    // if it's a time object
    } else {
      timeObj.minutes   = forceBound(time.minutes || 0, 0, 20);
      timeObj.seconds   = forceBound(time.seconds || 0, 0, 60);
      timeMilli         = objToMilli(time);
    }

    // apply thte sanitized time))
    this.remaining = timeMilli;
    this.minutes   = timeObj.minutes;
    this.seconds   = timeObj.seconds;
  }

  return Timer;
}]);