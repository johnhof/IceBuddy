var regexSet = require(process.cwd() + '/api/lib/regex_set');
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('team', {
  name : Mongoman('First name').string().required().isAlphaNum().isLength([1, 50]).fin()

  //
  // TODO: flesh out schema
  //

});