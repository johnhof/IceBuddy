var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');

var Stat = Mongoman.model('stat');

module.exports = function accountController (api) {
  return {

//
    // Read
    //
    read : function (req, res, next) {
      Stat.findById(req.params.statId, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              stat  : data || null
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
      Stat.updateById(req.params.statId, inputs, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              stat  : data || null
          }
          return next();
        }
      });
    },


    //
    // Destroy
    //
    destroy : function (req, res, next) {
      Stat.deleteById(req.params.statId, function ( error, data ) {
        if ( error ) {
          return next(error);
        } else {
          res.data = {
              success : true,
              stat  : data || null
          }
          return next();
        }
      });
    }
  };
}