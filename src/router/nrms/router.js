export default [
  {
    path: '/nurse_notes',
    name: 'nurse_notes',
    component: () =>
      import(/* webpackChunkName: "nurse_notes" */ '../../views/nrms/NurseNotes/Main.vue'),
    meta: {
      isFullScreen: true
    }
  },
  // {
  //   path: '/nurse_notes_print',
  //   name: 'nurse_notes_print',
  //   component: () =>
  //     import(/* webpackChunkName: "nurse_notes_print" */ '../../views/nrms/NurseNotes/Print.vue')
  // },
  // {
  //   path: '/nurse_notes_add',
  //   name: 'nurse_notes_add',
  //   component: () =>
  //     import(/* webpackChunkName: "nurse_notes_add" */ '../../views/nrms/NurseNotes/Add.vue')
  // },
  {
    path: '/nurseFocus',
    name: 'nurseFocus',
    component: () =>
      import('../../views/nrms/NurseFocus/Main.vue')
  },
  // 体征记录
  {
    path: '/sign_record',
    name: 'sign_record',
    component: () =>
      import('../../views/nrms/SignRecord/Sign_Main.vue'),
    meta: {
      isFullScreen: true
    }
  },
  // 体征项字典
  {
    path: '/sign_item',
    name: 'sign_item',
    component: () =>
      import('../../views/nrms/SignDictionary/SignMain.vue'),
    meta: {
      isFullScreen: true
    }
  },
  // 体征项管理
  {
    path: '/sign_manage',
    name: 'sign_manage',
    component: () =>
      import('../../views/nrms/SignManage/list.vue')
  },
  // 体况
  {
    path: '/body_condition',
    name: 'body_condition',
    component: () =>
      import('../../views/nrms/BodyCondition/Main.vue'),
    meta: {
      isFullScreen: true
    }
  },
  {
    path: '/clinicalReport',
    name: 'clinicalReport',
    component: () =>
      import('../../views/nrms/NurseClinicalReport/Main.vue'),
    meta: {
      isFullScreen: true
    },

    children: [{
      path: 'clinical-report-examine-details_fakeRouter',
      name: 'clinical-report-examine-details',
      component: () =>
        import('../../views/nrms/NurseClinicalReport/examineDetails.vue'),
      meta: {
        isFullScreen: true
      }
    }, {
      name: 'inspection-details',
      path: 'inspection-details_fakeRouter',
      component: () => import('../../views/nrms/NurseClinicalReport/inspectionDetails'),
      meta: {
        isFullScreen: true
      }
    }, {
      name: 'inspection-dicom',
      path: 'inspection-dicom',
      component: () => import('../../views/nrms/NurseClinicalReport/inspectionPreview/dicom.vue'),
      meta: {
        isFullScreen: true
      }
    }, {
      name: 'inspection-html',
      path: 'inspection-html',
      component: () => import('../../views/nrms/NurseClinicalReport/inspectionPreview/html.vue'),
      meta: {
        isFullScreen: true
      }
    }]
  },
  {
    path: '/clinicalReportDoctorNurse',
    name: 'clinicalReportDoctorNurse',
    component: () =>
      import('../../views/nrms/Pad/views/ClinicalSee/Main.vue')
  },
  {
    path: '/pad_main',
    name: 'pad_main',
    component: () =>
      import('../../views/nrms/Pad/Main.vue')
  },
  {
    path: '/pad_side_main',
    name: 'pad_side_main',
    component: () =>
      import('../../views/nrms/PadSide/Main.vue')
  },
  {
    path: '/education_nrms',
    name: 'education_nrms',
    component: () =>
      import('../../views/nrms/Education/Main.vue')
  },
  {
    path: '/education_list_nrms',
    name: 'education_list_nrms',
    component: () =>
      import('../../views/nrms/EducationList/Main.vue')
  },
  {
    path: '/patrol_setting',
    name: 'patrol_setting',
    component: () =>
      import('../../views/nrms/Patrol/PatrolSetting.vue')
  },
  {
    path: '/patrol_list',
    name: 'patrol_list',
    component: () =>
      import('../../views/nrms/Patrol/Main.vue')
  },
  {
    path: '/patrol_contents',
    name: 'patrol_contents',
    component: () =>
      import('../../views/nrms/Patrol/Contents.vue')
  },
  {
    path: '/patrol_times',
    name: 'patrol_times',
    component: () =>
      import('../../views/nrms/Patrol/Times.vue')
  },
  {
    path: '/HandoverRecord',
    name: 'HandoverRecord',
    meta: {
      isFullScreen: true
    },
    component: () =>
      import('../../views/nrms/HandoverRecord/Main.vue')
  },
  {
    path: '/operation',
    name: 'operation',
    meta: {
      isFullScreen: true
    },
    component: () =>
      import('../../views/nrms/Operation/Main.vue')
  },
  {
    path: '/form_manage/:formType',
    name: 'form_manage',
    component: () =>
      import('../../views/nrms/FormManage/Main.vue'),
    meta: {
      title: '表单管理'
    }

  },
  {
    path: '/form_manage',
    name: 'form_manage',
    component: () =>
      import('../../views/nrms/FormManage/Main.vue'),
    meta: {
      title: '表单管理',
      isFullScreen: true
    }

  },
  {
    path: '/critical_value',
    name: 'critical_value',
    component: () =>
      import('../../views/nrms/CriticalValueSetting/Main.vue'),
    meta: {
      title: '危急值设置'
    }
  },
  // 危急值 检查项目字典设置
  {
    path: '/check_danger_dictionary',
    name: 'check_danger_dictionary',
    component: () =>
      import('../../views/nrms/CheckDangerDictionary/Main.vue'),
    meta: {
      title: '检查项目字典设置',
      isFullScreen: true
    }
  },
  {
    path: '/observe',
    name: 'observe',
    component: () => import('../../views/nrms/Observe/Main.vue'),
    meta: {
      title: '观察记录',
      isFullScreen: true
    }
  },
  {
    path: '/inspect_inform',
    name: 'inspect_inform',
    component: () => import('../../views/nrms/InspectNotice/Main.vue'),
    meta: {
      title: '检查通知单',
      isFullScreen: true
    }
  },
  {
    path: '/into_assess',
    name: 'into_assess',
    component: () => import('../../views/nrms/IntoAssess/Main.vue'),
    meta: {
      title: '转入评估单',
      isFullScreen: true
    }
  },
  // 心率监测
  {
    path: '/heart-rate-monitoring',
    name: 'heart-rate-monitoring',
    component: () =>
      import('../../views/nrms/HeartRateMonitoring/Main')
  },
  // 入院评估
  {
    path: '/admission_assess',
    name: 'admission-assess',
    component: () => import('../../views/nrms/AdmissionAssess/Main'),
    meta: {
      title: '中心医院入院评估',
      isFullScreen: true
    }
  },
  // 风险评估
  {
    path: '/nams_assess_list2',
    name: 'nams_assess_list2',
    component: () => import('../../views/nrms/RiskAssessment/Main'),
    meta: {
      title: '中心医院风险评估',
      isFullScreen: true
    }
  },
  {
    path: '/mews-manage',
    name: 'mews-manage',
    component: () => import('../../views/nrms/Mews/MewsManage'),
    meta: {
      title: 'mews设置',
      // isFullScreen: true
    }
  },
  {
    path: '/mews-record',
    name: 'mews-record',
    component: () => import('../../views/nrms/MewsRecord/List'),
    meta: {
      title: 'mews记录',
      isFullScreen: true
    }
  },
  {
    path: '/critical_value',
    name: 'critical_value',
    component: () =>
      import('../../views/nrms/CriticalValueSetting/Main.vue'),
    meta: {
      title: '危急值设置'
    }
  },
  // 危急值 检查项目字典设置
  {
    path: '/check_danger_dictionary',
    name: 'check_danger_dictionary',
    component: () =>
      import('../../views/nrms/CheckDangerDictionary/Main.vue'),
    meta: {
      title: '检查项目字典设置',
      isFullScreen: true
    }
  },
  // 危急值 检验项目字典设置
  {
    path: '/examine_danger_dictionary',
    name: 'examine_danger_dictionary',
    component: () =>
      import('../../views/nrms/ExamineDangerDictionary/Main.vue'),
    meta: {
      title: '检验项目字典设置',
      isFullScreen: true
    }
  },
  // 危急值 检验子项目字典设置
  {
    path: '/examine_child_danger_dictionary',
    name: 'examine_child_danger_dictionary',
    component: () =>
      import('../../views/nrms/childExamineDangerDictionary/Main.vue'),
    meta: {
      title: '检验子项目字典设置',
      isFullScreen: true
    }
  },
  // 危急值检查检验列表
  {
    path: '/critical-list',
    name: 'critical-list',
    component: () => import('../../views/nrms/CritcalValue/Main.vue'),
    meta: {
      isFullScreen: true
    },

    children: [{
      name: 'checkValue-details',
      path: 'checkValue-details_fakeRouter',
      component: () => import('../../views/nrms/CritcalValue/checkValueDetails.vue'),
      meta: {
        isFullScreen: true
      }
    }]
  },
  {
    path: '/medication',
    name: 'medication',
    component: () => import('../../views/nrms/Medication/List.vue')
  }
]
