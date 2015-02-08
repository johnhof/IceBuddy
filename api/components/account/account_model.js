var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mon = require('mongoman');
var bcrypt   = require('bcrypt-nodejs');

module.exports = Mon.register('account', {
  email      : Mon('Email').string().required().unique().regex(regexSet.email).fin(),
  password   : Mon('Password').string().required().fin(),
  nickname   : Mon('Nickname').string().required().unique().alphanum().min(3).max(50).fin(), // display name
  registered : Mon().date().required().default(Date.now).fin(),
  name       : {
    first : Mon('First name').string().required().alphanum().min(1).max(50).fin(),
    last  : Mon('Last name').string().required().alphanum().min(1).max(50).fin()
  }
}, {

  middleware : {

    // save
    save : {
      pre : function (callback) {
        if (this.isModified('password'))  {
          this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
        }

        return callback();
      }
    }
  },

  methods : {
    //compare password
    comparePassword : function(submitted, callback) {
      var result = bcrypt.compareSync(submitted, this.password);
      return callback(null, result);
    }
  }
});