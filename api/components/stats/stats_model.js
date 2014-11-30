var mongoMan = require(process.cwd() + '/api/lib/mongo_man');

var build = mongoMan.build;

module.exports = mongoMan.register('stats' ,{
  username : build('Username').string().fin(),
});