var fs = require('fs');
var gulp = require('gulp');
var concat = require('gulp-concat');
var replace = require('gulp-replace-task');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var merge = require('merge-stream');

function getDirectories(path) {
  return fs.readdirSync(path).filter(function(file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}

gulp.task('vendor', function() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/handlebars/dist/handlebars.js'
  ]).pipe(concat('vendor.js'))
    .pipe(gulp.dest('browser/Chrome/assets'));
});

gulp.task('build:core', ['vendor'], function() {
  let core = gulp.src([
    '!core/extensions.js',
    'core/!(core)*.js',
    'core/core.js'
  ]).pipe(concat('core.js'))
    .pipe(gulp.dest('browser/Chrome/assets'));

  let logo = gulp.src('core/logo.png')
    .pipe(gulp.dest('browser/Chrome/assets'));

  return merge(core, logo);
});

gulp.task('build:extensions', function() {
  let condense = gulp.src([
    'extensions/*/code.js',
    'core/extensions.js'
  ]).pipe(concat('extensions.js'))
    .pipe(replace({
      patterns: [{
        match: 'ListOfCommaSeperatedExtensionIdsGoHere',
        replacement: getDirectories(__dirname + '/extensions/').join(', ')
      }]
    }))
    .pipe(gulp.dest('browser/Chrome/assets'));

  let copy = gulp.src([
    'extensions/**/*',
    '!extensions/**/code.js'
  ]).pipe(gulp.dest('browser/Chrome/extensions'));

  return merge(condense, copy);
});

gulp.task('package', function() {
  console.log('To be written...');
});

gulp.task('watch', function() {
  gulp.watch('core/*.js', ['build:core']);
  gulp.watch('extensions/**/*', ['build:extensions']);
});

gulp.task('build', ['build:core', 'build:extensions']);
gulp.task('package', ['build', 'package']);
gulp.task('default', ['build']);
