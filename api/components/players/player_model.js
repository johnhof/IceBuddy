var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('player', {
  preferred_number : Mongoman('Preferred Number').number().required().fin(),

  registered : Mongoman().date().required().default(Date.now).fin(),
  name       : {
    first : Mongoman('First name').string().required().alphanum().isLength([1, 50]).fin(),
    last  : Mongoman('Last name').string().required().alphanum().isLength([1, 50]).fin()
  },
  //List of teams player is associated with
  teams   : Mongoman('Teams').default([]).array().fin(),
  //account object (embedded)
  account : {},
  // List of game ids this user has participated in
  games : Mongoman('Games').default([]).array().fin()
}, {
  statics : {
    findById : function ( _id, callback ) {
      this.findOne({
        '_id' : _id
      }, function (error, player){
          if (player) {
            var data = {
              success : true,
              player  : player
            };
            return callback(null, data);
          } else {
            return callback(Err.notFound('No player matches the provided ID'));
          }
      });
    }, 
    updateById : function ( _id, inputs, callback ) {
      this.findOneAndUpdate({
        _id : _id
      }, inputs, function (error, player) {
        if (player) {
          var data = {
            success : true,
            player  : player
          };
          return callback(null, data);
        } else {
          return callback(Err.notFound('No player matches the provided ID'));
        }
      });
    },
    deleteById : function ( _id, callback ) {
      this.findOneAndRemove({
        _id : _id
      }, function (error, player){
        if (player) {
          var data = {
            success : true,
            player  : player
          };
          return callback(null, data);
        } else {
          return callback(Err.notFound('No player matches the provided ID'));
        }
      });
    },
    create : function ( inputs, callback ) {
      validate(inputs, {
        name     : Joi.object().keys({
          first : Joi.string().optional().alphanum().min(1).max(50),
          last  : Joi.string().optional().alphanum().min(1).max(50)
        }, function save (result, saveCallback) {
        Mongoman.save('player', inputs, callback, function ( player ) {
          var data = {
            success : true,
            player  : player,
            message : 'Stats created'
          };
          return saveCallback(null, data);
        });
      }, function (error, data) {
        if ( error )  {
          return callback(error);
        } else {
          return callback(null, data);
        }
        
      });
    },
    findByName : function ( inputs, callback ) {

      validate(inputs, {
        first : Joi.string().optional().alphanum().min(1).max(50),
        last  : Joi.string().optional().alphanum().min(1).max(50)
      }, function (result, callback) {
        Player.find(inputs, function (error, players) {
          if ( error ) {
            return callback(error);
          } else {
            var success = !!(players && players.length);
            var data = {
              success : success,
              message : !success ? 'No players found' : undefined,
              players : players || []
            };
            return callback(null, data);
          }
        });
      }, next);
      this.find({
        player_id : player_id
      }, function (error, players) {
        if ( error ) {
          return callback(error);
        } else {
          var success = !!(players && players.length);
          var data = {
            success : success,
            message : !success ? 'No players found' : undefined,
            players : players || []
          };
          return callback(null, data);
        }
      });
    }
  }

});