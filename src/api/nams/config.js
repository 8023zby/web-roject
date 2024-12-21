export default {
  baseUrl: '/',
  InPatient: 'bnms/web-bn/patient-in-view-list/by-not-null-bed',
  OutPatient: 'bnms/web-bn/patient-out-list',
  TransPatient: 'bnms/web-bn/patient-transfer-list',

  // 医嘱列表
  DoctorsAdviceList: 'dams/web-da/advice',
  DoctorsAdviceListPrintPages: 'dams/web-da/advice/print',
  // 医嘱执行
  DoctorsAdviceExecuteList: 'dams/web-da/execute',
  DoctorsAdviceExecuteRecovery: 'dams/web-da/execute/cancel-delete',
  DoctorsAdviceExecute: 'dams/web-da/execute/start-execute',
  DoctorsAdviceExecuteEnd: 'dams/web-da/execute/end-execute',
  DoctorsAdviceExecuteCancel: 'dams/web-da/execute/cancel-execute',
  DoctorsAdviceExecuteRemark: 'dams/web-da/execute/remark',
  DoctorsAdviceExecuteOperate: 'dams/web-da/execute/operate-list',
  // 输液巡视
  InfusionPatrol: 'dams/web-da/patrol',
  InfusionPatrolCacel: 'dams/web-da/patrol/cancelPatrol',
  // 医嘱配药
  DoctorsAdviceDispense: '/dams/web-da/dispense',
  DoctorsAdviceDispenseAll: '/dams/web-da/dispense/all',
  DoctorsAdviceDispenseCancel: '/dams/web-da/dispense/cancelDispense',
  DoctorsAdviceDispenseCancelCheck: '/dams/web-da/dispense/cancelCheck',
  labelQr: '/dams/web-da/dispense/qrCode',
  // 频次设置
  DoctorsAdviceFrequencyConfig: 'dams/web-da/frequency-config',
  DoctorsAdviceFrequencyIsUsed: 'dams/web-da/frequency-config/is-delete',
  // 皮试
  SkinTest: 'dams/web-da/skinTest',
  SkinTestCancelTest: 'dams/web-da/skinTest/cancelTest',
  SkinTestCancelCheck: 'dams/web-da/skinTest/cancelCheck',
  // 密码验证
  loginInTry: 'passport/web-rbac/logins/loginInTry',
  userNurseList: '/ifms/web-org/emp/listSortNurse/currentDeptByMode',
  // 文书-评估管理
  assessManageList: 'nams/web-na/ass-dict/get-all',
  assessManageDict: 'nams/web-na/ass-dict',
  assessManageSort: 'nams/web-na/ass-dict/sort-assenssment',
  // 科室
  deptList: '/ifms/web-org/depts',
  // 标签管理
  // labelManage: "/bnms/web-bn/label-dict",
  // labelManageDelBefore: '/bnms/web-bn/label-dict/apply-dept-list-name',
  // labelRelationLabel: "/bnms/web-bn/label-dict/relation-label",
  // labelManageApplyDept: "/bnms/web-bn/label-dict/apply-dept-list",
  labelManageApply: '/nams/web-na/ass-dict/batch-update-dept',
  labelManageApplyBatch: '/nams/web-na/ass-dict/batch-update-dept',

  // 评估频次设置
  AssessAdviceFrequencyConfigList: 'dams/web-da/assessment-config/list',
  AssessAdviceFrequencyConfig: 'dams/web-da/assessment-config',
  AssessAdviceFrequencyIsUsed: 'dams/web-da/assessment-config/is-delete'
}
