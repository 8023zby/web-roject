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
    return _get({ url: urls['DoctorsAdviceList'], data: params })
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
    return _post_qs({ url: urls['DoctorsAdviceExecute'], data: params })
  },
  end: (params = null) => {
    return _post_qs({ url: urls['DoctorsAdviceExecuteEnd'], data: params })
  },
  cancel: (params = null) => {
    return _post_qs({ url: urls['DoctorsAdviceExecuteCancel'], data: params })
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
  edit: (params = null) => {
    return _put({ url: urls['SkinTest'] + '?targetDate=' + params.targetDate, data: params.entity })
  },
  cancelEdit: (params = null) => {
    return _put({ url: urls['SkinTestCancelTest'] + '?targetDate=' + params.targetDate, data: params.entity })
  },
  check: (params = null) => {
    return _put({ url: urls['SkinTest'] + '?targetDate=' + params.targetDate, data: params.entity })
  },
  cancelCheck: (params = null) => {
    return _put({ url: urls['SkinTestCancelCheck'] + '?targetDate=' + params.targetDate, data: params.entity })
  }
}
export const ApiUser = {
  verify_password: (params = null) => {
    return _post_qs({ url: urls['loginInTry'], data: params })
  },
  nurse: (params = null) => {
    return _get({ url: urls['userNurseList'], data: params })
  }
}
// 医嘱频次设置
export const ApiFrequencySetting = {
  select: (params = null) => {
    return _get({ url: urls['DoctorsAdviceFrequencyConfig'], data: params })
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
// 医嘱配药
export const ApiDoctorsAdviceDispense = {
  select: (params = null) => {
    return _get({ url: urls['DoctorsAdviceDispense'], data: params })
  },
  dispense: (params = null) => {
    return _put({
      url: urls['DoctorsAdviceDispense'] + '?targetDate=' + params.targetDate,
      data: params.entities
    })
  },
  dispenseCancel: (params = null) => {
    return _put({
      url: urls['DoctorsAdviceDispenseCancel'] + '?targetDate=' + params.targetDate,
      data: params.entities
    })
  },
  recovery: (params = null) => {
    return _put({
      url: urls['DoctorsAdviceDispense'] + '?targetDate=' + params.targetDate,
      data: params.entities
    })
  },
  recoveryCancel: (params = null) => {
    return _put({
      url: urls['DoctorsAdviceDispenseCancelCheck'] + '?targetDate=' + params.targetDate,
      data: params.entities
    })
  },
  selectAll: (params = null) => {
    return _get({ url: urls['DoctorsAdviceDispenseAll'], data: params })
  },
  selectQr: (params = null) => {
    return _get({ url: urls['labelQr'], data: params })
  }
}
// 文书-评估管理
export const ApiAssessManage = {
  select: (params = null) => {
    return _get({ url: urls['assessManageList'], data: params })
  },
  delete: (params = null) => {
    return _delete({ url: urls['assessManageDict'], data: params })
  },
  sort: (params = null) => {
    return _put({ url: urls['assessManageSort'], data: params })
  },
  save: (params = {}) => {
    return params['assId']
      ? ApiAssessManage.update(params)
      : ApiAssessManage.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['assessManageDict'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['assessManageDict'],
      data: params
    })
  }

}

// 获取科室
export const ApiDept = {
  select: (params = null) => {
    return _get({ url: urls['deptList'], data: params })
  }
}

// 标签应用到科室
export const ApiLabel2Nurse = {
  one: (params = null) => {
    return _put({
      url: urls['labelManageApply'],
      data: params
    })
  },
  multi: (params = null) => {
    return _put({
      url: urls['labelManageApplyBatch'],
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
