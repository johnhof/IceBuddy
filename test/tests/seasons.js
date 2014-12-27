var assert = require('assert');
var async  = require('async');
var tester = require(process.cwd() + '/test/tester');

//
// Setup
//

// initialize the test object
var test = tester();

test.stash.name = 'Winter 15 ' + test.seed;
test.stash.league = 'E';

// Test set execution

test.execSet('Season', [
  add,
  search,
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
  describe('Adding a Season', function () {
    it('should store a Season into the db', function (done) {
      test.request.post({
        route : '/seasons',
        form  : {
          name : stash.name,
          league : stash.league,
        }
      }, function (response, body) {
        return next(null, done);
      });
    });
  });
}

// Search
//
// expects - season name
function search (stash, next) {
  describe('Search for a season', function () {
    it('should return a list of matching seasons', function (done) {
      test.request.get({
        route : '/seasons',
        qs    : { name : stash.name },
      }, function (response, body) {
        assert.notEqual(body.seasons.length, 0, 'No seasons found from the search');
        var season = body.seasons[0];
        assert.equal(season.name, stash.name);
        assert.equal(season.league, stash.league);

        stash.seasonId =  season['_id'];

        return next(null, done);
      });
    });
  });
}


// Retrieve
//
// expects - seasonId
function retrieve (stash, next) {
  describe('Retrieving a season', function () {
    it('should retrieve previously stored season', function (done) {
      test.request.get({
        route : '/seasons/' + stash.seasonId,
      }, function (response, body) {
        assert.equal(body.season.name, stash.name);
        assert.equal(body.season.league, stash.league);

        stash.seasonId =  body.season['_id'];

        return next(null, done);
      });
    });
  });
}


// Update
//
// expects - seasonId
function update (stash, next) {
  describe('Updating a season', function() {
    it('should update season name', function (done) {
      var newName = 'New Name ' + test.seed;
      test.request.put({
        route : '/seasons/' + stash.seasonId,
        form  : {
          name : newName
        }
      }, function (response, body) {
        assert.equal(body.season.name, newName);

        return next(null, done);
      });
    });
  });
}


// Remove
//
// expects - seasonId
function remove (stash, next) {
  describe('Deleting a season', function () {
    it('delete the created season', function (done) {
      test.request.del({
          route : '/seasons/' + stash.seasonId,
        }, function (response, body) {
          assert.equal(body.success, true);
          return next(null, done);
        })
    });
  });
}

// function addGameToSeason (stash, next) {
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
//   describe('Add the game to the season', function () {
//     it('add game to the created season object', function (done) {
//       test.request.put({
//         route : '/seasons/' + stash.seasonId + '/roster',
//         form  : { ids : [test.stash.testGame._id] },
//       }, function (response, body) {
//         assert.equal(body.season.games.length, 1);
//         assert.equal(body.season.games[0], test.stash.testGame._id);
//         //Go to next Describe
//         return done();
//       });
//     });
//   });
//   describe('Retrieve the game from the season', function () {
//     it('retrieve rostered game', function (done) {
//       test.request.get({
//         route : '/seasons/' + stash.seasonId + '/roster'
//       }, function (response, body) {
//         assert.equal(body.season.games.length, 1);
//         assert.equal(body.season.games[0], test.stash.testGame._id);
//         //Go to next Describe
//         return done();
//       });
//     });
//   });
//   describe('Remove the game from the season', function () {
//     it('remove game from season', function (done) {
//       test.request.del({
//         route : '/seasons/' + stash.seasonId + '/roster',
//         form  : { ids : [test.stash.testGame._id] }
//       }, function (response, body) {
//         assert.equal(body.season.games.length, 0);
//         //Go to next Describe
//         return next(null, done);
//       });
//     });
//   });

// }