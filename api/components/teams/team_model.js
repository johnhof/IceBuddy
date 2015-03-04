var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mon      = require('mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');
var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;

var Player = Mon.model('player');

module.exports = Mon.register('team', {
  name : Mon('Team name').string().required().min(1).max(50).fin(),
  //(http://docs.mongodb.org/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/)
  //This will be an array of season ids
  seasons : Mon('Seasons').array().fin(),
  players : Mon('Team Players').array().fin(),
  //Array of player ids
  captains : Mon('Captains').array().fin(),
  //Array of user ids
  managers : Mon('Managers').array().fin()
}, {
  methods : {
    addByPlayerId : function ( playerId, callback ) {
      this.players.push(playerId);
      this.save( function ( err, team ) {
        return callback(err, team);
      });
    },
    addPlayer : function ( player, callback ) {
      this.addByPlayerId(player['_id'], callback);
    },
    addPlayerIds : function ( players, callback ) {
      var thisTeam = this;
      players.forEach(function( player ){
        if ( player && player['_id']) {
          thisTeam.players.push( player['_id'] )
        } else {
          thisTeam.players.push( player )
        }
      });
      this.save( function ( err, team ) {
        return callback(err, team);
      });
    },
    getPlayers : function (callback) {
      Player.find({
          '_id': { $in: this.players}
      }, function (error, players){
        if ( error ) {
          return callback(error);
        }
        return callback( players );
      });
    }
  },
  statics : {
    findById : function ( _id, callback ) {
      this.findOne({
        '_id' : _id
      }, function (error, team){
          if (team) {
            return callback(null, team);
          } else {
            return callback(Err.notFound('No team regex the provided ID'));
          }
      });
    },
    updateById : function ( _id, inputs, callback ) {
      this.findOneAndUpdate({
        _id : _id
      }, inputs, function (error, team) {
        if (team) {
          return callback(null, team);
        } else {
          return callback(Err.notFound('No team regex the provided ID'));
        }
      });
    },
    deleteById : function ( _id, callback ) {
      this.findOneAndRemove({
        _id : _id
      }, function (error, team){
        if (team) {
          return callback(null, team);
        } else {
          return callback(Err.notFound('No team regex the provided ID'));
        }
      });
    },
    create : function ( inputs, callback ) {
      validate(inputs, {
          name     : Joi.string().required().min(1).max(50),
        },
        function save (result, saveCallback) {
          Mon.save('team', inputs, callback, function ( team ) {
            return saveCallback(null, team);
          });
        },
        function (error, data) {
          return callback(error, data);
        }
      );
    },
    findByName : function ( inputs, callback ) {
      var thisTeam = this;

      validate(inputs, {
        name     : Joi.string().required().min(1).max(50)
      }, function (result, findCallback) {
          thisTeam.find(inputs, function (error, teams) {
            if ( error ) {
              return callback(error);
            } else {
              return findCallback(null, teams);
            }
          });
        },
        function (error, data) {
          return callback(error, data);
        }
      );
    },
    addPlayerIdsToTeam : function ( inputs, callback ) {
      var thisTeam = this;
      validate(inputs, {
        playerIds     : Joi.array().required().min(1),
        team_id     : Joi.string().required().token()
      }, function (result, updateCallback) {
          thisTeam.findOneAndUpdate({
            _id : inputs.team_id,
          }, { $push:
              { players: {
                  $each: inputs.playerIds
                }
              }
          }, function (error, team) {
            if (team) {
              return updateCallback(null, team);
            } else {
              return updateCallback(Err.notFound('No team regex the provided ID'));
            }
          });
        },
        function (error, data) {
          return callback(error, data);
        }
      );
    },
    removePlayerIdsFromTeam : function ( inputs, callback ) {
      var thisTeam = this;
      validate(inputs, {
        playerIds     : Joi.array().required().min(1),
        team_id     : Joi.string().required().token()
      }, function (result, updateCallback) {
          thisTeam.findOneAndUpdate({
            _id : inputs.team_id,
          }, { $pull:
              { players: {
                  $in: inputs.playerIds
                }
              }
          }, function (error, team) {
            if (team) {
              return updateCallback(null, team);
            } else {
              return updateCallback(Err.notFound('No team regex the provided ID'));
            }
          });
        },
        function (error, data) {
          return callback(error, data);
        }
      );
    }
  }
});