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
        Account.findOne({email : inputs.email}, function (error, user) {
          user.comparePassword(inputs.password, function (error, isValid) {
            if (isValid) {
              res.setSession(user, true);
              res.data = {
                success : true,
                message : 'now logged in as ' + user.username
              }

            } else {
              error = Err('Login failed. check your credentials and try again');
            }

            return callback(error);
          });
        });
      }, next);
    },


    //
    // Read
    //
    read : function (req, res, next) {
      Account.findOne({
        email    : req.session.email
      }, function (error, user) {
        if (error) { return next(error); }

        res.data = {
          email      : user.email,
          username   : user.username,
          registered : user.registered,
          name       : user.name
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