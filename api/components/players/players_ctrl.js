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

      validate(inputs, {
        name     : Joi.object().keys({
          first : Joi.string().optional().alphanum().min(1).max(50),
          last  : Joi.string().optional().alphanum().min(1).max(50)
        })
      }, function save (result, callback) {
        Mongoman.save('player', req.body, next, function ( player ) {
          res.data = {
            success : true,
            player  : player,
            message : 'Player ' + inputs.name.first + ' ' + inputs.name.last + ' created'
          };
          return callback();
        });
      }, next);
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