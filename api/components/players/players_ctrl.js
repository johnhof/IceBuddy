var Err      = require(process.cwd() + '/api/lib/error').errorGenerator;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');
var Player = Mongoman.model('player');

module.exports = function playerController (api) {
  return {

    //
    // Create
    //
    create : function (req, res, next) {
      var inputs = req.body;

      validate(inputs, {
        name     : Joi.object().keys({
          first : Joi.string().optional().alphanum().min(1).max(50),
          last  : Joi.string().optional().alphanum().min(1).max(50)
        })
      }, [
        function save (error, callback) {
          Mongoman.save('player', req.body, next, function () {
            res.data = {
              success : true,
              message : 'Player ' + inputs.name.first + ' ' + inputs.name.last + ' created'
            }
            return callback();
          });
        }
      ], next);
    },


    //
    // Read
    //
    read : function (req, res, next) {
      var inputs = req.body;
      if (inputs && inputs.name && inputs.name.first && inputs.name.last ) {
        Player.findOne({
            name : 
              { 
                first : inputs.name.first,
                last : inputs.name.last,
              }
          }, function(err, player){
            if ( player ) {
              return res.send( { 
                  success : true, 
                  player : player 
                } );
            } else {
              return res.send( { 
                  success : false, 
                  message : 'No player matched the name: ' + inputs.name.first + ' ' + inputs.name.last
              } );
            }
          });

      } else {
        return next( Err('Name.First and Name.Last are required fields') );
      }
    },


    //
    // Update
    //
    update : function (req, res, next) {
      var inputs = req.body;
      if (inputs && inputs.id && inputs.update ) {
        Player.findOneAndUpdate({
            _id : inputs.id
          }, 
          inputs.update, //fields to Update
          function(err, player){
            if ( player ) {
              //TODO: Add a check to see if it actually updated???
              return res.send( { 
                  success : true, 
                  player : player
              } );
            } else {
              return res.send( { 
                  success : false, 
                  message : 'No player matched the id: ' + inputs.id
              } );
            }
          });
      } else {
        return next( Err('Player Id and Update Object are required fields') ); 
      }
    },


    //
    // Destroy
    //
    destroy : function (req, res, next) {
      var inputs = req.body;
      if (inputs && inputs.id ) {
        Player.findOneAndRemove({
            _id : inputs.id
          }, 
          function(err, player){
            if ( player ) {
              //TODO: Add a check to see if it actually updated???
              return res.send( { 
                  success : true, 
                  player : player
              } );
            } else {
              return res.send( { 
                  success : false, 
                  message : 'No player matched the id: ' + inputs.id
              } );
            }
          });
      } else {
        return next( Err('Player Id is required fields') ); 
      }
    }
  };
}