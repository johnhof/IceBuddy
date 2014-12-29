var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');
var Err  = require(process.cwd() + '/api/lib/error').errorGenerator;

module.exports = Mongoman.register('game', {
  home: {
    team_id: Mongoman('Home Team Id').string().required().fin(),
    players: Mongoman('Home Team Players').array().default([]).fin(),
    score  : Mongoman('Home Team score').string().required().fin()
  },
  away: {
    team_id: Mongoman('Away Team Id').string().required().fin(),
    players: Mongoman('Away Team Players').array().default([]).fin(),
    score  : Mongoman('Away Team score').number().required().fin()
  },
  //This the season id this game belongs to
  season_id : Mongoman('Season Id').string().required().fin(),
  //Array of ref ids
  refs : Mongoman('Referees').array().default([]).fin(),
  date_time : Mongoman('Game time').date().required().fin()

},
{
  statics : {
    findById : function ( _id, callback ) {
      this.findOne({
        '_id' : _id
      }, function (error, game){
          if (game) {
            return callback(null, game);
          } else {
            return callback(Err.notFound('No game matches the provided ID'));
          }
      });
    }, 
    updateById : function ( _id, inputs, callback ) {
      this.findOneAndUpdate({
        _id : _id
      }, inputs, function (error, game) {
        if (game) {
          return callback(null, game);
        } else {
          return callback(Err.notFound('No game matches the provided ID'));
        }
      });
    },
    deleteById : function ( _id, callback ) {
      this.findOneAndRemove({
        _id : _id
      }, function (error, game){
        if (game) {
          var data = {
            success : true,
            game  : game
          };
          return callback(null, data);
        } else {
          return callback(Err.notFound('No game matches the provided ID'));
        }
      });
    },
    create : function ( inputs, callback ) {
      validate(inputs, {
          home     : Joi.object().keys({
            team_id : Joi.string().token().required(),
            players : Joi.array().optional().includes(Joi.string().token()),
            score   : Joi.number().integer()
          }),
          away     : Joi.object().keys({
            team_id : Joi.string().token().required(),
            players : Joi.array().optional().includes(Joi.string().token()),
            score   : Joi.number().integer()
          }),
          season_id : Joi.string().token().required(),
          refs : Joi.array().optional(),
          date_time : Joi.date().required(),
        }, 
        function save (result, saveCallback) {
          Mongoman.save('game', inputs, callback, function ( game ) {
            return saveCallback(null, game);
          });
        }, callback
      );
    },
    findByTeamSeason : function ( inputs, callback ) {
      var thisGame = this;

      validate(inputs, {
          team_id : Joi.string().token().required(),
          season_id : Joi.string().token().required()
      } , function (result, findCallback) {
          thisGame.find({
                $and: [
                    {
                      season_id : inputs.season_id
                    },
                    {
                      $or : [
                          {
                            'home.team_id' : inputs.team_id
                          },
                          {
                            'away.team_id' : inputs.team_id
                          }
                      ]
                    }
                  ]
          }, function (error, games) {
            if ( error ) {
              return callback(error);
            } else {
              return findCallback(null, games);
            }
          });
        }, 
        function (error, data) {
          return callback(error, data);
        }
      );
    },
    findByTeam : function ( inputs, callback ) {
      //All Games this team has participated in
      var thisGame = this;

      validate(inputs, {
          team_id : Joi.string().token().required()
      } , function (result, findCallback) {
          thisGame.find({
              $or : [
                      {
                        'home.team_id' : inputs.team_id
                      },
                      {
                        'away.team_id' : inputs.team_id
                      }
                    ]
            }, function (error, games) {
            if ( error ) {
              return callback(error);
            } else {
              return findCallback(null, games);
            }
          });
        }, callback
      );
    },
    findBySeason : function ( inputs, callback ) {
      //All Games this season
      var thisGame = this;

      validate(inputs, {
          season_id : Joi.string().token().required()
      } , function (result, findCallback) {
          thisGame.find(inputs, function (error, games) {
            if ( error ) {
              return callback(error);
            } else {
              return findCallback(null, games);
            }
          });
        }, callback
      );
    }
  }
});