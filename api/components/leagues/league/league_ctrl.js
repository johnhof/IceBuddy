var Err = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mon = require('mongoman');

var League = Mon.model('league');

module.exports = function accountController (api) {
  return {

    //
    // Create
    //
    create : function (req, res, next) {
      return next();
    },


    //
    // Read
    //
    read : function (req, res, next) {
      res.data = {
        success: true
      };
      return next();
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