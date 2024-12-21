export default [
  {
    path: '/music',
    component: () => import('@/views/msms/musicManage/index.vue'),
    name: 'msms',
    meta: {
      title: 'msms',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/ebooks',
    component: () => import('@/views/msms/ebookManage/index.vue'),
    name: 'msms',
    meta: {
      title: 'msms',
      icon: 'documentation',
      affix: true
    }
  }
]
