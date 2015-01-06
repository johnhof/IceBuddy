var Err  = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');

var Team = Mongoman.model('team');

module.exports = function accountController (api) {
  return {

    //
    // Create
    //
    create : function (req, res, next) {
      var inputs = req.body;
      validate(inputs, {
        name     : Joi.string().required().min(1).max(50),
      }, function save (result, callback) {
        Mongoman.save('team', req.body, next, function ( team ) {
          res.data = {
            success : true,
            team  : team,
            message : 'Team ' + inputs.name + ' created'
          };
          return callback();
        });
      }, next);
    },


    //
    // Read
    //
    read : function (req, res, next) {
      var inputs = req.query;

      Team.findByName(inputs, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              teams  : data || []
          }
          return next();
        }
      });
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