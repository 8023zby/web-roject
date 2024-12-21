import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let stores = {}
const requireComponent = require.context(
  // 其组件目录的相对路径
  '../../store',
  // 是否查询其子目录
  true,
  // 匹配基础文件名的正则表达式
  /(store.js|Store.js)$/
)
requireComponent.keys().forEach(fileName => {
  // 获取动态状态
  const componentConfig = requireComponent(fileName)
  let arr = fileName.split('/')
  const key = arr[2].replace('.js', '')
  const item = componentConfig.default
  let temp = {}
  // 增加模块内的多模块状态管理
  temp[`${arr[1]}_${key}`] = item
  stores = { ...stores, ...temp }
})

export default new Vuex.Store({
  modules: stores
})
