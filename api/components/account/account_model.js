var regexSet = require(process.cwd() + '/api/lib/regex_set');
var mongoMan = require(process.cwd() + '/api/lib/mongo_man');

var build = mongoMan.build;
module.exports = mongoMan.register('account', {
  email      : build('Email').string().required().isAlphaNum().fin(),
  password   : build('Password').string().required().matches(regexSet.password).fin(),
  username   : build('User name').string().required().isAlphaNum().isLength([3, 50]).fin(),
  registered : build().date().required().fin(),
  name       : {
    first : build('First name').string().required().isAlphaNum().isLength([1, 50]).fin(),
    last  : build('Last name').string().required().isAlphaNum().isLength([1, 50]).fin()
  }
});