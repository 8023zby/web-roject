import Vue from 'vue'
// 全局注册组件
const requireComponent = require.context('../../components', true, /[A-Za-z]\w+(common|Common)\.vue$/)
const components = {}
requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  fileName = (fileName.split('/'))[fileName.split('/').length - 1]
  // 如果这个组件选项是通过 `export default` 导出的，
  // 那么就会优先使用 `.default`，
  // 否则回退到使用模块的根。
  components[fileName] = componentConfig.default || componentConfig
})
Object.keys(components).forEach(key => {
  Vue.component(components[key].name, components[key])
})
