var bcrypt = require('bcrypt-nodejs');
var _      = require('lodash');
var Err    = require(process.cwd() + '/api/lib/error').errorGenerator;


//
// Setup functions
//

var server_secret = bcrypt.hashSync((new Date()).toString() + 'here\'s some more entropy for you', bcrypt.genSaltSync());

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
  req.session = req.cookies.session;

  if (!req.session) {
    req.session = newSession();
    res.cookie('session', req.session);
  }

  req.isSignedIn = exports.isValidSession(req)

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

    res.cookie('session', sessionObj);
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
  return [session.username, session.email, session.issued, session.signedIn, server_secret].toString();
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