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
      res.data = [];
      locationParser(function (error, result, callback) {
        if (error) { return callaback(error); }
        // Mongoman.save('league', req.body, next, function () {
      
        //   res.data = {
        //     success : true,
        //     message : 'User ' + inputs.name + ' created'
        //   }
      
        //   return next();
        // });
        console.log(result);
        res.data.push(result)
        return callback();
      }, function (error) {
        return next();
      })
    },


    //
    // Update
    //
    update : function (req, res, next) {
      res.data = [];
      locationParser(function (error, result, callback) {
        if (error) { return callaback(error); }
        // Mongoman.save('league', req.body, next, function () {
      
        //   res.data = {
        //     success : true,
        //     message : 'User ' + inputs.name + ' created'
        //   }
      
        //   return next();
        // });
        console.log(result);
        res.data.push(result)
        return callback();
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