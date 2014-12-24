var assert = require('assert');
var async  = require('async');
var tester = require(process.cwd() + '/test/tester');

//
// Setup
//

// initialize the test object
var test = tester();

test.stash.name = 'Puck Buddies ' + test.seed;

// Test set execution

test.execSet('Team', [
  add,
  search,
  retrieve,
  update,
  addPlayerToTeam,
  remove,
  
]);


//
// Tests
//

// Add
//
// expects - nothing
function add (stash, next) {
  describe('Adding a Team', function () {
    it('should store a Team into the db', function (done) {
      test.request.post({
        route : '/teams',
        form  : {
          name : stash.name,
        }
      }, function (response, body) {
        return next(null, done);
      });
    });
  });
}

// Search
//
// expects - team name
function search (stash, next) {
  describe('Search for a team', function () {
    it('should return a list of matching teams', function (done) {
      test.request.get({
        route : '/teams',
        qs    : { name : stash.name },
      }, function (response, body) {
        assert.notEqual(body.teams.length, 0, 'No teams found from the search');

        var team = body.teams[0];
        assert.equal(team.name, stash.name);

        stash.teamId =  team['_id'];

        return next(null, done);
      });
    });
  });
}

// Retrieve
//
// expects - teamId
function retrieve (stash, next) {
  describe('Retrieving a team', function () {
    it('should retrieve previously stored team', function (done) {
      test.request.get({
        route : '/teams/' + stash.teamId,
      }, function (response, body) {
        assert.equal(body.team.name, stash.name);

        stash.teamId =  body.team['_id'];

        return next(null, done);
      });
    });
  });
}

// Update
//
// expects - teamId
function update (stash, next) {
  describe('Updating a team', function() {
    it('should update team name', function (done) {
      var newName = 'New Name ' + test.seed;
      test.request.put({
        route : '/teams/' + stash.teamId,
        form  : {
          name : newName
        }
      }, function (response, body) {
        assert.equal(body.team.name, newName);

        return next(null, done);
      });
    });
  });
}


// Remove
//
// expects - teamId
function remove (stash, next) {
  describe('Deleting a team', function () {
    it('delete the created team', function (done) {
      test.request.del({
          route : '/teams/' + stash.teamId,
        }, function (response, body) {
          assert.equal(body.success, true);
          return next(null, done);
        })
    });
  });
}

function addPlayerToTeam (stash, next) {
  describe('Create a player', function () {
    it('creating a player', function (done) {

      test.request.post({
      route : '/players',
      form  : {
          name : {
            first : 'John',
            last  : test.seed
          },
            preferred_number : 15,
          }
        }, function (response, body) {
          test.stash.testPlayer = body.player;
          //Go to next Describe
          return done();
        }
      );
    });
  });
  describe('Add the player to the team', function () {
    it('add player to the created team object', function (done) {
      test.request.put({
        route : '/teams/' + stash.teamId + '/roster',
        form  : { ids : [test.stash.testPlayer._id] },
      }, function (response, body) {
        assert.equal(body.team.players.length, 1);
        assert.equal(body.team.players[0], test.stash.testPlayer._id);
        //Go to next Describe
        return done();
      });
    });
  });
  describe('Retrieve the player from the team', function () {
    it('retrieve rostered player', function (done) {
      test.request.get({
        route : '/teams/' + stash.teamId + '/roster'
      }, function (response, body) {
        assert.equal(body.team.players.length, 1);
        assert.equal(body.team.players[0], test.stash.testPlayer._id);
        //Go to next Describe
        return done();
      });
    });
  });
  describe('Remove the player from the team', function () {
    it('remove player from team', function (done) {
      test.request.del({
        route : '/teams/' + stash.teamId + '/roster',
        form  : { ids : [test.stash.testPlayer._id] }
      }, function (response, body) {
        assert.equal(body.team.players.length, 0);
        //Go to next Describe
        return next(null, done);
      });
    });
  });

}