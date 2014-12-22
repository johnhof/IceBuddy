var async   = require('async');
var request = require('request');
var _       = require('lodash');
var assert  = require('assert');
var QS      = require('qs');

request.defaults({
  json : true,
  jar  : true
})

//
// internal variables
//
var host = 'http://localhost:8000';

module.exports = function test (defaults) {
  defaults = defaults || {};

  var stash = defautls.stash || {};
}

module.exports = function (stash, overrides) {
  overrides = overrides || {};

  var seed     = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  for(var i=0; i < 10; i++) {
    seed += possible.charAt(Math.floor(Math.random() * possible.length));
  }


  var test = {
    stash : stash || {},
    host  : overrides.host || host,
    jar   : request.jar(),

    //
    // generate a random seed
    //
    seed : seed,



    //
    //  execute a set set
    //
    execSet : function (setName, testSet) {
      describe('Tester', function () {
        it('primes ' + setName, function (done) {
          testSet = _.map(testSet, function (testFunc) {
            return function (callback) {
              return testFunc(test.stash, function (error, _done) {
                if (error) {
                  _done(error);
                  return callback(error);
                } else {
                  _done();
                  return callback();
                }
              });
            }
          });

          done();
          async.waterfall(testSet, function (err) {
            if (err) {
              console.log(setName + ' tests failed'.yellow)
              console.error(err)
            } else {
              console.log(setName + ' tests succeeded'.green)
            }
          });
        });
      });
    },

    //
    // request wrapper
    //

    request : function (inputs, callback) {
      var reqObj = _.defaults(inputs, {
        url  : test.host + inputs.route,
        jar  : test.jar,
        json : true
      });

      var qs   = QS.stringify(reqObj.qs || {}) || '';
      var path =  inputs.route + (qs ? '?' + qs : '');
      console.log('\n  ' + reqObj.method.cyan + ' ' + path.grey)

      request(reqObj, function (error, response, body) {
        assert.equal(error, undefined, error);
        assert.equal(response.statusCode, 200, 'Server returned status ' + response.statusCode);
        assert.equal(body.error, null, 'Errors Reported: ' + body.error);
        assert.equal(body.success, true, 'Body returned not successful');

        return callback(response, body);
      })
    }
  };

  test.request.put  = function (inputs, callback) { test.request(_.defaults(inputs, { method : 'PUT' }), callback); }
  test.request.post = function (inputs, callback) { test.request(_.defaults(inputs, { method : 'POST' }), callback); }
  test.request.get  = function (inputs, callback) { test.request(_.defaults(inputs, { method : 'GET' }), callback); }
  test.request.del  = function (inputs, callback) { test.request(_.defaults(inputs, { method : 'DELETE' }), callback); }

  return test;
}