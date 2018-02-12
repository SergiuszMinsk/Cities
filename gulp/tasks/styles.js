var gulp = require('gulp'),
    sass = require('gulp-sass');

gulp.task('styles', function() {
    return gulp.src(['./app/assets/styles/**/*.scss'])
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./app/temp/styles'))
});