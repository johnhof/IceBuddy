var regexSet = require(process.cwd() + '/api/lib/regex_set');
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('player', {
  email      : Mongoman('Email').string().required().matches(regexSet.email).fin(),
  password   : Mongoman('Password').string().required().matches(regexSet.password).fin(),
  username   : Mongoman('User name').string().required().isAlphaNum().isLength([3, 50]).fin(),
  registered : Mongoman().date().required().default(Date.now).fin(),
  name       : {
    first : Mongoman('First name').string().required().isAlphaNum().isLength([1, 50]).fin(),
    last  : Mongoman('Last name').string().required().isAlphaNum().isLength([1, 50]).fin()
  }

  //
  // TODO: flesh out schema
  //

});