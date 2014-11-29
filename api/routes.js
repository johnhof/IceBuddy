var _ = require('lodash');

//
// Register
//

exports.register = function  (api) {
  
  // 
  // Helpers
  //



  function controller (name) {
    var componentDir = process.cwd() + '/api/components/';
    return require(componentDir + name + '/' + name + '_ctrl')(api);
  }

  function mapRoute (route, controller) {
    // NOTE: this setup is in place to allow injection of middleware before and after the handler
    if (controller.create) { api.post(route, init, controller.create, respond); }
    if (controller.read) { api.get(route, init, controller.read, respond); }
    if (controller.update) { api.put(route, init, controller.update, respond); }
    if (controller.destroy) { api.del(route, init, controller.destroy, respond); }
  }

  //
  // Routes
  //

  // Home
  mapRoute('/', controller('home'));

  // Session
  mapRoute('/session', controller('session'));

  // Account
  mapRoute('/account', controller('account'));

  // Statistics
  mapRoute('/stats', controller('stats'));

  // Times
  mapRoute('/times', controller('times'));



  //
  // MiddleWare
  //

  function init (req, res, next) {
    res.data = {};
    return next();
  }

  function respond (req, res, next) {
    console.log('responding')
    if (res.data && Object.keys(res.data).length) {
      console.log('sending json')
      res.json(res.data);
    } else {
      res.send(200);
    }
  }
}