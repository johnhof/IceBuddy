var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');

var Season = Mongoman.model('season');

module.exports = function accountController (api) {
  return {

//
    // Read
    //
    read : function (req, res, next) {
      Season.findOne({
        '_id' : req.params.seasonId
        }, function (error, season){
          if (season) {
            res.data = {
              success : true,
              season  : season
            };
            return next();
          } else {
            return next(Err.notFound('No season matches the provided ID'));
          }
      });
    },


    //
    // Update
    //
    update : function (req, res, next) {
      var inputs = req.body;
      Season.findOneAndUpdate({
        _id : req.params.seasonId
      }, inputs, function (error, season) {
        if (season) {
          res.data = {
            success : true,
            season  : season
          };
          return next();
        } else {
          return next(Err.notFound('No season matches the provided ID'));
        }
      })
    },


    //
    // Destroy
    //
    destroy : function (req, res, next) {
      Season.findOneAndRemove({
        _id : req.params.seasonId
      }, function (error, season){
        if (season) {
          res.data = {
            success : true,
            season  : season
          };
          return next();
        } else {
          return next(Err.notFound('No season matches the provided ID'));
        }
      });
    }
  };
}