import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
export default new VueRouter({
  routes: [
    {
      name: 'nrmsPad',
      path: '/nrmsPad',
      component: () => import('./Main.vue')
    },
    {
      name: 'clinicalList',
      path: '/clinicalList',
      component: () => import('./views/ClinicalSee/Main.vue')
    }
  ]
})
