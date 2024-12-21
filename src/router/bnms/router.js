export default [
  // {
  //   path: "/",
  //   name: "index",
  //   meta: { title: "首页" },
  //   component: () =>
  //     import(/* webpackChunkName: "card_list" */ "../../views/bnms/BedCard/CardList.vue")
  // },
  {
    path: '/card_list',
    name: 'card_list',
    meta: { title: '患者一览' },
    component: () =>
      import(/* webpackChunkName: "card_list" */ '../../views/bnms/BedCard/Main.vue')
  },
  {
    path: '/card_detail',
    name: 'card_detail',
    meta: { title: '患者详情' },
    component: () =>
      import(/* webpackChunkName: "detail" */ '../../views/bnms/BedCard/CardDetail.vue')
  },
  {
    path: '/card_tabs',
    name: 'card_tabs',
    meta: { title: '患者动态' },
    component: () =>
      import(/* webpackChunkName: "detail" */ '../../views/bnms/BedCard/CardTabs.vue')
  },
  {
    path: '/label_nursing',
    name: 'label_nursing',
    meta: { title: '护理标签', keepAlive: false, isFullScreen: true },
    component: () =>
      import(/* webpackChunkName: "label_nursing" */ '../../views/bnms/LabelManage/Nursing/Main.vue')
  },
  {
    path: '/label_nursing_add',
    name: 'label_nursing_add',
    meta: { title: '护理标签添加' },
    component: () =>
      import(/* webpackChunkName: "label_nursing_add" */ '../../views/bnms/LabelManage/Nursing/NursingAdd.vue')
  },
  {
    path: '/label_remind',
    name: 'label_remind',
    meta: { title: '提醒标签', keepAlive: false },
    component: () =>
      import(/* webpackChunkName: "label_nursing" */ '../../views/bnms/LabelManage/Remind/Main.vue')
  },
  {
    path: '/label_patient',
    name: 'label_patient',
    meta: { title: '患者标签', keepAlive: false },
    component: () =>
      import(/* webpackChunkName: "label_patient" */ '../../views/bnms/LabelManage/Patient/Main.vue')
  },
  {
    path: '/label_basic_add',
    name: 'label_basic_add',
    meta: { title: '患者标签添加' },
    component: () =>
      import(/* webpackChunkName: "label_basic_add" */ '../../views/bnms/LabelManage/Patient/BasicAdd.vue')
  },
  {
    path: '/label_statistics',
    name: 'label_statistics',
    meta: { title: '统计标签', keepAlive: false },
    component: () =>
      import(/* webpackChunkName: "label_statistics" */ '../../views/bnms/LabelManage/Statistics/Main.vue')
  },
  {
    path: '/label_statistics_add',
    name: 'label_statistics_add',
    meta: { title: '统计标签添加' },
    component: () =>
      import(/* webpackChunkName: "label_statistics_add" */ '../../views/bnms/LabelManage/Statistics/StatisticsAdd.vue')
  },
  {
    path: '/label_apply_patient',
    name: 'label_apply_patient',
    meta: { title: '患者标签应用', keepAlive: false },
    component: () =>
      import(/* webpackChunkName: "label_apply_patient" */ '../../views/bnms/LabelApply/Patient/BasicList.vue')
  },
  {
    path: '/label_apply_nursing',
    name: 'label_apply_nursing',
    meta: { title: '护理标签应用', keepAlive: false },
    component: () =>
      import(/* webpackChunkName: "label_apply_nursing" */ '../../views/bnms/LabelApply/NursingList.vue')
  },
  {
    path: '/label_apply_nursing_edit',
    name: 'label_apply_nursing_edit',
    meta: { title: '护理标签应用编辑', keepAlive: false },
    component: () =>
      import(/* webpackChunkName: "label_apply_nursing_edit" */ '../../views/bnms/LabelApply/NursingListEdit.vue')
  },
  {
    path: '/label_apply_statistics',
    name: 'label_apply_statistics',
    meta: { title: '统计标签应用', keepAlive: false },
    component: () =>
      import(/* webpackChunkName: "label_apply_statistics" */ '../../views/bnms/LabelApply/Statistics/StatisticsList.vue')
  },
  {
    path: '/nurse_level',
    name: 'nurse_level',
    meta: { title: '护理级别', keepAlive: false },
    component: () =>
      import(/* webpackChunkName: "nurse_level" */ '../../views/bnms/SystemSetting/MainLevel.vue')
    // children: [
    //   {
    //     path: "edit",
    //     name: "nurse_level_edit",
    //     meta: { title: "护理级别添加" },
    //     component: () =>
    //       import(/* webpackChunkName: "nurse_level_edit" */ "../../views/bnms/NurseLevel/edit.vue")
    //   }
    // ]
  },
  {
    path: '/nurse_level_edit',
    name: 'nurse_level_edit',
    meta: { title: '护理级别添加' },
    component: () =>
      import(/* webpackChunkName: "nurse_level_edit" */ '../../views/bnms/SystemSetting/edit.vue')
  },
  {
    path: '/nurse_shift',
    name: 'nurse_shift',
    meta: { title: '护士交班', isFullScreen: false },
    component: () =>
      import(/* webpackChunkName: "nurse_level_edit" */ '../../views/bnms/NurseShift/Main.vue')
  },
  {
    path: '/sbar_shift',
    name: 'sbar_shift',
    meta: { title: 'SBAR交班' },
    component: () =>
      import(/* webpackChunkName: "nurse_level_edit" */ '../../views/bnms/SBARShift/Main.vue')
  },
  {
    path: '/nurse_shift_record_list',
    name: 'nurse_shift_record_list',
    meta: {
      isFullScreen: false,
      title: '护士交班'
    },
    component: () =>
      import('../../views/bnms/NurseShiftRecord/Main.vue')// 护士交班记录
  },
  {
    path: '/shift_setting',
    name: 'shift_setting',
    meta: { title: '交班配置' },
    component: () =>
      import(/* webpackChunkName: "nurse_level_edit" */ '../../views/bnms/ShiftSetting/Main.vue')
  },
  {
    path: '/operative_arrangement_shengli',
    name: 'operative_arrangement_shengli',
    meta: { title: '手术安排' },
    component: () =>
      import(/* webpackChunkName: "nurse_level_edit" */ '../../views/bnms/OpreativeArrangementShengli/main.vue')
  },
  {
    path: '/operative_arrangement',
    name: 'operative_arrangement',
    meta: { title: '手术安排' },
    component: () =>
      import(/* webpackChunkName: "nurse_level_edit" */ '../../views/bnms/OperativeArrangement/main.vue')
  },
  {
    path: '/cost_manage',
    name: 'cost_manage',
    meta: { title: '费用管理', isFullScreen: true },
    component: () =>
      import(/* webpackChunkName: "nurse_level_edit" */ '../../views/bnms/CostManage/main.vue')
  },
  // wangjuan
  {
    path: '/card_tabs',
    name: 'card_tabs',
    meta: { title: '患者详情' },
    component: () =>
      import(/* webpackChunkName: "detail" */ '../../views/bnms/BedCard/CardTabs.vue')
  },
  {
    path: '/out_hospital',
    name: 'out_hospital',
    meta: { title: '出院患者' },
    component: () =>
      import(/* webpackChunkName: "out_hospital" */ '../../views/bnms/OutHospital/OutHospital.vue')
  },
  {
    path: '/patient_waiting',
    name: 'patient_waiting',
    meta: { title: '待入科患者' },
    component: () =>
      import(/* webpackChunkName: "patient_waiting" */ '../../views/bnms/PatientWaiting/WaitingPatient.vue'),
    children: [
      {
        path: 'in-dept-son_fakeRouter',
        name: 'in-dept-son',
        meta: { title: '入科操作' },
        component: () =>
          import(/* webpackChunkName: "in-dept-son" */ '../../views/bnms/PatientWaiting/InDept.vue')
      }
    ]
  },
  // hanzhe

  {
    path: '/system_setting',
    name: 'system_setting',
    meta: { title: '系统设置' },
    component: () =>
      import(/* webpackChunkName: "nurse_level_edit" */ '../../views/bnms/SystemSetting/Main.vue')
  },
  {
    path: '/otherSetting',
    name: 'otherSetting',
    meta: { title: '其他设置' },
    component: () =>
      import(/* webpackChunkName: "kanban_template" */ '../../views/bnms/SystemSetting/NurseShiftSetting.vue')
  },
  {
    path: '/doctorFields',
    name: 'doctorFields',
    meta: { title: '其他设置' },
    component: () =>
      import(/* webpackChunkName: "kanban_template" */ '../../views/bnms/SystemSetting/MainDoctorFields.vue')
  },
  {
    path: '/wristband_printing',
    name: 'wristband_printing',
    meta: { title: '腕带打印' },
    component: () =>
      import(/* webpackChunkName: "nurse_level_edit" */ '../../views/bnms/BedCard/WristbandPrinting.vue')
  },
  {
    path: '/case_history',
    name: 'case_history',
    meta: { title: '病例病程', isFullScreen: true },
    component: () =>
      import(/* webpackChunkName: "nurse_level_edit" */ '../../views/bnms/CaseHistory/Main.vue')
  },
  {
    path: '/case-details',
    name: 'case-details',
    meta: { title: '病例病程pdf展示' },
    component: () =>
      import(/* webpackChunkName: "in-dept-son" */ '../../views/bnms/CaseHistory/Detail.vue')
  },
  {
    path: '/kanban_setting',
    name: 'kanban_setting',
    meta: { title: '护理看板设置' },
    component: () =>
      import(/* webpackChunkName: "kanban_setting" */ '../../views/bnms/NursingKanban/Setting')
  },
  {
    path: '/kanban_switch',
    name: 'kanban_switch',
    meta: { title: '护理看板切换设置' },
    component: () =>
      import(/* webpackChunkName: "kanban_switch" */ '../../views/bnms/NursingKanban/Switch')
  },
  {
    path: '/kanban_preview',
    name: 'kanban_preview',
    meta: { title: '护理看板预览' },
    component: () =>
      import(/* webpackChunkName: "kanban_preview" */ '../../views/bnms/NursingKanban/Preview')
  },
  {
    path: '/kanban_template',
    name: 'kanban_template',
    meta: { title: '护理看板模板设置' },
    component: () =>
      import(/* webpackChunkName: "kanban_template" */ '../../views/bnms/NursingKanban/Template')
  },
  {
    path: '/model_set',
    name: 'model_set',
    meta: { title: '模板设置' },
    component: () =>
      import(/* webpackChunkName: "kanban_template" */ '../../views/bnms/NursingKanban/ModelSet')
  },
  {
    path: '/page_set',
    name: 'page_set',
    meta: { title: '页面设置' },
    component: () =>
      import(/* webpackChunkName: "kanban_template" */ '../../views/bnms/NursingKanban/PageSet')
  },
  {
    path: '/zrz_manage',
    name: 'zrzManage',
    meta: { title: '责任组管理列表' },
    component: () => import('../../views/bnms/zrzManage/Main.vue')
  },
  {
    path: '/trans_dept',
    name: 'trans_dept',
    meta: { title: '转科科室管理', keepAlive: false },
    component: () =>
      import(/* webpackChunkName: "label_apply_statistics" */ '../../views/bnms/NursingKanban/transDept')
  }
]
