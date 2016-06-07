var gulp = require('gulp');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require("gulp-sourcemaps");
var concat = require('gulp-concat');
var copy = require('gulp-copy');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var rename = require("gulp-rename");
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var htmlreplace = require('gulp-html-replace');
var livereload = require('gulp-livereload');
var reload_page = livereload.changed;
var cleanCSS = require('gulp-clean-css');

gulp.task('default', function() {
  // place code for your default task here
});

var path = {
  DEST: 'wwwroot/_themes/main/',
	SCSS: './src/scss/',
	SCSS_ENTRY: './src/scss/main.scss',
	CSS_SRC: './src/css',
	HTML_SRC: './src/html/**/*.html',
  JS_SRC_DIST: './src/dist/',
  JS_OUT: 'wwwroot/_themes/main/js/',
  JS_MIN: 'scripts.min.js',
  JS: ['./src/js/third_party/*.js','./src/js/Availability.js','./src/js/InTheArea.js','./src/js/App.js']
}

gulp.task('copyHTML', function(){
  gulp.src(path.HTML_SRC)
    .pipe(gulp.dest(path.DEST + 'layouts'));
});



gulp.task('sass', function () {
  gulp.src(path.SCSS_ENTRY)
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(sass())
    .pipe(gulp.dest(path.DEST + 'css'));
});

gulp.task('minify-css', function() {
  return gulp.src(path.DEST + 'css/main.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename("main.min.css"))
    .pipe(gulp.dest(path.DEST + 'css'));
});

gulp.task('replaceHTML', function(){
  gulp.src(path.HTML_SRC + '*.html')
    .pipe(htmlreplace({
      'js': {
        src: null,
        tpl: '<script src="{{ theme:js src="main.min.js" }}"></script>'
      },
      'css': {
        src: null,
        tpl: '<link rel="stylesheet" href="{{ theme:css src="main.min.css" }}" />'
      }
    }))
    .pipe(gulp.dest(path.DEST + 'layouts'));
});

gulp.task('scripts', function() {
  return gulp.src(path.JS)
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(path.JS_SRC_DIST));
});

gulp.task('copyJS', ['scripts'], function(){
  gulp.src(path.JS_SRC_DIST + 'scripts.js')
    .pipe(gulp.dest(path.JS_OUT));
});

gulp.task('compress', function() {
  return gulp.src('./src/dist/scripts.js')
    .pipe(uglify().on('error', gutil.log))
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest(path.JS_OUT).on('error', gutil.log));
});


gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(path.HTML, ['copy']);
  gulp.watch(path.SCSS + '**/*.scss', ['sass']);
  gulp.watch(path.JS, ['compress']);
  gulp.watch([path.DEST + '/**/*.*'], reload_page);
});

gulp.task('watchProduction', function() {
  livereload.listen();
  gulp.watch(path.JS, ['compress']);
});

gulp.task('production', ['replaceHTML', 'minify-css', 'compress' ]);

gulp.task('default', ['watch']);

