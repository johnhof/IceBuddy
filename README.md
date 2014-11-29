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

  ------ example_model.js (M)

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
* `grunt api` -> http://localhost:8000
  * nodemon will restart the server for js changes


**Coming Soon**
* command line options

Useful grunt commands
=====================

`grunt clean:compiled` -> removes compiled code (./tmp, ./dist, ./sass_cache)

`grunt clean:modules` ->  removes node modules and bower components