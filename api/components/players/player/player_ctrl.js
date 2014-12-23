var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

var Player   = Mongoman.model('player');

module.exports = function playerController (api) {
  return {

    //
    // Read
    //
    read : function (req, res, next) {
      Player.findOne({
        '_id' : req.params.playerId
        }, function (error, player){
          if (player) {
            res.data = {
              success : true,
              player  : player
            };
            return next();
          } else {
            return next(Err.notFound('No player matches the provided ID'));
          }
      });
    },


    //
    // Update
    //
    update : function (req, res, next) {
      var inputs = req.body;
      Player.findOneAndUpdate({
        _id : req.params.playerId
      }, inputs, function (error, player) {
        if (player) {
          res.data = {
            success : true,
            player  : player
          };
          return next();
        } else {
          return next(Err.notFound('No player matches the provided ID'));
        }
      });
    },


    //
    // Destroy
    //
    destroy : function (req, res, next) {
      Player.findOneAndRemove({
        _id : req.params.playerId
      }, function (error, player){
        if (player) {
          res.data = {
            success : true,
            player  : player
          };
          return next();
        } else {
          return next(Err.notFound('No player matches the provided ID'));
        }
      });
    }
  };
}