'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  context: path.resolve(__dirname, './'),
  resolve: {
    // extensions: ['.js', '.vue', '.json', '.css', '.scss'],
    alias: {
      '@': resolve('src'),
      '@views': resolve('src/views'),
      '@assets': resolve('src/assets'),
      '@comp': resolve('src/components'),
      '@utils': resolve('src/utils'),
      '@zhbfbed': resolve('src/zhbfbed'),
      '@mws': resolve('src/zhbfbed/viewsmws'),
      '@core': resolve('src/zhbfbed/core'),
    }
  }
}
