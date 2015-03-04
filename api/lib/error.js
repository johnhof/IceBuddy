var _ = require('lodash');

//
// Error generator
//
exports.errorGenerator = function (seed, details, status) {

  // allow joi errors to pass in directly
  if ((seed.message && seed._object) || seed.type === 'joi') {

    var existingErrors = {}; // keep track of existing errors to avoid dupes
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

// wrappers for convenience
exports.errorGenerator.notFound = function (seed, detail) { return exports.errorGenerator(seed || 'Content not found', detail, 404) }
exports.errorGenerator.unAuth = function (seed, detail) { return exports.errorGenerator(seed || 'You are not authorized to perform this action', detail, 401) }

//
// middleware error handler
//
exports.errorHandler = function (error, req, res, next) {
  if (error instanceof Error) {
    if (error.name === 'ValidationError') {
      // duck type the val error
      error.type = error.message && !error.details ? 'mongoose' : 'joi';
      return sendErr(exports.errorGenerator(error));

    } else {

      sendErr({
        error : 'Internal server error'
      });

      throw (error);
    }
  } else {
    return sendErr(error);
  }


  function sendErr (err) {
    var status = err.status || 500
    console.log('  ' + (req.method).cyan.dim + ' ' + (req.url).grey.dim + ' ' + ((status + '').red + ' - ' + (err.error || 'Could not process request').yellow));

    res.status(status).send({
      error   : err.error || 'Could not process request',
      details : err.details || null
    });
  }
}