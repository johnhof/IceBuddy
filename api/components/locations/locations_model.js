var Mongoman = require(process.cwd() + '/api/lib/mongoman');

// Time schemas

var day   = {
  notes : Mongoman().string().fin(),
  hours : [Mongoman.schema({
    text  : Mongoman().string().fin(),
    start : Mongoman().string().fin(),
    end   : Mongoman().string().fin(),
    notes : Mongoman().string().fin()
  })]
}

var timeSet = {
  monday    : day,
  tuesday   : day,
  wednesday : day,
  thursdat  : day,
  friday    : day,
  sadurday  : day,
  sunday    : day,
  notes     : Mongoman().array().fin()
};

// Full schema
module.exports = Mongoman.register('times', {
  name  : Mongoman('Name').string().required().fin(),
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
    type: Mongoman('Type').string().default('Point').required().enum(['Point', 'LineString', 'Polygon']).fin(),
    coordinates: [Number]
  }  
}, { 
  index : {
    location: '2dsphere'
  }
});