var fs = require('fs');
var _  = require('lodash');

exports.parseJsonFile = function (path) {
  var content = {
    _error : {
      summary : 'Failed to parse: ' + path,
      details : null
    }
  };

  try {
    content = JSON.parse(fs.readFileSync(path || ''));
  } catch (e) {
    content._error || {};
    content._error.details = e;
  }

  return content;
}


//
//
// Directory managers
//
//

exports.requireDirContent = function (path, regEx) {
  // use a recurseive tree mapper to retrieve the object
  var resultObj = subTreeObj({}, path);

  // recursive tree for requirign content which matches regex
  function subTreeObj (currentLeaf, currentPath) {

    // for the current leaf, iterate over its matching directory
    var currentContents = exports.getDirContents(currentPath);
    _.each(currentContents, function (content) {
      if (!currentLeaf[content.name]) {
        currentLeaf[content.name] = {};
      }

      // if this is is a file, require it as a property of this leaf
      if (content.isJs && regEx.test(content.name + content.extension)) {
        currentLeaf[content.name] = require(content.path + '/' + content.name + content.extension);

      // if it's a directory, recurse
      } else if (!content.isFile) {
        subTreeObj(_.clone(currentLeaf[content.name], true), content.path + '/' + content.name);
      }
    });
  }

  return resultObj;
}


// returns the an array of directories and an array of files from an directory
exports.getDirContents = function (path) {
  var results = _.map(fs.readdirSync(path) || [], function (content) {
    if (!content) return;

    var match  = content.match(/(.*?)(\..*)$/) || []
    var result = {
      string    : path + '/' + content,
      name      : match[1] || content,
      path      : path,
      extension : match[2] || null,
      isJs      : /\.js$/.test(content),
      isFile    : !fs.statSync(path + '/' + (match[1] || content) + (match[2] || '')).isDirectory()
    };

    return result;
  });

  return results;
}