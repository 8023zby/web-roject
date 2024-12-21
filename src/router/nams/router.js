export default [
  //
  // {
  //   path: '/assess_add',
  //   name: 'assess_add',
  //   component: () => import('../../views/nams/assess/assess_add.vue')
  // },
  {
    path: '/list',
    name: 'index',
    component: () => import('../../views/nams/assess/list.vue'),
    meta: {
      isFullScreen: true
    }

  },
  {
    path: '/inapp',
    name: 'inapp',
    component: () => import('../../views/nams/assess/in.vue'),
    meta: {
      isFullScreen: true
    }

  },
  {
    path: '/assess_setting',
    name: 'assess_setting',
    component: () => import('../../views/nams/assess/assess_setting_main.vue')

  },
  {
    path: '/assessMassage',
    name: 'assessMassage',
    component: () => import('../../views/nams/assessManage/Main.vue')

  }
]
