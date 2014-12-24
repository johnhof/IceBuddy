var _       = require('lodash');
var session = require(process.cwd() + '/api/lib/session');

//
// Register
//

exports.register = function  (api) {

  //
  // Routes
  //

  //
  // Generic CRUDS routes
  //

  // Home
  routeCrud('/', controller('home'));

  // Account
  var accountCtrl = controller('account')
  api.get('/session', session.requireSession, accountCtrl.read, respond);
  api.put('/session', session.requireSession, accountCtrl.update, respond);
  routeCrud('/account', controller('account'));

  // Leagues
  routeCrud('/leagues', controller('leagues'));
  routeCrud('/leagues/:leagueId', controller('leagues.league'));

  // Players
  routeCrud('/players', controller('players'));
  routeCrud('/players/:playerId', controller('players.player'));

  // Session
  var sessionCtrl = controller('session')
  api.get('/session', session.requireSession, sessionCtrl.read, respond);
  routeCrud('/session', controller('session'));

  // Teams
  routeCrud('/teams', controller('teams'));
  routeCrud('/teams/:teamId', controller('teams.team'));
  routeCrud('/teams/:teamId/roster', controller('teams.roster'));



  //
  // MiddleWare
  //


  function respond (req, res, next) {
    res.status(200).send(res.data);
  }


  //
  // Helpers
  //


  function controller (path) {
    var pathSplit    = path.split('.');
    var ctrl         = pathSplit[pathSplit.length - 1]
    var truePath     = pathSplit.join('/')
    var componentDir = process.cwd() + '/api/components/';
    return require(componentDir + truePath + '/' + ctrl + '_ctrl')(api);
  }

  function routeCrud (route, controller) {
    // NOTE: this setup is in place to allow injection of middleware before and after the handler
    if (controller.create) { api.post(route, controller.create, respond); }
    if (controller.read) { api.get(route, controller.read, respond); }
    if (controller.update) { api.put(route, controller.update, respond); }
    if (controller.destroy) { api.delete(route, controller.destroy, respond); }
    if (controller.search) { api.get(route, controller.search, respond); } // TODO: make this relevant
  }
}