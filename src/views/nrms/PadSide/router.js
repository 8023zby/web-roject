import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
export default new VueRouter({
  routes: [
    {
      name: 'nrmsPadSide',
      path: '/nrmsPadSide',
      component: () => import('./Main.vue')
    }
  ]
})
