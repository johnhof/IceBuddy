var async = require('async');
var Mon = require('mongoman');
Mon.registerAll(__dirname + '/api/components', /_model$/i);
//Utility Functions
var Player   = Mon.model('player');
var mongoose = require('mongoose');

// if ( process.argv[2] ) {
//   switch(process.argv[2]):
//     case 'populateDemoData':
populateDemoData();
//       break;
//     case 'cleanPopulateDemoData':
//       cleanPopulateDemoData();
//       break;
// }


function createPlayer ( player, callback ) {
  console.log('NADE IT?')
  if ( player && player.name && player.preferred_number ) {
    console.log('1')
    Player.create(player, function(error, data){
      console.log('2')
      if( error ) {
        console.log('3')
        return callback(error);
      } else {
        console.log('WOOOO Adding Player ', data);
        return callback(null, data);
      }
    });
  } else {
    console.log('4')
    return callback("Did not receive proper player data");
  }
}


var playerIds = [];

function populateDemoData() {
  var players = [
    {
      name : {
        first : 'Seb',
        last  : 'Donor'
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

  console.log('OK')

  async.map(players, createPlayer, function(err, results){
    if ( err ) {
      console.log('ERRO ' + err)


      return "ERROR == " + err;
    }

    console.log('Result Count == ' + results.length);

  });

  console.log('OUT')
}