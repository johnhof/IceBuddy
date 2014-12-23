var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

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
      Team.findOne({
        '_id' : req.params.teamId
      }, function (error, team) {
        if (team) {
          if ( team.players.length ) {
            Player.find({
                '_id': { $in: team.players}
            }, function (error, players){
              if ( error ) {
                return next(error);  
              }
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
      });
    },


    //
    // Update -- Add Player to a team
    // In order to facilitate both single and multiple entry, update expects an array of ids
    //
    update : function (req, res, next) {
      var inputs = req.body;
      Team.findOneAndUpdate({
        _id : req.params.teamId,
      }, { $push: 
          { players: { 
              $each: inputs.ids
            } 
          } 
      }, function (error, team) {
        if (team) {
          res.data = {
            success : true,
            team  : team
          };
          return next();
        } else {
          return next(Err.notFound('No team matches the provided ID'));
        }
      })
    },


    //
    // Destroy -- Remove Player from a team
    //
    destroy : function (req, res, next) {
      var inputs = req.body;
      Team.findOneAndUpdate({
        _id : req.params.teamId
      }, { $pull: 
          { 
            players: { $in : inputs.ids }
          } 
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