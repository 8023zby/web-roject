export default [
  {
    path: '/shiftInformationPrint',
    name: 'shiftInformationPrint',
    component: () => import('../../views/hsms/shiftInformation/Print.vue')
  },
  {
    path: '/nurseShiftInformationPrint',
    name: 'nurseShiftInformationPrint',
    component: () => import('../../views/hsms/nurseShiftInformation/Print.vue')
  },
  {
    path: '/shiftInformationBedPrint',
    name: 'shiftInformationBedPrint',
    component: () => import('../../views/hsms/dutyBed/Print.vue')
  },
  {
    path: '/shiftMeritsPrint',
    name: 'shiftMeritsPrint',
    component: () => import('../../views/hsms/nurseShiftMerits/Print.vue')
  }
]
