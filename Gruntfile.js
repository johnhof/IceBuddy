'use strict';


var mongoose = require('mongoose');

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);


  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // run shell commands asyncronously
  grunt.loadNpmTasks('grunt-shell-spawn');

  var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

  // Configurable paths for the application
  var appConfig = {
    app  : require('./bower.json').appPath || 'app',
    api  : require('./bower.json').apiPath || 'api',
    dist : 'dist'
  };

  // cache options for reuse
  var opts = {
    copy : {
      images : {
        expand: true,
        dot: true,
        flatten: true,
        dest: '<%= server.dist %>/images',
        src: '<%= server.app %>/assets/images/**/*'
      },
      sass : {
        expand: true,
        dot: true,
        flatten: true,
        src: '<%= server.app %>/**/*.{sass,scss}',
        dest: '.tmp/styles'
      },
      index : {
        expand: true,
        dot: true,
        flatten: true,
        src: '<%= server.app %>/core/index.html',
        dest: '<%= server.dist %>'
      },
      views : {
        expand: true,
        dot: true,
        flatten: true,
        src: '<%= server.app %>/components/**/*.html',
        dest: '<%= server.dist %>/views'
      },
      partials : {
        expand: true,
        dot: true,
        flatten: true,
        src:'<%= server.app %>/assets/partials/**/*.html',
        dest: '<%= server.dist %>/partials'
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
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      css: {
        files: ['<%= server.app %>/**/*.{scss,sass}'],
        tasks: ['build-stylus']
      },
      views: {
        files: ['<%= server.app %>/**/*.html'],
        tasks: ['build-html'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      images : {
        files: ['<%= server.app %>/assets/images/**/*'],
        tasks: ['copy:images']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['build']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
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


    // The actual grunt server settings
    connect: {
      proxies: [{
        context: '/',
        host: 'localhost',
        port: 8000,
        xforward: true
      }],
      options: {
        port: 9000,
        hostname: '0.0.0.0',
        livereload: 35729,
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components'),
                appConfig.dist + '/'
              ),
              connect.static(appConfig.dist),
              proxySnippet
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= server.dist %>'
        }
      }
    },

    // Setup one prism
    prism: {
      options: {
        mode: 'proxy',
        mocksPath: './mocks',
        context: '/api',
        host: '0.0.0.0',
        port: 8000,
        https: false,
        delay: 0,
        /* rewrites requests to context */
        rewrite: {}
      },
      serve: {},
      e2e: {}
    },

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
      options: {
        // cwd: '<%= server.app %>'
      },
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
         opts.copy.images,
         opts.copy.sass,
         opts.copy.index,
         opts.copy.views,
         opts.copy.partials
        ]
      },
      images: {
        files: [opts.copy.images]
      },
      css : {
        files: [opts.copy.sass]
      },
      html : {
        files: [
         opts.copy.index,
         opts.copy.views,
         opts.copy.partials
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
          '<%= server.dist %>/scripts/main.js': ['<%= server.app %>/core/app.js',
                                                  '<%= server.app %>/core/api.js',
                                                  '<%= server.app %>/scripts/services.js',
                                                  '<%= server.app %>/scripts/helpers.js',
                                                  '<%= server.app %>/**/*.js']
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
        // files: [{
        //   expand: true,
        //   src: '<%= server.dist %>/styles/*.css',
        // }]
      }
    },


    /***************************************************************************************************
    *
    *  Concurrency tasks
    *
    ****************************************************************************************************/

    // Run some tasks in parallel to speed up the build process
    concurrent: {},

    shell: {
      mongo: {
        command: 'sudo mongod',
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
      api : {
        command: 'nodemon ./api/api.js --ignore "test/" --ignore "app/" --ignore "dist/"',
        options: {
          async: false
        }
      },
      install: {
        command: 'npm install && bower install',
        options: {
          async: true
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
    }
  });

  /***************************************************************************************************
  *
  *  Task registration
  *
  ****************************************************************************************************/

  grunt.loadNpmTasks('grunt-connect-proxy');

  // run the app
  grunt.registerTask('app', 'Starting API server...', function () {
    grunt.task.run([
      'build',
      'configureProxies',
      'connect:livereload',
      'watch'
    ]);
  });

  // run the api
  grunt.registerTask('api', 'Compiling and Starting App server...', function (target) {
    grunt.task.run([
      'shell:api',
    ]);
  });


  // run tests
  grunt.registerTask('test', 'running API tests...', function (target) {
    var set = ['simplemocha'];

    if (grunt.option('drop')) {
      set.unshift('shell:dropdb')
    }

    grunt.task.run(set);
  });

  // drop a database
  grunt.registerTask('dropdb', 'dropping database...', function () {
    grunt.task.run([
      'shell:dropdb'
    ]);
  });


  //
  // composite tasks used as utilities
  //

  grunt.registerTask('build', [
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
    // 'uglify',
    // 'filerev', --- this shit is mucking up css/js serving. fix it later
    // 'usemin',
    'htmlmin',
    'clean:tmp',
  ]);

  grunt.registerTask('build-js', [
    'clean:js',
    'concat:js',
    'ngmin',
    'clean:tmp',
  ]);

  grunt.registerTask('build-stylus', [
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
    'cdnify',
    'htmlmin',
    'clean:tmp',
  ]);
};