var Mongoman = require(process.cwd() + '/api/lib/mongoman');

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
      // run parser
      locationParser = null;
      
      // locationParser.parseAll(function (result) {
      //   Mongoman.save('league', req.body, next, function () {
      //
      //     res.data = {
      //       success : true,
      //       message : 'User ' + inputs.name + ' created'
      //     }
      //
      //     return next();
      //   });
      // })
    },


    //
    // Destroy
    //
    destroy : function (req, res, next) {
      return next();
    }
  };
}