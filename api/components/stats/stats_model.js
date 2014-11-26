var mongoose = require('mongoose');

var statsSchema = new Schema({
  username     : String,
});

module.exports = mongoose.model('stats', statsSchema);