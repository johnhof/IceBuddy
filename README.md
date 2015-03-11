IceBuddy
========

Web service to compile and deliver local ice times (skate/stick time/pickup)

* [Structure](#structure)
* [To Run](#to-run)
* [Useful Commands](#useful-commands)
* [Api](#api)
* [App](#app)


## Structure

```

- Gruntfile.js // grunt build script

- config.json // server configurations

> dist // compiled client side components

> api

  -- routes.js // route->controller mapping

  >> lib // helpers, shared assets

  >> components // models and controllers

    >>>> example

    ------ example_ctrl.js (C)

    ------ example_model.js (M) (IMPORTANT - all models `_model.js` are registered on server startup)


> app

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

    ---- api.js // api service. wrapper for a set of $resource objects

    ---- index.html // main view container in which other views and partials are wrapped

    ---- router.js // mapping of routes to views

```

## To Run

General
 - Requires MongoDB, Node, Compass (Ruby)
 - Clone Git Repo
 - `$ npm install`
 - `$ bower install`
 - `$ grunt app`
   - watches for changes in both API and App for rebuild
   - `--prod` builds a production version (minified)
   - `--dev` builds a dev version (unminified/default)

## Useful grunt commands

`grunt serve` -> run with the current build (no watch)

`grunt build-prod` -> builds a minified prod dist

`grunt build-dev` -> builds an unminified dev dist

`grunt clean:compiled` -> removes compiled code (./tmp, ./dist, ./sass_cache)

`grunt clean:modules` ->  removes node modules and bower components

`gunt dropdb` - > drops the current local database

`grunt populateDemoData`  - > Generates Demo data to be worked on

## API

A few things are done automatically cut down on controller/model/router bloat:

**Routing and Controllers**

CRUD controllers can be added to the route file with internal helpers. using `routeCrud('/', controller('home'))` will call `homeCtrl = require(process.cwd() + '/home/home_ctrl')(api)` then map the following routes automatically, **IF** the handler is defined in the controller

 * `POST /` -> `homeCtrl.create(req, res, next)`
 * `GET /` -> `homeCtrl.read(req, res, next)`
 * `PUT /` -> `homeCtrl.update(req, res, next)`
 * `DELETE /` -> `homeCtrl.destroy(req, res, next)`

Sub-controllers can be added in a dot-syntax string `routeCrud('/players/:playerId', controller('players.player'))` -> `require(process.cwd() + '/players/player/player_ctrl.js')(api)`

**Models**

Models are all registered automatically on server startup. The server will crawl through the `/components` directory tree and `require` any js file ending in `_model.js`. if this is not done, the model will need to be added manually **BEFORE** it is used, or the server will crash.

**General notes**

both routes and models can be added in the standard raw mongo/express methods, if you see fit. If thats the case, they need not follow the file structure used for automation.

**Server Initialization**

the following variables and utils are cached by middleware

- `req`
    - `session`    - a copy of the parsed session cookie
    - `signedIn()` - returns whether or not the user is signed in (using the hash to validate)
- `res`
    - `setSession(session, signedIn)` - takes `session[username]`, `session[email]` and `signedIn` to generate and set the session cookie. defaults to null values
    - `data` - anything in this object will be sent at the end of a crud route after calling `next()`

**Errors**

Custom error handling middleware was added to standardize output. All errors will follow the structure

```javascript
{
  error: 'string',
  details: []
}
```

to generate error on the fly, please use the error generator  `require(process.cwd() + '/api/lib/error').errorGenerator(error)` which takes an object of the form:

```javascript
{
  error   : 'string', // defaults to 'Could not process request'
  status  : 'status code', // defaults to 400
  details : [] // defaults to null
}
```

which is then handled by the errorhandler middleware which applies defaults and sends the error object.

**NOTE:** Raw mongoose/joi errors are accepted in both the error generator and the middleware. They will be processed and groomed into the standard error output. An example converted mongoose/joi validation error is listed below. The intent is for the App to match paths to messages in form inputs

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


**Session**

the following utils are available from /lib/session.js
* `isvalidSession(req)` - return whether or not this session is signed in with a valid hash
* `primeSession(req, res, next)` - app level middleware that parses and sets up the session state/cookie. if neither are sent in the request, they are generated. the following utilities are added as well
  * `req.session`    - a copy of the parsed session cookie
  * `res.signedIn()` - returns whether or not the user is signed in (using the hash to vlaidate)
  * `res.setSession(session, signedIn)` - takes `session[username]`, `session[email]` and `signedIn` to generate and set the session cookie. defaults to null values
* `requireSession(req, res, next)` - Route level middleware. returns 401 if a valid session is not found


## App

### Utilities


#### Sprites

for the sake of speed, I pulled in the [ionicon bower package](http://ionicons.com/). I also added a sprite directive to standardize use. Please use a sprite from the sheet linked above. We'll probably need to add another sprite tool for unsupported sprites, but we'll cross that bridge when we come to it.


```html
<sprite name="[ionicon name]" size="[optional: size in pixels defafult: 32]" href="[optional: href for new tab]"></sprite>
```

without the directive

```html
<a class="[ionicon name] [some size class]" href="[href]" target="__blank"></a>
```
### Material Design

Following googles [material design guide](http://www.google.com/design/spec/material-design/introduction.html) a set of scss variables and angular directive are defined for use accross the site.

### SCSS tools

#### General

```
// all spacing should be a multiple or divisor of the $space variable
$space: // 8px

// material design hinges on the principal of paper components in 3D space.
// any time a paper component overlays another, the elevation mixin must be used.
// The $scale parameter will set the box shadow size/alpha for the paper component
@inlude elevation($scale)

// all cards must have a border radius
$radius // 2px;
```

#### Text Sizes

```
@inlude button-text () // 14px, bold, uppercase

@inlude caption-text () // 12px

@inlude body-text () // 14px

@inlude body-bold-text () // 14px, bold

@inlude subhead-text () // 16px

@inlude title-text () // 20px, bold

@inlude headline-text () // 24px

@inlude display-small-text () // 34px

@inlude display-medium-text () // 45px

@inlude display-large-text () // 56px
```

#### Color Palette ([source](http://www.google.com/design/spec/style/color.html#color-color-palette))

```
// Base
$base-color // white

// Shades

// white
$divider-color // 12% opacity
$disabled-color // 26% opacity
$secondary-text-color // 54% opacity
$text-color // 87% opacity

// black
$divider-light-color // 12% opacity
$disabled-light-color // 26% opacity
$secondary-text-light-color // 54% opacity
$text-light-color // 87% opacity

// Primary - Blue
$primary-light // 500
$primary // 700
$primary-dark // 900

// Accent - Orange
$accent // A700
$accent-fallback // A200
```

#### Utilities

```
@include center() // center content vertically and horizontally
```

### Directives

#### Animations


**ripple**

- restrict
    - Class
- animation
    - Ripple effect on click
- options
    - `.dark` class in conjunction will cause dark ripple
