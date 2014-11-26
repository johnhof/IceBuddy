var mongoose = require('mongoose');

var timesSchema = new Schema({
  times : Array,
  type  : String,
  cost  : String,
  teams : Array,
  host  : String
});

module.exports = mongoose.model('times', timesSchema);