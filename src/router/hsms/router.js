export default [
  {
    path: '/nurseDuty',
    name: 'nurseDuty',
    component: () => import('../../views/hsms/nurseDuty/Main.vue')
  },
  {
    path: '/nurseDeptDuty',
    name: 'nurseDeptDuty',
    component: () => import('../../views/hsms/nurseDeptDuty/Main.vue')
  },
  {
    path: '/duty/:businessType',
    name: 'duty',
    component: () => import('../../views/hsms/duty/Main.vue')
  },
  {
    path: '/deptDuty/:businessType',
    name: 'deptDuty',
    component: () => import('../../views/hsms/deptDuty/Main.vue')
  },
  {
    path: '/group/:businessType',
    name: 'group',
    component: () => import('../../views/hsms/group/Main.vue') // 老的护理分组
  },
  {
    path: '/nuserCareGroup',
    name: 'nuserCareGroup',
    component: () => import('../../views/hsms/nurseGroup/List.vue') // 新的护理分组
  },
  {
    path: '/apply/:businessType',
    name: 'apply',
    component: () => import('../../views/hsms/apply/Main.vue')
  },
  {
    path: '/remark/:businessType',
    name: 'remark',
    component: () => import('../../views/hsms/remark/Main.vue')
  },
  {
    path: '/nurseShiftStatistics/:businessType',
    name: 'nurseShiftStatistics',
    component: () => import('../../views/hsms/nurseShiftStatistics/Main.vue')
  },
  // 医生排班流水
  {
    path: '/shiftTab/:businessType',
    // name: 'shiftTab',
    // component: () => import('../../views/hsms/shiftTab/ShiftTab.vue'),
    component: () => import('../../views/hsms/shiftTab/Main.vue'),
    children: [{
      path: '',
      components: {
        nurseShiftInformationRule: () => import('../../views/hsms/shiftInformationRule/ShiftInformationRule.vue'),
        nurseMonthShiftInformationRule: () => import('../../views/hsms/shiftInformationRule/MonthShiftInformationRule.vue'),
        nurseShiftInformation: () => import('../../views/hsms/shiftInformation/ShiftInformation.vue'),
        nurseMonthShiftInformation: () => import('../../views/hsms/shiftInformation/MonthShiftInformation.vue'),
        nurseDutyBed: () => import('../../views/hsms/dutyBed/DutyBed.vue'),
        editShiftInformationRule: () => import('../../views/hsms/shiftTab/editShiftInformationRule.vue'),
        editMonthShiftInformationRule: () => import('../../views/hsms/shiftTab/editMonthShiftInformationRule.vue'),
        editShiftInformation: () => import('../../views/hsms/shiftTab/editShiftInformation.vue'),
        editMonthShiftInformation: () => import('../../views/hsms/shiftTab/editMonthShiftInformation.vue')
      }
    }]
  },
  // 护士排班流水
  {
    path: '/nurseShiftTab/:businessType',
    // name: 'nurseShiftTab',
    // component: () => import('../../views/hsms/shiftTab/ShiftTab.vue'),
    component: () => import('../../views/hsms/nurseShiftTab/Main.vue'),
    children: [{
      path: '',
      components: {
        nurseShiftInformationRule: () => import('../../views/hsms/nurseShiftInformationRule/ShiftInformationRule.vue'),
        nurseMonthShiftInformationRule: () => import('../../views/hsms/nurseShiftInformationRule/MonthShiftInformationRule.vue'),
        nurseShiftInformation: () => import('../../views/hsms/nurseShiftInformation/ShiftInformation.vue'),
        nurseMonthShiftInformation: () => import('../../views/hsms/nurseShiftInformation/MonthShiftInformation.vue'),
        nurseDutyBed: () => import('../../views/hsms/dutyBed/DutyBed.vue'),
        editShiftInformationRule: () => import('../../views/hsms/nurseShiftTab/editShiftInformationRule.vue'),
        editMonthShiftInformationRule: () => import('../../views/hsms/nurseShiftTab/editMonthShiftInformationRule.vue'),
        editShiftInformation: () => import('../../views/hsms/nurseShiftTab/editShiftInformation.vue'),
        editMonthShiftInformation: () => import('../../views/hsms/nurseShiftTab/editMonthShiftInformation.vue')
      }
    }]
  },
  {
    path: '/nurseShiftTabOutPatient/:businessType',
    // name: 'nurseShiftTabOutPatient',
    component: () => import('../../views/hsms/shiftTab/ShiftTabOutPatient.vue'),
    children: [{
      path: '',
      components: {
        nurseShiftInformationRule: () => import('../../views/hsms/shiftInformationRule/ShiftInformationRule.vue'),
        nurseMonthShiftInformationRule: () => import('../../views/hsms/shiftInformationRule/MonthShiftInformationRule.vue'),
        nurseShiftInformation: () => import('../../views/hsms/shiftInformation/ShiftInformationOutPatient.vue'),
        nurseMonthShiftInformation: () => import('../../views/hsms/shiftInformation/MonthShiftInformation.vue'),
        nurseDutyBed: () => import('../../views/hsms/dutyBed/DutyBed.vue')
      }
    }]
  },
  {
    path: '/levelStatistics/:businessType',
    name: 'levelStatistics',
    component: () => import('../../views/hsms/levelStatistics/Main.vue'),
    children: [
      {
        path: '/level',
        name: 'level',
        component: () => import('../../views/hsms/level/Main.vue')
      },
      {
        path: '/post',
        name: 'post',
        component: () => import('../../views/hsms/post/Main.vue')
      }
    ]
  },
  {
    path: '/nurseShiftMerits/:businessType',
    name: 'nurseShiftMerits',
    component: () => import('../../views/hsms/nurseShiftMerits/Main.vue'),
    children: [
      {
        path: '/dutyCoefficient',
        name: 'dutyCoefficient',
        component: () => import('../../views/hsms/dutyCoefficient/Main.vue')
      }
    ]
  },
  // 存假管理
  {
    path: '/save_holidays_manage',
    name: 'save_holidays_manage',
    component: () =>
            import('../../views/hsms/saveHolidaysManage/List.vue'),
    meta: {
      title: '存假管理',
      isFullScreen: true
    }
  },
  // 年假管理
  {
    path: '/annual_holidays_manage',
    name: 'annual_holidays_manage',
    component: () =>
            import('../../views/hsms/annualHolidaysManage/List.vue'),
    meta: {
      title: '年假管理',
      isFullScreen: true
    }
  },
  {
    path: '/holidayNurse',
    name: 'holidayNurse',
    component: () => import('../../views/hsms/HolidayManagement/Main.vue')
  },
  // 医疗分组-新
  {
    path: '/doctor_group',
    name: 'doctor_group',
    component: () =>
          import('../../views/hsms/doctorGroup/List.vue'),
    meta: {
      title: '医疗分组',
      isFullScreen: true
    }
  }

]
