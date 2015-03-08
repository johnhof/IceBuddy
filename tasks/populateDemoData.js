var async = require('async');
var _ = require('lodash');
var colors = require('colors');
var Mon = require('mongoman');
var mongoose = require('mongoose');

//Initialize connection ...
Mon.connect();

// register mixins
require(__dirname + '/../api/lib/mongo_mixins');

//Register all of the models
Mon.registerAll(__dirname + '/../api/components', /_model$/i);


//Utility Functions
var Player   = Mon.model('player');
var Team     = Mon.model('team');
var Season   = Mon.model('season');
var Game     = Mon.model('game');
var Stat     = Mon.model('stat');

function createPlayer ( player, callback ) {
  console.log('Creating Player ... ');
  if ( player && player.name && player.preferred_number ) {
    Player.create(player, function(error, data){
      if( error ) {
        return callback(error);
      } else {
        return callback(null, data);
      }
    });
  } else {
    return callback("Did not receive proper player data");
  }
}

function createTeam ( team, callback ) {
  console.log('Creating team ... ');
  if ( team && team.name ) {
    Team.create(team, function (error, data){
      if( error ) {
        return callback(error);
      } else {
        return callback(null, data);
      }
    });
  } else {
    return callback("Did not receive proper Team data");
  }
}

function addPlayersToTeam (teamPlayers, callback ) {
  console.log('Adding Players to team ... ');
  if ( teamPlayers.team && teamPlayers.players && teamPlayers.players.length ) {
    teamPlayers.team.addPlayerIds( teamPlayers.players, function (error, data ) {
      return callback(error);
    });
  } else {
    return callback("Did not receive proper Team or Players");
  }
}

function createSeason ( season, callback ) {
  console.log('Creating Season ... ');
  if ( season && season.name ) {
    Season.create(season, function (error, data){
      if( error ) {
        return callback(error);
      } else {
        return callback(null, data);
      }
    });
  } else {
    return callback("Did not receive proper season data");
  }
}

function createGame (teams, season, callback) {
  console.log('Creating Game ... ');
  var coinFlip = Math.floor(Math.random() * 2);
  var homeTeam = teams[coinFlip];
  var awayTeam = teams[+!coinFlip];
  var homeScore = Math.floor(Math.random() * 5) + 1;
  var awayScore = Math.floor(Math.random() * 5) + 1;

  var dateRandom = Math.floor(Math.random() * 28) + 1;

  var gameDate  = new Date('2015-2-' + dateRandom + ' 20:30 EST').getTime();

  var game = {
    home : {
      team : homeTeam['_id'],
      players : homeTeam.players,
      score   : homeScore
    },
    away : {
      team : awayTeam['_id'],
      players : awayTeam.players,
      score   : awayScore
    },
    season_id : season['_id'],
    date_time : gameDate
  };


  Game.create(game, function (error, data){
    if( error ) {
      return callback(error);
    } else {
      return callback(null, data);
    }
  });

}


// Populate the database
module.exports = function(grunt) {


  grunt.registerTask('populateDemoData', 'Populating the database...', function(){
    var players = [
      {
        name : {
          first : 'Seb',
          last  : 'DonorTEST'
        },
        preferred_number : '54'
      },
      {
        name : {
          first : 'Duane',
          last  : 'GooberTEST'
        },
        preferred_number : 13
      },
      {
        name : {
          first : 'Zack',
          last  : 'ZebakrakenTEST'
        },
        preferred_number : 77
      },
      {
        name : {
          first : 'John',
          last  : 'HasslehoffTEST'
        },
        preferred_number : 15
      },
      {
        name : {
          first : 'Todd',
          last  : 'BootmakerTEST'
        },
        preferred_number : 30
      },
      {
        name : {
          first : 'Gabe',
          last  : 'NewellTEST'
        },
        preferred_number : 69
      },
      {
        name : {
          first : 'Shane',
          last  : 'KullmenTEST'
        },
        preferred_number : 16
      },
      {
        name : {
          first : 'Charles',
          last  : 'OrpikTEST'
        },
        preferred_number : 44
      },
      {
        name : {
          first : 'Tony',
          last  : 'SavereTEST'
        },
        preferred_number : 39
      },
      {
        name : {
          first : 'George',
          last  : 'GoalieTEST'
        },
        preferred_number : 1
      }
    ];

    var teams = [
      {
        name : "Puck Buddies TEST"
      },
      {
        name : "Other Guys TEST"
      }
    ];

    var seasons = [
      {
        name : 'Winter 15 TEST',
        league : 'E league TEST'
      }
    ];

    var done = this.async();

    //Create Players
    async.map(players, createPlayer, function (err, players){
      if ( err ) {
        return done(err);
      }

      //Create Teams
      async.map(teams, createTeam, function ( err, teams ) {
        if ( err ) {
          return done(err);
        }

        // var chunkedPlayers = _.chunk(players, 5);
        var teamPlayers = [];

        //Groups Players and Teams
        teams.forEach(function ( team, index ){
          teamPlayers.push({
            team : team,
            players : players.slice( (0 + index) * 4, (5 + (index * 4) ) )
          });
        });

        //Add Players to team (using each, cause we dont need the results)
        async.each(teamPlayers, addPlayersToTeam, function (err) {
          if ( err ) {
            return done(err);
          }

          //Create Seasons
          async.map(seasons, createSeason, function ( err, seasons ) {
            if ( err ) {
              return done(err);
            }

            var season = seasons[0];

            async.parallel([
              function (callback) {
                createGame(teams, season, callback);
              },
              function (callback) {
                createGame(teams, season, callback);
              },
              function (callback) {
                createGame(teams, season, callback);
              },
              function (callback) {
                createGame(teams, season, callback);
              },
              function (callback) {
                createGame(teams, season, callback);
              }
            ],
            function (err, games) {
              if ( err ) {
                return done(err);
              }

              console.log('Data Populated Succesfully'.green);

              return done(null);
            });
          });
        });
      });
    });
  });
}