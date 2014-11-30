var _ = require('lodash');

//
// Error generator
//
exports.errorGenerator = function (seed, details, status) {
  // allow mongoose errors to pass in directly
  if (seed.message && !details) {
    details = _.map(seed.errors, function (err, index) {
        // shorthand these required errors for now. we may need to create more specific messaging later
        if (/is required/.test(err.message)) {
          err.message = 'Required';
        }

        return {
          path    : err.path,
          message : err.message
        }
      });

    seed = seed.message;
  }

  return {
    error   : seed || 'Could not process request',
    status  : status || 400,
    details : details || {}
  };
}

//
// middleware error handler
//
exports.errorHandler = function (error, req, res, next) {
  if (error) {
    res.json(error.status || 500, {
      error   : error.error || 'Could not process request',
      details : error.details || null
    });

  } else {
    next();
  }
}