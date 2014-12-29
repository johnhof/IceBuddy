var assert = require("assert");
var tester = require(process.cwd() + '/test/tester');

//
// Setup
//

// initialize the test object
var test = tester();

test.stash.playerId = "PLAY" + test.seed;
test.stash.number = 69;
test.stash.gameId = "GAME" + test.seed;
test.stash.seasonId = "SEASON" + test.seed;
test.stash.goals = 3;
test.stash.assists = 1;
test.stash.plus_minus = -1;
test.stash.pim = 2;
test.stash.ppg = 1;
test.stash.ppa = 0;
test.stash.shg = 0;
test.stash.sha = 1;
test.stash.gwg = 1;
test.stash.otg = 0;
test.stash.shots = 6;
test.stash.fot = 0;
test.stash.fow = 0;
test.stash.win = 0;
test.stash.loss = 1;
test.stash.otl = 0;
test.stash.tie = 0;
test.stash.nd = 0;
test.stash.sa = 35;
test.stash.ga = 5;
test.stash.so = 0;

// Test set execution

test.execSet('Stats', [
  add,
  player_search,
  season_search,
  game_search,
  playerSeason_search,
  playerGame_search,
  retrieve,
  update,
  remove
]);

//
// Tests
//


// Add
//
// expects - nothing
function add (stash, next) {
  describe('Create a statistic', function () {
    it('should store a statistic into the db', function (done) {
      test.request.post({
        route : '/stats',
        form  : {
          player_id : stash.playerId,
          game_id : stash.gameId,
          season_id : stash.seasonId,
          goals: stash.goals,
          assists: stash.assists,
          plus_minus: stash.plus_minus,
          pim: stash.pim,
          ppg: stash.ppg,
          ppa: stash.ppa,
          shg: stash.shg,
          sha: stash.sha,
          gwg: stash.gwg,
          otg: stash.otg,
          shots: stash.shots,
          fot: stash.fot,
          fow: stash.fow,
          win: stash.win,
          loss: stash.loss,
          otl: stash.otl,
          tie: stash.tie,
          nd: stash.nd,
          sa: stash.sa,
          ga: stash.ga,
          so: stash.so
        }
      }, function (response, body) {
        //All create test cases are done in helpers
        stash.statsId = body.stat['_id'];
        return next(null, done);
      });
    });
  });
}

// Search 
// Returns stats that match player id

// expects - player id
function player_search (stash, next) {
  describe('Search for a player\'s stats', function () {
    it('should return a list of stats', function (done) {
      test.request.get({
        route : '/stats',
        qs    : { player_id : stash.playerId },
      }, function (response, body) {
        assert.notEqual(body.stats.length, 0, 'No stats found from the search');

        var stat = body.stats[0];
        assert.equal(stat.goals, stash.goals);
        assert.equal(stat.sha, stash.sha);
        assert.equal(stat.sa, stash.sa);

        return next(null, done);
      });
    });
  });
}

// Search 
// Returns stats that match season id

// expects - season id
function season_search (stash, next) {
  describe('Search for a season\'s stats', function () {
    it('should return a list of stats', function (done) {
      test.request.get({
        route : '/stats',
        qs    : { season_id : stash.seasonId },
      }, function (response, body) {
        assert.notEqual(body.stats.length, 0, 'No stats found from the search');

        var stat = body.stats[0];
        assert.equal(stat.goals, stash.goals);
        assert.equal(stat.sha, stash.sha);
        assert.equal(stat.sa, stash.sa);

        return next(null, done);
      });
    });
  });
}

// Search 
// Returns stats that match game id

// expects - game id
function game_search (stash, next) {
  describe('Search for a game\'s stats', function () {
    it('should return a list of stats', function (done) {
      test.request.get({
        route : '/stats',
        qs    : { game_id : stash.gameId },
      }, function (response, body) {
        assert.notEqual(body.stats.length, 0, 'No stats found from the search');

        var stat = body.stats[0];
        assert.equal(stat.goals, stash.goals);
        assert.equal(stat.sha, stash.sha);
        assert.equal(stat.sa, stash.sa);

        return next(null, done);
      });
    });
  });
}

// Search 
// Returns stats that players season

// expects - season id, player id
function playerSeason_search (stash, next) {
  describe('Search for a player\'s season stats', function () {
    it('should return a list of stats', function (done) {
      test.request.get({
        route : '/stats',
        qs    : { 
          player_id : stash.playerId,
          season_id : stash.seasonId 
        },
      }, function (response, body) {
        assert.notEqual(body.stats.length, 0, 'No stats found from the search');

        var stat = body.stats[0];
        assert.equal(stat.goals, stash.goals);
        assert.equal(stat.sha, stash.sha);
        assert.equal(stat.sa, stash.sa);

        return next(null, done);
      });
    });
  });
}

// Search 
// Returns stat that players game

// expects - game id, player id
function playerGame_search (stash, next) {
  describe('Search for a player\'s game stats', function () {
    it('should return a single of stat', function (done) {
      test.request.get({
        route : '/stats',
        qs    : { 
          player_id : stash.playerId, 
          game_id : stash.gameId
        },
      }, function (response, body) {
        assert.notEqual(body.stats.length, 0, 'No stats found from the search');

        var stat = body.stats[0];
        assert.equal(stat.goals, stash.goals);
        assert.equal(stat.sha, stash.sha);
        assert.equal(stat.sa, stash.sa);

        return next(null, done);
      });
    });
  });
}

// Retrieve
//
// expects
function retrieve (stash, next) {
  describe('Retrieving a stat', function () {
    it('should retrieve stat row', function (done) {
      test.request.get({
        route : '/stats/' + stash.statsId,
      }, function (response, body) {
        var stat = body.stat;
        assert.equal(stat.goals, stash.goals);
        assert.equal(stat.sha, stash.sha);
        assert.equal(stat.sa, stash.sa);

        return next(null, done);
      });
    });
  });
}

// Update
//
// expects - playerId
function update (stash, next) {
  describe('Updating a player', function() {
    it('should update player Goals and Assists', function (done) {
      var newGoals = 2;
      var newAssists = 2;
      test.request.put({
        route : '/stats/' + stash.statsId,
        form  : {
          goals : newGoals,
          assists : newAssists
        }
      }, function (response, body) {
        assert.equal(body.stat.goals, newGoals);
        assert.equal(body.stat.assists, newAssists);

        return next(null, done);
      });
    });
  });
}


// Remove
//
// expects - playerId
function remove (stash, next) {
  describe('Deleting a stat', function () {
    it('delete the created stat', function (done) {
      test.request.del({
          route : '/stats/' + stash.statsId,
        }, function (response, body) {
          assert.equal(body.success, true);
          return next(null, done);
        })
    });
  });
}