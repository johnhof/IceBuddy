var locations      = require('./locations');
var customParsers  = require('./customParsers');
var standardParser = require('./standardParser');
var async          = require('async');
var URL            = require('url');

module.exports = function (handler, onComplete) {
  var parsers = _.map(locations, function parse (location) {
    var url = URL.parse(location);

    return function (callback) {

      // pass the result to the handler and call the completion callback
      var trueHandler = function (result) {
        return handler(result, callback);
      }

      // map the location to the parser and pass in the handler-wrapper
      if (customParsers[url.host]) {
        return customParsers[url.host](url, trueHandler);
      } else {
        return standardParser(url, trueHandler);
      }
    }
  })

  // parse in parallel
  async.parallel(parsers, onComplete);
}