var browserify = require('browserify');
var fs = require('fs');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var replace = require('gulp-replace-task');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var merge = require('merge-stream');
var source = require('vinyl-source-stream');

function getDirectories(path) {
  return fs.readdirSync(path).filter(function(file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}

/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file
 |--------------------------------------------------------------------------
 */
gulp.task('vendor', ['browserify-vendor'], function() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/handlebars/dist/handlebars.js',
    'node_modules/minimatch/dist/minimatch.js'
  ]).pipe(concat('vendor.js'))
    .pipe(gulp.dest('staging/assets'));
});

gulp.task('browserify-vendor', function() {
  return browserify()
    .require('minimatch')
    .bundle()
    .pipe(source('minimatch.js'))
    .pipe(gulp.dest('node_modules/minimatch/dist/'));
});

/*
 |--------------------------------------------------------------------------
 | Build Core into staging
 |--------------------------------------------------------------------------
 */
gulp.task('build:core', function() {
  let core = gulp.src([
    '!core/extension.js',
    '!core/extensions.js',
    'core/!(execute)*.js',
    'core/execute.js'
  ]).pipe(concat('core.js'))
    .pipe(gulp.dest('staging/assets'));

  let logo = gulp.src('core/logo.png')
    .pipe(gulp.dest('staging/assets'));

  return merge(core, logo);
});

/*
 |--------------------------------------------------------------------------
 | Build Extensions into staging
 |--------------------------------------------------------------------------
 */
gulp.task('build:extensions:core', function() {
  const extensionClasses = getDirectories(__dirname + '/extensions/');

  return gulp.src([
    'core/extension.js',
    'extensions/*/code.js',
    'core/extensions.js'
  ]).pipe(concat('extensions.js'))
    .pipe(replace({
      patterns: [{
        match: 'ListOfCommaSeperatedExtensionIdsGoHere',
        replacement: extensionClasses.join(', ')
      }, {
        match: 'ListOfCommaSeperatedExtensionIdsWithQuotesGoHere',
        replacement: extensionClasses.join("', '")
      }]
    }))
    .pipe(gulp.dest('staging/assets'));
});

gulp.task('build:extensions:copy', function() {
  return gulp.src([
    'extensions/**/*',
    '!extensions/**/*.scss',
    '!extensions/**/code.js'
  ]).pipe(gulp.dest('staging/extensions'));
});

gulp.task('build:extensions:css', function() {
  return gulp.src('extensions/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('staging/extensions'));
});

/*
 |--------------------------------------------------------------------------
 | Distribute Core and Extensions to browser specific folders
 |--------------------------------------------------------------------------
 */
 gulp.task('stage', function() {
   return gulp.src('staging/**/*')
     .pipe(gulp.dest('browser/Chrome'))
     .pipe(gulp.dest('browser/Firefox'));
 });

/*
 |--------------------------------------------------------------------------
 | Compiles browser specific folders into one file
 |--------------------------------------------------------------------------
*/
gulp.task('package', function() {
  console.log('To be written...');
});

/*
 |--------------------------------------------------------------------------
 | Etc.
 |--------------------------------------------------------------------------
 */
gulp.task('watch', ['build'], function() {
  gulp.watch(['core/*.js', '!core/extension.js', '!core/extensions.js'], ['build:core']);
  gulp.watch(['core/extension.js', 'extensions/*/code.js', 'core/extensions.js'], ['build:extensions:core']);
  gulp.watch(['extensions/**/*', '!extensions/**/*.scss', '!extensions/**/code.js'], ['build:extensions:copy']);
  gulp.watch('extensions/**/*.scss', ['build:extensions:css']);
  gulp.watch('staging/**/*', ['stage']);
});

gulp.task('build', ['vendor', 'build:core', 'build:extensions', 'stage']);
gulp.task('build:extensions', ['build:extensions:core', 'build:extensions:copy', 'build:extensions:css']);
gulp.task('pack', ['build', 'package']);
gulp.task('default', ['build']);
