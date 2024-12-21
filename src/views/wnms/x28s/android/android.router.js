/*
 * @Author: 翟冲
 * @Owner:
 * @Date: 2022-11-07 10:27:37
 * @LastEditTime: 2022-12-08 16:32:20
 * @LastEditors: 翟冲
 * @Description:
 * @FilePath: \yarward-wnms-frontEnd\src\views\wnms\x28s\android\android.router.js
 */
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const routes = [

  {
    path: '/',
    name: '主页',
    component: () => import('./csms/tempindex.vue')
  },
  {
    path: '/home/404',
    name: '404',
    component: () => import('../../x28s/android/csms/404.vue')
  }
];

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
});
