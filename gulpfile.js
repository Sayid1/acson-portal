const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const clean = require("gulp-clean");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const htmlmin = require("gulp-htmlmin");
const htmlreplace = require("gulp-html-replace");

gulp.task("fileinclude", function () {
  return gulp
    .src(["src/*.html"])
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest("dist"));
});

gulp.task("watch", function () {
  gulp.watch(["src/*.html", "partials/*.html"], gulp.series("fileinclude"));
});

// 清空 dist 目录任务
// gulp.task("clean", function () {
//   return gulp.src("dist", { read: false, allowEmpty: true }).pipe(clean());
// });
function cleanDist() {
  // body omitted
  return gulp.src("dist", { read: false, allowEmpty: true }).pipe(clean());
}

// 移动 assets 目录到 dist 目录并压缩其中的 CSS 和 JS 文件任务
function move() {
  return gulp.src("assets/**/*").pipe(gulp.dest("dist/assets"));
}

// 定义一个任务用于处理 JS 文件
function js() {
  return gulp
    .src("dist/assets/js/**/*.js") // 匹配 assets/js 目录及其子目录下的所有 JS 文件
    .pipe(sourcemaps.init()) // 初始化 sourcemaps
    .pipe(uglify()) // 压缩 JS 文件
    .pipe(sourcemaps.write(".")) // 写入 sourcemaps
    .pipe(gulp.dest("dist/js")); // 输出到 dist/js 目录
}

// 定义一个任务用于处理 CSS 文件
function css() {
  return gulp
    .src("dist/assets/css/**/*.css") // 匹配 assets/css 目录及其子目录下的所有 CSS 文件
    .pipe(sourcemaps.init()) // 初始化 sourcemaps
    .pipe(cleanCSS()) // 压缩 CSS 文件
    .pipe(sourcemaps.write(".")) // 写入 sourcemaps
    .pipe(gulp.dest("dist/css")); // 输出到 dist/css 目录
}
function html() {
  return gulp
    .src(["src/*.html"])
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"));
}

gulp.task("build", gulp.series(cleanDist, move, gulp.parallel(js, css, html)));
gulp.task("default", gulp.series("fileinclude", "watch"));
