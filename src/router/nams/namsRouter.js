export default [
  {
    path: '/assess_info_repeat/:aid/:pid/:loopflag/:sum/:asstimes/:saveDataFlag/:levelType',
    name: 'assess_info_repeat',
    component: () => import('../../views/nams/assess/assess_info_repeat.vue')
  },
  {
    path: '/assess_info/:assId/:patientId/:isLoop/:assRate/:assTimes/:saveDataFlag/:levelType',
    name: 'assess_info',
    component: () => import('../../views/nams/assess/assess_info.vue')
  },
  {
    path: '/ass_auto_print/:assId/:patientId/:isLoop/:assRate/:assTimes/:saveDataFlag/:autoPrint',
    name: 'ass_auto_print',
    component: () => import('../../views/nams/assess/ass_auto_print.vue')
  }
]
