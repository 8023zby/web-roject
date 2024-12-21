/*
 * @Author: 杨星波
 * @Owner: 
 * @Date: 2021-03-02 12:30:03
 * @LastEditTime: 2021-12-15 09:43:31
 * @LastEditors: 杨星波
 * @Description: 
 * @FilePath: \yarward-dams-frontEnd\src\api\dams\config.js
 */
export default {
  baseUrl: '/',
  InPatient: 'bnms/web-bn/patient-in-view-list/by-not-null-bed',
  OutPatient: 'bnms/web-bn/patient-out-list',
  TransPatient: 'bnms/web-bn/patient-transfer-list',

  // 医嘱列表
  DoctorsAdviceListList: 'dams/web-da/advice/list',
  DoctorsAdviceList: 'dams/web-da/advice',
  DoctorsAdviceListPrintPages: 'dams/web-da/advice/print',
  // 医嘱执行
  DoctorsAdviceExecuteList: 'dams/web-da/execute/list',
  DoctorsAdviceExecuteRecovery: 'dams/web-da/execute/cancel-delete',
  DoctorsAdviceExecute: 'dams/web-da/execute/start-execute-remark',
  DoctorsAdvicePatrol: 'dams/web-da/execute/patrol-execute-remark',
  DoctorsAdvicePause: 'dams/web-da/execute/pause-execute-remark',
  DoctorsAdviceCancelPause: 'dams/web-da/execute/cancel-pause-execute-remark',
  DoctorsAdviceEnd: 'dams/web-da/execute/end-execute-remark',
  DoctorsAdviceStop: 'dams/web-da/execute/stop-execute-remark',
  DoctorsAdviceRevoke: 'dams/web-da/execute/revoke-execute-remark',
  // DoctorsAdviceExecuteRemark: 'dams/web-da/execute/remark',
  // DoctorsAdviceExecuteOperate: 'dams/web-da/execute/operate-list',
  // 输液巡视
  InfusionPatrol: 'dams/web-da/patrol',
  InfusionPatrolCacel: 'dams/web-da/patrol/cancelPatrol',
  // 医嘱配药
  DoctorsAdviceDispense: '/dams/web-da/dispense',
  DoctorsAdviceDispenseAll: '/dams/web-da/dispense/all',
  DoctorsAdviceDispenseCancel: '/dams/web-da/dispense/cancelDispense',
  DoctorsAdviceCheck: '/dams/web-da/dispense/check',
  DoctorsAdviceDispenseCancelCheck: '/dams/web-da/dispense/cancelCheck',
  labelQr: '/dams/web-da/dispense/qrCode',

  // 医嘱频次设置
  DoctorsAdviceFrequencyConfigList: 'dams/web-da/frequency-config/list',
  DoctorsAdviceFrequencyConfig: 'dams/web-da/frequency-config',
  DoctorsAdviceFrequencyIsUsed: 'dams/web-da/frequency-config/is-delete',

  // 评估频次设置
  AssessAdviceFrequencyConfigList: 'dams/web-da/assessment-config/list',
  AssessAdviceFrequencyConfig: 'dams/web-da/assessment-config',
  AssessAdviceFrequencyIsUsed: 'dams/web-da/assessment-config/is-delete',

  // 皮试
  SkinTest: 'dams/web-da/skinTest',
  SkinTestBatch: 'dams/web-da/skinTest/batch',
  SkinTestInput: 'dams/web-da/skinTest/input',
  SkinTestConfirm: 'dams/web-da/skinTest/confirm',
  SkinTestExecute: '/dams/web-da/skinTest/exec',
  SkinTestCancelTest: 'dams/web-da/skinTest/cancelExec',
  SkinTestCancelCheck: 'dams/web-da/skinTest/cancelConfirm',
  // 密码验证
  loginInTry: 'passport/web-rbac/logins/loginInTry',
  userNurseList: '/ifms/web-org/emp/listSortNurse/currentDeptByMode',
  userDoctorList: '/ifms/web-org/emp/listSortDoctor/currentDeptByMode',
  userNurseDoctorList: '/ifms/web-org/emp/currentDeptByMode',
  // 简版医嘱
  janeList: 'nrms/web-nr/simple-advice/list',
  janeFieldsList: 'nrms/web-nr/column/list',
  janeType: 'nrms/web-nr/simple-advice/getTypes',
  janeClassification: 'nrms/web-nr/simple-advice/getClassifys',
  cancelToDo: 'nrms/web-nr/simple-advice/oper'
}
