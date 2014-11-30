var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var Schema = mongoose.Schema;

//
// Helper/wrapper to prevent code bloat in mongo models
//

//
// TODO: make property descripters accessible outside the conscructor function
//         to allow users to generate custom validation. Then this should be 
//         broken out into its own module
//


var mongoman = function (title) {
  var constructor = {
    data : {
      required : false,
      validate : []
    }
  };


  //
  // Types
  //


  constructor.string   = function () { return constructor.type(String); }
  constructor.date     = function () { return constructor.type(Date); }
  constructor.number   = function () { return constructor.type(Number); }
  constructor.buffer   = function () { return constructor.type(Buffer); }
  constructor.boolean  = function () { return constructor.type(Boolean); }
  constructor.mixed    = function () { return constructor.type(Mixed); }
  constructor.objectId = function () { return constructor.type(ObjectId); }
  constructor.array    = function () { return constructor.type(Array); }

  constructor.type = function (type) {
    constructor.data.type = type;
    return constructor;
  }


  //
  // Misc
  //


  constructor.required = function (required) { 
    constructor.data.required = required === false ? false : true;
    return constructor; 
  }

  constructor.default = function (val) { 
    constructor.data.default = val;
    return constructor; 
  }


  //
  // Validation
  //


  constructor.isAlphaNum = function (msg) {
    return bind({
      validator   : 'isAlphanumeric',
      passIfEmpty : false,
      message     : msg || title + ' should contain alpha-numeric characters only'
    });
  },

  constructor.isLength = function (val, msg) {
    return bind({
      validator   : 'isLength',
      passIfEmpty : false,
      arguments   : val,
      message     : msg || title + ' should be between ' + val[0] + ' and ' + val[1] + ' characters'
    });
  },

  constructor.matches = function (regEx, msg) {
    return bind({
      validator : 'matches',
      arguments : regEx,
      message   : msg ||title + ' invalid'
    });
  }

  // bind validation object to set
  function bind (valObj) {
    constructor.data.validate.push(validate(valObj));
    return constructor;
  }

  
  //
  // Compiler
  //


  constructor.fin = function () {
    return constructor.data;
  }

  return constructor;
}

//
// Helpers and properties
//

// register a model with a plain schema obj
mongoman.register = function (name, schema, options) {

  // TODO : iterate over every leaf looking for a mongoman constructor and call fin()

  return mongoose.model(name, new Schema(schema, options || { strict: true }));
}

// get a model
mongoman.model = function (name) {
  return mongoose.model(name);
}

mongoman.save = function (modelName, inputs, errorHandler, successHandler) {
  var Model = mongoman.model(modelName);
  var newModel = new Model(inputs);

  return newModel.save(function (error) {
    if (error) {
      return errorHandler(error);
    } else {
      successHandler();
    }
  })
}


//
// Export
//

module.exports = mongoman;