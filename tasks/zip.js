const gulp = require('gulp')
const zip = require('gulp-zip')
const size = require('gulp-size')
const packageJson = require('../package.json')
const name = packageJson.project || 'game'
const notify = require('gulp-notify')

gulp.task('compile:zip', [ 'compile:html' ], () => {

  let s = size();

  return gulp.src('./compile/**/*')
    .pipe(zip(`${name}.zip`))
    .pipe(size())
    .pipe(s)
    //.pipe(micro({limit: 13 * 1024}))
    .pipe(gulp.dest('./releases'))
    .pipe(notify({
            title: 'Build result',
            onLast: true,
            message: function () {
                return '\nTotal size\t\t' + s.prettySize + '\n' + 'Bytes used\t\t' + s.size + '\n' + 'Bytes left\t\t' + ((13 * 1024) - s.size);
            }
    }));
    }
)
