import Vue from 'vue'
import App from './index.vue'
import router from './android.router.js'
import animated from 'animate.css'
// 引用Element
Vue.use(animated)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#androidapp')
