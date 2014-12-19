// Account DB Crud Testing
var Err     = require(process.cwd() + '/api/lib/error').errorGenerator;
var assert  = require("assert");
var request = require("request");
var helpers = require(process.cwd() + '/test/helpers');

var hasCreatedPlayer = false;
var hasDeletedPlayer = false;

var url = "http://localhost:8000";

var testSeed = helpers.makeRandomSeed();

describe('Create an account', function () {
  it('should store an account in the db', function (done) {

    request.post({
        url: url + '/account',
        form: {
          email      : 'test' + testSeed + '@testing.com',
          password   : 'testing1',
          username   : 'test' + testSeed,
          name       : {
            first: 'Duane' + testSeed,
            last:  'Tester' + testSeed
          }
        },
        json: true
      }, function (err, res, body) {
          assert.equal(body.error, null, 'Errors Reported: ' + body.error);
          assert.equal(body.success, true, 'Body returned not successful');

          //For Cleanup!
          hasCreatedPlayer = true;

          return done(err);
        }
    );
  });
});

describe('Check account', function () {
  it('should retrieve previously stored account', function (done) {
    request.get({
        url  : url + '/account',
        json : true
      }, function (err, res, body) {
          if (!err) {
            try {
              assert.notEqual(body, {})
              assert.equal(body.email, 'test' + testSeed + '@testing.com');
              assert.equal(body.username, 'test' + testSeed);
              assert.equal(body.player.name.first, 'Duane' + testSeed);
              assert.equal(body.player.name.last, 'Tester' + testSeed);

              //Nested Update
              describe('Updating an account', function() {
                it('should update account name', function (done) {
                  request.put({
                    url: url + '/account',
                    form : {
                      name : {
                        first: 'John' + testSeed
                      }
                    },
                    json: true
                  }, function (error, res, updateBody){
                    if(error) {
                      return done(error);
                    } else {
                      console.log(updateBody)
                      try {
                        //I cant seem to get JSON back here :(
                        if ( (typeof updateBody) === 'string') {
                          updateBody = JSON.parse(updateBody);
                        }
                      } catch(e) {
                        return done("Exception Running Asserts " + e.message);
                      }

                      assert.equal(updateBody.success, true);
                      assert.equal(updateBody.account.name.first, 'John' + testSeed);

                      return done();
                    }
                  })
                });
              }); // END Nested Update Use Case


            } catch (e) {
              Err("Exception Running Asserts");
            }
          }
          done(err);
        }
      );
  });
});