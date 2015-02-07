'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  require('colors');

  grunt.loadNpmTasks('grunt-shell-spawn');

  var config  = require('config.json')();

  if (!config) {
    console.log('!! No Config file loaded !!');
    process.kill();
  }

  // Configurable paths for the application
  var appConfig = {
    app  : config.path.app,
    dist : config.path.dist,
    port : config.port,
    copy : {
      images : {
        expand  : true,
        dot     : true,
        flatten : true,
        dest    : '<%= server.dist %>/images',
        src     : '<%= server.app %>/assets/images/**/*'
      },
      favicon : {
        dest : '<%= server.dist %>/favicon.ico',
        src  : '<%= server.app %>/assets/images/favicon.ico'
      },
      sass : {
        expand  : true,
        dot     : true,
        flatten : true,
        src     : '<%= server.app %>/**/*.{sass,scss}',
        dest    : '.tmp/styles'
      },
      index : {
        expand  : true,
        dot     : true,
        flatten : true,
        src     : '<%= server.app %>/core/index.html',
        dest    : '<%= server.dist %>'
      },
      views : {
        expand  : true,
        dot     : true,
        flatten : true,
        src     : '<%= server.app %>/components/**/*.html',
        dest    : '<%= server.dist %>/views'
      },
      partials : {
        expand  : true,
        dot     : true,
        flatten : true,
        src     :'<%= server.app %>/assets/partials/**/*.html',
        dest    : '<%= server.dist %>/partials'
      }
    }
  }

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    server: appConfig,


    /***************************************************************************************************
    *
    *  Watching tasks
    *
    ****************************************************************************************************/

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= server.app %>/**/*.js'],
        tasks: ['build-js'],
        options: {}
      },
      css: {
        files: ['<%= server.app %>/**/*.{scss,sass}'],
        tasks: ['build-scss']
      },
      views: {
        files: ['<%= server.app %>/**/*.html'],
        tasks: ['build-html'],
        options: {}
      },
      images : {
        files: ['<%= server.app %>/assets/images/**/*'],
        tasks: ['copy:images']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['build-dev']
      },
      livereload: {
        options: {},
        files: [
          '<%= server.app %>/**/*.html',
          'dist/styles/*.css',
          '<%= server.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },


    /***************************************************************************************************
    *
    *  Server cleaning, compiling, and initialization tasks
    *
    ****************************************************************************************************/

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= server.dist %>/',
            '!<%= server.dist %>/.git*'
          ]
        }]
      },
      tmp: {
        files: [{
          dot: true,
          src: '.tmp'
        }]
      },
      js: {
        files: [{
          dot: true,
          src: '<%= server.dist %>/**/*.js'
        }]
      },
      css: {
        files: [{
          dot: true,
          src: '<%= server.dist %>/**/*/css'
        }]
      },
      html: {
        files: [{
          dot: true,
          src: '<%= server.dist %>/**/*.html'
        }]
      },
      modules: {
        files: [{
          src: [
            './node_modules',
            './bower_components'
          ]
        }]
      },
      compiled : {
        files: [{
          dot: true,
          src: ['./.sass*', './dist', './tmp']
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          src: '<%= server.dist %>/styles/*.css'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= server.app %>/core/index.html'],
        ignorePath:  /\.\.\//
      },
      sass: {
        src: ['<%= server.app %>/**/*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '.tmp/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '<%= server.dist %>/images',
        imagesDir: '<%= server.app %>',
        javascriptsDir: '<%= server.app %>',
        importPath: './bower_components',
        httpImagesPath: 'shared_assets/images',
        httpGeneratedImagesPath: '/images/generated',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= server.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= server.dist %>/scripts/*.js',
          '<%= server.dist %>/styles/*.css',
          '<%= server.dist %>/images/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },


    /***************************************************************************************************
    *
    *  Copying tasks
    *
    ****************************************************************************************************/


    copy: {
      dist: {
        files: [
         appConfig.copy.images,
         appConfig.copy.sass,
         appConfig.copy.index,
         appConfig.copy.views,
         appConfig.copy.partials,
         appConfig.copy.favicon
        ]
      },
      images: {
        files: [
          appConfig.copy.images,
          appConfig.copy.favicon
        ]
      },
      css : {
        files: [appConfig.copy.sass]
      },
      html : {
        files: [
         appConfig.copy.index,
         appConfig.copy.views,
         appConfig.copy.partials
        ]
      },
    },


    /***************************************************************************************************
    *
    *  Minifying tasks
    *
    ****************************************************************************************************/

    // *Important* - js files must be concatenated in order of dependency
    concat: {
      js: {
        files: {
          '<%= server.dist %>/scripts/main.js': [
            '<%= server.app %>/core/app.js',
            '<%= server.app %>/core/api.js',
            '<%= server.app %>/scripts/services.js',
            '<%= server.app %>/scripts/helpers.js',
            '<%= server.app %>/**/*.js'
          ]
        }
      },
      css: {
        files: {
          '<%= server.dist %>/styles/main.css': ['.tmp/**/main.css', '.tmp/**/*.css']
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= server.dist %>/views/*.html',
      options: {
        flow: {
          html: {
            steps: {
              js: ['uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        },
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= server.dist %>/views/*.html'],
      css: ['<%= server.dist %>/styles/*.css'],
      options: {
        assetsDirs: ['<%= server.dist %>','<%= server.dist %>/images']
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= server.app %>',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= server.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= server.app %>',
          src: '**/*.svg',
          dest: '<%= server.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          src: '<%= server.dist %>/views/*.html',
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= server.dist %>/views/*.html']
      }
    },

    // prep angular scripts for minification
    ngmin: {
      dist: {
        files: [{
          expand: true,
          src: '<%= server.dist %>/scripts/*.js',
        }]
      }
    },

    // uglify JS
    uglify: {
      options: {
        compress: {
          drop_console: true
        }
      },
      my_target: {
        files: [{
            expand: true,
            src: '<%= server.dist %>/scripts/*.js',
        }]
      }
    },

    // minify compiled CSS
    cssmin: {
      my_target: {
        files: [{
          expand: true,
          src: '<%= server.dist %>/styles/*.css',
        }]
      }
    },


    /***************************************************************************************************
    *
    *  Concurrency tasks
    *
    ****************************************************************************************************/

    concurrent: {
      serverDev : {
        tasks : [
          'watch',
          'shell:serve'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      serverProd : {
        tasks : [
          'watch',
          'shell:serveProd'
        ],
        options: {
          logConcurrentOutput: true
        }
      }
    },


    /***************************************************************************************************
    *
    *  Mocha testing tasks
    *
    ****************************************************************************************************/

    simplemocha: {
      options: {
        globals     : ['expect'],
        timeout     : 10000,
        ignoreLeaks : false,
        ui          : 'bdd',
        reporter    : 'tap'
      },
      all: {
        src: ['test/tests/**/*.js']
      }
    },


    /***************************************************************************************************
    *
    *  shell tasks
    *
    ****************************************************************************************************/

    shell: {
      install_bower: {
        command: 'rm -rf ./bower_components && bower install',
        options: {
          async: false
        }
      },
      dropdb: {
        command: 'mongo --eval "db.getMongo().getDBNames().forEach(function(i){ db.getSiblingDB(i).dropDatabase()})"',
        options: {
          async: false
        }
      },
      serve: {
        command: 'nodemon server.js -q --ignore "test/" --ignore "app/" --ignore "dist/"',
        options: {
          async: false
        }
      },
      serveProd: {
        command: 'NODE_ENV=production nodemon server.js -q --ignore "test/" --ignore "app/" --ignore "dist/"',
        options: {
          async: false
        }
      },
      deploy: {
        command: 'jitsu deploy',
        options: {
          async: false
        }
      }
    }
  });

  /***************************************************************************************************
  *
  *  Primary Tasks
  *
  ****************************************************************************************************/

  // run the app
  grunt.registerTask('serve', 'Starting app server...', function () {
    grunt.task.run(['shell:serve']);
  });


  // run the app
  grunt.registerTask('app', 'Building and starting server...', function () {
    var prod = grunt.option('prod');
    if (prod) {
      grunt.task.run([
        'build-prod',
        'concurrent:serverProd'
      ]);

    } else {
      grunt.task.run([
        'build-dev',
        'concurrent:serverDev'
      ]);
    }
  });

  // drop the database
  grunt.registerTask('dropdb', 'dropping the database...', function () {
    grunt.task.run(['shell:dropdb']);
  });


  // run tests
  grunt.registerTask('test', 'running API tests...', function (target) {
    var set = ['simplemocha'];

    if (grunt.option('drop')) {
      set.unshift('shell:dropdb')
    }

    grunt.task.run(set);
  });



  /***************************************************************************************************
  *
  *  Secondary tasks Tasks
  *
  ****************************************************************************************************/


  grunt.registerTask('build-prod', [
    'clean:dist',
    'wiredep',
    'copy:dist',
    'useminPrepare',
    'concat:js',
    'ngmin',
    'cdnify',
    'compass',
    'concat:css',
    'autoprefixer',
    'cssmin',
    'uglify',
    'usemin',
    'htmlmin',
    'clean:tmp',
  ]);


  grunt.registerTask('build-dev', [
    'clean:dist',
    'wiredep',
    'copy:dist',
    'useminPrepare',
    'concat:js', //remove?
    'compass',
    'concat:css',
    'autoprefixer',
    'clean:tmp',
  ]);

  //
  // Individual file types
  //

  grunt.registerTask('build-js', [
    'clean:js',
    'ngmin',
    'concat:js',
    'clean:tmp',
  ]);

  grunt.registerTask('build-scss', [
    'clean:css',
    'copy:css',
    'compass',
    'concat:css',
    'autoprefixer',
    'cssmin',
    'clean:tmp',
  ]);


  grunt.registerTask('build-html', [
    'clean:html',
    'copy:html',
    'useminPrepare',
    'htmlmin',
    'clean:tmp',
  ]);
};