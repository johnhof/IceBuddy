IceBuddy
========

Web service to compile and deliver local ice times (skate/stick time/pickup)


**Build from:** https://github.com/johnhof/simple_skeleton


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

A collection of minified files made accessible to the client. This is where the actual app runs. The App dir is for dev only

To Run
======

App
* npm install
* `grunt serve`
  * the grunt file will watch for changes to restart the server

API
* FROM THE ROOT DIRECTORY
* npm install
* `nodemon ./api/api.js`
  * Working on integrating this into the grunt file. as it stands, `grunt api` will run the server but not deliver data (not sure why)


**Coming soon**

`grunt serve` will start both the API and App servers watching both for changes to restart each independantly
