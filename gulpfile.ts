import * as gulp from "gulp";
import * as ts from "gulp-typescript";
import * as sass from "gulp-sass";

gulp.task("js", function () {
  return gulp
    .src("src/**/*.ts")
    .pipe(
      ts({
        esModuleInterop: true,
        noImplicitAny: true,
        outFile: "app.js",
      })
    )
    .pipe(gulp.dest("src/site/js"));
});

gulp.task("sass", function () {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(sass({ includePaths: ["node_modules"] }).on("error", sass.logError))
    .pipe(gulp.dest("src/site/css"));
});

gulp.task("watch", function () {
  gulp.watch("src/scss/**/*.scss", gulp.series("sass"));
  gulp.watch("src/js/**/*.js", gulp.series("js"));
});

gulp.task("default", gulp.series("js", "sass"));
