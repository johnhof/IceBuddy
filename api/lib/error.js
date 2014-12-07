var _ = require('lodash');

//
// Error generator
//
exports.errorGenerator = function (seed, details, status) {

  // allow joi errors to pass in directly
  if ((seed.message && seed._object) || seed.type === 'joi') {

    var existingErrors = {}; // keep trak of existing errors to avoid dupes
    details = _.compact(_.map(seed.details, function (err, index) {
      if (existingErrors[err.path]) { return; }

      existingErrors[err.path] = true;

      // shorthand these required errors for now. we may need to create more specific messaging later
      err.message = err.message.replace(/fails to match the required pattern/, 'is invalid');

      return {
        path    : err.path,
        message : err.message
      }
    }));

    seed = seed.name;
  }


  // allow mongoose errors to pass in directly
  if ((seed.message && !details) || seed.type === 'mongoose') {
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
    details : details || null
  };
}

//
// middleware error handler
//
exports.errorHandler = function (error, req, res, next) {
  // catch and handle raw joi errors
  if (error instanceof Error && error.name === 'ValidationError') {
    error.type = 'joi'
    error = exports.errorGenerator(error);
    return sendErr(error);

  } else if (error && !(error instanceof Error)) {

    // catch and handle raw mongoose errors
    if (error.message && !error.details) {
      error.type = 'mongoose'
      error = exports.errorGenerator(error);
    }

    return sendErr(error);

  } else {
    sendErr({
      error   : 'Internal server error'
    });
    console.log('\n')
    throw (error);
  }


  function sendErr (err) {
    res.json(err.status || 500, {
      error   : err.error || 'Could not process request',
      details : err.details || null
    });
  }
}