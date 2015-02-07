var config       = require('config.json')();
var express      = require('express');
var routes       = require(__dirname + '/api/routes');
var helpers      = require(__dirname + '/api/lib/helpers');
var Err          = require(__dirname + '/api/lib/error');
var json         = require('express-json');
var bodyParser   = require('body-parser');
var colors       = require('colors');
var mon          = require('mongoman');
var server       = express();


//////////////////////////////////////////////////////////////////////////////////
//
// Initial setup
//
//////////////////////////////////////////////////////////////////////////////////

server.config = config;
server.use(json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

console.log('\n\n++++  starting server  ++++'.yellow + '\n');

//////////////////////////////////////////////////////////////////////////////////
//
// connect to mongo
//
//////////////////////////////////////////////////////////////////////////////////


mon.goose.connection.on("open", function (ref) {
  console.log("\n  Connected to mongo server!\n".blue);
  setupServer();
});

mon.goose.connection.on("error", function (err) {
  console.log("\n!! Could not connect to mongo server !! \n    Try running `[sudo] mongod` in another terminal\n".red);
  process.kill();
});

var dbInstance = process.env.NODE_ENV === 'production' ? config.db.prod : config.db.dev;
mon.connect(dbInstance);


// register models
helpers.requireDirContent(__dirname + '/api/components', /_model.js/i)


//////////////////////////////////////////////////////////////////////////////////
//
// Set up express server
//
//////////////////////////////////////////////////////////////////////////////////


function setupServer () {
  // static deliverly
  for (staticDir in config.staticMap) {
    server.use(staticDir, express.static(__dirname + config.staticMap[staticDir]));
  }

  // prime routes to set headers and log out route details
  server.use(function init (req, res, next) {
    res.data = {};

    console.log('  ' + (req.method).cyan.dim + ' ' + (req.url).grey.dim)

    res.set({ 'Content-Type': 'application/json' });

    return next();
  });

  // register API routes
  routes.register(server);

  // register error handler
  server.use(Err.errorHandler);

  // any route not used by the API should return the standart page
  server.get('*', function (req, res) {
    res.set({ 'Content-Type': 'text/html; charset=utf-8' });
    res.sendFile(__dirname + '/dist/index.html');
  });

  //
  //start server
  //
  server.listen(config.port);
  console.log('\n  Listening on port '.green + (config.port + '').blue + '\n');
}