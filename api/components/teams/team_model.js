var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

var Joi      = require('joi');
var validate = require(process.cwd() + '/api/lib/validate');
var Err  = require(process.cwd() + '/api/lib/error').errorGenerator;

module.exports = Mongoman.register('team', {
  name : Mongoman('Team name').string().required().isLength([1, 50]).fin(),
  //(http://docs.mongodb.org/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/)
  //This will be an array of season ids
  seasons : Mongoman('Seasons').array().fin(),
  players : Mongoman('Team Players').array().fin(),
  //Array of player ids
  captains : Mongoman('Captains').array().fin(),
  //Array of user ids
  managers : Mongoman('Managers').array().fin()
}, {
  statics : {
    findById : function ( _id, callback ) {
      this.findOne({
        '_id' : _id
      }, function (error, team){
          if (team) {
            return callback(null, team);
          } else {
            return callback(Err.notFound('No team matches the provided ID'));
          }
      });
    }, 
    updateById : function ( _id, inputs, callback ) {
      this.findOneAndUpdate({
        _id : _id
      }, inputs, function (error, team) {
        if (team) {
          return callback(null, team);
        } else {
          return callback(Err.notFound('No team matches the provided ID'));
        }
      });
    },
    deleteById : function ( _id, callback ) {
      this.findOneAndRemove({
        _id : _id
      }, function (error, team){
        if (team) {
          return callback(null, team);
        } else {
          return callback(Err.notFound('No team matches the provided ID'));
        }
      });
    },
    create : function ( inputs, callback ) {
      validate(inputs, {
          name     : Joi.string().required().min(1).max(50),
        }, 
        function save (result, saveCallback) {
          Mongoman.save('team', inputs, callback, function ( team ) {
            return saveCallback(null, team);
          });
        }, 
        function (error, data) {
          return callback(error, data);
        }
      );
    },
    findByName : function ( inputs, callback ) {
      var thisTeam = this;

      validate(inputs, {
        name     : Joi.string().required().min(1).max(50)
      }, function (result, findCallback) {
          thisTeam.find(inputs, function (error, teams) {
            if ( error ) {
              return callback(error);
            } else {
              return findCallback(null, teams);
            }
          });
        }, 
        function (error, data) {
          return callback(error, data);
        }
      );
    }
  }
});