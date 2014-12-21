var regexSet = require(process.cwd() + '/api/lib/validate').regex;
var Mongoman = require(process.cwd() + '/api/lib/mongoman');
var bcrypt   = require('bcrypt-nodejs');

module.exports = Mongoman.register('account', {
  email      : Mongoman('Email').string().required().unique().matches(regexSet.email).fin(),
  password   : Mongoman('Password').string().required().fin(),
  nickname   : Mongoman('Nickname').string().required().unique().alphanum().isLength([3, 50]).fin(), // display name
  registered : Mongoman().date().required().default(Date.now).fin(),
  name       : {
    first : Mongoman('First name').string().required().alphanum().isLength([1, 50]).fin(),
    last  : Mongoman('Last name').string().required().alphanum().isLength([1, 50]).fin()
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