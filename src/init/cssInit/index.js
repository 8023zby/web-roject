// 全局样式
const requireFile = require.context(
  '../../',
  true,
  /(global.scss|global.css|Global.scss)$/
)
requireFile.keys().forEach(fileName => {
  // 获取要加载的css样式
  requireFile(fileName)
})
