export default [
  {
    path: '/',
    redirect: '/login'
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('../../views/passport/Login.vue')
  },
  {
    name: 'loginNew',
    path: '/loginNew',
    component: () => import('../../views/passport/LoginNew.vue')
  },
  {
    name: 'login',
    path: '/phone/login',
    component: () => import('../../views/passport/Login_phone.vue')
  },
  {
    name: 'org_reg',
    path: '/org_reg',
    component: () => import('../../views/passport/Org.vue')
  },
  {
    path: '/changePassword',
    name: 'changePassword',
    component: () => import('../../views/passport/ChangePassword.vue')
  },
  {
    path: '/passport_menu',
    name: 'passport_menu',
    component: () => import('../../views/passport/menu/Main.vue')
  },
  {
    path: '/passport_authority',
    name: 'passport_authority',
    component: () => import('../../views/passport/authority/Main.vue')
  },
  {
    path: '/passport_systemApply',
    name: 'passport_systemApply',
    meta: {
      noPrevent: 'yes'
    },
    component: () => import('../../views/passport/SystemApply.vue')
  },
  {
    path: '/UserReg',
    name: 'UserReg',
    component: () => import('../../views/passport/UserReg.vue')
  }
]
