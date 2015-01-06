var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');
var Err  = require(process.cwd() + '/api/lib/error').errorGenerator;

module.exports = Mongoman.register('stat', {
  player_id: Mongoman('Player Id').string().required().fin(),
  //For historic stacts we could just use 0
  game_id: Mongoman('Game Id').string().required().fin(),
  season_id: Mongoman('Season Id').string().required().fin(),
  goals : Mongoman('Goals').number().default(0).required().fin(),
  assists : Mongoman('Assists').number().default(0).required().fin(),
  points : Mongoman('Points').number().default(0).required().fin(),
  
  plus_minus : Mongoman('Plus Minus').number().default(0).required().fin(),
  pim : Mongoman('Penalties In Minutes').number().default(0).required().fin(),
  ppg : Mongoman('Power Play Goals').number().default(0).required().fin(),
  ppa : Mongoman('Power Play Assists').number().default(0).required().fin(),
  shg : Mongoman('Short Handed Goals').number().default(0).required().fin(),
  sha : Mongoman('Short Handed Assists').number().default(0).required().fin(),
  gwg : Mongoman('Game Winning Goal').number().default(0).required().fin(),
  otg : Mongoman('Overtime Goal').number().default(0).required().fin(),
  shots : Mongoman('Shots').number().default(0).required().fin(),
  fot : Mongoman('Face Offs Taken').number().default(0).required().fin(),
  fow : Mongoman('Face Offs Won').number().default(0).required().fin(),

  //Goalie stuff as well
  win : Mongoman('Win').number().default(0).required().fin(),  
  loss : Mongoman('Loss').number().default(0).required().fin(),  
  otl : Mongoman('Overtime Loss').number().default(0).required().fin(),  
  tie : Mongoman('Tie').number().default(0).required().fin(),
  nd : Mongoman('No Decision').number().default(0).required().fin(),
  sa : Mongoman('Shots Against').number().default(0).required().fin(),  
  ga : Mongoman('Goals Allowed').number().default(0).required().fin(),  
  so : Mongoman('Shut Out').number().default(0).required().fin(),
  svpct : Mongoman('Save Percentage').number().default(0).required().fin(),

  created : Mongoman().date().required().default(Date.now).fin()
}, {
  statics : {
    findById : function ( _id, callback ) {
      this.findOne({
        '_id' : _id
      }, function (error, stat){
          if (stat) {
            return callback(null, stat);
          } else {
            return callback(Err.notFound('No stat matches the provided ID'));
          }
      });
    }, 
    updateById : function ( _id, inputs, callback ) {
      this.findOneAndUpdate({
        _id : _id
      }, inputs, function (error, stat) {
        if (stat) {
          return callback(null, stat);
        } else {
          return callback(Err.notFound('No stat matches the provided ID'));
        }
      });
    },
    deleteById : function ( _id, callback ) {
      this.findOneAndRemove({
        _id : _id
      }, function (error, stat){
        if (stat) {
          return callback(null, stat);
        } else {
          return callback(Err.notFound('No stat matches the provided ID'));
        }
      });
    },
    create : function ( inputs, callback ) {
      validate(inputs, {
        player_id  : Joi.string().token().required(),
        game_id    : Joi.string().token().required(),
        season_id  : Joi.string().token().required(),
        goals      : Joi.number().default(0).integer().optional(),
        assists    : Joi.number().default(0).integer().optional(),
        plus_minus : Joi.number().default(0).integer().optional(),
        
        pim     : Joi.number().default(0).optional(),
        ppg     : Joi.number().default(0).integer().optional(),
        ppa     : Joi.number().default(0).integer().optional(),
        shg     : Joi.number().default(0).integer().optional(),
        sha     : Joi.number().default(0).integer().optional(),
        gwg     : Joi.number().default(0).integer().optional(),
        otg     : Joi.number().default(0).integer().optional(),
        shots   : Joi.number().default(0).integer().optional(),
        fot     : Joi.number().default(0).integer().optional(),
        fow     : Joi.number().default(0).integer().optional(),

        //Goalie stuff
        win     : Joi.number().default(0).integer(),
        loss    : Joi.number().default(0).integer(),
        otl     : Joi.number().default(0).integer(),
        tie     : Joi.number().default(0).integer().optional(),
        nd      : Joi.number().default(0).integer().optional(),
        sa      : Joi.number().default(0).integer().optional(),
        ga      : Joi.number().default(0).integer().optional(),
        so      : Joi.number().default(0).integer().optional()
      }, function save (result, saveCallback) {
        var points = inputs.goals + inputs.assists;
        var savePercentage = 0;
        if ( inputs.sa ) {
          savePercentage = inputs.ga / inputs.sa;
        }

        inputs.points = points;
        inputs.svpct = savePercentage;

        Mongoman.save('stat', inputs, callback, function ( stat ) {
          return callback(null, stat);
        });
      }, function (error, data) {
        if ( error )  {
          return callback(error);
        } else {
          return callback(null, data);
        }
        
      });
    },
    findByPlayerId : function ( inputs, callback ) {
      //This function will return all stats by player -- Think lifetime stats
      this.find({
        player_id : inputs.player_id
      }, function (error, stats) {
        if ( error ) {
          return callback(error);
        } else {
          return callback(null, stats);
        }
      });
    },
    findBySeasonId : function ( inputs, callback ) {
      //This function will return all stats by season -- Think stats for every player for a season
      this.find({
        season_id : inputs.season_id
      }, function (error, stats) {
        if ( error ) {
          return callback(error);
        } else {
          return callback(null, stats);
        }
      });
    },
    findByGameId : function ( inputs, callback ) {
      //This function will return all stats by game -- Think stats for every player for a game
      this.find({
        game_id : inputs.game_id
      }, function (error, stats) {
        if ( error ) {
          return callback(error);
        } else {
          return callback(null, stats);
        }
      });
    },
    findByPlayerIdSeasonId : function ( inputs, callback ) {
      //This function will return all stats by player for a season
      this.find({
        $and: [
          {
            player_id : inputs.player_id
          },
          {
            season_id : inputs.season_id
          }
        ]
      }, function (error, stats) {
        if ( error ) {
          return callback(error);
        } else {
          return callback(null, stats);
        }
      });
    },
    findByPlayerIdGameId : function ( inputs, callback ) {
      //This function will return all stats by player for a season -- will return single stat
      this.find({
        $and: [
          {
            player_id : inputs.player_id
          },
          {
            game_id : inputs.game_id
          }
        ]
      }, function (error, stats) {
        if ( error ) {
          return callback(error);
        } else {
          return callback(null, stats);
        }
      });
    }
  }
});