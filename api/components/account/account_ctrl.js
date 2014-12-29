var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var validate = require(process.cwd() + '/api/lib/validate');
var Joi      = require('joi');

var Account = Mongoman.model('account');

module.exports = function accountController (api) {
  return {

    //
    // Create
    //
    create : function (req, res, next) {
      var inputs = req.body
      validate(inputs, {
        email    : Joi.email(),
        password : Joi.password(),
        nickname : Joi.string().alphanum().min(3).max(50),
        name     : Joi.object().keys({
          first : Joi.string().optional().alphanum().min(1).max(50),
          last  : Joi.string().optional().alphanum().min(1).max(50)
        })
      }, [
        function checkEmailUnique (result, callback) {
          Account.findOne({ email : inputs.email }, function (error, user) {
            var error = user ? Err('Email in use') : null;
            return callback(error, result);
          });
        },
        function checNicknameUnique(result, callback) {
          Account.findOne({ nickname : inputs.nickname }, function (error, user) {
          var error = user ? Err('Nickname in use') : null;
          return callback(error, result);
          });
        },
        function save (result, callback) {
          Mongoman.save('account', req.body, callback, function (user) {
            res.setSession(user, true);
            res.data = {
              success : true,
              message : 'Account ' + inputs.username + ' created'
            };

            return callback();
          });
        }
      ], next);
    },


    //
    // Read
    //
    read : function (req, res, next) {
      Account.findOne({
        email : req.session.email
      }, function (error, account) {
        if (account) {
          res.data = {
            success : true,
            account : account
          };
          return next();
        } else {
          return next(Err('Could not recover account information'));
        }
      });
    },


    //
    // Update
    //
    update : function (req, res, next) {
      Account.findOneAndUpdate({
        email : req.session.email
      }, req.body, function (error, account) {
        if (account) {
          res.data = {
            success : true,
            account  : account
          };
          return next();
        } else {
          return next(Err('Could not update account information'));
        }
      })
    }
  };
}