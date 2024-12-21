export default [
  // 问卷
  {
    path: '/qsmsManage',
    component: () => import('@/views/qsms/qsmsManage/qsmsManage'),
    name: 'qsmsManage',
    meta: {
      title: 'qsmsManage',
      icon: 'documentation',
      affix: true
    }
  },{
    path: '/answerSheetList',
    component: () => import('@/views/qsms/qsmsList/list'),
    name: 'answerSheetList',
    meta: {
      title: 'answerSheetList',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/questionLibraryManage',
    component: () => import('@/views/qsms/questionLibraryManage/questionLibraryManage'),
    name: 'questionLibraryManage',
    meta: {
      title: 'questionLibraryManage',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/qsmsManageHW',
    component: () => import('@/views/qsms/qsmsManageHW/qsmsManageHW'),
    name: 'qsmsManageHW',
    meta: {
      title: 'qsmsManageHW',
      icon: 'documentation',
      affix: true
    }
  }
]
