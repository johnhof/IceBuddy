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

Mongoman
========

I hate code bloat expecially when its something that we'll need to do over and over again. So I made a wrapper MANage MONgoose/mongo and mongoose-validator. 

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

* `isAlphaNum([msg])` - must be alpha numberic
* `isLength(array, [msg])` - must be between `array[0]` and `array[1]`
* `matches(regex, [msg])` - must match regex

**Stand alone helpers**

* `Mongoman.register(name, schema, [options])` - register new schema with a raw object (not a `Schema` instance)
* `Mongoman.model(name)` - wrapper to get a model
* `Mongoman.save(modelName, inputs, errorHandler, successHandler)` - save an `input` object to `modelName`, validation/DB errors will go to the `errorHandler` (generally `next()`), otherwise, `successHandler` is called 

