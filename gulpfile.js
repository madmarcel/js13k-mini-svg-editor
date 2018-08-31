const gulp = require('gulp')
require('./tasks/js')
require('./tasks/css')
require('./tasks/assets')
require('./tasks/template')
require('./tasks/zip')
require('./tasks/watch')

gulp.task('default', () => {
  console.log('\nPlease use npm run <script>, don\'t use gulp directly.\n')
})
