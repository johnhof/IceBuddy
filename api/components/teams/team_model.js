var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('team', {
  team_id: Mongoman('Team Id').number().required().unique().isLength([1, 50]).fin(),
  name : Mongoman('Team name').string().required().alphanum().isLength([1, 50]).fin(),
  //(http://docs.mongodb.org/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/)
  //This will be an array of season ids
  seasons : [],
  players : [],
  //Array of player ids
  captains : [],
  //Array of user ids
  managers : []


});