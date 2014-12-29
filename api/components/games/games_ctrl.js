var Err  = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');

var Game = Mongoman.model('game');

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
        Game.findByTeamSeason(inputs, function ( error, data ) {
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
        Game.findBySeason(inputs, function ( error, data ) {
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
        Game.findByTeam(inputs, function ( error, data ) {
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
      }
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