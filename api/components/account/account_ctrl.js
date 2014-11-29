var Account  = require('./account_model');
var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;

module.exports = function accountController (api) {
  return {

    //
    // Create
    //
    create : function (req, res, next) {
      var inputs = req.body;
      var newAccount = new Account(inputs);
      newAccount.save(function (error) {
        if (error) {
console.log('yay')
          return next(Err('Validation failed', error));
        } else {
console.log('sending')
          res.data = {
            success : true,
            message : 'User ' + inputs.email + 'created'
          }
          return next();
        }
      });
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