var Mon      = require('mongoman');
var Joi      = require('joi');
var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var validate = require(process.cwd() + '/api/lib/validate');

var Game = Mon.model('game');

module.exports = function accountController (api) {
  return {

    //
    // Read
    //
    read : function (req, res, next) {
      Game.findById(req.params.gameId, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              game  : data || null
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
      Game.updateById(req.params.gameId, inputs, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              game  : data || null
          }
          return next();
        }
      });
    },


    //
    // Destroy
    //
    destroy : function (req, res, next) {
      Game.deleteById(req.params.gameId, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              game  : data || null
          }
          return next();
        }
      });
    }
  };
}