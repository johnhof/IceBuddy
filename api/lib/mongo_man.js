var mongoose = require('mongoose');
var validate = require('mongoose-validator');

exports.build = function (title) {
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
  constructor.ibjectId = function () { return constructor.type(ObjectId); }
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
      message     : msg || title + ' should be between {MIN} and {MAX} characters'
    });
  },

  constructor.matches = function (regEx, msg) {
    return bind({
      validator : 'matches',
      arguments : regEx,
      message   : msg ||title + ' invlaid'
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

exports.register = function(name, schema, options) {
  return mongoose.model('account', new Schema(schema, options || { strict: true }));
}