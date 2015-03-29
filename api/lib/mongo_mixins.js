var Mon   = require('mongoman');
var Err   = require('./error');
var _     = require('lodash');
var async = require('async');
var _     = require('lodash');


//////////////////////////////////////////////////////////////////////////////////
//
// Helpers
//
//////////////////////////////////////////////////////////////////////////////////

Mon.helpers = Mon.helpers || {};

// Search Regex
//
// return a search compatible regex for the given string
var searchRegex = Mon.helpers.searchRegex = function (string) {
  return {
    $regex   :  new RegExp('^\\s*' + (string || '').trim() + '', 'i')
  };
}

// Paginate
//
// return a pagination object
var paginate = Mon.helpers.paginate = function (inputs) {
  inputs.skip = inputs.skip || inputs.page;
  inputs.limit = inputs.limit || inputs.count;
  return _.defaults(inputs, {
    skip  : 0, // default to first page
    limit : 10 // default to 10 items per page
  });
}

// PopulateArray
//
// populate the array with populate object specified
var populateArray = Mon.helpers.populateArray = function (docArray, inputs, callback) {
  async.parallel(_.map(docArray, function (doc) {
    return function (callback) {
      Mon.model(inputs.model).populate(doc, { path: inputs.path }, callback);
    }
  }), callback);
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
    function onComplete (error, doc) {
      if (doc) {
        return callback(null, doc);
      } else {
        return callback(Err.notFound(options.errorMsg || 'No document found for the prodided ID'));
      }
    }

    if (options.populate) {
      this.findOne({ _id : _id }).populate(options.populate).exec(onComplete);
    } else {
      this.findOne({ _id : _id }, onComplete);
    }
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
    this.find({}, {}, paginate(inputs)).sort({
      created : 'descending'
    }).exec(callback);
  }
}


// Recent entries
//
// model MUST have the `created` property
Mon.statics.search = function (options) {

  // inputs = {
  //   condition : Object, //  Shallow - search condition - REQUIRED
  //   page      : Number, // page number - OPTIONAL
  //   count     : Number // documents per page - OPTIONAL
  // }
  return function (inputs, callback) {
    _.each(inputs.condition, function (value, key) {
      if (value === undefined) {
        delete inputs.condition[key];
      } else if (_.isString(value)){
        inputs.condition[key] = searchRegex(value);
      }
    });

    this.find(inputs.condition, {}, paginate(inputs)).exec(callback);
  }
}