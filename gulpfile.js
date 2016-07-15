var fs = require('fs');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var replace = require('gulp-replace-task');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
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

gulp.task('build:core', function() {
  let core = gulp.src([
    '!core/extension.js',
    '!core/extensions.js',
    'core/!(execute)*.js',
    'core/execute.js'
  ]).pipe(concat('core.js'))
    .pipe(gulp.dest('browser/Chrome/assets'));

  let logo = gulp.src('core/logo.png')
    .pipe(gulp.dest('browser/Chrome/assets'));

  return merge(core, logo);
});

gulp.task('build:extensions:core', function() {
  return gulp.src([
    'core/extension.js',
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
});

gulp.task('build:extensions:copy', function() {
  return gulp.src([
    'extensions/**/*',
    '!extensions/**/*.scss',
    '!extensions/**/code.js'
  ]).pipe(gulp.dest('browser/Chrome/extensions'));
});

gulp.task('build:extensions:css', function() {
  return gulp.src('extensions/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('browser/Chrome/extensions'));
});

gulp.task('package', function() {
  console.log('To be written...');
});

gulp.task('watch', function() {
  gulp.watch(['core/*.js', '!core/extension.js', '!core/extensions.js'], ['build:core']);
  gulp.watch(['core/extension.js', 'extensions/*/code.js', 'core/extensions.js'], ['build:extensions:core']);
  gulp.watch(['extensions/**/*', '!extensions/**/*.scss', '!extensions/**/code.js'], ['build:extensions:copy']);
  gulp.watch('extensions/**/*.scss', ['build:extensions:css']);
});

gulp.task('build', ['vendor', 'build:core', 'build:extensions']);
gulp.task('build:extensions', ['build:extensions:core', 'build:extensions:copy', 'build:extensions:css']);
gulp.task('package', ['build', 'package']);
gulp.task('default', ['build']);
