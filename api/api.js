var express      = require('express');
var mongoose     = require('mongoose');
var routes       = require(process.cwd() + '/api/routes');
var helpers      = require(process.cwd() + '/api/lib/helpers');
var session      = require(process.cwd() + '/api/lib/session');
var errorHandler = require(process.cwd() + '/api/lib/error').errorHandler;
var http         = require('http');
var json         = require('express-json');
var bodyParser   = require('body-parser');
var colors       = require('colors');
var cookieParser = require('cookie-parser')


//
// Config parsing
//


var confFile = process.cwd() + '/api/config.json';
var config   = helpers.parseJsonFile(confFile);

if (!config || config._error) {
  config = config || {
    _error : {
      summary : 'Something\'s gone horribly wrong',
      detials : 'head for the hills'
    }
  };
  console.error(('\nEncountered and error: ' + config._error.summary).red);
  console.error('\nDetails: ' + config._error.details + '\n');
  return;
}

//
// express setup
//


var api = express();

api.use(json());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());
api.use(cookieParser());
api.use(session.primeSession);

api.set('port', config.port);

api.config = config;

//
// MongoDB setup (globals)
//

mongoose.connection.on("open", function (ref) {
  console.log("\nConnected to mongo server!\n".blue);
  listen();
});

mongoose.connection.on("error", function (err) {
  console.log("\n!! Could not connect to mongo server !! \n    Try running `[sudo] mongod` in another terminal\n".red);
  process.kill();
});

var dbHost = 'mongodb://localhost/database'
db = mongoose.connect(dbHost)

// register models
helpers.requireDirContent(process.cwd() + '/api/components', /_model.js/i)


//
// Register routes
//

// prime routes
api.use(function init (req, res, next) {
  res.data = {};

  console.log('  ' + (req.method).cyan.dim + ' ' + (req.url).grey.dim)

  //set headers
  res.set({
    'Content-Type': 'application/json' // TODO: Get this to work for errors!!!
  });

  return next();
});

routes.register(api);

//
// Register error handler
//

// expect {error : 'string', status : 'status code', details : 'object'}
api.use(errorHandler);


//
// mixins
//

require(process.cwd() + '/api/lib/validate');

//
// Start server when mongo is connected
//
function listen () {
  http.createServer(api).listen(api.get('port'), function() {
   console.log(('++++++++ API server listening on port ').green + api.get('port') + (' ++++++++\n').green);
  });
}