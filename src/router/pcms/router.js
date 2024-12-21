export default [
  // 充值
  {
    path: '/record',
    component: () => import('@/views/pcms/rechargeRecord/recordTable'),
    name: 'record',
    meta: {
      title: 'record',
      icon: 'documentation',
      affix: true
    }
  }
]
