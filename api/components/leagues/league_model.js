var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mon      = require('mongoman');

module.exports = Mon.register('league', {
  name : Mon('Name').string().required().alphanum().min(3).max(50).fin()

  //
  // TODO: flesh out schema
  //

});