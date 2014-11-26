var fs = require('fs');

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
