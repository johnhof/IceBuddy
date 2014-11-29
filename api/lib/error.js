//
// Error generator
//
exports.errorGenerator = function (title, details, status) {
  return {
    error   : 'Could not process request' || title,
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