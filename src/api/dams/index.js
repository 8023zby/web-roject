import { _get, _post, _post_qs, _put, _put_qs, _delete, _postEx } from './http.js'
import urls from './config'

export const ApiPatient = {
  selectIn: (params = null) => {
    return _get({ url: urls['InPatient'], data: params })
  },
  selectOut: (params = null) => {
    return _get({ url: urls['OutPatient'], data: params })
  },
  selectTrans: (params = null) => {
    return _get({ url: urls['TransPatient'], data: params })
  }
}
// 长期医嘱
export const ApiDoctorsAdvice = {
  select: (params = null) => {
    return _post({ url: urls['DoctorsAdviceListList'], data: params })
  },
  selectPrintPage: (params = null) => {
    return _get({ url: urls['DoctorsAdviceListPrintPages'], data: params })
  },
  long_term: (params = null) => {
    return _get({ url: urls['DoctorsAdviceList'], data: params })
  },
  temporary: (params = null) => {
    return _get({ url: urls['DoctorsAdviceList'], data: params })
  },
  check: (params = null) => {
    return _put({ url: urls['DoctorsAdviceList'], data: params })
  },
  checkCancel: (params = null) => {
    return _put({ url: urls['DoctorsAdviceList'], data: params })
  }
}
// 医嘱执行
export const ApiAdviceExecute = {
  select: (params = null) => {
    return _post({ url: urls['DoctorsAdviceExecuteList'], data: params })
  },
  delete: (params = null) => {
    return _delete({ url: urls['DoctorsAdviceExecuteList'], data: params })
  },
  recovery: (params = null) => {
    return _post_qs({ url: urls['DoctorsAdviceExecuteRecovery'], data: params })
  },
  execute: (params = null) => {
    return _post({ url: urls['DoctorsAdviceExecute'], data: params })
  },
  patrol: (params = null) => {
    return _post({ url: urls['DoctorsAdvicePatrol'], data: params })
  },
  pause: (params = null) => {
    return _post({ url: urls['DoctorsAdvicePause'], data: params })
  },
  cancelPause: (params = null) => {
    return _post({ url: urls['DoctorsAdviceCancelPause'], data: params })
  },
  end: (params = null) => {
    return _post({ url: urls['DoctorsAdviceEnd'], data: params })
  },
  stop: (params = null) => {
    return _post({ url: urls['DoctorsAdviceStop'], data: params })
  },
  revoke: (params = null) => {
    return _post({ url: urls['DoctorsAdviceRevoke'], data: params })
  },
  remark: (params = null) => {
    return _post({ url: urls['DoctorsAdviceExecuteRemark'], data: params })
  },
  operateList: (params = null) => {
    return _get({ url: urls['DoctorsAdviceExecuteOperate'], data: params })
  }
}
// 输液巡视
export const ApiInfusionPatrol = {
  select: (params = null) => {
    return _get({ url: urls['InfusionPatrol'], data: params })
  },
  patrol: (params = null) => {
    return _post({
      url: urls['InfusionPatrol'] + '?targetDate=' + params.targetDate,
      data: { data: params.entities }
    })
  },
  patrolCancel: (params = null) => {
    return _put({
      url: urls['InfusionPatrolCacel'] + '?targetDate=' + params.targetDate,
      data: { data: params.entities }
    })
  }
}
export const ApiSkinTest = {
  select: (params = null) => {
    return _get({ url: urls['SkinTest'], data: params })
  },
  batch: (params = null) => {
    return _get({ url: urls['SkinTestBatch'], data: params })
  },
  execute: (params = null) => {
    return _post_qs({ url: urls['SkinTestExecute'], data: params })
  },
  edit: (params = null) => {
    return _put_qs({ url: urls['SkinTestInput'], data: params })
  },
  cancelExecute: (params = null) => {
    return _put_qs({ url: urls['SkinTestCancelTest'], data: params })
  },
  check: (params = null) => {
    return _put_qs({ url: urls['SkinTestConfirm'], data: params })
  },
  cancelCheck: (params = null) => {
    return _put_qs({ url: urls['SkinTestCancelCheck'], data: params })
  }
}
export const ApiUser = {
  verify_password: (params = null) => {
    return _post_qs({ url: urls['loginInTry'], data: params })
  },
  nurse: (params = null) => {
    return _get({ url: urls['userNurseList'], data: params })
  },
  doctor: (params = null) => {
    return _get({ url: urls['userDoctorList'], data: params })
  },
  nurseDoctor: (params = null) => {
    return _get({ url: urls['userNurseDoctorList'], data: params })
  }
}
// 医嘱频次设置
export const ApiFrequencySetting = {
  select: (params = null) => {
    return _post({ url: urls['DoctorsAdviceFrequencyConfigList'], data: params })
  },
  delete: (params = null) => {
    return _delete({ url: urls['DoctorsAdviceFrequencyConfig'], data: params })
  },
  save: (params = {}) => {
    return params['frequencyConfigId']
      ? ApiFrequencySetting.update(params)
      : ApiFrequencySetting.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['DoctorsAdviceFrequencyConfig'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['DoctorsAdviceFrequencyConfig'],
      data: params
    })
  },
  used: (params = null) => {
    return _post_qs({
      url: urls['DoctorsAdviceFrequencyIsUsed'],
      data: params
    })
  }
}

