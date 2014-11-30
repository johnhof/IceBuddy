var mongoMan = require(process.cwd() + '/api/lib/mongo_man');

var build = mongoMan.build;

module.exports = mongoMan.register('times', {
  times : build('Times').array().fin(),
  type  : build('Type').string().fin(),
  cost  : build('Cost').string().fin(),
  teams : build('Teams').array().fin(),
  host  : build('Host').string().fin()
});