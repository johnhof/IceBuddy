var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var locationParser = require(process.cwd() + '/api/locationParser');

module.exports = function timesController (api) {
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