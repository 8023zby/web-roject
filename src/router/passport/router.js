export default [
  {
    name: 'jobType',
    path: '/jobType',
    component: () => import('../../views/passport/setting/jobtype/Main.vue'),
    meta: { title: '岗位类型' }
  }, {
    name: 'jobList',
    path: '/jobList',
    component: () => import('../../views/passport/setting/joblist/Main.vue'),
    meta: { title: '岗位列表' }
  }, {
    name: 'menu',
    path: '/menu',
    component: () => import('../../views/passport/menu/Main.vue'),
    meta: { title: '菜单管理' }
  }, {
    name: 'authority',
    path: '/authority',
    component: () => import('../../views/passport/authority/Main.vue'),
    meta: { title: '权限管理' }
  }, {
    name: 'role',
    path: '/role',
    component: () => import('../../views/passport/setting/role/Main.vue'),
    meta: { title: '角色管理' }
  },
  {
    name: 'user',
    path: '/user',
    component: () => import('../../views/passport/setting/user/Main.vue'),
    meta: { title: '用户账号列表' }
  },
  {
    name: 'userAdd',
    path: '/user/userAdd_fakeRouter',
    component: () => import('../../views/passport/setting/user/userAddModify.vue'),
    meta: { title: '用户账号添加' }
  },
  {
    path: '/errorInfo',
    name: 'errorInfo',
    component: () => import('../../views/passport/ErrorInfo.vue')
  },
  {
    path: '/error500',
    name: 'error500',
    component: () => import('../../views/passport/Error500.vue')
  },
  {
    path: '/org_reg_list',
    name: 'org_reg_list',
    component: () => import('../../views/passport/orgReg/Main.vue')
  },
  {
    path: '/logList',
    name: 'logList',
    component: () => import('../../views/passport/setting/log/List.vue')
  },
  {
    path: '/loginLog',
    name: 'loginLog',
    component: () => import('../../views/passport/setting/loginLog/List.vue')
  },
  {
    path: '/homePage',
    name: 'homePage',
    component: () => import('../../views/passport/homePage/List.vue')
  },
  {
    path: '/menuSort',
    name: 'menuSort',
    component: () => import('../../views/passport/menuSort/Tab.vue')
  },
  {
    path: '/commonSet',
    name: 'commonSet',
    component: () => import('../../views/passport/commonSet/Main.vue')
  },
  {
    path: '/rebootSet',
    name: 'rebootSet',
    component: () => import('../../views/passport/rebootSet/Main.vue')
  },
  {
    path: '/userFace',
    name: 'userFace',
    component: () => import('../../views/passport/setting/userFace/Main.vue')
  },
  {
    path: '/videoServeSet',
    name: 'videoServeSet',
    component: () => import('../../views/passport/videoServeSet/Main.vue')
  },
  {
    path: '/orgManage',
    name: 'orgManage',
    component: () => import('../../views/passport/orgManage/Main.vue')
  },
  {
    path: '/systemLicense',
    name: 'systemLicense',
    component: () => import('../../views/passport/systemLicense/Main.vue')
  },
  {
    path: '/systemSet',
    name: 'systemSet',
    component: () => import('../../views/passport/systemSet/Main.vue')
  },
  {
    path: '/systemSetPims',
    name: 'systemSetPims',
    component: () => import('../../views/passport/systemSetPims/Main.vue')
  },
  {
    path: '/systemSetOrg',
    name: 'systemSetOrg',
    component: () => import('../../views/passport/systemSetOrg/Main.vue')
  },
  {
    path: '/deviceManage',
    name: 'deviceManage',
    component: () => import('../../views/passport/deviceManage/Main.vue')
  },
  /* 组织架构菜单配置 */
  {
    name: 'departConfig',
    path: '/departConfig',
    component: () => import('../../views/passport/department/departConfig.vue'),
    meta: { title: '部门配置' }
  },
  {
    name: 'regionType',
    path: '/regionType',
    component: () => import('../../views/passport/region/Main.vue'),
    meta: { title: '区域类型' }
  },
  {
    name: 'regionConfig',
    path: '/regionConfig',
    component: () => import('../../views/passport/region/regionConfig.vue'),
    meta: { title: '区域配置' }
  },
  {
    name: 'roomsList',
    path: '/roomsList',
    component: () => import('../../views/passport/rooms/Main.vue'),
    meta: { title: '房间列表' }
  },
  {
    name: 'bedsList',
    path: '/bedsList',
    component: () => import('../../views/passport/beds/Main.vue'),
    meta: { title: '床位列表' }
  },
  {
    name: 'bedsList_pims',
    path: '/bedsList_pims',

    component: () => import('../../views/passport/beds_pims/Main.vue'),
    meta: { title: '床位列表' }
  },
  {
    name: 'createRoom',
    path: '/createRoom',
    component: () => import('../../views/passport/createRoom/Main.vue'),
    meta: { title: '床位列表' }
  },
  {
    path: '/versionLog_noneRouter',
    name: 'versionLog_noneRouter',
    component: () => import('../../views/passport/VersionsLog.vue')
  },
  {
    path: '/versionCheck',
    name: 'versionCheck',
    component: () => import('../../views/passport/setting/versionCheck/List.vue')
  },
  {
    path: '/checkInterface',
    name: 'checkInterface',
    component: () => import('../../views/passport/interface/Main.vue')
  }
]
