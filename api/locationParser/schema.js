var _ = require('lodash');

var schema = {
  base : function  () {
    var day = {
      notes : [],
      hours : []
    };

    var timeSet = {
      monday    : day,
      tuesday   : day,
      wednesday : day,
      thursdat  : day,
      friday    : day,
      sadurday  : day,
      sunday    : day,
      notes     : [],
      rates     : []
    };

    return {
      name  : null,
      times : {
        skate : timeSet,
        ice : {
          stick  : timeSet,
          pickup : timeSet,
        },
        roller : {
          stick  : timeSet,
          pickup : timeSet,
        }
      },
      location : {
        coordinates: []
      }  
    };
  },
  hours : function () {
    return {
      text  : null,
      start : null,
      end   : null,
      notes : null
    }
  },
  apply : function (schemaName, obj) {
    schemaObj = schema[schemaName]();
    return _.defaults(obj, schemaObj);
  }
}

module.exports = schema;