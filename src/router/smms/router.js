export default [
  // 商城
  {
    path: '/billCheck',
    component: () => import('@/views/smms/shoppingMall/billCheck/index'),
    name: 'billCheck',
    meta: {
      title: 'billCheck',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/shop',
    component: () => import('@/views/smms/shoppingMall/shop'),
    name: 'shop',
    meta: {
      title: 'shop',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/wareCategory',
    component: () => import('@/views/smms/shoppingMall/wareCategory'),
    name: 'wareCategory',
    meta: {
      title: 'wareCategory',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/businessManage',
    component: () => import('@/views/smms/shoppingMall/businessManage/main'),
    name: 'businessManage',
    meta: {
      title: 'businessManage',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/wareManage',
    component: () => import('@/views/smms/shoppingMall/wareManage/main'),
    name: 'wareManage',
    meta: {
      title: 'ware',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/orderList',
    component: () => import('@/views/smms/shoppingMall/orderList'),
    name: 'orderList',
    meta: {
      title: 'orderList',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/wareOnshelfList',
    component: () => import('@/views/smms/shoppingMall/wareOnshelf/index'),
    name: 'wareOnshelfList',
    meta: {
      title: 'wareOnshelfList',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/orderComments',
    component: () => import('@/views/smms/shoppingMall/orderComments'),
    name: 'orderComments',
    meta: {
      title: 'orderComments',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/wareBill',
    component: () => import('@/views/smms/shoppingMall/wareBill/main'),
    name: 'wareBill',
    meta: {
      title: 'wareBill',
      icon: 'documentation',
      affix: true
    }
  }
]
