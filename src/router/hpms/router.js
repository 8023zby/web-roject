export default [
  // 宣教
  {
    path: '/lableManage',
    component: () => import('@/views/hpms/eduCation/lableManage/main.vue'),
    name: 'lableManage',
    meta: {
      title: 'lableManage',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/ward',
    component: () => import('@/views/hpms/eduCation/ward/main.vue'),
    name: 'ward',
    meta: {
      title: 'ward',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/wholeWard',
    component: () => import('@/views/hpms/eduCation/wholeWard/main.vue'),
    name: 'wholeWard',
    meta: {
      title: 'wholeWard',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/ylward',
    component: () => import('@/views/hpms/eduCation/yl_ward/main.vue'),
    name: 'ylward',
    meta: {
      title: 'ylward',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/ylwholeWard',
    component: () => import('@/views/hpms/eduCation/yl_wholeWard/main.vue'),
    name: 'ylwholeWard',
    meta: {
      title: 'ylwholeWard',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/situation',
    component: () => import('@/views/hpms/eduCation/situation/main'),
    name: 'situation',
    meta: {
      title: 'situation',
      icon: 'documentation',
      affix: true
    }
  },
  // 宣教记录
  {
    path: '/eduRecord',
    component: () => import('@/views/hpms/eduCation/situation/eduRecord/Main'),
    name: 'eduRecord',
    meta: {
      title: 'eduRecord',
      icon: 'documentation',
      affix: true,
      isFullScreen: true
    }
  }
]
