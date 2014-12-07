IceBuddy
========

Web service to compile and deliver local ice times (skate/stick time/pickup)


**Built from:** https://github.com/johnhof/simple_skeleton


Structure
=========

**API**

```

api.js // base script

config.json // configuration data

routes.js // route->controller mapping

>> lib // helpers, shared assets

>> components // models and controllers

  >>>> example

  ------ example_ctrl.js (C)

  ------ example_model.js (M) (IMPORTANT - all models `_model.js` are registered on server startup)

```

**App**

```

>> assets

  >>>> fonts

  >>>> images

  >>>> partials

  >>>> scripts

  >>>> styles

>> components

  >>>> example

    ---- example.html // (V)

    ---- example.scss

    ---- example_ctrl.js // (C)

>> core

  ---- app,js // angular setup and server management

  ---- app_congif // app configuration

  ---- index.html // main view container in which other views and partials are wrapped

  ---- router.js // mapping of routes to views

```

**Dist**

A collection of minified files made accessible to the client. This is where the actual Angular app runs. The App dir is for dev only

To Run
======

General
 * Requires MongoDB and Node
 * Clone and npm/bower install

App
* `grunt app` -> http://localhost:9000 
  * grunt will recompile portions of the server on save depending on the file type (eg: re-minify js)

API
* `npm install nodemon -g`
* `[sudo] mongod`
* `grunt api` -> http://localhost:8000
  * nodemon will restart the server for js changes


**Coming Soon**
* command line options

Useful grunt commands
=====================

`grunt clean:compiled` -> removes compiled code (./tmp, ./dist, ./sass_cache)

`grunt clean:modules` ->  removes node modules and bower components

API Specific
============

A few things are done automatically cut down on controller/model/router bloat:

**Routing and Controllers**

CRUD controllers can be added to the route file with internal helpers. useing `routeCrud('/', controller('home'))` will call `homeCtrl = require(process.cwd() + '/home/home_ctrl')(api)` then map the following routes automatically, **IF** the handler is defined in the controller

 * `POST /` -> `homeCtrl.create(req, res, next)`
 * `GET /` -> `homeCtrl.read(req, res, next)`
 * `PUT /` -> `homeCtrl.update(req, res, next)`
 * `DELETE /` -> `homeCtrl.destroy(req, res, next)`

Sub-controllers can be added in a dot-syntax string `routeCrud('/players/:playerId', controller('players.player'))` -> `require(process.cwd() + '/players/player/player_ctrl.js')(api)`

**Models**

Models are all registered automatically on server startup. The server will crawl through the `/components` directory tree and `require` any js file ending in `_model.js`. if this is not done, the model will need to be added manually **BEFORE** it is used, or the server will crash.

**General notes**

both routes and models can be added in the standard raw mongo/express methods, if you see fit. If thats the case, they need not follow the file structure used for automation.

**Errors**

Custom error handling middleware was added to standardize output. All errors will follow the structure 

```javascript
{
  error: 'string',
  details: []
}
```

to generate error on the fly, please use teh error generato  `require(process.cwd() + '/api/lib/error').errorGenerator(error)` which takes an object of the form:

```javascript
{
  error   : 'string', // defaults to 'Could not process request'
  status  : 'status code', // defaults to 400
  details : [] // defaults to null
}
```

which is then handled by the errorhandler middleware which applies defaults and sends the error object. 

**NOTE:** Raw mongoose/joi errors are accepted in both the error generator and the middleware. They will be processed and groomed into the standard error output. An example converted mongoose/joi validation error is listed below. The intent is for the APP to match paths to messages in form inputs

```javascript
{
  "error": "Validation failed",
  "details": [
    {
      "path": "username",
      "message": "Required"
    },
    {
      "path": "password",
      "message": "Password invalid"
    },
    {
      "path": "email",
      "message": "Email invalid"
    }
  ]
}
```

**Validation**

There is a wrapper for joi to handle errors for us. simply use

```javascript
  validate(req.body, {
    email    : Joi.email(),
    password : Joi.password()
  }, handler(trimmedInput, callback) || [array, of, handlers], FinalcallbackAndErrorHandler);
```

if an arrray is passed in, it will execute an async.waterfall. the validator also adds a few minor Joi mixins, but Joi doesnt support true extension, so use with caution. the validator object also has a property `regex` containing an object of regex's to standardize use. the current supported reges's are below

* `email` - small-ish version of the official regex
* `password` - accepts letters and at least one number between 4 and 10 characters


APP Specific
============


Mongoman
========

I hate code bloat especially when its something that we'll need to do over and over again. So I made a wrapper MANage MONGOose/mongo and mongoose-validator. 

Once this is near completion I'd like to make it into a separate module for public use. 

**Schema building**

Below is a simple Model constructor to demonstrate a use case

```javascript
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

// register a user model
module.exports = Mongoman.register('user', {
  name : Mongoman('Name') // error templates will use the 'Name' string when specifying issues
           .string().required().isAlphaNum().isLength([3, 50]) // it is a required, alaphanumeric, string, of length greater than 3 and less than 50
         .fin() // compile the construcor object (some day, Mongoman.register will do this for us)
});
```

Here is an example controller

```javascript
var Mongoman = require(process.cwd() + '/api/lib/mongoman');

module.exports = function accountController (api) {
  return {
    create : function (req, res, next) {
      Mongoman.save('player', req.body, next, function () {
        res.data = { success : true, }
        return next();
      });
    },
```

**Constructor properties** - remeber to update me!!

* `string()` - type `String`
* `date()` - type `Date`
* `number()` - type `Number`
* `buffer()` - type `Buffer`
* `booleand()` - type `Boolean`
* `mixed()` - type `Mixed`
* `objectId()` - type `ObjectId`
* `array()` - type `Array`
* `type(type)` - set type as 'type' parameter
* `required()` - configure schema to require this property
* `default(val)` - default to `val` parameter

**Constructor validations** - remeber to update me!!

All validations that an error message param as the last argument to override the default error

* `alphanum([msg])` - must be alpha numberic
* `isLength(array, [msg])` - must be between `array[0]` and `array[1]`
* `matches(regex, [msg])` - must match regex

**Stand alone helpers**

* `Mongoman.register(name, schema, [options])` - register new schema with a raw object (not a `Schema` instance)
* `Mongoman.model(name)` - wrapper to get a model
* `Mongoman.save(modelName, inputs, errorHandler, successHandler)` - save an `input` object to `modelName`, validation/DB errors will go to the `errorHandler` (generally `next()`), otherwise, `successHandler` is called 
* `Mongoman.schema(schemaObj)` - returns a new schema instance of the passed in object

