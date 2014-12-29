var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var validate = require(process.cwd() + '/api/lib/validate');
var Joi      = require('joi');
var bcrypt   = require('bcrypt-nodejs');

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
        var unAuth = Err.unAuth('Sign in failed. Please try again');

        Account.findOne({email : inputs.email}, function (error, account) {
          if (account) {
            account.comparePassword(inputs.password, function (error, isValid) {
              if (isValid) {
                res.setSession(account, true);
                res.data = {
                  success : true,
                  message : 'now logged in as ' + account.nickname
                }
                return callback();
              } else {
                return callback(unAuth);
              }
            });
          } else {
            callback(unAuth);
          }
        });
      }, next);
    },


    //
    // Read
    //
    read : function (req, res, next) {
      Account.findOne({
        email    : req.session.email
      }, function (error, account) {
        if (error) { return next(error); }

        res.data = {
          email      : account.email,
          account   : account.nickname,
          registered : account.registered,
          name       : account.name
        };

        return next();
      });
    },


    //
    // Destroy
    //
    destroy : function (req, res, next) {
      // nullify the session and return
      res.setSession();
      return next();
    }
  };
}