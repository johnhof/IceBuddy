var restify  = require('restify');  
var mongoose = require('mongoose');
var routes   = require(process.cwd() + '/api/routes');
var helpers  = require(process.cwd() + '/api/lib/helpers');


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
  console.error('\nEncountered and error: ' + config._error.summary);
  console.error('\nDetails: ' + config._error.details + '\n');
  return;
}

//
// RESTify setup
//


var api = restify.createServer(config.serverSettings);

api.use(restify.bodyParser());
api.use(restify.dateParser());
api.use(restify.queryParser());
api.config = config;


//
// MongoDB setup (globals)
//

// db = mongoose.connect({/* Mongoose Auth */})
Schema = mongoose.Schema;



//
// Register routes
//
routes.register(api);


//
// start listening
//

api.listen(config.port, function() {
  console.log(api.name + ' listening at ' + (api).url);
});