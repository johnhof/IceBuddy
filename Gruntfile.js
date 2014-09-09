'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

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
        tasks: ['build'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      compass: {
        files: ['<%= server.app %>/**/*.{scss,sass}'],
        tasks: ['build']
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
          'dist/styles/**/*.css',
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
      options: {
        port: 9000,
        hostname: 'localhost',
        livereload: 35729
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
              connect.static(appConfig.dist)
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
          cwd: '<%= server.dist %>',
          src: 'styles/*.css',
          dest: '<%= server.dist %>/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      options: {
        cwd: '<%= server.app %>'
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
        cssDir: '<%= server.dist %>/styles',
        generatedImagesDir: '<%= server.dist %>/images',
        imagesDir: '<%= server.app %>',
        javascriptsDir: '<%= server.app %>',
        fontsDir: '<%= server.app %>/shared_assets/fonts',
        importPath: './bower_components',
        httpImagesPath: 'shared_assets/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
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
          '<%= server.dist %>/images/*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= server.dist %>/styles/fonts/*'
        ]
      }
    },


    /***************************************************************************************************
    *
    *  Copying tasks
    *
    ****************************************************************************************************/


    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
          // Miscellaneous
          {
            expand: true,
            dot: true,
            flatten: true,
            cwd: '<%= server.app %>',
            dest: '<%= server.dist %>',
            src: [
              '.htaccess',
              'shared_assets/fonts/*'
            ]
          }, 

          // sass
          {
            expand: true,
            dot: true,
            flatten: true,
            src: '<%= server.app %>/**/*.{sass,scss}',
            dest: '.tmp/styles'
          }, 

          // index
          {
            expand: true,
            dot: true,
            flatten: true,
            src: '<%= server.app %>/core/index.html',
            dest: '<%= server.dist %>'
          }, 

          // views
          {
            expand: true,
            dot: true,
            flatten: true,
            src: '<%= server.app %>/components/**/*.html',
            dest: '<%= server.dist %>/views'
          }, 

          // partials
          {
            expand: true,
            dot: true,
            flatten: true,
            src:'<%= server.app %>/assets/partials/**/*.html',
            dest: '<%= server.dist %>/partials'
          }
        ]
      }
    },


    /***************************************************************************************************
    *
    *  Minifying tasks
    *
    ****************************************************************************************************/

    // *Important* - js files must be concatenated in order of dependency
    concat: {
        dist: {
          files: {
          '<%= server.dist %>/scripts/main.js': ['<%= server.app %>/core/app.js', '<%= server.app %>/**/*.js']
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

    // Run some tasks in parallel to speed up the build process
    concurrent: {}
  });


  /***************************************************************************************************
  *
  *  Task registration
  *
  ****************************************************************************************************/


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'build',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });


  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'copy:dist',
    'useminPrepare',
    'concat',
    'autoprefixer',
    'ngmin',
    'cdnify',
    'compass',
    'cssmin',
    // 'uglify',
    // 'filerev', --- this shit is mucking up css/js serving. fix it later
    // 'usemin',
    'htmlmin',
    'clean:tmp',
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
