var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('player', {
  preferred_number : Mongoman('Preferred Number').number().required().fin(),

  registered : Mongoman().date().required().default(Date.now).fin(),
  name       : {
    first : Mongoman('First name').string().required().alphanum().isLength([1, 50]).fin(),
    last  : Mongoman('Last name').string().required().alphanum().isLength([1, 50]).fin()
  },
  //List of teams player is associated with
  teams   : Mongoman('Teams').default([]).array().fin(),
  //account object (embedded)
  account : {},
  // List of game ids this user has participated in
  games : Mongoman('Games').default([]).array().fin()
});