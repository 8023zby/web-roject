export default {
  baseUrl: '/',
  // 护理记录
  insertTemp: 'nrms/web-nr/intake-output/sync-critically',
  someIn: 'nrms/web-nr/nursing-record/batch-save',
  nurseNotesList: 'nrms/web-nr/nursing-record',
  nurseNotesListAll: 'nrms/web-nr/nursing-record/listByLines',
  nurseNotesAdd: 'nrms/web-nr/nursing-record',
  nurseNotesDelete: 'nrms/web-nr/nursing-record',
  nurseNotesGetItem: '',
  nurseNotesReviewAndSigning: 'nrms/web-nr/nursing-record/autograph',
  nurseNotesGetSignsByPatientId: '',
  // nurseNotesGetFixedItem: 'nrms/web-nr/nursing-item',
  nurseNotesGetListFixedItem: 'nrms/web-nr/form-used/form-sign/getSignById',
  nurseNotesGetAddFixedItem: 'nrms/web-nr/form-used/form-sign/getClassifySignById',
  nurseNotesGetFocus: 'nrms/web-nr/focus/query-all',
  nurseNotesSyncSign: 'nrms/web-nr/nursing-record/sync',
  nurseNotesGetInPatient: 'bnms/web-bn/patient-in-view-list/by-not-null-bed',
  nurseNotesGetOutPatient: 'bnms/web-bn/patient-out-list',
  nurseNotesGetTransPatient: 'bnms/web-bn/patient-transfer-list',

  nurseNotesPatientInspection: '/nrms/web-nr/inspection-report',
  nurseNotesPatientInspectionPAD: '/nrms/app-nr/inspection-report/by-patient-id',
  nurseNotesPatientInspectionListPAD: '/nrms/app-nr/inspection-report',
  nurseNotesPatientExamine: '/nrms/web-nr/examine-report',
  nurseNotesPatientExaminePAD: '/nrms/app-nr/examine-report/by-patient-id',
  nurseNotesPatientExamineListPAD: '/nrms/app-nr/examine-report',
  nurseNotesPatientExamineItems: '/nrms/web-nr/examine-report/examine-items',
  nurseNotesPatientExamineItemsAll: '/nrms/web-nr/examine-report/examine-items-all',
  examineItemsChartSelectByPatientId: '/nrms/web-nr/examine-report/examine-items-chart',
  examineUpdateSwitch: '/nrms/web-nr/examine-report/switch-setting',
  inspectionUpdateSwitch: '/nrms/web-nr/inspection-report/switch-setting',
  examineUpdateSwitchPAD: '/nrms/app-nr/examine-report/switch-setting',
  inspectionUpdateSwitchPAD: '/nrms/app-nr/inspection-report/switch-setting',

  // 体征记录
  signItemList: 'nrms/web-nr/sign-items/list',
  signItem: 'nrms/web-nr/sign-items',
  // signRelation: 'nrms/web-nr/sign-items/by-in-out-type',
  signApply: 'nrms/web-nr/form-used/form-sign/getSignById',
  signApplyApp: 'nrms/app-nr/sign-apply',
  signApplyGetDept: 'nrms/web-nr/sign-apply/by-signId',
  // 2020-09-24 改为走体温单设置中的测量时间
  measureTime: '/nrms/web-nr/form-temperature',
  // measureTime: 'nrms/web-nr/sign-temperature-config',
  measureTimeApp: 'nrms/app-nr/sign-temperature-config',

  // 2020-09-15, 表单管理-体温单设置中使用
  temperatureMeasureTime: '/nrms/web-nr/form-temperature/temperature-time',

  // 体征项分类
  signClassifyList: 'nrms/web-nr/sign-classify',
  // 体征项分类排序
  signClassifySort: 'nrms/web-nr/sign-classify/sort',
  // 体征项管理
  signItemManage: 'nrms/web-nr/sign-apply-manage/list',
  // 体征项管理编辑
  signItemManageEdit: 'nrms/web-nr/sign-apply-manage',
  // 体况
  signBodyItemTh: 'nrms/web-nr/sign-apply-manage/th-list',
  signBodyItemData: 'nrms/web-nr/body-condition/list',
  bodyCondition: 'nrms/web-nr/body-condition',
  // 血糖单趋势图
  bloodChart: 'nrms/web-nr/glucometer-record/trend',
  bloodChartNew: 'nrms/web-nr/glucose/trend',
  // 血糖检测单
  bloodMonitoring: 'nrms/web-nr/monitoring',
  // 体温单趋势图
  temperatureChart: 'nrms/web-nr/temperature/trend',
  // 临床事件
  temperatureEvent: 'nrms/web-nr/clinical-event',
  temperatureEventApp: 'nrms/app-nr/clinical-event',
  temperatureSheet: 'nrms/web-nr/temperature',
  temperatureSheetApp: 'nrms/app-nr/temperature',
  temperatureSheetAll: 'nrms/web-nr/temperature/all',
  temperatureSheetAllApp: 'nrms/app-nr/temperature/all',
  temperatureSheetDay: 'nrms/web-nr/temperature/day',
  temperatureSheetDayApp: 'nrms/app-nr/temperature/day',
  temperatureSheetSaveList: 'nrms/web-nr/temperature/save-list',
  // 转入评估导出体温单
  temperatureSyncRYPGData: 'nrms/web-nr/temperature/syncRYPGData',
  // 入院和出院日期
  inAndOutDate: 'bnms/web-bn/patient-list/in-time',
  // 科室
  deptList: 'ifms/web-org/depts',
  // 体况
  // bodyCondition: 'nrms/web-nr/body-condition',
  // bodyConditionApp: 'nrms/app-nr/body-condition',
  // bodyConditionDetail: 'nrms/web-nr/body-condition/get-details',
  // bodyConditionDetailApp: 'nrms/app-nr/body-condition/get-details',
  // 密码验证
  loginInTry: 'passport/web-rbac/logins/loginInTry',

  // 宣教列表
  educationList: 'nrms/web-nr/education-record',
  educationListEvaluate: 'nrms/web-nr/education-record/evaluate',
  educationContentAll: 'nrms/web-nr/education/query-all',

  // 巡视时间设置
  patrolTime: 'nrms/web-nr/patrol-time',
  // 巡视内容设置
  patrolContent: 'nrms/web-nr/patrol-content',
  // 获取指定巡视记录
  getPatrolContentList: 'nrms/web-nr/patrol-content/value',
  // 更新巡视记录
  putPatrolData: 'nrms/web-nr/patrol-record/content',
  // 巡视记录列表
  patrolRecord: '/nrms/web-nr/patrol-record/condition',
  // 转科记录
  handoverRecord: 'nrms/web-nr/handover-record',
  // 获取护理级别
  getNurseLevel: 'bnms/web-bn/settingNurseLevel/selectAll',
  // 查询科室的表单应用情况待改为NRMS
  deptFormInfo: 'nrms/web-nr/form-used',
  observe: '/nams/web-na/ass-manage/used',
  getList: 'nrms/web-nr/form-dict/list',
  getNextFormCode: 'nrms/web-nr/form-dict/getNextFormCode',
  putForm: 'nrms/web-nr/form-dict',
  getFormDictByType: 'nrms/web-nr/form-dict/getFormDictByType',
  getFormDict: 'nrms/web-nr/form-dict/getFormDict',
  delBefoeCheck: 'nrms/web-nr/form-dict/checkDelete',
  // 危急值检查
  inspectSet: '/nrms/web-nr/inspectSet',
  inspectItem: '/nrms/web-nr/crisis-dict',
  examineSet: '/nrms/web-nr/examineSet',
  // 危急值字典设置
  dangerClassify: '/nrms/web-nr/crisis-class',
  // 危急值检查项目排序
  dangerClassifySort: '/nrms/web-nr/crisis-class/sort',
  dangerClassifyDeleteSelect: '/nrms/web-nr/crisis-class/is-delete',
  // 危急值 检查项目
  dangerDictionary: '/nrms/web-nr/crisis-dict',
  dangerDictionaryDeleteSelect: '/nrms/web-nr/crisis-dict/is-delete',
  dangerDictionaryProcess: '/nrms/web-nr/crisis-dict/progress',
  // 危急值 检验子项目
  dangerChildDictionary: '/nrms/web-nr/crisis-child-dict',
  dangerChildDictionaryDeleteSelect: '/nrms/web-nr/crisis-child-dict/is-delete',
  // 初始化上传实例
  dangerDictionaryInit: '/nrms/web-nr/crisis-dict/init-upload',
  // 终端上传
  dangerDictionaryCancel: '/nrms/web-nr/crisis-dict/cancel-upload',
// 查询检验项目关联子项目
  dangerDictionaryRelationChild:'/nrms/web-nr/crisis-child-dict/ids',

  // 体温单管理-体征项设置
  temperatureItemSetting: '/nrms/web-nr/form-used/form-sign',
  // 体温单管理-体征项设置-是否始终显示
  temperatureItemShow: '/nrms/web-nr/form-used/form-sign/is-show',
  // 体温单管理-体征项设置-排序/
  temperatureItemSort: '/nrms/web-nr/form-used/form-sign/sort',
  temperatureItemSelect: '/nrms/web-nr/sign-items',
  // 护理记录配置项
  form_dict_setting_select: '/nrms/web-nr/form-dict-extend', // 根据表单id查询护理记录配置项
  form_dict_setting_add: '/nrms/web-nr/form-dict-extend', // 添加护理记录配置项
  formManageConfirm: '/nrms/web-nr/form-dict/shiftRecord', // 交班记录设置
  /** **************************************评估单****************************************/
  // 查询评估单管理
  assClassList: '/nams/web-na/ass-manage/by-class',
  // 根据评估单ID和分数查询风险级别等信息
  queryScore: '/nsms/web-na/ass-setting/query-score',
  // 查询患者评估记录
  assRecordList: '/nams/web-na/ass-record',
  assRecordQuery: '/nams/web-na/ass-record/query',
  // 循环表单
  assLoop: '/nams/web-na/ass-record/add-loop',
  // 循环表单查询
  assQueryLoop: '/nams/web-na/ass-record/query-loop',
  // 查询某日期几个时刻点最近记录时间
  assQueryHours: '/nams/web-na/ass-record/query-hours',
  // 同步体温单记录
  syncTemperature: '/nams/web-na/ass-record/sync-temperature',
  // 临床事件
  clinicalEvent: '/nrms/web-nr/clinical-event-config',

  /** **************************************自动表单管理****************************************/
  // 自动表单管理
  formManage: '/nams/web-na/ass-manage',
  formManageUsed: '/nams/web-na/ass-manage/used',
  /**
  * ------------------------------------------------------------------
  * 出入量
  * ------------------------------------------------------------------
  */
  intakeOutput: '/nrms/web-nr/intake-output',

  /**
  * ------------------------------------------------------------------
  * 患者自动表单详情,关联当前表单
  * ------------------------------------------------------------------
  */
  formRecordPatient: '/nams/web-na/ass-record/ass-patient',
  /**
  * ------------------------------------------------------------------
  * 检查单通知
  * ------------------------------------------------------------------
  */
  // 检查单设置
  inspectionTemp: '/nrms/web-nr/form-inspection-template',
  // 检查单值设置
  inspectionValue: '/nrms/web-nr/form-inspection-template-value',
  /**
  * ------------------------------------------------------------------
  * 交班原因
  * ------------------------------------------------------------------
  */
  shiftReason: '/nsms/web-nr/shift-reason',

  // 心率监测
  // wiki http://192.168.30.168:8090/pages/viewpage.action?pageId=31038929
  heartRateMonitoring: '/nrms/web-nr/heartRate',
  // 其他设置上传logo 查询logo地址
  getLogoUrl: 'nsms/app-nr/form-dict/logo',
  deleteLogo: 'nsms/web-nr/form-dict/logo',
  reportType: '/nsms/web-nr/file-type',
  // 检查报告 获取阅片图片路径
  dimJpgPath: '/bnms/web-bn/case-record/dcmJpg',
  // 所有用户
  users: '/ifms/web-org/emp/currentDeptByMode',
  //  mews设置
  mewsManage:'/nrms/web-nr/mews',
  mewsManageList:'/nrms/web-nr/mews/list',
  // 危急值查询
  warnList: '/nsms/web-nr/crisis-record',
  // 危急值列表接收
  warningListReceive: '/nsms/web-nr/crisis-record',

  // 用药管理
  medicationInfo: '/nsms/web-nr/medication-info'

}
