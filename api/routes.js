var _ = require('lodash');

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
  routeCrud('/account', controller('account'));

  // Leagues
  routeCrud('/leagues', controller('leagues'));
  routeCrud('/leagues/:leagueId', controller('leagues.league'));

  // Players
  routeCrud('/players', controller('players'));
  routeCrud('/players/:playerId', controller('players.player'));

  // Session
  routeCrud('/session', controller('session'));

  // Teams
  routeCrud('/teams', controller('teams'));
  routeCrud('/teams/:teamId', controller('teams.team'));



  //
  // MiddleWare
  //


  function init (req, res, next) {
    res.data = {};
    return next();
  }

  function respond (req, res, next) {
   res.setHeader('Content-Type', 'application/json'); // TODO: get this to actually work
    if (res.data && Object.keys(res.data).length) {
      res.json(res.data);
    } else {
      res.send(200);
    }
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
    if (controller.create) { api.post(route, init, controller.create, respond); }
    if (controller.read) { api.get(route, init, controller.read, respond); }
    if (controller.update) { api.put(route, init, controller.update, respond); }
    if (controller.destroy) { api.delete(route, init, controller.destroy, respond); }
    if (controller.search) { api.get(route, init, controller.search, respond); } // TODO: make this relevant
  }
}