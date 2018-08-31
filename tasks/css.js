const gulp = require('gulp')
const concat = require('gulp-concat-css')
const cleanCss = require('gulp-clean-css')

gulp.task('build:css', () =>
  gulp.src('src/css/**/*.css')
    .pipe(concat('main.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest('./build'))
)

gulp.task('compile:css', () =>
  gulp.src('src/css/**/*.css')
    .pipe(concat('main.min.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest('./build'))
)
