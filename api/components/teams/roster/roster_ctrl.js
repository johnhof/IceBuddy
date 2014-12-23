var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');

var Team = Mongoman.model('team');
var Player = Mongoman.model('player');

module.exports = function accountController (api) {
  return {

    //
    // Create
    //
    create : function (req, res, next) {
      return next(Err.notFound('Roster does not have POST functionality'));
    },

    //
    // Read -- Retrieve all players on the team
    //
    read : function (req, res, next) {
      var team = _retrieveTeam(req.params.teamId, next);
      if (team) {
        var rosteredPlayers = [];
        if ( team.players.length ) {
          Player.find({
              '_id': { $in: team.players}
          }, function (err, players){
            res.data = {
              success : true,
              team    : team,
              players : players
            };
            return next();
          });
        } else {
          return next(Err.notFound('Team found, but has no players'));
        }
      } else {
        return next(Err.notFound('No team matches the provided ID'));
      }
    },


    //
    // Update -- Add Player to a team
    //
    update : function (req, res, next) {
      var team = _retrieveTeam(req.params.teamId, next);
      //Add Player to a team
      return next();
    },


    //
    // Destroy -- Remove Player from a team
    //
    destroy : function (req, res, next) {
      Team.findOneAndRemove({
        _id : req.params.teamId
      }, function (error, team){
        if (team) {
          res.data = {
            success : true,
            team  : team
          };
          return next();
        } else {
          return next(Err.notFound('No team matches the provided ID'));
        }
      });
    }
  };



}

function _retrieveTeam ( teamId, next ) {
    Team.findOne({
    '_id' : teamId
    }, function (error, team){
      if (team) {
        return team;
      } else {
        //quit execution
        return next(Err.notFound('No team matches the provided ID'));
      }
  });  
  
}