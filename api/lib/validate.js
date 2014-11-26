
//
// Take a joi schema object and pass the minimal object to the callback
//
module.exports = function (joiObj, input, callback) {
  var schema = Joi.object().keys(joiObj);

  Joi.validate(req.body, schema, function (error, value) {
    
    return callback(err, value);
  });
}