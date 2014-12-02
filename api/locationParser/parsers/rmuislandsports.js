var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');
var schema = require('../schema');



module.exports = function parse (host, next) {
  var result = schema.apply('base', {
    name : 'RMU Island Sports Center',
    location: {
      coordinates : [40.51917, -80.15234]
    }
  })

  async.parallel([
    function skateTimes (callback) {
      request({
        uri : 'http://' + host + '/public-skating'
      }, function (error, response, body) {
        var $ = cheerio.load(body);

        return callback();
      });
    },

    function stickAndPickupTimes (callback) {
      request({
        uri : 'http://' + host + '/hockey/ice-hockey-stick-time-pickup'
      }, function (error, response, body) {
        var $ = cheerio.load(body);

        require('fs').writeFileSync('/tmp/test2.html', body);

        return callback();
      });
    },

  ], function aggregate (error) {
    return next(error, result);
  });
}