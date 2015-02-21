var async = require('async');
var Mon = require('mongoman');
var helpers = require(process.cwd() + '/api/lib/helpers');

helpers.requireDirContent(process.cwd() + '/api/components/', /.+_model/)
//Utility Functions
var Player = Mon.model('player');
var mongoose        = require('mongoose');

// if ( process.argv[2] ) {
//   switch(process.argv[2]):
//     case 'populateDemoData':
populateDemoData();
//       break;
//     case 'cleanPopulateDemoData':
//       cleanPopulateDemoData();
//       break;
// }



var playerIds = [];

function populateDemoData() {
  return function () {
    var players = [
      {
        name : {
          first : 'Seb',
          last  : 'Donovor'
        },
        preferred_number : 54
      },
      {
        name : {
          first : 'Duane',
          last  : 'Goober'
        },
        preferred_number : 13
      },
      {
        name : {
          first : 'Zack',
          last  : 'Zebakraken'
        },
        preferred_number : 77
      },
      {
        name : {
          first : 'Shane',
          last  : 'Kullmen'
        },
        preferred_number : 16
      },
      {
        name : {
          first : 'Todd',
          last  : 'Bootmaker'
        },
        preferred_number : 30
      },
      {
        name : {
          first : 'Gabe',
          last  : 'Newell'
        },
        preferred_number : 69
      },
      {
        name : {
          first : 'John',
          last  : 'Hasslehoff'
        },
        preferred_number : 15
      },
      {
        name : {
          first : 'Charles',
          last  : 'Orpik'
        },
        preferred_number : 44
      },
      {
        name : {
          first : 'Tony',
          last  : 'Savere'
        },
        preferred_number : 39
      },
      {
        name : {
          first : 'George',
          last  : 'Goalie'
        },
        preferred_number : 1
      }
    ];
    players.forEach(function (player) {
      console.log('WOOOO')
      Player.create(player, function(error, data){
        if( !error ) {
          console.log('WOOOO Adding Player ', data);
        } else {
          console.log('ERRR == ', error);
        }
      });
    });
  }
}