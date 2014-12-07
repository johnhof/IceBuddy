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
        username : Joi.string().alphanum().min(3).max(50),
        name     : Joi.object().keys({
          first : Joi.string().optional().alphanum().min(1).max(50),
          last  : Joi.string().optional().alphanum().min(1).max(50)
        })
      }, [
        function getAccount (callback) {
          Account.findOne({
            $or: [
              { email    : inputs.email },
              { username : inputs.username }
            ]
          }, callback);
        },
        function checkUnique (user, callback) {
          var result = user ? Err('Username or email in use') : null;
          return callback(result);
        },
        function save (callback) {
          Mongoman.save('account', req.body, callback, function (user) {
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