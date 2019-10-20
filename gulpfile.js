var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var useref = require("gulp-useref");
var cleanCSS = require("gulp-clean-css");
var connect = require("gulp-connect");
var del = require("del");

var paths = {
  assets: "src/assets/**/*",
  html: "src/*.html",
  css: "src/css/*.css",
  js: [
    "src/bower_components/phaser-official/build/phaser.min.js",
    "src/js/**/*.js"
  ],
  dist: "./dist/"
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del(["dist"]);
}

function assets() {
  return gulp.src(paths.assets).pipe(gulp.dest(paths.dist + "assets"));
}

function copyhtml() {
  return gulp
    .src(paths.html)
    .pipe(useref())
    .pipe(gulp.dest(paths.dist));
}

/*
 * Define our tasks using plain functions
 */
function styles() {
  return (
    gulp
      .src(paths.css)
      .pipe(cleanCSS())
      // pass in options to the stream
      .pipe(
        rename({
          basename: "main",
          suffix: ".min"
        })
      )
      .pipe(gulp.dest(paths.dist))
  );
}

function scripts() {
  return gulp
    .src(paths.js, { sourcemaps: true })
    .pipe(uglify())
    .pipe(concat("main.min.js"))
    .pipe(gulp.dest(paths.dist));
}

function connectServer() {
  connect.server({
    root: [__dirname + "/dist"],
    port: 9000,
    livereload: true
  });
}

function watch() {
  gulp.watch(paths.html, copyhtml);
  gulp.watch(paths.js, scripts);
  gulp.watch(paths.css, styles);
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(
  clean,
  gulp.parallel(assets, copyhtml, styles, scripts)
);
var run = gulp.series(connectServer, gulp.parallel(watch));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.assets = assets;
exports.copyhtml = copyhtml;
exports.styles = styles;
exports.scripts = scripts;
exports.connect = connect;
exports.clean = clean;
exports.watch = watch;
exports.build = build;
exports.run = run;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = run;
