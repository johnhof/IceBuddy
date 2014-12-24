var Joi      = require('joi');
var async    = require('async');

//
// Validate function
//

var validate = function validate (inputs, schema, middleMan, onComplete) {
  var defaults = {
    abortEarly    : false, // exit with error at the first failure
    convert       : true, // convert similar types eg. string->int
    allowUnknown  : true, // allow unexpected properties to pass throught
    skipFunctions : false, // ignore function properties
    stripUnknown  : true, // delete unknown keys
    language      : {}, // error message overrides
    presence      : 'required', // default presence ['requried', 'optional', 'forbidden']
  }

  if (schema.joi) {
    options = _.defautls(schema.joi, defaults);
  }

  Joi.validate(inputs, Joi.object().keys(schema), defaults,  function (error, value){
    if (error) {
      return onComplete(error);
    } else if (middleMan) {
      if (middleMan instanceof Array) {
        middleMan.unshift(function (callback) {
          return callback(null, value)
        })
        return async.waterfall(middleMan, onComplete)
      } else {
        return middleMan(value, onComplete);
      }
    } else {
      return onComplete(new Error);
    }
  });
}

//
// Common use regex's
//

validate.regex = {
  email      : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password   : /^.*(?=.{4,10})(?=.*\d)(?=.*[a-zA-Z]).*$/,
  domainName : /\.(com|edu|net|org|info|coop|int|co\.uk|org\.uk|ac\.uk|uk)$/
};

//
// Session
//

//
// Export
//

module.exports = validate;

//
// Joi mixins
//

Joi.email = function () {
  return this.string().required().regex(validate.regex.email);
}

Joi.password = function () {
  return this.string().required().regex(validate.regex.password);
}
