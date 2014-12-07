var regexSet = require(process.cwd() + '/api/lib/regex_set');
var Joi      = require('joi');
var async    = require('async');

//
// Validate function
//

module.exports = function validate (inputs, schema, middleMan, onComplete) {
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
      if (middleMan.length) {
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
// Joi mixins
//

Joi.email = function () {
  return this.string().required().regex(regexSet.email);
}

Joi.password = function () {
  return this.string().required().regex(regexSet.password);
}
