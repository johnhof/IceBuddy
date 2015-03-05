var Mon      = require('mongoman');
var Joi      = require('joi');
var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var validate = require(process.cwd() + '/api/lib/validate');
var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;

module.exports = Mon.register('player', {
  created : Mon().date().required().default(Date.now).fin(),
  name    : {
    first : Mon('First name').string().required().alphanum().min(1).max(50).fin(),
    last  : Mon('Last name').string().required().alphanum().min(1).max(50).fin()
  },

  //List of teams player is associated with
  teams   : Mon('Teams').default([]).array().fin(),

  //account object (embedded)
  account : {},

  // List of game ids this user has participated in
  games : Mon('Games').default([]).array().fin(),

  preferred_number : Mon('Preferred Number').number().required().fin()
}, {

  //
  // vituals
  //
  virtuals :  {
    'name.full' : {
      get : function () {
        return this.name.first + ' ' + this.name.last;
      }
    }
  },

  //
  // Statics
  //
  statics : {
    findById   : Mon.statics.findyById({ errorMsg : 'No player regex the provided ID' }),
    updateById : Mon.statics.updateById({ errorMsg : 'No player regex the provided ID' }),
    deleteById : Mon.statics.deleteById({ errorMsg : 'No player regex the provided ID' }),

    recent : Mon.statics.recent(),

    search : Mon.statics.search(),


    create : function ( inputs, callback ) {
      validate(inputs, {
          name     : Joi.object().keys({
            first : Joi.string().required().alphanum().min(1).max(50),
            last  : Joi.string().required().alphanum().min(1).max(50)
          })
        },
        function save (result, saveCallback) {
          Mon.save('player', inputs, callback, function ( player ) {
            return saveCallback(null, player);
          });
        },
        function (error, data) {
          return callback(error, data);
        }
      );
    },

    findByName : function (inputs, callback) {
      var thisPlayer = this;

      validate(inputs, {
        first : Joi.string().optional().alphanum().min(1).max(50),
        last  : Joi.string().optional().alphanum().min(1).max(50)
      }, function (result, findCallback) {
          thisPlayer.find(inputs, function (error, players) {
            if (error) {
              return callback(error);
            } else {
              return findCallback(null, players);
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