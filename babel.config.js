module.exports = {
  presets: [
    '@vue/app',
    ['@babel/env',
      {
        'modules': false
      }
    ]
  ],
  plugins: [
    [
      'import',
      { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: 'css' }
    ]
  ]
}
