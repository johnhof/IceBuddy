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
      }, function save (result, callback) {
        Mongoman.save('game', req.body, next, function ( game ) {
          res.data = {
            success : true,
            game  : game,
            message : 'Game ' + inputs.name + ' created'
          };
          return callback();
        });
      }, next);
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

      // take a game array and build the response body
      function getResult (games) {
        var success = !!(games && games.length);
        return {
          success : success,
          message : !success ? 'No games found' : undefined,
          games : games || []
        };
      }

      // if the client performed a search
      if (Object.keys(req.query).length) {
        validate(inputs, {
          team_id : Joi.string().token().optional(),
          season_id : Joi.string().token().optional()
        }, function (result, callback) {

          //If both parameters are present, return the and result
          if ( inputs.team_id && inputs.season_id ) {
            Game.find({
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
                  res.data = getResult(games)
                  return callback();
                }
            );
          } else { 
            Game.find({
              $or : [
                      {
                        'home.team_id' : inputs.team_id
                      },
                      {
                        'away.team_id' : inputs.team_id
                      },
                      {
                        season_id : inputs.season_id
                      }
                    ]
            }, function (error, games) {
              res.data = getResult(games)
              return callback();
            });
          }
        }, next);

      // otherwise, return the last 10 registered
      } else {
        Game.find({
          created : {
            $lte : new Date()
          }
        }).limit(10).exec(function (error, games) {
          res.data = getResult(games)
          return next();
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