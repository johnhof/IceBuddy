var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');
var Player = Mongoman.model('player');

module.exports = function playerController (api) {
  return {

    //
    // Create
    //
    create : function (req, res, next) {
      var inputs = req.body;

      var inputs = req.body;
      Player.create(inputs, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = data;
          return next();
        }
      });
    },


    //
    // Read
    //
    read : function (req, res, next) {
      var inputs = req.query;

      // take a player array and build the response body
      function getResult (players) {
        var success = !!(players && players.length);
        return {
          success : success,
          message : !success ? 'No players found' : undefined,
          players : players || []
        };
      }

      // if the client performed a search
      if (Object.keys(req.query).length) {
        validate(inputs, {}, function (result, callback) {
          Player.find(inputs, function (error, players) {
            res.data = getResult(players)
            return callback();
          });
        }, next);

      // otherwise, return the last 10 registered
      } else {
        Player.find({
          registered : {
            $lte : new Date()
          }
        }).limit(10).exec(function (error, players) {
          res.data = getResult(players)
          return next();
        });
      }
    },

    //
    // Update
    //
    update : function (req, res, next) {
      //
      // TODO : handle bulk updates (eg. add large number of players to a team)
      //
      return next();
    },


    //
    // Destroy
    //
    destroy : function (req, res, next) {
      return next();
    }
  };
}