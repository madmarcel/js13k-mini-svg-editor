const gulp = require('gulp')

const js = './src/*.js'
const js1 = './index.js'
const js2 = './src/classes/*.js'
const css = './src/css/*.css'
const html = './src/index.hbs'
const images = './assets/*.png'

gulp.task('watch:build', () =>
  gulp.watch([js, js1, js2, css, html, images], ['build:html'])
)

gulp.task('watch:compile', () =>
  gulp.watch([js, js1, js2, css, html, images], ['compile:html'])
)
