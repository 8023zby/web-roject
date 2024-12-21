const webpack = require('webpack')
module.exports = {
  publicPath: './',
  lintOnSave: false,
  outputDir: 'dist', // 构建输出目录
  assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
  filenameHashing: true,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery'
      })
    ],
    optimization: {
      minimizer: [
        {
          apply: (compiler) => {
            // 在 apply 方法中修改配置
            compiler.options.optimization.minimizer.forEach((minimizer) => {
              if (minimizer.constructor.name === 'TerserPlugin') {
                // 禁用混淆
                minimizer.options.terserOptions.mangle = false
              }
            })
          }
        }
      ]
    }
  },
  chainWebpack: (config) => {
    config.plugin('provide').use(webpack.ProvidePlugin, [
      {
        'window.Quill': 'quill',
      },
    ]);

    config.optimization.splitChunks({
      chunks: 'async',
      minSize: 60000,
      minChunks: 2,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendors',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    });
  },
  pages: {
    index: 'src/main.js',
  },
  devServer: {
    disableHostCheck: true,
    port: 80,
    proxy: {
      '/': {
        target: 'http://www.yarward.com/',
        changeOrigin: true,
        ws: false,
      },
    },
  },
};
