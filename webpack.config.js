const path = require('path')
const ClosureCompilerPlugin = require('webpack-closure-compiler')

module.exports = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.min.js',
    sourceMapFilename: 'main.min.map'
  },

  plugins: [
    new ClosureCompilerPlugin({
      compiler: {
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5',
        compilation_level: 'ADVANCED'
      },
      concurrency: 3
    })
  ]
}
