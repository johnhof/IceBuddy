//Player DB Crud Testing
var Err     = require(process.cwd() + '/api/lib/error').errorGenerator;
var assert  = require("assert");
var request = require("request");
var helpers = require(process.cwd() + '/test/helpers');

var hasCreatedPlayer = false;
var hasDeletedPlayer = false;

var url = "http://localhost:8000";

var testSeed = helpers.makeRandomSeed();

describe('Adding a player', function () {
  it('should store a player into the db', function (done) {

    request.post({
        url: url + '/players',
        form: {
          preferred_number : 13,
          name : {
            first: 'Duane' + testSeed,
            last:  'Tester' + testSeed
          },
          registered: Date.now()
        },
        json: true },
        function (err, res, body) {
          assert.equal(body.error, null, 'Errors Reported: ' + body.error);
          assert.equal(body.success, true, 'Body returned not successful');

          //For Cleanup!
          hasCreatedPlayer = true;

          done(err);
        }
    );
  });
});

describe('Retrieving a player', function () {
  it('should retrieve previously stored player', function (done) {
    request.get({
        url: url + '/players',
        form: {
          name : {
            first: 'Duane' + testSeed,
            last:  'Tester' + testSeed
          }
        },
        json: true },
        function (err, res, body) {
          if ( !err ) {
            try {
              assert.notEqual(body, {})
              assert.equal(body.success, true);
              assert.equal(body.player.name.first, 'Duane' + testSeed);
              assert.equal(body.player.name.last, 'Tester' + testSeed);
              //Nested Update
              describe('Updating a player', function() {
                it('should update player preferred number', function (done) {
                  request.put({
                      url: url + '/players',
                      form : {
                        id : body.player['_id'],
                        update : {
                          preferred_number : 31
                        },
                        json: true
                      }
                    }, function (err, res, updateBody){
                      if( err ) {
                        return done(err);
                      } else {
                        try {
                          //I cant seem to get JSON back here :(
                          if ( (typeof updateBody) === 'string') {
                            updateBody = JSON.parse(updateBody);
                          }
                        } catch( e ) {
                          return done("Exception Running Asserts " + e.message);
                        }
                        assert.equal(updateBody.success, true);
                        assert.equal(updateBody.player.preferred_number, 31);

                        //Nested Delete
                        describe('Deleting a player', function () {
                          it('delete the created player', function (done) {
                            request.del({
                                url: url + '/players',
                                form : { id : body.player['_id'] },
                                json: true
                              }, function (err, res, deleteBody) {
                                if ( !err ) {
                                  assert.equal(deleteBody.success, true);

                                  hasDeletedPlayer = deleteBody.success;
                                }
                                return done(err);
                              })
                          });
                        }); // END Nested Delete

                        return done();
                      }
                    }
                  )
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


function makeRandomSeed(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}