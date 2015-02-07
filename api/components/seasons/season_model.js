var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mon      = require('mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');
var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;

module.exports = Mon.register('season', {
  name    : Mon('Season Name').string().required().min(1).max(50).fin(),
  league  : Mon('League Name').string().required().min(1).max(50).fin(),
  // List of game ids this season
  games : Mon('Games').default([]).array().fin(),

  created : Mon().date().required().default(Date.now).fin(),


},{
  statics : {
    findById : function ( _id, callback ) {
      this.findOne({
        '_id' : _id
      }, function (error, season){
          if (season) {
            return callback(null, season);
          } else {
            return callback(Err.notFound('No season regex the provided ID'));
          }
      });
    },
    updateById : function ( _id, inputs, callback ) {
      this.findOneAndUpdate({
        _id : _id
      }, inputs, function (error, season) {
        if (season) {
          return callback(null, season);
        } else {
          return callback(Err.notFound('No season regex the provided ID'));
        }
      });
    },
    deleteById : function ( _id, callback ) {
      this.findOneAndRemove({
        _id : _id
      }, function (error, season){
        if (season) {
          return callback(null, season);
        } else {
          return callback(Err.notFound('No season regex the provided ID'));
        }
      });
    },
    create : function ( inputs, callback ) {
      validate(inputs, {
          name     : Joi.string().required().min(1).max(50),
          league   : Joi.string().required().min(1).max(50),
        },
        function save (result, saveCallback) {
          Mon.save('season', inputs, callback, function ( season ) {
            return saveCallback(null, season);
          });
        },
        function (error, data) {
          return callback(error, data);
        }
      );
    },
    findByName : function ( inputs, callback ) {
      var thisSeason = this;

      validate(inputs, {
        name     : Joi.string().required().min(1).max(50),
        league   : Joi.string().optional().min(1).max(50),
      }, function (result, findCallback) {
          thisSeason.find(inputs, function (error, seasons) {
            if ( error ) {
              return callback(error);
            } else {
              return findCallback(null, seasons);
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