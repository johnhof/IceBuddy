var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');
var Player = Mongoman.model('player');

module.exports = function playerController (api) {
  return {

    //
    // Create
    //
    create : function (req, res, next) {
      var inputs = req.body;
      Player.create(inputs, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              player  : data || null
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

      Player.findByName(inputs, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              players  : data || null
          }
          return next();
        }
      });
    },

    //
    // Update
    //
    update : function (req, res, next) {
      //
      // TODO : handle bulk updates (eg. add large number of players to a team)
      //
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