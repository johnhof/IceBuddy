var Mon = require('mongoman');
var Err = require('./error');
var _   = require('lodash');


//////////////////////////////////////////////////////////////////////////////////
//
// Helpers
//
//////////////////////////////////////////////////////////////////////////////////

Mon.helpers = Mon.helpers || {};

// Search Regex
//
// return a search compatible regex for the given string
Mon.helpers.searchRegex = function (string) {
  return new RegExp('(^|\\s+)' + (string || '').trim(), 'ig');
}


//////////////////////////////////////////////////////////////////////////////////
//
// Statics
//
//////////////////////////////////////////////////////////////////////////////////


Mon.statics = Mon.statics || {};

//
// ID statics
//

// Find by ID
//
Mon.statics.findyById = function (options) {
  return function (_id, callback) {
    this.findOne({ _id : _id }, function (error, doc) {
      if (doc) {
        return callback(null, doc);
      } else {
        return callback(Err.notFound(options.errorMsg || 'No document found for the prodided ID'));
      }
    });
  }
}

// Update by ID
//
Mon.statics.updateById = function (options) {
  return function ( _id, inputs, callback ) {
    this.findOneAndUpdate({ _id : _id }, inputs, function (error, doc) {
      if (doc) {
        return callback(null, doc);
      } else {
        return callback(Err.notFound(options.errorMsg || 'No document found for the prodided ID'));
      }
    });
  }
}

// Delete by ID
//
Mon.statics.deleteById = function (options) {
  return function (_id, callback) {
    this.findOneAndRemove({  _id : _id }, function (error, doc) {
      if (doc) {
        return callback(null, doc);
      } else {
        return callback(Err.notFound(options.errorMsg ||  'No document found for the prodided ID'));
      }
    });
  }
}

//
// Generic
//

// Recent entries
//
// model MUST have the `created` property
Mon.statics.recent = function (options) {

  // inputs = {
  //   page  : Number, // page number - optional
  //   count : Number // documents per page - optional
  // }
  return function (inputs, callback) {
    this.find({}, {},  {
      skip  : inputs.page || 0, // default to first page
      limit : inputs.count || 10 // default to 10 items per page
    }).sort({
      created : 'descending'
    }).exec(callback);
  }
}


// Recent entries
//
// model MUST have the `created` property
Mon.statics.search = function (options) {

  // inputs = {
  //   condition : Obj, // search condition - REQUIRED
  //   page      : Number, // page number - OPTIONAL
  //   count     : Number // documents per page - OPTIONAL
  // }
  return function (inputs, callback) {
    var property = null;
console.log(inputs.condition)
    this.find(inputs.condition, {},  {
      skip  : inputs.page || 0, // default to first page
      limit : inputs.count || 10 // default to 10 items per page
    }).exec(callback);
  }
}