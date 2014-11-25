var mongoose = require('mongoose');

Schema = mongoose.Schema;

exports.newModel = function (name, schema) {
  // generate schema
  var newSchema = new Schema(schema);

  // register schema, and return it
  mongoose.model(name, MessageSchema); 
  return mongoose.model(name);
}