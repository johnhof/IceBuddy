var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mon      = require('mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');

var Game = Mon.model('game');

module.exports = function accountController (api) {
  return {

    //
    // Create
    //
    create : function (req, res, next) {
      var inputs = req.body;
      Game.create(inputs, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
            success : true,
            game : data
          }
          return next();
        }
      });
    },


    //
    // Read
    //
    // Expects
    // season_id OR team_id
    // IF season_id is only value, this query will return all games in this season
    // IF team_id is only value, this query will return all games played by this team ever
    // IF season_id AND team_id are both present, this query will return every game played by a team during this season
    read : function (req, res, next) {
      var inputs = req.query;
      if ( inputs.season_id && inputs.team_id ) {
        Game.findByTeamIdSeasonId(inputs, function ( error, data ) {
          if ( error ) {
            return next(error);
          } else {
            res.data = {
              success : true,
              games  : data || []
            };
            return next();
          }
        });
      } else if ( inputs.season_id ) {
        Game.findBySeasonId(inputs, function ( error, data ) {
          if ( error ) {
            return next(error);
          } else {
            res.data = {
              success : true,
              games  : data || []
            };
            return next();
          }
        });
      } else if ( inputs.team_id ) {
        Game.findByTeamId(inputs, function ( error, data ) {
          if ( error ) {
            return next(error);
          } else {
            res.data = {
              success : true,
              games  : data || []
            };
            return next();
          }
        });
      } else {
        return next('Season_id or Team_id are required in this query');
      }

      console.log('Out?')
    },


    //
    // Update
    //
    update : function (req, res, next) {
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