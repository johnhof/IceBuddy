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

      // take a team array and build the response body
      function getResult (teams) {
        var success = !!(teams && teams.length);
        return {
          success : success,
          message : !success ? 'No teams found' : undefined,
          teams : teams || []
        };
      }

      // if the client performed a search
      if (Object.keys(req.query).length) {
        validate(inputs, {}, function (result, callback) {
          Team.find(inputs, function (error, teams) {
            res.data = getResult(teams)
            return callback();
          });
        }, next);

      // otherwise, return the last 10 registered
      } else {
        Team.find({
          registered : {
            $lte : new Date()
          }
        }).limit(10).exec(function (error, teams) {
          res.data = getResult(teams)
          return next();
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