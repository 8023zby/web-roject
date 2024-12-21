export default [
  /* 终端管理路由配置 */
  {
    name: 'patientRoom',
    path: '/patientRoom/:deviceType',
    component: () => import('../../views/tdms/patientRoom/Main.vue'),
    meta: { title: '列表' }
  },
  {
    name: 'pimsManage',
    path: '/pimsManage/:deviceType',
    component: () => import('../../views/tdms/pimsManage/Main.vue'),
    meta: { title: '列表' }
  },
  {
    name: 'deveiceA10',
    path: '/deveiceA10/:deviceType',
    component: () => import('../../views/tdms/deveiceA10/Main.vue'),
    meta: { title: '列表' }
  },
  {
    name: 'deveiceA10IXL',
    path: '/deveiceA10IXL/:deviceType',
    component: () => import('../../views/tdms/deveiceA10IXL/Main.vue'),
    meta: { title: '列表' }
  },
  {
    name: 'outPatient',
    path: '/outPatient/:deviceType',
    component: () => import('../../views/tdms/outPatient/Main.vue'),
    meta: { title: '列表' }
  },
  {
    name: 'tzsb',
    path: '/tzsb/:deviceType',
    component: () => import('../../views/tdms/tzsb/Main.vue'),
    meta: { title: '列表' }
  },
  {
    name: 'mnis',
    path: '/mnis/:deviceType',
    component: () => import('../../views/tdms/mnis/Main.vue'),
    meta: { title: '列表' }
  },
  {
    name: 'zipManage',
    path: '/zipManage',
    component: () => import('../../views/tdms/zipManage/Main.vue'),
    meta: { title: '安装包管理' }
  },
  {
    name: 'smartPass',
    path: '/smartPass/:deviceType',
    component: () => import('../../views/tdms/smartPass/Main.vue'),
    meta: { title: '列表' }
  },
  {
    name: 'deviceRegNum',
    path: '/deviceRegNum',
    component: () => import('../../views/tdms/deviceRegNum/List.vue'),
    meta: { title: '注册设号' }
  }
]
