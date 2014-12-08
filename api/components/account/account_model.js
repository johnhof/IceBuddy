var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('account', {
  email      : Mongoman('Email').string().required().unique().matches(regexSet.email).fin(),
  password   : Mongoman('Password').string().required().fin(),
  username   : Mongoman('User name').string().required().unique().alphanum().isLength([3, 50]).fin(), // display name
  registered : Mongoman().date().required().default(Date.now).fin(),
  name       : {
    first : Mongoman('First name').string().required().alphanum().isLength([1, 50]).fin(),
    last  : Mongoman('Last name').string().required().alphanum().isLength([1, 50]).fin()
  }

  //
  // TODO: flesh out schema
  //

});