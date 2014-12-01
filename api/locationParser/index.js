var locations = require('./locations');
var parserSet = require('./parsers');
var async     = require('async');
var URL       = require('url');
var _         = require('lodash');
var regexSet  = require(process.cwd() + '/api/lib/regex_set');

module.exports = function (handler, onComplete) {
  var parsers = _.map(locations, function parse (location) {
    return function (callback) {

      // pass the result to the handler and call the completion callback
      var trueHandler = function (error, result) {
        return handler(error, result, callback);
      }

      var domain = location.replace(regexSet.domainName, '');

      // map the location to the parser and pass in the handler-wrapper
      if (parserSet[domain]) {
        return parserSet[domain]('www.' + location, trueHandler);
      } else {
        return parserSet.standard('www.' + location, trueHandler);
      }
    }
  })

  // parse in parallel
  async.parallel(parsers, onComplete);
}