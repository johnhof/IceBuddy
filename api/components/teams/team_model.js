var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('team', {
  name : Mongoman('First name').string().required().alphanum().isLength([1, 50]).fin()

  //
  // TODO: flesh out schema
  //

});