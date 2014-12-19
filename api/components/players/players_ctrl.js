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
      },
      function save (result, callback) {
          Mongoman.save('player', req.body, next, function () {
            res.data = {
              success : true,
              message : 'Player ' + inputs.name.first + ' ' + inputs.name.last + ' created'
            }
            return callback();
          });
      }, next);
    },


    //
    // Read
    //
    read : function (req, res, next) {
      var inputs = req.body;
      validate(inputs, {
          name     : Joi.object().keys({
            first : Joi.string().optional().alphanum().min(1).max(50),
            last  : Joi.string().optional().alphanum().min(1).max(50)
          })
        },
        function read (result, callback) {
          Player.findOne({
            name : 
                { 
                  first : inputs.name.first,
                  last : inputs.name.last,
                }
            }, function (error, player){
              if ( player ) {
                res.data = { 
                    success : true, 
                    player : player 
                };
                return callback();
              } else {
                res.data = { 
                    success : false, 
                    message : 'No player matched the name: ' + inputs.name.first + ' ' + inputs.name.last
                };
                return callback();
              }
          });
        }, next);
    },

    //
    // Update
    //
    update : function (req, res, next) {
      var inputs = req.body;
      validate(inputs, {
          id: Joi.string().token().required(),
          update : Joi.object().min(0).required()
        },
        function update(result, callback) {
          Player.findOneAndUpdate({
              _id : inputs.id
            }, 
            inputs.update, //fields to Update
            function (error, player){
              if ( player ) {
                //TODO: Add a check to see if it actually updated???
                res.data = { 
                    success : true, 
                    player : player
                };
                return callback();
              } else {
                res.data = { 
                    success : false, 
                    message : 'No player matched the id: ' + inputs.id
                };
                return callback();
              }
            }
          );
        }, next);
    },


    //
    // Destroy
    //
    destroy : function (req, res, next) {
      var inputs = req.body;
        validate(inputs, {
          id: Joi.string().token().required()
        },
        function destroy(result, callback) {
          Player.findOneAndRemove({
            _id : inputs.id
          }, 
          function (error, player){
            if ( player ) {
              //TODO: Add a check to see if it actually updated???
              res.data = { 
                  success : true, 
                  player : player
              };
              return callback();
            } else {
              res.data = { 
                  success : false, 
                  message : 'No player matched the id: ' + inputs.id
              };
              return callback();
            }
          });
      }, next);
    }
  };
}