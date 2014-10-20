module.exports = (grunt) ->
  require('load-grunt-tasks') grunt
  require('time-grunt') grunt

  grunt.initConfig
    watch:
      js:
        files: [
          'src/**/*.js',
          'index.js'
        ]
        tasks: [
          'newer:jshint:all',
          'newer:es6transpiler',
        ]
    jshint:
      options:
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      dist: [
        'src/**/*.js',
        'index.js'
      ]
      test: [
        'src/**/*.spec.js'
      ]
    clean:
      dist:
        files: [{
          dot: true,
          src: [
            'dist/*'
          ]
        }]
      test:
        files: [{
          dot: true,
          src: [
            'test/*'
          ]
        }]
    es6transpiler:
      dist:
        files: [{
          expand: true
          cwd: '.'
          dest: 'dist'
          src: [
            'src/**/*.js',
            '!src/**/*.spec.js',
            'index.js'
          ]
          ext: '.js'
        }]
      test:
        options:
          globals:
            it: false
            describe: false
        files: [{
          expand: true
          cwd: '.'
          dest: 'test'
          src: [
            'src/**/*.js',
            'index.js'
          ]
          ext: '.js'
        }]
    simplemocha:
      # options:
        # globals: ['should']
        # timeout: 3000
        # ignoreLeaks: false
        # grep: '*-test'
        # ui: 'bdd'
        # reporter: 'tap'
      test:
        src: [
          'test/**/*.js'
        ]

  grunt.registerTask 'build', [
    'jshint:dist',
    'clean:dist',
    'es6transpiler:dist'
  ]

  grunt.registerTask 'test', [
    'jshint:test',
    'clean:test',
    'es6transpiler:test',
    'simplemocha:test',
    'clean:testgrunt'
  ]

  grunt.registerTask 'default', [
    'test',
    'build'
  ]
