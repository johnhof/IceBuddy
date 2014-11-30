var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var locationParser = require(process.cwd() + '/api/locationParser');

module.exports = function timesController (api) {
  return {

    //
    // Create
    //
    create : function (req, res, next) {
      
      Mongoman.save('league', req.body, next, function () {

        res.data = {
          success : true,
          message : 'User ' + inputs.name + ' created'
        }

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
      locationParser(function (result) {
        Mongoman.save('league', req.body, next, function () {
      
          res.data = {
            success : true,
            message : 'User ' + inputs.name + ' created'
          }
      
          return next();
        });
      }, function (error) {
        return next();
      })
    },


    //
    // Destroy
    //
    destroy : function (req, res, next) {
      return next();
    }
  };
}