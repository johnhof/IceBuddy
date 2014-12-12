var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('game', {
  game_id: Mongoman('Game Id').number().required().unique().fin(),
  home_team_id: Mongoman('Home Team Id').number().required().fin(),
  away_team_id: Mongoman('Away Team Id').number().required().fin(),
  //This the season id this game belongs to
  seasons : Mongoman('Season Id').number().required().fin(),
  //Array of player ids
  home_players : Mongoman('Home Team Players').array().fin(),
  away_players : Mongoman('Away Team Players').array().fin(),
  //Array of ref ids
  refs : Mongoman('Referees').array().fin(),
  home_team_score: Mongoman('Home Team score').number().required().fin(),
  away_team_score: Mongoman('Away Team score').number().required().fin(),
  game_time:  Mongoman('Game time').string().required().fin()

});