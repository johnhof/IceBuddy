var assert = require('assert');
var async  = require('async');
var tester = require(process.cwd() + '/test/tester');

//
// Setup
//

// initialize the test object
var test = tester();

test.stash.home = {
    team_id : 'HOME' + test.seed,
    players : ['123', '456'],
    score   : 3
  };

test.stash.away = {
    team_id : 'AWAY' + test.seed,
    players : ['789', '210'],
    score   : 2
  };

test.stash.season_id = 'SEASON' + test.seed;
test.stash.refs = ['321', '654'];


test.stash.date_time = new Date('2015-2-1 20:30 EST').getTime();
// Test set execution

test.execSet('Game', [
  add,
  search_team,
  search_season,
  search_season_team,
  retrieve,
  update,
  remove,
]);


//
// Tests
//

// Add
//
// expects - nothing
function add (stash, next) {
  describe('Adding a Game', function () {
    it('should store a Game into the db', function (done) {
      test.request.post({
        route : '/games',
        form  : {
          home : stash.home,
          away : stash.away,
          season_id : stash.season_id,
          refs : stash.refs,
          date_time : stash.date_time
        }
      }, function (response, body) {
        return next(null, done);
      });
    });
  });
}

// Search
//
// expects - team id
function search_team (stash, next) {
  describe('Search for a game', function () {
    it('should return a list of matching games', function (done) {
      test.request.get({
        route : '/games',
        qs    : { team_id : stash.home.team_id },
      }, function (response, body) {
        assert.notEqual(body.games.length, 0, 'No games found from the search');
        var game = body.games[0];
        assert.equal(game.home.team_id, stash.home.team_id);
        assert.equal(game.away.team_id, stash.away.team_id);
        stash.gameId =  game['_id'];

        return next(null, done);
      });
    });
  });
}

function search_season (stash, next) {
  describe('Search for a game', function () {
    it('should return a list of matching games', function (done) {
      test.request.get({
        route : '/games',
        qs    : { season_id : stash.season_id },
      }, function (response, body) {
        assert.notEqual(body.games.length, 0, 'No games found from the search');
        var game = body.games[0];
        assert.equal(game.home.team_id, stash.home.team_id);
        assert.equal(game.away.team_id, stash.away.team_id);
        stash.gameId =  game['_id'];

        return next(null, done);
      });
    });
  });
}

function search_season_team (stash, next) {
  describe('Search for a game', function () {
    it('should return a list of matching games', function (done) {
      test.request.get({
        route : '/games',
        qs    : { 
                  season_id : stash.season_id,
                  team_id : stash.home.team_id 
                },
      }, function (response, body) {
        assert.notEqual(body.games.length, 0, 'No games found from the search');
        var game = body.games[0];
        assert.equal(game.home.team_id, stash.home.team_id);
        assert.equal(game.away.team_id, stash.away.team_id);
        stash.gameId =  game['_id'];

        return next(null, done);
      });
    });
  });
}


// Retrieve
//
// expects - gameId
function retrieve (stash, next) {
  describe('Retrieving a game', function () {
    it('should retrieve previously stored game', function (done) {
      test.request.get({
        route : '/games/' + stash.gameId,
      }, function (response, body) {
        var game = body.game;
        assert.equal(game.home.team_id, stash.home.team_id);
        assert.equal(game.away.team_id, stash.away.team_id);

        stash.gameId =  body.game['_id'];

        return next(null, done);
      });
    });
  });
}


// Update
//
// expects - gameId
function update (stash, next) {
  describe('Updating a game', function() {
    it('should update game time', function (done) {
      var newDateObj = new Date('2015-2-5 19:30 EST');
      var newDateTime = newDateObj.getTime();
      test.request.put({
        route : '/games/' + stash.gameId,
        form  : {
           date_time : newDateTime
        }
      }, function (response, body) {
        var responseDateTime = new Date(body.game.date_time);
        assert.equal(responseDateTime.getTime(), newDateObj.getTime());

        return next(null, done);
      });
    });
  });
}


// Remove
//
// expects - gameId
function remove (stash, next) {
  describe('Deleting a game', function () {
    it('delete the created game', function (done) {
      test.request.del({
          route : '/games/' + stash.gameId,
        }, function (response, body) {
          assert.equal(body.success, true);
          return next(null, done);
        })
    });
  });
}

// function addGameToGame (stash, next) {
//   describe('Create a game', function () {
//     it('creating a game', function (done) {

//       test.request.post({
//       route : '/games',
//       form  : {
//           name : {
//             first : 'John',
//             last  : test.seed
//           },
//             preferred_number : 15,
//           }
//         }, function (response, body) {
//           test.stash.testGame = body.game;
//           //Go to next Describe
//           return done();
//         }
//       );
//     });
//   });
//   describe('Add the game to the game', function () {
//     it('add game to the created game object', function (done) {
//       test.request.put({
//         route : '/games/' + stash.gameId + '/roster',
//         form  : { ids : [test.stash.testGame._id] },
//       }, function (response, body) {
//         assert.equal(body.game.games.length, 1);
//         assert.equal(body.game.games[0], test.stash.testGame._id);
//         //Go to next Describe
//         return done();
//       });
//     });
//   });
//   describe('Retrieve the game from the game', function () {
//     it('retrieve rostered game', function (done) {
//       test.request.get({
//         route : '/games/' + stash.gameId + '/roster'
//       }, function (response, body) {
//         assert.equal(body.game.games.length, 1);
//         assert.equal(body.game.games[0], test.stash.testGame._id);
//         //Go to next Describe
//         return done();
//       });
//     });
//   });
//   describe('Remove the game from the game', function () {
//     it('remove game from game', function (done) {
//       test.request.del({
//         route : '/games/' + stash.gameId + '/roster',
//         form  : { ids : [test.stash.testGame._id] }
//       }, function (response, body) {
//         assert.equal(body.game.games.length, 0);
//         //Go to next Describe
//         return next(null, done);
//       });
//     });
//   });

// }