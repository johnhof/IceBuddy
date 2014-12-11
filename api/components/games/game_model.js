var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('game', {
  game_id: Mongoman('Game Id').number().required().unique().fin(),
  //Array of teams involved in the game
  teams : []
  //This the season id this game belongs to
  seasons : Mongoman('Season Id').number().required().unique().fin(),
  //Array of player ids
  players : [],
  //Array of Stats objects
  stats   : [],
  //Array of ref ids
  refs   : [],
  



});