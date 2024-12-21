import Vue from 'vue'
import App from './App'
import router from './init/routerInit' // 路由
import store from './init/storeInit' // 状态
import './init/componentsInit' // 全局组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 默认主题
import './init/cssInit' // 样式
import uniId from './directive/uni-id'

Vue.use(ElementUI, { size: 'small' })
Vue.directive('uni', uniId)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
