var regexSet = require(process.cwd() + '/api/lib/regex_set');
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('league', {
  name : Mongoman('Name').string().required().isAlphaNum().isLength([3, 50]).fin()

  //
  // TODO: flesh out schema
  //
  
});