export default [
  {
    path: '/visitRecord',
    name: 'visitRecord',
    component: () => import('../../views/vims/visitRecord')
  },
  {
    path: '/patientManage',
    name: 'patientManage',
    component: () => import('../../views/vims/patientManage')
  },
  {
    path: '/visitConfig',
    name: 'visitConfig',
    component: () => import('../../views/vims/visitConfig')
  }
];
