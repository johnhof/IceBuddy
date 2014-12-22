var assert = require("assert");
var tester = require(process.cwd() + '/test/tester');

//
// Setup
//

// initialize the test object
var test = tester();

test.stash = {
  email    : 'test' + test.seed + '@testing.com',
  password : 'tester1',
  nickname : 'tester' + test.seed,
  name     : {
    first : 'Duane' + test.seed,
    last  : 'Tester' + test.seed
  }
}

// Test set execution

test.execSet('Account', [
  signUp,
  retrieve,
  update
]);

//
// Tests
//

// Add
//
// expects - nothing
function signUp (stash, next) {
  describe('Sign up an Account', function () {
    it('should store an Accont into the db', function (done) {
      test.request.post({
        route : '/account',
        form  : {
          email    : stash.email,
          password : stash.password,
          nickname : stash.nickname,
          name     : stash.name,
        }
      }, function (response, body) {
        assert.equal(body.success, true);
        return next(null, done);
      });
    });
  });
}


// Retrieve
//
// expects - nothing
function retrieve (stash, next) {
  describe('Retrieving a player', function () {
    it('should retrieve account info', function (done) {
      test.request.get({
        route  : '/account',
      }, function (response, body) {
        assert.equal(body.account.name.first, stash.name.first);
        assert.equal(body.account.name.last, stash.name.last);

        stash.playerId =  body.account['_id'];

        return next(null, done);
      });
    });
  });
}


// Update
//
// expects - pnothing
function update (stash, next) {
  describe('Updating an Account', function() {
    it('should update account name', function (done) {
      var newName = {
        first : 'John',
        last  : 'Tester'
      };
      test.request.put({
        route : '/account',
        form  : {
          name : newName
        }
      }, function (response, body) {
        assert.equal(body.success, true);
        assert.equal(body.account.name.first, newName.first);
        assert.equal(body.account.name.last, newName.last);

        return next(null, done);
      });
    });
  });
}
