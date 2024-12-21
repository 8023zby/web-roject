export default {
  baseUrl: '/',
  InPatient: 'bnms/web-bn/patient-in-view-list/by-not-null-bed',
  OutPatient: 'bnms/web-bn/patient-out-list',
  TransPatient: 'bnms/web-bn/patient-transfer-list',
  // 床位一览
  bedCardPatientList: '/bnms/web-bn/patient-list/list',
  bedCardSelectPatientLabel: '/bnms/web-bn/label-used/card-patient-label',
  bedDetailSelectPatientLabel: '/bnms/web-bn/label-used/query-patient-label',
  bedCardSelectNurseLabel: '/bnms/web-bn/label-used/query-nursing-label',
  bedCardSelectDetailNurseLabel: '/bnms/web-bn/label-used/patient-nursing-label',
  bedCardSelectStatisticsLabel: '/bnms/web-bn/label-used/query-statistics-label',
  bedCardPatientInsert: '/bnms/web-bn/patient-list',
  bedCardPatientUpdate: '/bnms/web-bn/patient-list',
  bedCardPatientDelete: '/bnms/web-bn/patient-list',
  bedCardPatientChange: '/bnms/web-bn/patient-list/changedBedNo',
  bedCardAllPatientBed: '/bnms/web-bn/patient-list/listNotNullBed',
  // 标签管理
  labelManage: '/bnms/web-bn/label-dict',
  labelManageDelBefore: '/bnms/web-bn/label-dict/apply-dept-list-name',
  labelRelationLabel: '/bnms/web-bn/label-dict/relation-label',
  labelManageApplyDept: '/bnms/web-bn/label-dict/apply-dept-list',
  labelManageApply: '/bnms/web-bn/label-dict/apply',
  labelManageApplyBatch: '/bnms/web-bn/label-dict/apply-batch',
  labelAssess: '/nsms/web-na/ass-dict/query-level',
  // 标签应用
  labelApply: '/bnms/web-bn/label-used',
  labelApplyPosition: '/bnms/web-bn/label-used/label-position',
  labelApplyUpdateShow: '/bnms/web-bn/label-used/update-show',
  labelApplyUpdateInfo: '/bnms/web-bn/label-used/update-position-info',
  labelApplySort: '/bnms/web-bn/label-used/update-sort',
  labelApplyDetail: '/bnms/web-bn/label-used/selectByUsedId',
  labelApplyEdit: '/bnms/web-bn/label-used/updateByDeptCustom',
  labelBatchApply: '/bnms/web-bn/label-used/batchUpdateByPositionList',

  // 标签分类
  classifyManage: '/bnms/web-bn/label-class',
  classifyManageSort: '/bnms/web-bn/label-class/update-sort',
  // 标签标识
  identifyManage: '/bnms/web-bn/label-identify',
  identifyManageAll: '/bnms/web-bn/label-identify/all',
  identifyManageImage: '/bnms/web-bn/label-dict/query-image',
  // 护理级别
  nurseLevel: '/bnms/web-bn/settingNurseLevel/select',
  nurseLevelAll: '/bnms/web-bn/settingNurseLevel/selectAll',
  nurseLevelInsert: '/bnms/web-bn/settingNurseLevel/insert',
  nurseLevelUpdate: '/bnms/web-bn/settingNurseLevel/update',
  nurseLevelDelete: '/bnms/web-bn/settingNurseLevel/delete',
  nurseLevelApplyDept: '/bnms/web-bn/settingNurseLevel/selectUsed',
  nurseLevelApply: '/bnms/web-bn/settingNurseLevel/saveUsed',
  // 科室
  deptList: '/ifms/web-org/depts',
  // 床位
  // bedList: "/ifms/web-org/beds",
  bedList: '/ifms/web-org/beds/currentDept',
  // 房间
  roomList: '/ifms/web-org/rooms/currentDept',
  // 管房医生、护士
  roomDoctorNurse: '/hsms/web-hs/schedule/NURSE/obj-account',
  // 用户
  // userDoctorList: "/ifms/web-org/emp/listSortDoctor",
  // userNurseList: "/ifms/web-org/emp/listSortNurse"
  userDoctorList: '/ifms/web-org/emp/listSortDoctor/currentDeptByMode',
  userNurseList: '/ifms/web-org/emp/listSortNurse/currentDeptByMode',
  userDoctorList2: '/ifms/web-org/emp/listSortDoctorByMode',
  userNurseList2: '/ifms/web-org/emp/listSortNurseByMode',
  // 班次
  shiftsList: '/nsms/web-bn/shift',
  shifts: '/nsms/web-bn/shift/shift',
  shiftsDeptList: '/nsms/web-bn/shift/dept-list',
  shiftsUsedDept: '/nsms/web-bn/shift/used-dept',
  shiftsApply: '/nsms/web-bn/shift/apply',
  // 护士交班
  nurseShift: '/nsms/web-bn/shift-record',
  nurseShiftDeleteChild: '/nsms/web-bn/shift-record/child',
  nurseShiftChild: '/nsms/web-bn/shift-record/query-child',
  nurseShiftAddChild: '/nsms/web-bn/shift-record/add-child',
  nurseShiftStatistics: '/nsms/web-bn/shift-record/query-statistics',
  nurseShiftUpdateStatistics: '/nsms/web-bn/shift-record/update-statistics',
  nurseShiftPatient: '/nsms/web-bn/shift-record/query-patient-list',
  nurseShiftCount: '/nsms/web-bn/shift-record/record-count',
  nurseShiftPrintPatient: '/nsms/web-bn/shift-record/printing',
  nurseShiftPrintStatistic: '/nsms/web-bn/shift-record/query-printing-statistics',
  nurseShiftUpdateChildStatus: '/nsms/web-bn/shift-record/update-child-status',
  nurseShiftSbarPatient: '/nsms/web-bn/shift-record/childSBAR',
  SBARShift: '/nsms/web-bn/shift-record',
  // SBARShiftEdit: '/nsms/web-bn/shift-record/update-child-sbar',
  SBARShiftEdit: '/nsms/web-bn/shift-record/update-child',
  SBARShiftTakeOver: '/nsms/web-bn/shift-record/update-take-over',
  // 护理记录
  nurseNotes: '/nrms/web-nr/nursing-record/timespan',
  // 护士交班记录
  nurseShiftRecord: '/nsms/web-bn/appShift',
  // 用户列表
  DoctorNurseUsers: '/ifms/web-org/emp/currentDeptByMode',
  // 手术安排
  OperativeArrangement: '/bnms/web-bn/operation',
  // 省立手术安排
  OperationArrange: '/nrms/web-nr/arrange',
  // 费用管理--预交金 费用明细 费用汇总信息 结算信息
  AdvanceAmount: '/bnms/web-bn/cost/advance',
  CostDetail: '/bnms/web-bn/cost/centre',
  CostAggregation: '/bnms/web-bn/cost/summary',
  CostInformation: '/bnms/web-bn/cost/settlement',
  // wangjuan
  bnmsPatientDynamics: '/bnms/web-bn/patient-dynamics',
  bnmsPatientOutHospitalList: '/bnms/web-bn/patient-out-list/by-dept-id',
  bnmsPatientWaitingList: '/bnms/web-bn/patient-waiting-list/list',
  bnmsPatientWaitingListSendToHis: '/bnms/web-bn/patient-waiting-list',
  bnmsPatientOutHospitalRecall: '/bnms/web-bn/patient-out-list/cancel-recall',
  myPatient: '/nrms/web-nr/emp-bed-id-list',
  // 腕带设置
  WristbandSetting: '/bnms/web-bn/wristband',
  // 腕带打印
  wristbandPrint: '/bnms/web-bn/wristband/QrCodeUtils',
  // 病例病程
  caseHistory: '/bnms/web-bn/case-record',
  // 看板切换设置
  kanBanSwitch: '/bnms/web-bn/switch',
  // 模板详情查询
  KanBanModelDetail: '/bnms/web-bn/template-set/query-info',
  // 查询模板
  KanBanSelectModel: '/bnms/web-bn/template-set/query-list',
  // 终端设备
  kanBanDevice: '/tdms/web-td/device/',
  // 排班设置
  NurseShiftSetting: '/bnms/web-bn/hsms-config',
  // 模板设置
  modelSetList: '/bnms/web-bn/template-set/query-list', // 列表
  oneModelSetList: '/bnms/web-bn/template-set/query-info', // 详情
  addModelSet: '/bnms/web-bn/template-set/save', // 添加
  modModelSet: '/bnms/web-bn/template-set/update', // 修改
  delModelSet: '/bnms/web-bn/template-set/delete', // 删除
  checkDelModelSet: '/bnms/web-bn/template-set/template-devices/', // 删除校验查询
  navList: '/bnms/web-bn/template-set/nav-list', // 导航样式
  // 模板设置
  pageSetList: '/bnms/web-bn/page-set/query-list', // 列表
  pageNopSetList: '/bnms/web-bn/page-set/query-page-list', // 列表==不分页
  addPageSet: '/bnms/web-bn/page-set/save', // 添加
  modPageSet: '/bnms/web-bn/page-set/update', // 修改
  delPageSet: '/bnms/web-bn/page-set/delete/', // 删除
  checkDelPageSet: '/bnms/web-bn/page-set/page-templates/', // 删除校验查询
  SwitchSetting: '/bnms/web-bn/switch-setting',
  doctorFieldsSetUpdate: 'nrms/web-nr/column/update',
  colLength: 'nrms/web-nr/column/columns',
  updateColLength: 'nrms/web-nr/column/update-column',
  // 根据formType获取表单列表
  getFormDictByType: '/nrms/web-nr/form-dict/getFormDictByType',
  //  交班原因
  shiftReason: '/nrms/web-nr/shift-reason',
  // 其他设置上传logo 查询logo地址
  getLogoUrl: 'nsms/web-nr/form-dict/logo',
  deleteLogo: 'nsms/web-nr/form-dict/logo',
  // 检查报告|病历病程 数据格式
  // wiki http://192.168.30.168:8090/pages/viewpage.action?pageId=31042031
  reportType: '/nsms/web-nr/file-type',
  saveLayout: '/bnms/web-bn/page-layout/add',
  delLayout: '/bnms/web-bn/page-layout/delete',
  savePageLayout: '/bnms/web-bn/page-layout/update',
  listLayout: '/bnms/web-bn/page-layout/query-list',
  updatePageLayout: '/bnms/web-bn/page-layout/update',
  updateLayout: '/bnms/web-bn/page-layout/update-once',
  hlfzSetting: '/hsms/web-hs/nurse-group-config',
  // 转科科室
  addTransfer: '/bnms/web-bn/roll-dept/save', // 添加转科科室
  transferList: '/bnms/web-bn/roll-dept/query-list', // 获取科室列表
  updateTransfer: '/bnms/web-bn/roll-dept/update', // 编辑转科科室
  delTransfer: '/bnms/web-bn/roll-dept/delete', // 删除转科科室
  batchUpdateTransfer: '/bnms/web-bn/roll-dept/batchUpdate'// 批量更新
};
