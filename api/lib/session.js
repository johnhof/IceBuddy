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
  var isSignedIn = !!(session && session.isSignedIn && session.hash);

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
  }

  req.isSignedIn = exports.isValidSession(req)

  // set session
  res.setSession = function (session, isSignedIn) {
    var sessionObj = newSession();

    // convert the user/session if one was passed in
    if (session) {
      sessionObj.nickname = session.nickname;
      sessionObj.email    = session.email;
      sessionObj.isSignedIn = isSignedIn;

      var hashSeed = sessionToSeed(sessionObj);
      sessionObj.hash = bcrypt.hashSync(hashSeed, bcrypt.genSaltSync());
    }

    res.clearCookie('session');
    res.cookie('session', sessionObj);
  }

  return next();
}


//
// Route middleware
//

// if no session is found, return 401
exports.requireSession = function (req, res, next) {
  var result = exports.isValidSession(req) ? null : Err.noAuth('Must be signed in to view this page');
  return next(result);
}


//
// Helpers
//

// extract important values from the session for hashing purposes
function sessionToSeed (session) {
  return [session.username, session.email, session.issued, session.isSignedIn, server_secret].toString();
}

// generate a generic empty session
function newSession (seed) {
  return _.defaults(seed || {}, {
    username   : null,
    email      : null,
    isSignedIn : false,
    issued     : new Date().toString(),
    hash       : null
  });
}