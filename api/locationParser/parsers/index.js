var helpers = require(process.cwd() + '/api/lib/helpers');
var _       = require('lodash');

var files   = helpers.getDirContents(__dirname);
var parsers = {};

_.each(files, function (fileObj) {
  var fileName = fileObj.name;
  if (fileName !== 'index') {
    parsers[fileName] = require(fileObj.string);
  }
});

module.exports = parsers;