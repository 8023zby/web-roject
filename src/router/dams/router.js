export default [
  {
    path: '/doctors_advice_jane_list',
    name: 'doctors_advice_jane_list',
    component: () => import('../../views/dams/doctors_advice_jane_list/Main.vue'),
    meta: {
      title: '医嘱信息',
      isFullScreen: true
    }
  },
  {
    path: '/doctors_advice_list',
    name: 'doctors_advice_list',
    component: () => import('../../views/dams/doctors_advice_list/Main.vue'),
    meta: {
      title: '医嘱列表',
      isFullScreen: true
    }
  },
  {
    path: '/doctors_advice_execute',
    name: 'doctors_advice_execute',
    component: () => import('../../views/dams/doctors_advice_execute/Main.vue'),
    meta: {
      title: '医嘱执行',
      isFullScreen: true
    }
  },
  {
    path: '/infusion_patrol',
    name: 'infusion_patrol',
    component: () => import('../../views/dams/infusion_patrol/Main.vue'),
    meta: {
      title: '输液巡视',
      isFullScreen: true
    }
  },
  {
    path: '/skin_test',
    name: 'skin_test',
    component: () => import('../../views/dams/SkinTest/Main.vue'),
    meta: {
      title: '皮试管理',
      isFullScreen: true
    }
  },
  {
    path: '/doctors_advice_set',
    name: 'doctors_advice_set',
    component: () => import('../../views/dams/doctors_advice_set/Main.vue'),
    props: {
      // 从tab转换过来
      // tab: {
      activeName: 'frequency'
      // }
    },
    meta: {
      title: '医嘱频次',
      isFullScreen: false
    }
  },
  {
    path: '/assess_set',
    name: 'assess_set',
    component: () => import('../../views/dams/doctors_advice_set/Main.vue'),
    props: {
      // 从tab转换过来
      // tab: {
      activeName: 'assess'
      // }
    },
    meta: {
      title: '评估频次',
      isFullScreen: false
    }
  },
  {
    path: '/doctors_advice_dispense',
    name: 'doctors_advice_dispense',
    component: () => import('../../views/dams/doctors_advice_dispense/Main.vue'),
    meta: {
      title: '配液管理',
      isFullScreen: true
    }
  }
]
