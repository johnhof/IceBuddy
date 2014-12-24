var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = Mongoman.register('stat', {
  player_id: Mongoman('Team Id').number().required().unique().fin(),
  //For historic stacts we could just use 0
  game_id: Mongoman('Game Id').number().required().fin(),
  goals : Mongoman('Goals').number().required().fin(),
  assists : Mongoman('Assists').number().required().fin(),
  
  plus_minus : Mongoman('Plus Minus').number().required().fin(),
  pim : Mongoman('Penalties In Minutes').number().required().fin(),
  ppg : Mongoman('Power Play Goals').number().required().fin(),
  ppa : Mongoman('Power Play Assists').number().required().fin(),
  shg : Mongoman('Short Handed Goals').number().required().fin(),
  sha : Mongoman('Short Handed Assists').number().required().fin(),
  gwg : Mongoman('Game Winning Goal').number().required().fin(),
  otg : Mongoman('Overtime Goal').number().required().fin(),
  shots : Mongoman('Shots').number().required().fin(),
  fot : Mongoman('Face Offs Taken').number().required().fin(),
  fow : Mongoman('Face Offs Won').number().required().fin(),

  //Goalie stuff as well
   win : Mongoman('Win').number().required().fin(),  
   loss : Mongoman('Loss').number().required().fin(),  
   otl : Mongoman('Overtime Loss').number().required().fin(),  
   tie : Mongoman('Tie').number().required().fin(),  
   sa : Mongoman('Shots Against').number().required().fin(),  
   ga : Mongoman('Goals Allowed').number().required().fin(),  
   so : Mongoman('Shut Out').number().required().fin(),

  //No Total Points, PPG, Shots (calculated field)

  // Saves, Sv Pct are also calculated

});