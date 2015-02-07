var Err = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mon = require('mongoman');

var Team = Mon.model('team');


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
      Team.findById(req.params.teamId, function ( error, team ) {
        if ( error ) {
          return next(error);
        } else if ( team ) {
          team.getPlayers(function ( error, players ) {
            res.data = {
                success : true,
                team    : team,
                players : players
            };
            return next();
          });
        } else {
          return next(Err.notFound('Team not found'));
        }

      });
    },


    //
    // Update -- Add Player to a team
    // In order to facilitate both single and multiple entry, update expects an array of ids
    //
    update : function (req, res, next) {
      var inputs = req.body;
      inputs.team_id = req.params.teamId;

      Team.addPlayerIdsToTeam(inputs, function ( error, team ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              team  : team || null
          }
          return next();
        }
      });
    },


    //
    // Destroy -- Remove Player from a team
    //
    destroy : function (req, res, next) {
      var inputs = req.body;
      inputs.team_id = req.params.teamId;
      Team.removePlayerIdsFromTeam(inputs, function ( error, team ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              team  : team || null
          }
          return next();
        }
      });
    }
  };
}