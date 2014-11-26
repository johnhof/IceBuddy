var mongoose = require('mongoose');

var accountSchema = new Schema({
  email     : String,
  password  : String,
  username  : String,
  registered : Date,
  name      : {
    first : String,
    last  : String
  }
});

module.exports = mongoose.model('account', accountSchema);