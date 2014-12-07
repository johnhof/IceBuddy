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
          if (!user) {
            return callback(Err('Login failed. check your credentials and try again'))
          } else {
            res.data = {
              success :true,
              message : 'now logged in (not really though, we need to implement this)'
            }

            return callback();
          }
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