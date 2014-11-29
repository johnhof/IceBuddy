var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var valUtils = require(process.cwd() + '/api/lib/validation_utils');

// validator setup
var regexSet = valUtils.regexSet;
var val      = valUtils.validations;

//
// Schema
//

var accountSchema = new Schema({
  email : {
    type     : String, 
    required : true, 
    validate : [
      val.matches('Email', regexSet.email)
    ]
  },
  password : {
    type     : String, 
    required : true, 
    validate : [
      val.matches('Email', regexSet.password)
    ]
  },
  username : {
    type     : String, 
    required : true, 
    validate : [
      val.isLength('User name', [3, 50]),
      val.isAlphaNum('Username')
    ]
  },
  registered : {
    type     : Date, 
    required : true
  },
  name : {
    first : {
      type     : String, 
      required : true, 
      validate : [
        val.isLength('First name', [1, 50]),
        val.isAlphaNum('First name')
      ]
    },
    last  : {
      type     : String, 
      required : true, 
      validate : [
        val.isLength('Last name', [1, 50]),
        val.isAlphaNum('Last name')
      ]
    }
  }
});

module.exports = mongoose.model('account', accountSchema);