// 评估频次设置
export const ApiAssessSetting = {
  select: (params = null) => {
    return _post({ url: urls['AssessAdviceFrequencyConfigList'], data: params })
  },
  delete: (params = null) => {
    return _delete({ url: urls['AssessAdviceFrequencyConfig'], data: params })
  },
  save: (params = {}) => {
    return params['assessmentConfigId']
      ? ApiAssessSetting.update(params)
      : ApiAssessSetting.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['AssessAdviceFrequencyConfig'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['AssessAdviceFrequencyConfig'],
      data: params
    })
  },
  used: (params = null) => {
    return _post_qs({
      url: urls['AssessAdviceFrequencyIsUsed'],
      data: params
    })
  }
}

// 医嘱配药
export const ApiDoctorsAdviceDispense = {
  select: (params = null) => {
    return _get({ url: urls['DoctorsAdviceDispense'], data: params })
  },
  dispense: (params = null) => {
    return _post_qs({
      url: urls['DoctorsAdviceDispense'],
      data: params
    })
  },
  dispenseCancel: (params = null) => {
    return _put_qs({
      url: urls['DoctorsAdviceDispenseCancel'],
      data: params
    })
  },
  recovery: (params = null) => {
    return _put_qs({
      url: urls['DoctorsAdviceCheck'],
      data: params
    })
  },
  recoveryCancel: (params = null) => {
    return _put_qs({
      url: urls['DoctorsAdviceDispenseCancelCheck'],
      data: params
    })
  },
  selectAll: (params = null) => {
    return _get({ url: urls['DoctorsAdviceDispenseAll'], data: params })
  },
  selectQr: (params = null) => {
    return _get({ url: urls['labelQr'], data: params })
  }
}

// 简版医嘱
export const janeDoctorsAdvice = {
  janeList: (params = null) => { // 简版医嘱列表
    return _post({
      url: urls['janeList'],
      data: params
    })
  },
  janeFieldsList: (params = null) => { // 简版医嘱表头
    return _get({
      url: urls['janeFieldsList'],
      data: params
    })
  },
  janeType: (params = null) => { // 简版医嘱类型
    return _get({
      url: urls['janeType'],
      data: params
    })
  },
  janeClassification: (params = null) => { // 简版医嘱分类
    return _get({
      url: urls['janeClassification'],
      data: params
    })
  },
  cancelToDo: (params = null) => { // 取消执行、执行
    return _post({
      url: urls['cancelToDo'],
      data: params
    })
  }
}
