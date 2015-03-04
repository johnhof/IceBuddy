var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mon      = require('mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');
var Player   = Mon.model('player');

module.exports = function playerController (api) {
  return {

//////////////////////////////////////////////////////////////////////////////////
//
// Create
//
//////////////////////////////////////////////////////////////////////////////////


    create : function (req, res, next) {
      var inputs = req.body;
      Player.create(inputs, function (error, data) {
        if (error) {
          return next(error);
        } else {
          res.data = {
              success : true,
              player  : data || null
          }
          return next();
        }
      });
    },


//////////////////////////////////////////////////////////////////////////////////
//
// Read
//
//////////////////////////////////////////////////////////////////////////////////


    read : function (req, res, next) {
      var inputs = req.query;

      // if a name was provided, use it in the search
      if (inputs.name) {

        var name = inputs.name.toName();

        // build search condition
        inputs.condition = {
          'name.first' : name.first,
          'name.last'  : name.last
        };

        // perform the search
        Player.search(inputs, function (error, players) {
          if (error) {
            return next(error);

          } else {
            res.data = {
              success : true,
              players : players || [],
            };

            return next();
          }
        });

      // otherwise, get the latest players
      } else {

        // get the most recent
        Player.recent(inputs, function (error, players) {
          if (error) {
            return next(error);

          } else {
            res.data = {
              success : true,
              players : players || []
            };

            return next();
          }

        });
      }
    },


//////////////////////////////////////////////////////////////////////////////////
//
// Update
//
//////////////////////////////////////////////////////////////////////////////////


    update : function (req, res, next) {
      //
      // TODO : handle bulk updates (eg. add large number of players to a team)
      //
      return next();
    },


//////////////////////////////////////////////////////////////////////////////////
//
// Destroy
//
//////////////////////////////////////////////////////////////////////////////////


    destroy : function (req, res, next) {
      return next();
    }
  };
}