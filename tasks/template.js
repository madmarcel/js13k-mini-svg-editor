const gulp = require('gulp')
const handlebars = require('handlebars')
const fs = require('fs')

function writeFile (fileName, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function readFile (fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) return reject(err)
      resolve(data.toString('utf8'))
    })
  })
}

gulp.task('build:html', [ 'build:js', 'build:css', 'build:assets' ], done => {
  readFile('./src/index.hbs')
    .then(str => {
      let result = handlebars.compile(str)()
      return writeFile('./build/index.html', result)
    })
    .then(done)
})

gulp.task('compile:html', [ 'compile:js', 'compile:css', 'compile:assets' ], done => {
  let files = {}

  readFile('./build/main.min.js')
    .then(js => files.js = js)
    .then(() => readFile('./build/main.min.css'))
    .then(css => files.css = css)
    .then(() => readFile('./src/index.hbs'))
    .then(str => {
      let inlineResult = handlebars.compile(str)({ js: files.js, css: files.css })
      return writeFile('./compile/index.html', inlineResult)
    })
    .then(done)
})
