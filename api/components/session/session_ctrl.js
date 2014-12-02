var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;

var Account = Mongoman.model('account');

module.exports = function sessionController (api) {
  return {

    //
    // Create
    //
    create : function (req, res, next) {
      // TODO : add validation
      Account.findOne({
        email    : req.body.email,
        password : req.body.password
      }, function (error, user) {
        return next();
      });
    },


    //
    // Read
    //
    read : function (req, res, next) {
      res.json = {
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