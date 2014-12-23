var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('team', {
  name : Mongoman('Team name').string().required().isLength([1, 50]).fin(),
  //(http://docs.mongodb.org/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/)
  //This will be an array of season ids
  seasons : Mongoman('Seasons').array().fin(),
  players : Mongoman('Team Players').array().fin(),
  //Array of player ids
  captains : Mongoman('Captains').array().fin(),
  //Array of user ids
  managers : Mongoman('Managers').array().fin()
});