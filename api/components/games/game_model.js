var Mon      = require('mongoman');
var Joi      = require('joi');
var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var validate = require(process.cwd() + '/api/lib/validate');
var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;

module.exports = Mon.register('game', {
  home: {
    team_id: Mon('Home Team Id').string().required().fin(),
    players: Mon('Home Team Players').array().default([]).fin(),
    score  : Mon('Home Team score').string().required().fin()
  },
  away: {
    team_id: Mon('Away Team Id').string().required().fin(),
    players: Mon('Away Team Players').array().default([]).fin(),
    score  : Mon('Away Team score').number().required().fin()
  },
  //This the season id this game belongs to
  season_id : Mon('Season Id').string().required().fin(),
  //Array of ref ids
  refs : Mon('Referees').array().default([]).fin(),
  date_time : Mon('Game time').date().required().fin()

},
{
  methods : {
  },
  statics : {
    findById : function ( _id, callback ) {
      this.findOne({
        '_id' : _id
      }, function (error, game){
          if (game) {
            return callback(null, game);
          } else {
            return callback(Err.notFound('No game regex the provided ID'));
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
          return callback(Err.notFound('No game regex the provided ID'));
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
          return callback(Err.notFound('No game regex the provided ID'));
        }
      });
    },
    create : function ( inputs, callback ) {
      validate(inputs, {
          home     : Joi.object().keys({
            team_id : Joi.required(),
            players : Joi.array().optional(),
            score   : Joi.number().integer()
          }),
          away     : Joi.object().keys({
            team_id : Joi.required(),
            players : Joi.array().optional(),
            score   : Joi.number().integer()
          }),
          season_id : Joi.required(),
          refs : Joi.array().optional(),
          date_time : Joi.date().required(),
        },
        function save (result, saveCallback) {
          Mon.save('game', inputs, callback, function ( game ) {
            return saveCallback(null, game);
          });
        }, callback
      );
    },
    findByTeamIdSeasonId : function ( inputs, callback ) {
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
    findByTeamId : function ( inputs, callback ) {
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
    findBySeasonId : function ( inputs, callback ) {
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