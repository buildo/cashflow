'use strict';

var gulp = require('gulp');
var webserver = require('gulp-webserver');
var livereload = require('gulp-livereload');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');
var es6ify = require('es6ify');
var reactify = require('reactify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var react = require('gulp-react');
var clean = require('gulp-clean');
var concatCss = require('gulp-concat-css');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var notify = require('gulp-notify');
var del = require('del');
var watchify = require('watchify');

var SERVER_PORT = 9001;
var HOST = 'localhost';
var LIVE_RELOAD_PORT = 35729;

var PATHS = {
  dist: './dist',
  browserifyEntry: './src/app.js',
  index: './src/index.html',
  js: './src/**/*.{js,jsx}',
  assets: './src/**/*.{png,jpg,jpeg,gif,svg,woff,ttf}',
  scss: './src/**/*.scss',
  vendor: [es6ify.runtime, './node_modules/jquery/dist/jquery.min.js', './semantic/dist/semantic.js'],
  vendorCss: ['./vendor/**/*.css', './semantic/dist/semantic.min.css', './node_modules/c3/c3.min.css', './node_modules/jsoneditor/jsoneditor.min.css'],
  themes: './semantic/dist/themes/**/*',
  themesBase: './semantic/dist',
  i18n: './i18n/**/*.json'
};

var handleErrors = function(err) {
    notify.onError({
      message: "<%= error.message %>"
    }).apply(this, arguments);

    this.emit('end');
};

gulp.task('clean', function (cb) {
  del([
    'dist/**',
  ], cb);
});

gulp.task('vendor', function() {
  return gulp.src(PATHS.vendor)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task('vendor-css', function() {
  return gulp.src(PATHS.vendorCss)
    .pipe(concatCss('vendor.css'))
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task('jshint', function() {
  return gulp.src(PATHS.js)
    .pipe(react())
    .on('error', handleErrors)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {
      verbose : true
    }))
    .pipe(jshint.reporter('fail', {
      verbose : true
    }));
});

gulp.task('js', ['jshint'], function() {
  var browserified = transform(function(filename) {
    es6ify.traceurOverrides = {
      experimental: true
    };

    watchify.args.debug = true;

    return browserify(filename, watchify.args)
      .transform(reactify)
      .transform(es6ify.configure(/.jsx?/))
      .bundle();
  });

  return gulp.src(PATHS.browserifyEntry)
    .pipe(browserified)
    .on('error', handleErrors)
    // .pipe(uglify())
    .pipe(gulp.dest(PATHS.dist));
});


gulp.task('scss', function() {
  return gulp.src(PATHS.scss)
    .pipe(sass())
    .pipe(concatCss('style.css'))
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task('assets', function() {
  return gulp.src(PATHS.assets)
    .pipe(sass())
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task('i18n', function() {
  return gulp.src(PATHS.i18n)
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task('themes', function() {
  return gulp.src(PATHS.themes, {base: PATHS.themesBase})
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task('html', ['vendor'], function() {
  return gulp.src(PATHS.index).pipe(gulp.dest(PATHS.dist));
});

gulp.task('server', function() {
  return gulp.src(PATHS.dist)
    .pipe(webserver({
      livereload: true,
      port: SERVER_PORT,
      host: HOST,
      open: true
    }));
});

gulp.task('build', [
  'js',
  'vendor-css',
  'scss',
  'html',
  'assets',
  'themes',
  'i18n'
]);

gulp.task('watch-all', function () {
  gulp.watch([PATHS.js], ['js']);
  gulp.watch([PATHS.assets], ['assets']);
  gulp.watch([PATHS.scss], ['scss']);
  gulp.watch([PATHS.index], ['html']);
  gulp.watch([PATHS.i18n], ['i18n']);
  gulp.watch([PATHS.themesBase], ['themes']);
});

gulp.task('default', function() {
  runSequence('clean', 'build', 'server', 'watch-all');
});
