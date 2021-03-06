var browserify = require('browserify');
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var replace = require('gulp-replace-task');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var zip = require('gulp-zip');
var merge = require('merge-stream');
var pump = require('pump');
var source = require('vinyl-source-stream');

function getDirectories(path) {
  return fs.readdirSync(path).filter(function(file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}

var production = true;

/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file
 |--------------------------------------------------------------------------
 */
gulp.task('build:vendor', ['build:browserify-vendor'], function() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/handlebars/dist/handlebars.js',
    'node_modules/minimatch/dist/minimatch.js',
    'node_modules/sortablejs/Sortable.min.js'
  ]).pipe(concat('vendor.js'))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest('staging/assets'));
});

gulp.task('build:browserify-vendor', function() {
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
    //.pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest('staging/assets'));

  let files = gulp.src([
    '!core/*.js',
    '!core/*.scss',
    'core/**/*'
  ]).pipe(gulp.dest('staging/assets'));

  return merge(core, files);
});

gulp.task('build:core:css', function() {
  return gulp.src('core/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulpif(production, cleanCSS({advanced: false, debug: true}, function(details) {
      let ratio = (details.stats.originalSize - details.stats.minifiedSize) / details.stats.originalSize;
      console.log(`  ${details.name}: ${details.stats.originalSize/1000}B -> ${details.stats.minifiedSize/1000}B (${parseInt(ratio*100, 10)}% reduction)`);
    })))
    .pipe(gulp.dest('staging/assets'));
});

/*
 |--------------------------------------------------------------------------
 | Build Extensions into staging
 |--------------------------------------------------------------------------
 */
gulp.task('build:extensions', ['build:extensions:core', 'build:extensions:copy', 'build:extensions:css']);

gulp.task('build:extensions:core', function(cb) {
  let extensionClasses = getDirectories(__dirname + '/extensions/'),
      index = extensionClasses.indexOf('BGCore');
  extensionClasses.splice(index, 1);
  extensionClasses.unshift('BGCore');

  pump([
    gulp.src([
      'core/extension.js',
      'extensions/*/code.js',
      'core/extensions.js'
    ]),
    concat('extensions.js'),
    replace({
      patterns: [{
        match: 'ListOfCommaSeperatedExtensionIdsGoHere',
        replacement: extensionClasses.join(', ')
      }, {
        match: 'ListOfCommaSeperatedExtensionIdsWithQuotesGoHere',
        replacement: extensionClasses.join("', '")
      }]
    }),
    //gulpif(production, uglify({ mangle: false })),
    gulp.dest('staging/assets')
  ], cb);
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
    .pipe(gulpif(production, cleanCSS({advanced: false, debug: true}, function(details) {
      let ratio = (details.stats.originalSize - details.stats.minifiedSize) / details.stats.originalSize;
      console.log(`  ${details.name}: ${details.stats.originalSize/1000}B -> ${details.stats.minifiedSize/1000}B (${parseInt(ratio*100, 10)}% reduction)`);
    })))
    .pipe(gulp.dest('staging/extensions'));
});

/*
 |--------------------------------------------------------------------------
 | Distribute Core and Extensions to browser specific folders
 |--------------------------------------------------------------------------
 */
 gulp.task('stage', ['build:vendor', 'build:core', 'build:core:css', 'build:extensions'], function() {
   return gulp.src('staging/**/*')
     .pipe(gulp.dest('browser/Chrome'))
     .pipe(gulp.dest('browser/Firefox'));
 });

/*
 |--------------------------------------------------------------------------
 | Compiles browser specific folders into one file
 |--------------------------------------------------------------------------
*/
gulp.task('package', ['build'], function() {
  let Chrome = gulp.src([
    'browser/Chrome/**/*',
    'LICENSE.md'
  ]).pipe(zip('Chrome.zip'))
    .pipe(gulp.dest('dist'));

  let Firefox = gulp.src([
    'browser/Firefox/**/*',
    'LICENSE.md'
  ]).pipe(zip('Firefox.zip'))
    .pipe(gulp.dest('dist'));

  return merge(Chrome, Firefox);
});

/*
 |--------------------------------------------------------------------------
 | Etc.
 |--------------------------------------------------------------------------
 */
 gulp.task('clean', function() {
   return del([
     'staging',
     'dist',
     'browser/Chrome/extensions',
     'browser/Chrome/assets/**/*',
     '!browser/Chrome/assets/bridge.js',
     'browser/Firefox/extensions',
     'browser/Firefox/assets/**/*',
     '!browser/Firefox/assets/bridge.js'
   ]);
 });

gulp.task('watch', ['build'], function() {
  production = false;

  gulp.watch(['core/*.js', '!core/extension.js', '!core/extensions.js'], ['build:core']);
  gulp.watch(['core/extension.js', 'extensions/*/code.js', 'core/extensions.js'], ['build:extensions:core']);
  gulp.watch(['extensions/**/*', '!extensions/**/*.scss', '!extensions/**/code.js'], ['build:extensions:copy']);
  gulp.watch('extensions/**/*.scss', ['build:extensions:css']);
  gulp.watch('staging/**/*', ['stage']);
});

gulp.task('build', ['stage']);
gulp.task('pack', ['package']);
gulp.task('default', ['build']);
