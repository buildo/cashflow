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
      all: [
        'src/**/*.js',
        'index.js'
      ]
    clean:
      dist:
        files: [{
          dot: true,
          src: [
            'dist/*'
          ]
        }]
    es6transpiler:
      # options:
      #   globals:
      all:
        files: [{
          expand: true
          cwd: '.'
          dest: 'dist'
          src: [
            'src/**/*.js',
            'index.js'
          ]
          ext: '.js'
        }]

  grunt.registerTask 'build', [
    'clean:dist',
    'es6transpiler'
  ]

  grunt.registerTask 'default', [
    'jshint',
    'build'
  ]