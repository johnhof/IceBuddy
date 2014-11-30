var locations      = require('./locations');
var customParsers  = require('./customParsrs');
var standardParser = require('./customParsrs');
var async          = require('async');
var URL            = require('url');

module.exports = function (handler, onComplete) {
  var parsers = _.map(locations, function parse (location) {
    var url = URL.parse(location);

    if (customParsers[url.host]) {
      customParsers[url.host](url)
    } else {
      standardParser(url)
    }
  })

  async.parallel(parsers, onComplete);
}