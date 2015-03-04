var fs = require('fs');
var _  = require('lodash');

//////////////////////////////////////////////////////////////////////////////////
//
// Helpers
//
//////////////////////////////////////////////////////////////////////////////////


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

//////////////////////////////////////////////////////////////////////////////////
//
// Mixins
//
//////////////////////////////////////////////////////////////////////////////////

//
// String
//

// To Name
//
// split on the first space, returing the properties [`first`, `last`, `full`]
String.prototype.toName = function () {
  var self = this.trim();
  var spaceIndex = self.indexOf(' ');

  return {
    full  : self,
    first : ~spaceIndex ? self.substr(0, spaceIndex) : self,
    last  : ~spaceIndex ? self.substr(spaceIndex + 1) : undefined
  }
}