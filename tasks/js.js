const gulp = require('gulp')
const rollup = require('rollup-stream')
const localResolve = require('rollup-plugin-local-resolve')
const sourceMaps = require('gulp-sourcemaps')
const buffer = require('vinyl-buffer')
const source = require('vinyl-source-stream')
const webpack = require('webpack')
const config = require('../webpack.config.js')
const gulpWebpack = require('gulp-webpack')

gulp.task('build:js', () =>
  rollup({
    entry: 'src/index.js',
    plugins: [localResolve()],
    format: 'es',
    sourceMap: true
  })
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourceMaps.init({ loadMaps: true }))
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest('./build'))
)

gulp.task('build:js:min', () =>
  rollup({
    entry: 'src/index.js',
    plugins: [localResolve()],
    format: 'es'
  })
    .pipe(source('main.min.js'))
    .pipe(gulp.dest('./build'))
)

gulp.task('compile:js', ['build:js:min'], () =>
  gulp.src('./build/main.min.js')
    .pipe(gulpWebpack(config), webpack)
    .pipe(gulp.dest('./build'))
)
