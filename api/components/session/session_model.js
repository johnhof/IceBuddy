var mongoose = require(process.cwd() + '/api/lib/mongo_manager');
var Message  = newModel({
  email     : String,
  userName  : String,
  regitered : Date,
  teams     : Array,
  name      : {
    first : String,
    last  : String,
  }
});