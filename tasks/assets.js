const gulp = require('gulp')
const rename = require('gulp-rename')

const image = './src/assets/*.png'

gulp.task('build:assets', () =>
  gulp.src(image)
    .pipe(rename('images.png'))
    .pipe(gulp.dest('./build'))
)

gulp.task('compile:assets', () =>
  gulp.src(image)
    .pipe(rename('images.png'))
    .pipe(gulp.dest('./compile'))
)
