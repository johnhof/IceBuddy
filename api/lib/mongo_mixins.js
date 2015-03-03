var Mon = require('mongoman');
var Err = require('./error');
var _   = require('lodash');


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
  //   property : String, // property to match against - REQUIRED
  //   search   : String, // search string - REQUIRED
  //   page     : Number, // page number - OPTIONAL
  //   count    : Number // documents per page - OPTIONAL
  // }
  return function (inputs, callback) {
    var search   = {};
    var property = null

  // properties = inputs.property.split('.');
  // function index (obj, i) {
  //   if (properties.length - 1 <= index) {

  //   }
  //   return obj[i];
  // }
  // properties.property.split('.').reduce(index, obj)

    search[inputs.property] = new RegExp('(^|\\s+)' + (inputs.search || '').trim(), 'ig');
console.log(search)
    this.find(search, {},  {
      skip  : inputs.page || 0, // default to first page
      limit : inputs.count || 10 // default to 10 items per page
    }).sort({
      created : 'descending'
    }).exec(callback);
  }
}