export default [
  // 系统配置
  {
    path: '/deveiceA10/wnBedHeadExtension/bedHeadConfig_fakeRouter',
    component: () => import('@/views/wnms/systemConfig/bedHeadHost'),
    name: 'bedHeadConfig',
    meta: {
      title: 'bedHeadConfig',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/deveiceA10IXL/iBedHeadExtension/i_bedHeadConfig_fakeRouter',
    component: () => import('@/views/wnms/systemConfig/IBedHeadHost'),
    name: 'IBedHeadConfig',
    meta: {
      title: 'IBedHeadConfig',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/deveiceA10/wnBedSideExtension/bedSideConfig_fakeRouter',
    component: () => import('@/views/wnms/systemConfig/bedSideHost'),
    name: 'bedSideConfig',
    meta: {
      title: 'bedSideConfig',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/deveiceA10/wnMedicalMainframe/mainConfig_fakeRouter',
    component: () => import('@/views/wnms/systemConfig/mainHost'),
    name: 'mainHostConfig',
    meta: {
      title: 'mainHostConfig',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/deveiceA10/wnDoorWayExtension/gateConfig_fakeRouter',
    component: () => import('@/views/wnms/systemConfig/gateHost'),
    name: 'gateConfig',
    meta: {
      title: 'gateConfig',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/deveiceA10IXL/iDoorWayExtension/i_gateConfig_fakeRouter',
    component: () => import('@/views/wnms/systemConfig/IGateHost'),
    name: 'IGateConfig',
    meta: {
      title: 'IGateConfig',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/deveiceA10/wnDutyMainframe/dutyRoomConfig_fakeRouter',
    component: () => import('@/views/wnms/systemConfig/dutyRoomHost'),
    name: 'dutyRoomConfig',
    meta: {
      title: 'dutyRoomConfig',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/deveiceA10/wnEntranceGuard/guardConfig_fakeRouter',
    component: () => import('@/views/wnms/systemConfig/guardHost'),
    name: 'guardConfig',
    meta: {
      title: 'guardConfig',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/deveiceA10/rvKinVisitExtension/visitConfig_fakeRouter',
    component: () => import('@/views/wnms/systemConfig/visitHost'),
    name: 'visitHost',
    meta: {
      title: 'visitHost',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/deveiceA10/wnMedicalAudioAssistant/YSAssistantConfig_fakeRouter',
    component: () => import('@/views/wnms/systemConfig/YSAssistantHost'),
    name: 'YSAssistantHost',
    meta: {
      title: 'YSAssistantHost',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/deveiceA10/wnCorridorLatticeScreen/corridorDisplayScreenConfig_fakeRouter',
    component: () => import('@/views/wnms/systemConfig/corridorDisplayScreenHost'),
    name: 'corridorDisplayScreenHost',
    meta: {
      title: 'corridorDisplayScreenHost',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/otherHost',
    component: () => import('@/views/wnms/systemConfig/otherHost'),
    name: 'otherHost',
    meta: {
      title: 'otherHost',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/YLMainConfig',
    component: () => import('@/views/wnms/systemConfig/YLMainHost'),
    name: 'YLMainConfig',
    meta: {
      title: 'YLMainConfig',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/YLBedSideConfig',
    component: () => import('@/views/wnms/systemConfig/YLBedSideHost'),
    name: 'YLBedSideConfig',
    meta: {
      title: 'YLBedSideConfig',
      icon: 'documentation',
      affix: true
    }
  },
  // 留言板
  {
    path: '/leaveMsg',
    component: () => import('@/views/wnms/msgManage/leaveMsg/main.vue'),
    name: 'leaveMsg',
    meta: {
      title: 'leaveMsg',
      icon: 'documentation',
      affix: true
    }
  },
  // 消息提醒
  {
    path: '/automWnms',
    component: () => import('@/views/wnms/msgManage/msgWarn/main.vue'),
    name: 'automWnms',
    meta: {
      title: 'automWnms',
      icon: 'documentation',
      affix: true
    }
  },
  {
    // 提醒应用
    path: '/automWnmsUse',
    component: () => import('@/views/wnms/msgManage/msgWarnUse/main.vue'),
    name: 'automWnms',
    meta: {
      title: 'automWnmsUse',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/msgBulletin',
    component: () => import('@/views/wnms/msgManage/msgBulletin/main.vue'),
    name: 'msgBulletin',
    meta: {
      title: 'msgBulletin',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/msgPush',
    component: () => import('@/views/wnms/msgManage/msgPush/main.vue'),
    name: 'msgPush',
    meta: {
      title: 'wnmsPush',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/msgTemplate',
    component: () => import('@/views/wnms/msgManage/msgTemplate/main.vue'),
    name: 'msgTemplate',
    meta: {
      title: 'wnmsTemp',
      icon: 'documentation',
      affix: true
    }
  }, {
    // 走廊公告
    path: '/msgCorridorAnnouncement',
    component: () => import('@/views/wnms/msgManage/msgCorridorAnnouncement/main.vue'),
    name: 'msgCorridorAnnouncement',
    meta: {
      title: 'wnmsTemp',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/extensionAnnouncement',
    component: () => import('@/views/wnms/msgManage/msgCorridorAnnouncement/extension-addorEdit.vue'),
    name: 'extensionAnnouncement'
  },
  {
    path: '/mngBroadcast',
    component: () => import('@/views/wnms/msgManage/mngBroadcast/mngBroadcast'),
    name: 'mngBroadcast',
    meta: {
      title: 'mngBroadcast',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/mngClock',
    component: () => import('@/views/wnms/msgManage/mngClock/mngClock'),
    name: 'mngClock',
    meta: {
      title: 'mngClock',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/wardRoundRecord',
    component: () => import('@/views/wnms/msgManage/wardRoundRecord/wardRound'),
    name: 'wardRoundRecord',
    meta: {
      title: 'wardRoundRecord',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/patientMsg/:onlyFlag',
    component: () => import('@/views/wnms/msgManage/patientMsg/list'),
    name: 'patientMsg',
    props: true,
    meta: {
      title: 'patientMsg',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/addressList',
    component: () => import('@/views/wnms/addressList/index'),
    name: 'addressList',
    meta: {
      title: 'addressList',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/bedCardConfig-my',
    component: () => import('@/views/wnms/bedCardConfig/index-my'),
    name: 'bedCardConfig',
    meta: {
      title: 'bedCardConfig',
      icon: 'documentation',
      affix: true
    }
  }, {
    path: '/bedCardConfig',
    component: () => import('@/views/wnms/bedCardConfig/main'),
    name: 'bedCardConfig',
    meta: {
      title: 'bedCardConfig',
      icon: 'documentation',
      affix: true
    }
  },
  // x28s
  {
    path: '/deviceList',
    component: () => import('@/views/wnms/x28s/device/main.vue'),
    name: 'deviceList',
    meta: {
      title: '设备查看',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/csmsManage',
    component: () => import('@/views/wnms/x28s/Manage/main.vue'),
    name: 'csmsManage',
    meta: {
      title: 'csmsManage',
      icon: 'documentation',
      affix: true
    }
  },
  // 显示屏管理
  {
    path: '/deveiceA10/wnCorridorScreen/wnCorridorScreen_fakeRouter',
    component: () => import('@/views/wnms/x28s/Config_x28sn/main.vue'),
    name: 'wnCorridorScreen',
    meta: {
      title: '显示屏配置',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/csmsConfig',
    component: () => import('@/views/wnms/x28s/Config/main.vue'),
    name: 'csmsConfig',
    meta: {
      title: 'csmsConfig',
      icon: 'documentation',
      affix: true
    }
  },
  // 门灯管理
  {
    path: '/doorLampHost',
    component: () => import('@/views/wnms/systemConfig/doorLampHost.vue'),
    name: 'doorLampHost',
    meta: {
      title: 'doorLampHost',
      icon: 'documentation',
      affix: true
    }
  },
  // 门灯配置
  {
    path: '/doorLampSetup',
    component: () => import('@/views/wnms/systemConfig/doorLampSetup.vue'),
    name: 'doorLampSetup',
    meta: {
      title: 'doorLampSetup',
      icon: 'documentation',
      affix: true
    }
  },
  // 新门灯
  {
    path: '/deveiceA10/wnDoorLampExtension/newDoorLamp_fakeRouter',
    component: () => import('@/views/wnms/systemConfig/newDoorLamp.vue'),
    name: 'newDoorLamp',
    meta: {
      title: 'newDoorLamp',
      icon: 'newDoorLamp',
      affix: true
    }
  },
  // 菜单配置中心
  {
    path: '/bedsideMenu/:type',
    component: () => import('@/views/wnms/bedSideMeun/main.vue'),
    name: 'bedsideMenu',
    meta: {
      title: 'bedsideMenu',
      icon: 'documentation',
      affix: true
    }
  },
  //预约情况
  {
    path: '/appointment',
    component: () => import('@/views/wnms/other/appointment.vue'),
    name: 'appointment'
  },
  {
    path: '/shopQRcode',
    component: () => import('@/views/wnms/shopingQRcode/main.vue'),
    name: 'shopQRcode'
  },
  {
    path: '/msgPatient',
    component: () => import('@/views/wnms/msgManage/msgPatient/main.vue'),
    name: 'msgPatient'
  },
  // 统计分析
  // 科室对比图
  {
    path: '/statistics/keshiduibi',
    component: () => import('@/views/wnms/statistics/keshiduibi.vue'),
    name: 'keshiduibi'
  },
  // 房间对比图
  {
    path: '/statistics/fangjianduibi',
    component: () => import('@/views/wnms/statistics/fangjianduibi.vue'),
    name: 'fangjianduibi'
  },
  // 床位对比图
  {
    path: '/statistics/chuangweiduibi',
    component: () => import('@/views/wnms/statistics/chuangweiduibi.vue'),
    name: 'chuangweiduibi'
  },
  // 日趋势图
  {
    path: '/statistics/riqushi',
    component: () => import('@/views/wnms/statistics/riqushi.vue'),
    name: 'riqushi'
  },
  // 时趋势图
  {
    path: '/statistics/shiqushi',
    component: () => import('@/views/wnms/statistics/shiqushi.vue'),
    name: 'shiqushi'
  },
  // 入住统计图
  {
    path: '/statistics/ruzhutongji',
    component: () => import('@/views/wnms/statistics/ruzhutongji.vue'),
    name: 'ruzhutongjitu'
  },
  // 呼叫响应对比图
  {
    path: '/statistics/hujiaoxiangying',
    component: () => import('@/views/wnms/statistics/hujiaoxiangying.vue'),
    name: 'ruzhutongjitu'
  },
  // 护士进入离开
  {
    path: '/nurseEnterLeave',
    component: () => import('@/views/wnms/msgManage/NurseEnterLeave/main.vue'),
    name: 'nurseEnterLeave'
  },

  //======================消息改造===========================//

  {
    path: '/patientMsg',
    component: () => import('@/views/wnms/msgManage/msgPatient/list'),
    name: 'patientMsg',
    props: true,
    meta: {
      title: 'patientMsg',
      icon: 'documentation',
      affix: true
    }
  },
  /***
   * 消息广播-消息推送
   */
  {
    path: '/pushMessage',
    component: () => import('@/views/wnms/msgManage/msgPatient/pushPatientsMessage.vue'),
    name: 'pushMessage',
    meta: {
      title: 'pushMessage',
      icon: 'documentation',
      affix: true
    }
  },
  /***
   * 消息广播-医护公告
   */
  {
    path: '/careNotice',
    component: () => import('@/views/wnms/msgManage/careNotice/list.vue'),
    name: 'careNotice',
    meta: {
      title: 'careNotice',
      icon: 'documentation',
      affix: true
    }
  },
  /***
   * 消息广播-医护公告-推送公告
   */
  {
    path: '/pushCareNotice',
    component: () => import('@/views/wnms/msgManage/careNotice/pushNoticeMsg.vue'),
    name: 'pushCareNotice',
    meta: {
      title: 'pushCareNotice',
      icon: 'documentation',
      affix: true
    }
  },
  /***
   * 我的消息-医护公告
   */
  {
    path: '/myCareNoticeMsg',
    component: () => import('@/views/wnms/myMessage/myCareNoticeMsg.vue'),
    name: 'myCareNoticeMsg',
    meta: {
      title: 'myCareNoticeMsg',
      icon: 'documentation',
      affix: true
    }
  },
  /***
   * 我的消息-系统消息
   */
  {
    path: '/mySystemMsg',
    component: () => import('@/views/wnms/myMessage/systemMsg.vue'),
    name: 'mySystemMsg',
    meta: {
      title: 'mySystemMsg',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/xjjqAdd',
    component: () => import('@/views/wnms/msgManage/msgPush/order/xjjq/main.vue'),
    name: 'xjjqAdd'
  },
  // i系列模板配置
  {
    path: '/i_template',
    component: () => import('@/views/wnms/systemConfig/ITemplate'),
    name: 'ITemplate',
    meta: {
      title: 'ITemplate',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/i_otherHost',
    component: () => import('@/views/wnms/systemConfig/IOtherHost'),
    name: 'IOtherHost'
  },
  //==============呼叫报号===============//
  {
    path: '/callNRField',
    component: () => import('@/views/wnms/callReportNumber/callRNFieldList.vue'),
    name: 'callNRField',
    meta: {
      title: 'callNRField',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/callNRConfig',
    component: () => import('@/views/wnms/callReportNumber/callRNConfig.vue'),
    name: 'callNRConfig',
    meta: {
      title: 'callNRConfig',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/callRNDispalyConfig',
    component: () => import('@/views/wnms/callReportNumber/callRNDispalyConfig.vue'),
    name: 'callRNDispalyConfig',
    meta: {
      title: 'callRNDispalyConfig',
      icon: 'documentation',
      affix: true
    }
  },
  //==============人脸识别一体机===============//
  //门禁角色权限管理列表
  {
    path: '/aceRoleAuth',
    component: () => import('@/views/wnms/accessControlExtension/aceRoleAuth.vue'),
    name: 'aceRoleAuth',
    meta: {
      title: 'aceRoleAuth',
      icon: 'documentation',
      affix: true
    }
  },
  //门禁账户管理权限列表
  {
    path: '/aceAccountAuth',
    component: () => import('@/views/wnms/accessControlExtension/aceAccountAuth.vue'),
    name: 'aceAccountAuth',
    meta: {
      title: 'aceAccountAuth',
      icon: 'documentation',
      affix: true
    }
  },
  //门禁账户权限编辑
  {
    path: '/editAceAccountAuth',
    component: () => import('@/views/wnms/accessControlExtension/editAceAccountAuth.vue'),
    name: 'editAceAccountAuth',
    meta: {
      title: 'editAceAccountAuth',
      icon: 'documentation',
      affix: true
    }
  },
  //病区出入记录
  {
    path: '/inpatientAceRecord',
    component: () => import('@/views/wnms/accessControlExtension/inpatientAceRecord.vue'),
    name: 'inpatientAceRecord',
    meta: {
      title: 'inpatientAceRecord',
      icon: 'documentation',
      affix: true
    }
  },
  //终端配置
  {
    path: '/aceTerminalConfig',
    component: () => import('@/views/wnms/accessControlExtension/aceTerminalConfig.vue'),
    name: 'aceTerminalConfig',
    meta: {
      title: 'aceTerminalConfig',
      icon: 'documentation',
      affix: true
    }
  },
  //添加修改角色权限
  {
    path: '/editAceRoleAuth',
    component: () => import('@/views/wnms/accessControlExtension/editAceRoleAuth.vue'),
    name: 'editAceRoleAuth',
    meta: {
      title: 'editAceRoleAuth',
      icon: 'documentation',
      affix: true
    }
  },
  {
    path: '/noDevice',
    component: () => import('@/views/wnms/msgManage/msgCorridorAnnouncement/noDevice.vue'),
    name: 'noDevice'
  },
  {
    path: '/devicesmanage',
    component: () => import('@/views/wnms/smartmattress/devicesmanage/list.vue'),
    name: 'devicesmanage'
  },
  {
    path: '/configmanage',
    component: () => import('@/views/wnms/smartmattress/configmanage/main.vue'),
    name: 'configmanage'
  },
  {
    path: '/ondemand',
    component: () => import('@/views/wnms/msgManage/ondemand/main.vue'),
    name: 'ondemand'
  },
  {
    path: '/systemFiles',
    component: () => import('@/views/wnms/msgManage/systemFiles/main.vue'),
    name: 'systemFiles'
  },
  //终端比对
  {
    path: '/deviceVersion',
    component: () => import('@/views/wnms/deviceVersion/main.vue'),
    name: 'deviceVersion'
  },
  {
    path: '/bedcardtest',
    component: () => import('@/views/wnms/bedcardtest/list.vue'),
    name: 'bedcardtest'

  }
];
