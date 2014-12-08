var bcrypt = require('bcrypt-nodejs');
var _      = require('lodash');
var Err    = require(process.cwd() + '/api/lib/error').errorGenerator;


//
// Standalone functions
//

// if the request contains a valid session cookie
exports.isValidSession = function (req) {
  var session    = req.session || {};
  var isSignedIn = !!(session && session.signedIn && session.hash);

  // verify the hash
  return isSignedIn && bcrypt.compareSync(sessionToSeed(session), session.hash);
}

//
// App middleware
//

// init req.signedIn, req.session, and res.setSession()
exports.primeSession = function (req, res, next) {
  req.session = req.cookies.ice_session;

  if (!req.session) {
    req.session = newSession();
    // res.cookie('ice_session', req.session, { secure: true }); // not being set for some reason :(
    res.cookie('ice_session', req.session);
  }

  req.signedIn = function () {
    return exports.isValidSession(req);
  }

  // set session
  res.setSession = function (session, signedIn) {
    var sessionObj = newSession();

    // convert the user/session if one was passed in
    if (session) {
      sessionObj.username = session.username;
      sessionObj.email    = session.email;
      sessionObj.signedIn = signedIn;

      var hashSeed = sessionToSeed(sessionObj);
      sessionObj.hash = bcrypt.hashSync(hashSeed, bcrypt.genSaltSync());
    }

    res.cookie('ice_session', sessionObj);
  }

  return next();
}


//
// Route middleware
//

// if no session is found, return 401
exports.requireSession = function (req, res, next) {
  var result = exports.isValidSession(req) ? null : Err('Must be signed in to view this page', null, 401);
  return next(result);
}


//
// Helpers
//

// extract important values from the session for hashing purposes
function sessionToSeed (session) {
  return [session.username, session.email, session.issued, session.signedIn].toString();
}

// generate a generic empty session
function newSession (seed) {
  return _.defaults(seed || {}, {
    username : null,
    email    : null,
    signedIn : false,
    issued   : new Date().toString(),
    hash     : null
  });
}