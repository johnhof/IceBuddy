var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');
var schema  = require('../schema');

module.exports = function parse (host, next) {
  var result = schema.apply('base', {
    name : 'Ice Castle Arena',
    location: {
      coordinates : [40.366090, -80.026582]
    }
  })

  async.parallel([
    function skateTimes (callback) {
      request({
        uri : 'http://' + host + '/skating/public/'
      }, function (error, response, body) {
        var $ = cheerio.load(body);

        var $timeCol = $('.content .one_half');

        return callback();
      });
    },
  ], function aggregate (error) {
    return next(error, result);
  });
}