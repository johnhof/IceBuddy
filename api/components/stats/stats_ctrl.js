

module.exports = function statsController (api) {
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