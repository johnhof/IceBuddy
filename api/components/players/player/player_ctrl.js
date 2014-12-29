var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

var Player   = Mongoman.model('player');

module.exports = function playerController (api) {
  return {

    //
    // Read
    //
    read : function (req, res, next) {
      Player.findById(req.params.playerId, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = data;
          return next();
        }
      });
    },


    //
    // Update
    //
    update : function (req, res, next) {
      var inputs = req.body;
      Player.updateById(req.params.playerId, inputs, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = data;
          return next();
        }
      });
    },


    //
    // Destroy
    //
    destroy : function (req, res, next) {
      Player.deleteById(req.params.playerId, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = data;
          return next();
        }
      });
    }
  };
}