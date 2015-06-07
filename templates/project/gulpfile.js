var gulp = require('gulp')
  , del = require('del')
  , rename = require('gulp-rename')
  , plumber = require('gulp-plumber')
  , stylus = require('gulp-stylus')
  , autoprefix = require('gulp-autoprefixer')
  , minifyCss = require('gulp-minify-css')
  , uglify = require('gulp-uglify')
  , concat = require('gulp-concat')
  , browserSync = require('browser-sync').create()
  , bower = require('bower-files')()
  , jshint = require('gulp-jshint')
  , jade = require('gulp-jade')
  , src = './src'
  , dist = './dist'


/**
 * CLEAN
 * Various clean tasks that remove un-needed code from each build.
 */
gulp.task('clean:scripts', function (done) {
  del([dist + '/scripts/**/*.js', '!**/vendor.js'], done)
})

gulp.task('clean:styles', function (done) {
  del([dist + '/styles'], done)
})

gulp.task('clean:images', function (done) {
  del([dist + '/images'], done)
})

/**
 * BOWER:SCRIPTS
 * Compiles the "vendor.js" file containing all bower installed scripts.
 */
gulp.task('bower:scripts', function () {
  return gulp.src(bower.ext('js').files)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist + '/scripts'));
})

/**
 * STYLES:COMPILE
 * Compile Stylus files, apply vendor prefixes and minify stylesheets.
 */
gulp.task('styles', ['clean:styles'], function () {
  return gulp.src(src + '/*.styl')
    .pipe(plumber())
    .pipe(stylus())
    .pipe(autoprefix())
    .pipe(gulp.dest(dist + '/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifyCss())
    .pipe(gulp.dest(dist + '/styles'))
})

/**
 * SCRIPTS
 * Minify and concatenate scripts to the distribution folder.
 */
gulp.task('scripts', function () {
  return gulp.src(src + '/scripts/**/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dist + '/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(dist + '/scripts'))
})

/**
 * IMAGES
 * Copying images to the distribution folder.
 */
gulp.task('images', ['clean:images'], function () {
  return gulp.src(src + '/images/**/*')
    .pipe(gulp.dest(dist + '/images'))
})

/**
 * TEMPLATES
 * Compile templates into a static HTML files.
 */
gulp.task('templates', function () {
  return gulp.src(src + '/*.jade')
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest(dist))
})

/**
 * BUILD
 * Run all compilation tasks.
 */
gulp.task('build', ['bower:scripts', 'styles', 'scripts', 'images', 'templates'])

/**
 * WATCH
 * Automatically run tasks on file change.
 */
gulp.task('watch', ['build'], function () {
  gulp.watch('./bower.json', ['bower:scripts'])
  gulp.watch(src + '/styles/**/*.styl', ['styles'])
  gulp.watch(src + '/scripts/**/*.js', ['scripts'])
  gulp.watch(src + '/images/**/*', ['images'])
})

/**
 * SERVE
 * Spins up a browser-sync server that watches for file changes.
 */
gulp.task('serve', ['build'], function () {

  browserSync.init({
    files: [dist + '/**/*'],
    server: {
      baseDir: dist
    }
  })

})

/**
 * DEFAULT TASK
 */
gulp.task('default', ['watch', 'serve'])
