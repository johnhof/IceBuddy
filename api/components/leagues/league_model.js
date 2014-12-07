var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('league', {
  name : Mongoman('Name').string().required().alphanum().isLength([3, 50]).fin()

  //
  // TODO: flesh out schema
  //

});