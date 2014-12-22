var assert = require("assert");
var tester = require(process.cwd() + '/test/tester');

//
// Setup
//

// initialize the test object
var test = tester();

test.stash.name = {
  first : 'Duane' + test.seed,
  last  : 'Tester' + test.seed
}

// Test set execution

test.execSet('Player', [
  add,
  search,
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
  describe('Adding a player', function () {
    it('should store a player into the db', function (done) {
      test.request.post({
        route : '/players',
        form  : {
          name             : stash.name,
          preferred_number : 13,
        }
      }, function (response, body) {
        return next(null, done);
      });
    });
  });
}

// Search
//
// expects - player name:[first, last]
function search (stash, next) {
  describe('Search for a player', function () {
    it('should return a list of matching players', function (done) {
      test.request.get({
        route : '/players',
        qs    : { name : stash.name },
      }, function (response, body) {
        assert.notEqual(body.players.length, 0, 'No players found from the search');

        var player = body.players[0];
        assert.equal(player.name.first, stash.name.first);
        assert.equal(player.name.last, stash.name.last);

        stash.playerId =  player['_id'];

        return next(null, done);
      });
    });
  });
}

// Retrieve
//
// expects - playerId
function retrieve (stash, next) {
  describe('Retrieving a player', function () {
    it('should retrieve previously stored player', function (done) {
      test.request.get({
        route : '/players/' + stash.playerId,
      }, function (response, body) {
        assert.equal(body.player.name.first, stash.name.first);
        assert.equal(body.player.name.last, stash.name.last);

        stash.playerId =  body.player['_id'];

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
    it('should update player preferred number', function (done) {
      var newNum = 31;
      test.request.put({
        route : '/players/' + stash.playerId,
        form  : {
          preferred_number : newNum
        }
      }, function (response, body) {
        assert.equal(body.success, true);
        assert.equal(body.player.preferred_number, newNum);

        return next(null, done);
      });
    });
  });
}


// Remove
//
// expects - playerId
function remove (stash, next) {
  describe('Deleting a player', function () {
    it('delete the created player', function (done) {
      test.request.del({
          route : '/players/' + stash.playerId,
        }, function (response, body) {
          assert.equal(body.success, true);
          return next(null, done);
        })
    });
  });
}