
module.exports = function accountController (api) {
  return {
    //
    // Read
    //
    read : function (req, res, next) {
      res.json = {
        success: true
      };
      return next();
    },
  };
}