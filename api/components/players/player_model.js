var Mon      = require('mongoman');
var Joi      = require('joi');
var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var validate = require(process.cwd() + '/api/lib/validate');
var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;

module.exports = Mon.register('player', {
  preferred_number : Mon('Preferred Number').number().required().fin(),

  registered : Mon().date().required().default(Date.now).fin(),
  name       : {
    first : Mon('First name').string().required().alphanum().min(1).max(50).fin(),
    last  : Mon('Last name').string().required().alphanum().min(1).max(50).fin()
  },
  //List of teams player is associated with
  teams   : Mon('Teams').default([]).array().fin(),
  //account object (embedded)
  account : {},
  // List of game ids this user has participated in
  games : Mon('Games').default([]).array().fin(),
  created : Mon().date().required().default(Date.now).fin()
}, {
  statics : {
    findById : function ( _id, callback ) {
      this.findOne({
        '_id' : _id
      }, function (error, player){
          if (player) {
            return callback(null, player);
          } else {
            return callback(Err.notFound('No player regex the provided ID'));
          }
      });
    },
    updateById : function ( _id, inputs, callback ) {
      this.findOneAndUpdate({
        _id : _id
      }, inputs, function (error, player) {
        if (player) {
          return callback(null, player);
        } else {
          return callback(Err.notFound('No player regex the provided ID'));
        }
      });
    },
    deleteById : function ( _id, callback ) {
      this.findOneAndRemove({
        _id : _id
      }, function (error, player){
        if (player) {
          return callback(null, player);
        } else {
          return callback(Err.notFound('No player regex the provided ID'));
        }
      });
    },
    create : function ( inputs, callback ) {
      console.log('Hiiii???')
      validate(inputs, {
          name     : Joi.object().keys({
            first : Joi.string().required().alphanum().min(1).max(50),
            last  : Joi.string().required().alphanum().min(1).max(50)
          })
        },
        function save (result, saveCallback) {
          console.log('WEEEE', inputs)
          console.log('callback? ', callback)

          console.log('MON? ', Mon.save);
          Mon.save('player', inputs, callback, function ( player ) {
            console.log('ok ... ')
            return saveCallback(null, player);
          });
        },
        function (error, data) {
          console.log('MMEEEE')
          return callback(error, data);
        }
      );
    },
    findByName : function ( inputs, callback ) {
      var thisPlayer = this;

      validate(inputs, {
        first : Joi.string().optional().alphanum().min(1).max(50),
        last  : Joi.string().optional().alphanum().min(1).max(50)
      }, function (result, findCallback) {
          thisPlayer.find(inputs, function (error, players) {
            if ( error ) {
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