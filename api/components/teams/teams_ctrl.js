var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mon      = require('mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');

var Team = Mon.model('team');

module.exports = function accountController (api) {
  return {

//////////////////////////////////////////////////////////////////////////////////
//
// Create
//
//////////////////////////////////////////////////////////////////////////////////

    create : function (req, res, next) {
      var inputs = req.body;
      Mon.save('team', req.body, next, function (team) {
        res.data = {
          success : true,
          team    : team
        };
        return next();
      });
    },


//////////////////////////////////////////////////////////////////////////////////
//
// Read
//
//////////////////////////////////////////////////////////////////////////////////


    read : function (req, res, next) {
      var inputs = req.query;

      // if a name was provided, use it in the search
      if (inputs.name) {

        // build search condition
        inputs.condition = { name : inputs.name };

        // perform the search
        Team.search(inputs, function (error, teams) {
          if (error) {
            return next(error);

          } else {
            res.data = {
              success : true,
              teams   : teams || [],
            };

            return next();
          }
        });

      // otherwise, get the latest players
      } else {

        // get the most recent
        Team.recent(inputs, function (error, teams) {
          if (error) {
            return next(error);

          } else {
            res.data = {
              success : true,
              teams   : teams || []
            };

            return next();
          }

        });
      }
    },


//////////////////////////////////////////////////////////////////////////////////
//
// Update
//
//////////////////////////////////////////////////////////////////////////////////


    update : function (req, res, next) {
      return next();
    },


//////////////////////////////////////////////////////////////////////////////////
//
// Destroy
//
//////////////////////////////////////////////////////////////////////////////////


    destroy : function (req, res, next) {
      return next();
    }
  };
}