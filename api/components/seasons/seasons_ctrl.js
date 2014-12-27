var Err  = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');

var Season = Mongoman.model('season');

module.exports = function accountController (api) {
  return {

    //
    // Create
    //
    create : function (req, res, next) {
      var inputs = req.body;
      validate(inputs, {
        name     : Joi.string().required().min(1).max(50),
        league   : Joi.string().required().min(1).max(50),
      }, function save (result, callback) {
        Mongoman.save('season', req.body, next, function ( season ) {
          res.data = {
            success : true,
            season  : season,
            message : 'Season ' + inputs.name + ' created'
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

      // take a season array and build the response body
      function getResult (seasons) {
        var success = !!(seasons && seasons.length);
        return {
          success : success,
          message : !success ? 'No seasons found' : undefined,
          seasons : seasons || []
        };
      }

      // if the client performed a search
      if (Object.keys(req.query).length) {
        validate(inputs, {}, function (result, callback) {
          Season.find(inputs, function (error, seasons) {
            res.data = getResult(seasons)
            return callback();
          });
        }, next);

      // otherwise, return the last 10 registered
      } else {
        Season.find({
          created : {
            $lte : new Date()
          }
        }).limit(10).exec(function (error, seasons) {
          res.data = getResult(seasons)
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