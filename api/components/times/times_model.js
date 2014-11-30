var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('times', {
  times : Mongoman('Times').array().fin(),
  type  : Mongoman('Type').string().fin(),
  cost  : Mongoman('Cost').string().fin(),
  teams : Mongoman('Teams').array().fin(),
  host  : Mongoman('Host').string().fin()
});