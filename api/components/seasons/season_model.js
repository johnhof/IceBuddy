var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('season', {
  name    : Mongoman('Season Name').string().required().isLength([1, 50]).fin(),
  league  : Mongoman('League Name').string().required().isLength([1, 50]).fin(),
  // List of game ids this season
  games : Mongoman('Games').default([]).array().fin(),

  created : Mongoman().date().required().default(Date.now).fin(),
  

});