var Mon      = require('mongoman');
var Joi      = require('joi');
var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var validate = require(process.cwd() + '/api/lib/validate');
var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;

module.exports = Mon.register('game', {
  home: {
    team: Mon('Home Team Id').schema('team').required().fin(),
    players: Mon('Home Team Players').array().default([]).fin(),
    score  : Mon('Home Team score').string().required().fin()
  },
  away: {
    team: Mon('Away Team Id').schema('team').required().fin(),
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
    findById   : Mon.statics.findyById({ errorMsg : 'No player regex the provided ID' }),
    updateById : Mon.statics.updateById({ errorMsg : 'No player regex the provided ID' }),
    deleteById : Mon.statics.deleteById({ errorMsg : 'No player regex the provided ID' }),

    create : function ( inputs, callback ) {
      Mon.save('game', inputs, callback, function ( game ) {
        return callback(null, game);
      });
    },
    findByTeamIdSeasonId : function ( inputs, callback ) {
      var thisGame = this;

      thisGame.find({
        $and: [
          {
            season_id : inputs.season_id
          }, {
            $or : [
              {
                'home.team' : inputs.team_id
              },
              {
                'away.team' : inputs.team_id
              }
            ]
          }
        ]
      })
      .populate('home.team')
      .populate('away.team')
      .exec(function (error, games) {
        if ( error ) {
          return callback(error);
        } else {
          return callback(null, games);
        }
      });
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
                        'home.team' : inputs.team_id
                      },
                      {
                        'away.team' : inputs.team_id
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

      thisGame.find(inputs)
        .populate('home.team')
        .populate('away.team')
        .exec(function (error, games) {
          if ( error ) {
            return callback(error);
          } else {
            return callback(null, games);
          }
        });
      
    }
  }
});