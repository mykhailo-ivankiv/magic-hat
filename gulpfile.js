var gulp = require("gulp");
var babel = require("gulp-babel");
var sass = require("gulp-sass");

var plumber = require('gulp-plumber');

gulp.task("default", function () {
    gulp.src("src/js/**")

        .pipe(plumber())
            .pipe(babel({modules: "amd"}))
        .pipe(plumber.stop())
        .pipe(gulp.dest("dist/js"));

    gulp.src("src/style/*.scss")
        .pipe(plumber())
            .pipe(sass())
        .pipe(plumber.stop())
        .pipe(gulp.dest("dist/style"))

        .on('error', function (error) {
            console.error('' + error);
        });

    gulp.src("src/*.html")
        .pipe(gulp.dest("dist/"));

    gulp.src("src/data/**")
        .pipe(gulp.dest("dist/data"));
});

gulp.task("watch", function (){
    gulp.watch('./src/**/*.*', ['default']);
})
