var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var validate = require(process.cwd() + '/api/lib/validate');
var Joi      = require('joi');

var Account = Mongoman.model('account');

module.exports = function sessionController (api) {
  return {

    //
    // Create
    //
    create : function (req, res, next) {
      validate(req.body, {
        email    : Joi.email(),
        password : Joi.password()
      }, function success (inputs, callback) {
        Account.findOne(inputs, function (error, user) {
          console.log(inputs)
          console.log(arguments)
          console.log(error)
          console.log(user)
          return callback();
        });
      }, next);
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