var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');

var Team = Mongoman.model('team');

module.exports = function accountController (api) {
  return {

//
    // Read
    //
    read : function (req, res, next) {
      Team.findOne({
        '_id' : req.params.teamId
        }, function (error, team){
          if (team) {
            res.data = {
              success : true,
              team  : team
            };
            return next();
          } else {
            return next(Err.notFound('No team matches the provided ID'));
          }
      });
    },


    //
    // Update
    //
    update : function (req, res, next) {
      var inputs = req.body;
      Team.findOneAndUpdate({
        _id : req.params.teamId
      }, inputs, function (error, team) {
        if (team) {
          res.data = {
            success : true,
            team  : team
          };
          return next();
        } else {
          return next(Err.notFound('No team matches the provided ID'));
        }
      })
    },


    //
    // Destroy
    //
    destroy : function (req, res, next) {
      Team.findOneAndRemove({
        _id : req.params.teamId
      }, function (error, team){
        if (team) {
          res.data = {
            success : true,
            team  : team
          };
          return next();
        } else {
          return next(Err.notFound('No team matches the provided ID'));
        }
      });
    }
  };
}