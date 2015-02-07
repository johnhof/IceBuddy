var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mon      = require('mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');

var Season = Mon.model('season');

module.exports = function accountController (api) {
  return {

//
    // Read
    //
    read : function (req, res, next) {
      Season.findById(req.params.seasonId, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              season  : data || null
          }
          return next();
        }
      });
    },


    //
    // Update
    //
    update : function (req, res, next) {
      var inputs = req.body;
      Season.updateById(req.params.seasonId, inputs, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              season  : data || null
          }
          return next();
        }
      });
    },


    //
    // Destroy
    //
    destroy : function (req, res, next) {
      Season.deleteById(req.params.seasonId, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              season  : data || null
          }
          return next();
        }
      });
    }
  };
}