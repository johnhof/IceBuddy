var Err  = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mon = require('mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');

var Season = Mon.model('season');

module.exports = function accountController (api) {
  return {

    //
    // Create
    //
    create : function (req, res, next) {
      var inputs = req.body;
      Season.create(inputs, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              season  : data
          }
          return next();
        }
      });
    },


    //
    // Read
    //
    read : function (req, res, next) {
      var inputs = req.query;
      if ( inputs.name ) {
        Season.findByName(inputs, function ( error, seasons ) {
          if ( error ) {
            return next(error);
          } else {
            res.data = {
                success : true,
                seasons  : seasons || []
            }
            return next();
          }
        });
      } else {
        // get the most recent
        Season.recent(inputs, function (error, seasons) {
          if (error) {
            return next(error);

          } else {
            res.data = {
              success : true,
              seasons : seasons || []
            };

            return next();
          }

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