/* eslint-disable no-return-await */
import { _get, _post, _post_qs, _put, _put_qs, _delete, _postEx } from './http'
import urls from './config'
// / / 护理记录
export const ApiNurseNotes = {
  insertTemp: (params = {}) => {
    return _post({
      url: urls['insertTemp'],
      data: params
    })
  },
  someIn: (params = {}) => {
    return _post({
      url: urls['someIn'],
      data: params
    })
  },
  select: (params = null) => {
    return _get({
      url: urls['nurseNotesList'],
      data: params
    })
  },
  selectAll: (params = null) => {
    return _get({
      url: urls['nurseNotesListAll'],
      data: params
    })
  },
  save: (params = {}) => {
    return params['recordId']
      ? ApiNurseNotes.update(params)
      : ApiNurseNotes.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['nurseNotesAdd'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['nurseNotesAdd'],
      data: params
    })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['nurseNotesDelete'],
      data: params
    })
  },
  reviewAndSigning: (params = null) => {
    return _put({
      url: urls['nurseNotesReviewAndSigning'],
      data: params
    })
  },
  getSigns: (params = null) => {
    return _get({
      url: urls['nurseNotesGetSignsByPatientId'],
      data: params
    })
  },
  getFixedListItem: (params = null) => {
    return _get({
      url: urls['nurseNotesGetListFixedItem'],
      data: params
    })
  },
  getFixedAddItem: (params = null) => {
    return _get({
      url: urls['nurseNotesGetAddFixedItem'],
      data: params
    })
  },
  getFocusData: (params = null) => {
    return _get({
      url: urls['nurseNotesGetFocus'],
      data: params
    })
  },
  syncSign: (params = null) => {
    return _get({
      url: urls['nurseNotesSyncSign'],
      data: params
    })
  }
}
export const ApiPatient = {
  selectIn: (params = null) => {
    return _get({ url: urls['nurseNotesGetInPatient'], data: params })
  },
  selectOut: (params = null) => {
    return _get({ url: urls['nurseNotesGetOutPatient'], data: params })
  },
  selectTrans: (params = null) => {
    return _get({ url: urls['nurseNotesGetTransPatient'], data: params })
  }
}
// / / 组织架构 - 护理单元
export const ApiDept = {
  select: (params = null) => {
    return _get({ url: urls['deptList'], data: params })
  }
}
// / / 表单管理 自动表头
export const ApiAutoForm = {
  select: (params = null) => {
    return _get({ url: urls['deptFormInfo'], data: params })
  },
  // 获取指定类型的表单列表
  getList: (params = null) => {
    return _post({ url: urls['getList'], data: params })
  },
  // 应用表单至部门、更新
  postForm2Dept: (params = null) => {
    return _post({ url: urls['deptFormInfo'], data: params })
  },
  // 观察记录单单独拥有
  observe: (params = null) => {
    return _put({ url: urls['observe'], data: params })
  },
  getNextFormCode: (params = null) => {
    return _get({ url: urls['getNextFormCode'], data: params })
  },
  putForm: (params = null) => {
    return _put({ url: urls['putForm'], data: params })
  },
  postForm: (params = null) => {
    return _post({ url: urls['putForm'], data: params })
  },
  delForm: (params = null) => {
    return _delete({ url: urls['putForm'], data: params })
  },
  getFormDictByType: (params = null) => {
    return _get({ url: urls['getFormDictByType'], data: params })
  },
  getFormDict: (params = null) => {
    return _get({ url: urls['getFormDict'], data: params })
  },
  delBeforeCheck: (params = null) => { // 体围单删除之前的校验
    return _get({ url: urls['delBefoeCheck'], data: params })
  }
}
export const ApiBed = {
  select: (params = null) => {
    return _get({ url: '', data: params })
  }
}
export const ApiUser = {
  verify_password: (params = null) => {
    return _post_qs({ url: urls['loginInTry'], data: params })
  },
  select: (params = null) => {
    return _get({ url: urls['users'], data: params })
  }
}
// wangjuan
export const ApiClinicalReport = {
  selectInspection: (params = null) => {
    return _post({
      url: urls['nurseNotesPatientInspection'],
      data: params
    })
  },
  selectInspectionPAD: (params = null) => {
    return _get({
      url: urls['nurseNotesPatientInspectionPAD'],
      data: params
    })
  },
  selectInspectionListPAD: (params = null) => {
    return _get({
      url: urls['nurseNotesPatientInspectionListPAD'],
      data: params
    })
  },
  selectExamine: (params = null) => {
    return _post({
      url: urls['nurseNotesPatientExamine'],
      data: params
    })
  },
  selectExaminePAD: (params = null) => {
    return _get({
      url: urls['nurseNotesPatientExaminePAD'],
      data: params
    })
  },
  selectExamineListPAD: (params = null) => {
    return _get({
      url: urls['nurseNotesPatientExamineListPAD'],
      data: params
    })
  },
  selectExamineItemsPost: (params = null) => {
    return _post({
      url: urls['nurseNotesPatientExamineItemsAll'],
      data: params
    })
  },
  selectExamineItemsAllPAD: (params = null) => {
    return _get({
      url: urls['nurseNotesPatientExamineItemsAllPAD'],
      data: params
    })
  },
  selectExamineItemsChartByPatientIdPost: (params = null) => {
    return _post({
      url: urls['examineItemsChartSelectByPatientId'],
      data: params
    })
  },
  updateExamineSwitch: (params = null) => {
    return _post({
      url: urls['examineUpdateSwitch'],
      data: params
    })
  },
  updateInspectionSwitch: (params = null) => {
    return _post({
      url: urls['inspectionUpdateSwitch'],
      data: params
    })
  },
  getReportType: (params) => {
    return _get({
      url: urls['reportType'],
      data: params
    })
  },
  getDcmJpg: (params) => {
    return _get({
      url: urls['dimJpgPath'],
      data: params
    })
  }
}

// 体温单相关
export const ApiTemperatureSheet = {
  selectAll: (params = null) => {
    return _get({
      url: urls['temperatureSheetAll'],
      data: params
    })
  },
  selectAllApp: (params = null) => {
    return _get({
      url: urls['temperatureSheetAllApp'],
      data: params
    })
  },
  select: (params = null) => {
    return _get({
      url: urls['temperatureSheet'],
      data: params
    })
  },
  selectApp: (params = null) => {
    return _get({
      url: urls['temperatureSheetApp'],
      data: params
    })
  },
  selectByHour: (params = null) => {
    return _get({
      url: urls['temperatureSheetDay'],
      data: params
    })
  },
  selectByHourApp: (params = null) => {
    return _get({
      url: urls['temperatureSheetDayApp'],
      data: params
    })
  },
  saveSignData: (params = null) => {
    return _post({
      url: urls['temperatureSheet'],
      data: params
    })
  },
  saveSignDataApp: (params = null) => {
    return _post({
      url: urls['temperatureSheetApp'],
      data: params
    })
  },
  saveList: (params = null) => {
    return _post({
      url: urls['temperatureSheetSaveList'],
      data: params
    })
  },
  outputSign: (params = null) => {
    return _post({
      url: urls['temperatureSyncRYPGData'],
      data: params
    })
  }
}
// 体况
export const ApiBodyCondition = {
  select: (params = null) => {
    return _get({ url: urls['bodyCondition'], data: params })
  },
  selectApp: (params = null) => {
    return _get({ url: urls['bodyConditionApp'], data: params })
  },
  find: (params = null) => {
    return _get({ url: urls['bodyConditionDetail'], data: params })
  },
  findApp: (params = null) => {
    return _get({ url: urls['bodyConditionDetailApp'], data: params })
  },
  save: (params = {}) => {
    return params['codId']
      ? ApiBodyCondition.update(params)
      : ApiBodyCondition.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['bodyCondition'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['bodyCondition'],
      data: params
    })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['bodyCondition'],
      data: params
    })
  },
  saveApp: (params = {}) => {
    return params['eventId']
      ? ApiBodyCondition.updateApp(params)
      : ApiBodyCondition.insertApp(params)
  },
  insertApp: (params = null) => {
    return _post({
      url: urls['bodyConditionApp'],
      data: params
    })
  },
  updateApp: (params = null) => {
    return _put({
      url: urls['bodyConditionApp'],
      data: params
    })
  },
  deleteApp: (params = null) => {
    return _delete({
      url: urls['bodyConditionApp'],
      data: params
    })
  }
}

// 临时事件 查增改删
export const ApiTempEvent = {
  select: (params = null) => {
    return _get({ url: urls['temperatureEvent'], data: params })
  },
  save: (params = {}) => {
    return params['eventId']
      ? ApiTempEvent.update(params)
      : ApiTempEvent.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['temperatureEvent'],
      data: params
    })
  },
  insertApp: (params = null) => {
    return _post({
      url: urls['temperatureEventApp'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['temperatureEvent'],
      data: params
    })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['temperatureEvent'],
      data: params
    })
  }
}

// 获取所有体征项 查增改删
export const ApiSignItem = {
  select: (params = null) => {
    return _post({ url: urls['signItemList'], data: params })
  },
  save: (params = {}) => {
    return params['signId']
      ? ApiSignItem.update(params)
      : ApiSignItem.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['signItem'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['signItem'],
      data: params
    })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['signItem'],
      data: params
    })
  }
  // 获取应用过得科室
  // selectApplyDept: (params = null) => {
  //   return _get({
  //     url: urls['signApplyGetDept'],
  //     data: params
  //   })
  // },
  // selectRelation: (params = null) => {
  //   return _get({
  //     url: urls['signRelation'],
  //     data: params
  //   })
  // }
}
// 获取体征项分类
export const ApiSignClassify = {
  select: (params = null) => {
    return _get({ url: urls['signClassifyList'], data: params })
  },
  save: (params = {}) => {
    return params['signClassifyId']
      ? ApiSignClassify.update(params)
      : ApiSignClassify.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['signClassifyList'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['signClassifyList'],
      data: params
    })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['signClassifyList'],
      data: params
    })
  }
}
// 体征项分类排序
export const ApiSignItemClassifySort = {
  itemSetting: (params = null) => {
    return _post({ url: urls['signClassifySort'], data: params })
  }
}
// 体征项管理
export const ApiSignManage = {
  select: (params = null) => {
    return _post({ url: urls['signItemManage'], data: params })
  }
}
// 体征项管理编辑
export const ApiSignManageEdit = {
  save: (params = null) => {
    return _put({ url: urls['signItemManageEdit'], data: params })
  }
}
// 体况
export const ApiSignBodyItem = {
  // 查询表头
  selectTh: (params = null) => {
    return _post({ url: urls['signBodyItemTh'], data: params })
  },
  // 查询数据
  selectData: (params = null) => {
    return _post({ url: urls['signBodyItemData'], data: params })
  },
  confirm: (params = null) => {
    return _put({
      url: urls['bodyCondition'],
      data: params
    })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['bodyCondition'],
      data: params
    })
  }
}
export const ApiInAndOutDate = {
  select: (params = null) => {
    return _get({ url: urls['inAndOutDate'], data: params })
  }
}

export const ApiSignItem2Nurse = {
  // 单个应用
  one: (params = null) => {
    return _post_qs({
      url: urls['signApply'],
      data: params
    })
  },
  // 批量应用
  multi: (params = null) => {
    return _post_qs({
      url: urls['signApply'],
      data: params
    })
  }
}

export const temporary = {
  clear: () => {
    return _delete({
      url: '/nrms/app-nr/body-condition/all'
    })
  }
}

// 体征项记录---体温单
export const ApiSignItemSetting = {
  // 查询体温单应用的体征项
  selectItem: (params = null) => {
    return _get({
      url: urls['signApply'],
      data: params
    })
  },
  selectItemApp: (params = null) => {
    return _get({
      url: urls['signApplyApp'],
      data: params
    })
  },
  // 开启关闭
  open: (params = null) => {
    return _post({
      url: urls['signItemAdd'],
      data: params
    })
  },
  // 排序
  sort: (params = null) => {
    return _post({
      url: urls['signItemAdd'],
      data: params
    })
  },
  itemSetting: (params = null) => {
    return _put({
      url: urls['signApply'],
      data: params
    })
  },
  selectTime: (params = null) => {
    return _get({
      url: urls['measureTime'],
      data: params
    })
  },
  selectTimeApp: (params = null) => {
    return _get({
      url: urls['measureTimeApp'],
      data: params
    })
  },
  timeSetting: (params = {}) => {
    return _post({
      url: urls['measureTime'],
      data: params
    })
  },
  // 2020-09-15 表单管理-体温单设置中使用
  temperatureMeasureTime: (params = null) => {
    return _get({
      url: urls['temperatureMeasureTime'],
      data: params
    })
  },
  temperatureMeasureSave: (params = null) => {
    return _post({
      url: urls['temperatureMeasureTime'],
      data: params
    })
  }
}
// 趋势图---血糖单
export const ApiBloodChartData = {
  select: (params = null) => {
    return _get({ url: urls['bloodChart'] + '?patientId=' + params.patientId + '&beginTime=' + params.begin_date + '&endTime=' + params.end_date + '&formCode=' + params.formCode })
  },
  selectNew: (params = null) => {
    return _get({ url: urls['bloodChartNew'] + '?patientId=' + params.patientId + '&beginTime=' + params.begin_date + '&endTime=' + params.end_date + '&formCode=' + params.formCode })
  }
}
// 趋势图---体温单
export const ApiTemperatureChartData = {
  select: (params = null) => {
    return _get({ url: urls['temperatureChart'] + '?patientId=' + params.patientId + '&signCode=' + params.signCode + '&beginTime=' + params.begin_date + '&endTime=' + params.end_date })
  }
}
export const ApiEducationList = {
  select: (params = null) => {
    return _get({ url: urls['educationList'], data: params })
  },
  save: (params = {}) => {
    return params['recordId']
      ? ApiEducationList.update(params)
      : ApiEducationList.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['educationList'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['educationList'],
      data: params
    })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['educationList'],
      data: params
    })
  },
  // 评价
  evaluate: (params = null) => {
    return _post_qs({
      url: urls['educationListEvaluate'],
      data: params
    })
  },
  contentAll: (params = null) => {
    return _get({
      url: urls['educationContentAll'],
      data: params
    })
  }
}
// 巡视设置
export const ApiPatrol = {
  getData: (params = null, pType) => {
    return _get({
      url: urls[pType],
      data: params
    })
  },
  addData: (params = null, pType) => {
    return _post({
      url: urls[pType],
      data: params
    })
  },
  putData: (params = null, pType) => {
    return _put({
      url: urls[pType],
      data: params
    })
  },
  delData: (params = null, pType) => {
    return _delete({
      url: urls[pType],
      data: params
    })
  },
  getRecord: (params = null, pType) => {
    return _get({
      url: urls[pType],
      data: params
    })
  },
  addRecord: (params = null, pType) => {
    return _post({
      url: urls[pType],
      data: params
    })
  },
  putRecord: (params = null, pType) => {
    return _put({
      url: urls[pType],
      data: params
    })
  },
  delRecord: (params = null, pType) => {
    return _delete({
      url: urls[pType],
      data: params
    })
  },
  getNurseLevel: (params = null) => {
    return _get({
      url: urls['getNurseLevel'],
      data: params
    })
  }
}
// 转科记录单
export const ApiDeptChange = {
  getData: (params = null) => {
    return _get({
      url: urls['handoverRecord'],
      data: params
    })
  },
  addData: (params = null) => {
    return _post({
      url: urls['handoverRecord'],
      data: params
    })
  },
  putData: (params = null) => {
    return _put({
      url: urls['handoverRecord'],
      data: params
    })
  },
  delData: (params = null) => {
    return _delete({
      url: urls['handoverRecord'],
      data: params
    })
  }
}

export const ApiCriticalValueInspect = {
  select: (params = null) => {
    return _get({ url: urls['inspectSet'], data: params })
  },
  selectItem: (params = null) => {
    return _get({ url: urls['inspectItem'], data: params })
  },
  save: (params = {}) => {
    return params['inspectSetId']
      ? ApiCriticalValueInspect.update(params)
      : ApiCriticalValueInspect.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['inspectSet'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['inspectSet'],
      data: params
    })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['inspectSet'],
      data: params
    })
  }
}

export const ApiCriticalValueExamine = {
  select: (params = null) => {
    return _get({ url: urls['examineSet'], data: params })
  },
  selectItem: (params = null) => {
    return _get({ url: urls['examineItem'], data: params })
  },
  save: (params = {}) => {
    return params['examineSetId']
      ? ApiCriticalValueExamine.update(params)
      : ApiCriticalValueExamine.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['examineSet'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['examineSet'],
      data: params
    })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['examineSet'],
      data: params
    })
  }
}

// 危急值字典设置 -- 分类
export const ApiDangerClassify = {
  select: (params = null) => {
    return _get({ url: urls['dangerClassify'], data: params })
  },
  save: (params = {}) => {
    return params['crisisClassId']
      ? ApiDangerClassify.update(params)
      : ApiDangerClassify.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['dangerClassify'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['dangerClassify'],
      data: params
    })
  },
  sort: (params = null) => {
    return _put({
      url: urls['dangerClassifySort'],
      data: params
    })
  },
  deleteSelect: (params = null) => {
    return _get({ url: urls['dangerClassifyDeleteSelect'], data: params })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['dangerClassify'],
      data: params
    })
  }
}
// 危急值字典设置 -- 检查项目
export const ApiDangerDictionary = {
  select: (params = null) => {
    return _get({ url: urls['dangerDictionary'], data: params })
  },
  save: (params = {}) => {
    return params['crisisDictId']
      ? ApiDangerDictionary.update(params)
      : ApiDangerDictionary.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['dangerDictionary'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['dangerDictionary'],
      data: params
    })
  },
  deleteSelect: (params = null) => {
    return _get({ url: urls['dangerDictionaryDeleteSelect'], data: params })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['dangerDictionary'],
      data: params
    })
  },
  selectProgress: (params = null) => {
    return _get({
      url: urls['dangerDictionaryProcess'],
      data: params
    })
  },
  initUpload: () => {
    return _get({
      url: urls['dangerDictionaryInit']
    })
  },
  cancelUpload: (params = null) => {
    return _get({
      url: urls['dangerDictionaryCancel'],
      data: params
    })
  },
  selectChild:(params = null)=>{
    return _get({
      url: urls['dangerDictionaryRelationChild'],
      data: params
    })
  }
}
// 检验子项目
export const ApiChildDangerDictionary = {
  select: (params = null) => {
    return _get({ url: urls['dangerChildDictionary'], data: params })
  },
  save: (params = {}) => {
    return params['crisisChildDictId']
      ? ApiChildDangerDictionary.update(params)
      : ApiChildDangerDictionary.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['dangerChildDictionary'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['dangerChildDictionary'],
      data: params
    })
  },
  deleteSelect: (params = null) => {
    return _get({ url: urls['dangerChildDictionaryDeleteSelect'], data: params })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['dangerChildDictionary'],
      data: params
    })
  },
}
// 体温单设置-体征项配置
export const ApiTemperatureItemSetting = {
  select: (params = null) => {
    return _get({ url: urls['temperatureItemSetting'], data: params })
  },
  updateAlwaysShow: (params = null) => {
    return _put_qs({
      url: urls['temperatureItemShow'],
      data: params
    })
  },
  sort: (params = null) => {
    return _put({
      url: urls['temperatureItemSort'],
      data: params
    })
  },
  // 查询体征项
  selectItem: (params = null) => {
    return _get({ url: urls['temperatureItemSelect'], data: params })
  },
  importItem: (params = null) => {
    return _post({
      url: urls['temperatureItemSetting'],
      data: params
    })
  }
}
// 评估单管理
export const ApiAssManage = {
  async assMangerList (params) {
    return await _get({ url: urls['assClassList'], data: params })
  },
  async list (params) {
    return await _get({ url: urls['assRecordList'], data: params })
  },
  async getList (params) {
    return await _post({ url: urls['assRecordQuery'], data: params })
  },
  async addLoop (params) {
    return await _post({ url: urls['assLoop'], data: params })
  },
  async getScoreColor (params) {
    return await _get({ url: urls['queryScore'], data: params })
  },
  /**
   * @description: 获取循环表单
   * @param {*} params {
   * assId:评估表记录ID，字符串
   * patientId:患者ID，字符串
   * assTimes:评估次数，如果是添加，值为-1，数字
   * pagination:分页参数，根据返回的pageUp或pageDown传参（0,6），字符串，选填
   * }
   * @return {*}
   */
  async getQueryLoop (params) {
    return await _get({ url: urls['assQueryLoop'], data: params })
  },
  /**
   * @description: 同步体温单
   * @param {*} params {
   * "patientId":"2",
   * "recordList":[
   *     {
   *         "itemCode":"tengtongdengji", // 体征项对应的字段值
   *         "signValue":"2", // 体征对应值
   *         "phValue":null, // 复测值
   *         "itemHour":2, // 时间点
   *         "itemValueType":null, // 体征值对应的类型，例如腋温等
   *         "itemType":null, // 区分体征项类别 全天 上午 下午
   *         "recordDate":"2020-12-22" // 记录日期
   *     }
   *   ]
   * }
   * @return {*}
   */
  async syncTemperature (params) {
    return await _post({ url: urls['syncTemperature'], data: params })
  },
  /**
   *
   * 查询某日期几个时刻点最近的记录时间
   * @param {string} [params={
   *     assId: '', 评估单id
   *     patientId: '', 患者id
   *     recordDate: '' 评估日期（yyyy-MM-dd） 如果多个 逗号隔开 如 2020-12-23,2020-12-24，字符串
   *   }]
   * @return {*}
   */
  async getRecordDate (params = {
    assId: '',
    patientId: '',
    recordDate: ''
  }) {
    return await _get({ url: urls['assQueryHours'], data: params })
  },
  async add (params) {
    return await _post({ url: urls['assRecordList'], data: params })
  },
  async edit (params) {
    return await _put({ url: urls['assRecordList'], data: params })
  },
  async delete (assRecordId) {
    return await _delete({ url: urls['assRecordList'], data: { assRecordId }})
  },
  async addPatientRecord (params) {
    return await _post({ url: urls['formRecordPatient'], data: params })
  },
  async getPatientRecord (params) {
    return await _get({ url: urls['formRecordPatient'], data: params })
  }

}

export const ApiEventManage = {
  select: (params = null) => {
    return _get({
      url: urls['clinicalEvent'],
      data: params
    })
  },
  save: (params = {}) => {
    return params['id']
      ? ApiEventManage.update(params)
      : ApiEventManage.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['clinicalEvent'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['clinicalEvent'],
      data: params
    })
  }
}

export const ApiFormDictSetting = {
  select: (params = null) => {
    return _get({
      url: urls['form_dict_setting_select'],
      data: params
    })
  },
  add: (params = null) => {
    return _post({
      url: urls['form_dict_setting_add'],
      data: params
    })
  }
}

/** **************************************自动表单管理****************************************/

export const ApiFormMange = {
  async add (data) {
    return await _post({ url: urls['formManage'], data })
  },
  async edit (data) {
    return await _put({ url: urls['formManage'], data })
  },
  async delete (assId) {
    return await _delete({ url: urls['formManage'], data: { assId }})
  },
  /**
   *
   *
   * @param {*} data
   * assType:类型 1001 手术评估、1002 交接单、1003 观察记录单、1004 交班表单、1005 入院评估表单，字符串
   * assCode:编码，字符串，可选
   * assName:名称，字符串，可选
   * page:页数，数字，可选
   * size:大小，数字，可选
   * @return {*}
   */
  async list (data) {
    return await _get({ url: urls['formManage'], data })
  },

  /**
   *
   *
   * @param {*} params
   *
   * "assId":"1abf2bf5fed94edba1a902cb28f3c8a0",
   * "deptIds":"8b203276917b43808388f4443f0b640c"
   * @return {*}
   */
  async used (params) {
    return await _put({ url: urls['formManageUsed'], data: params })
  },
  // 交班管理 中 交班记录配置
  async confirm (params) {
    return await _post({ url: urls['formManageConfirm'], data: params })
  },
}
/**
* ------------------------------------------------------------------
* 血糖检测单
* ------------------------------------------------------------------
*/
export const ApiBloodMonitoring = {
  /**
   * 获取列表
   *
   * @param {*} data
   * {
   *   patientId 患者id
   *   formCode 表单CODE
   *   beginTime 开始时间
   *   endTime 截止时间
   *   page
   *   size
   * }
   * @return {*}
   */
  async list (data) {
    return await _get({ url: `${urls['bloodMonitoring']}`, data })
  },
  /**
   *删除
   *
   * @param {*} data
   * {recordId: 记录id}
   * @return {*}
   */
  async del (data) {
    return await _delete({ url: `${urls['bloodMonitoring']}`, data })
  },
  /**
   * @description: 血糖趋势图
   * @param {*} data
   * {
   *   patientId 患者id
   *   formCode 表单CODE
   *   beginTime 开始时间
   *   endTime 截止时间
   * }
   * @return {*}
   */
  async trend (data) {
    return await _get({ url: `${urls['bloodMonitoring']}/trend`, data })
  },
  /**
   *添加
   *
   * @param {*} data
   *   {
   *     "patientId": "1352346",
   *     "recordDate": "2021-01-08 00:00:00",
   *     "formId": "xuetangdan",
   *     "extend": [{
   *         "extendName": "zaocanqian",
   *         "extendValue": "测量者ID"
   *     }, {
   *         "extendName": "zaocanhou",
   *         "extendValue": "测量者ID"
   *     }, {
   *         "extendName": "wucanqian",
   *         "extendValue": "测量者ID"
   *     }, {
   *         "extendName": "wucanhou",
   *         "extendValue": "测量者ID"
   *     }, {
   *         "extendName": "wancanqian",
   *         "extendValue": "测量者ID"
   *     }],
   *     "signList": [{
   *         "signId": "zaocanqian",
   *         "signName": "早餐前",
   *         "signValue": "100"
   *     }, {
   *         "signId": "zaocanhou",
   *         "signName": "早餐后",
   *         "signValue": "100"
   *     }, {
   *         "signId": "wucanqian",
   *         "signName": "午餐前",
   *         "signValue": "150"
   *     }, {
   *         "signId": "wucanhou",
   *         "signName": "午餐后",
   *         "signValue": "100"
   *     }, {
   *         "signId": "wancanqian",
   *         "signName": "晚餐前",
   *         "signValue": "100"
   *     }]
   *   }
   * @return {*}
   */
  async add (data) {
    return await _post({ url: `${urls['bloodMonitoring']}`, data })
  },
  /**
   *编辑
   *
   * @param {*} data
   *   {
   *     "recordId": "3038ca45bb244f4ab46e4cc611c08117",
   *     "patientId": "1352346",
   *     "recordDate": "2021-01-08 00:00:00",
   *     "formId": "xuetangdan",
   *     "extend": [{
   *         "extendName": "zaocanqian",
   *         "extendValue": "测量者ID"
   *     }, {
   *         "extendName": "zaocanhou",
   *         "extendValue": "测量者ID"
   *     }, {
   *         "extendName": "wucanqian",
   *         "extendValue": "测量者ID"
   *     }, {
   *         "extendName": "wucanhou",
   *         "extendValue": "测量者ID"
   *     }, {
   *         "extendName": "wancanqian",
   *         "extendValue": "测量者ID"
   *     }],
   *     "signList": [{
   *         "signId": "zaocanqian",
   *         "signName": "早餐前",
   *         "signValue": "100"
   *     }, {
   *         "signId": "zaocanhou",
   *         "signName": "早餐后",
   *         "signValue": "100"
   *     }, {
   *         "signId": "wucanqian",
   *         "signName": "午餐前",
   *         "signValue": "150"
   *     }, {
   *         "signId": "wucanhou",
   *         "signName": "午餐后",
   *         "signValue": "100"
   *     }, {
   *         "signId": "wancanqian",
   *         "signName": "晚餐前",
   *         "signValue": "100"
   *     }]
   *   }
   * @return {*}
   */
  async update (data) {
    return await _put({ url: `${urls['bloodMonitoring']}`, data })
  }
}

/**
* ------------------------------------------------------------------
* 出入量
* ------------------------------------------------------------------
*/
export const ApiIntakeOutput = {
  /**
   * 出入量同步体温单
   *
   * @param {*} data {
   *  "type": 3,
   *  "recordTime": "2021-01-13 14:46:22",
   *  "startTime": "2021-01-10 07:00:22",
   *  "endTime": "2021-01-15 07:00:22",
   *  "nurseName": "5df44fadad544848a181a17a9fdf95dd",
   *  "patientId": "w001",
   *  "pointFlag":"13h",
   *  "deptId": "83a72a184f884fa0b35041ca5af57b70"
   * }
   * @return {*}
   */
  async syncTemperature (data) {
    return await _post({ url: `${urls['intakeOutput']}/syncTemperature`, data })
  }
}

/**
* ------------------------------------------------------------------
* 检查单设置
* ------------------------------------------------------------------
*/
// 检查单模板设置
export const ApiInspectionTemp = {
  /**
   *添加
   *
   * @param {*} data
   * {
   *   "formId": "123232", 表单id
   *   "inspectionTemplate": {} 模板内容
   * }
   * @return {*}
   */
  async add (data) {
    return await _post({ url: `${urls['inspectionTemp']}`, data })
  },
  /**
   *查询
   *
   * @param {*} data {
   *  formId: ''
   * }
   * @return {*}
   */
  async get (data) {
    return await _get({ url: `${urls['inspectionTemp']}`, data })
  },
  /**
   *添加
   *
   * @param {*} data
   * {
   *   "formId": "123232", 表单id
   *   "inspectionTemplate": {} 模板内容
   * }
   * @return {*}
   */
  async update (data) {
    return await _put({ url: `${urls['inspectionTemp']}`, data })
  }
}
// 检查单值设置
export const ApiInspectionValue = {
  /**
   *添加
   *
   * @param {*} data
   * {
   *  "inspectionTemplate": {},
   *   "inspectionValue": {},
   *   "patientId": "123" 病人id
   * }
   * @return {*}
   */
  async add (data) {
    return await _post({ url: `${urls['inspectionValue']}`, data })
  },
  /**
   *根据主键查询
   *
   * @param {*} data
   * {
   *  templateValueId ''
   * }
   * @return {*}
   */
  async getById (data) {
    return await _get({ url: `${urls['inspectionValue']}`, data })
  },
  /**
   * 查询
   *
   * @param {*} data
   * {
   *    patientId: ''
   * }
   * @return {*}
   */
  async get (data) {
    return await _get({ url: `${urls['inspectionValue']}`, data })
  },
  /**
   * 更新
   *
   * @param {*} data
   * {
   *   "templateValueId": ''
   *   "inspectionTemplate": {},
   *   "inspectionValue": {},
   *   "patientId": "123" 病人id
   * }
   * @return {*}
   */
  async update (data) {
    return await _put({ url: `${urls['inspectionValue']}`, data })
  }
}

/**
* ------------------------------------------------------------------
* 交班原因设置
* wiki: http://192.168.30.168:8090/pages/viewpage.action?pageId=31040684
* ------------------------------------------------------------------
*/

export const ApiShiftReason = {
  // 排序
  async sort (data) {
    return await _post({ url: `${urls['shiftReason']}/sort`, data })
  },
  // 删除
  async delete (data) {
    return await _delete({ url: `${urls['shiftReason']}`, data })
  },
  // 查询交班原因列表
  async get (data) {
    return await _get({ url: `${urls['shiftReason']}`, data })
  },
  // 添加
  async add (data) {
    return await _post({ url: `${urls['shiftReason']}`, data })
  },
  // 编辑
  async edit (data) {
    return await _put({ url: `${urls['shiftReason']}`, data })
  }
}

export const ApiHeartRateMonitoring = {
  select (data) {
    return _get({ url: urls['heartRateMonitoring'], data })
  }
}

// 其它设置上传表单logo
export const ApiNurseUploadLogo = {
  // 由于表头组件引用较多，权限无法一一添加，这里使用app-*接口
  getLogoUrl: (params = null) => {
    return _get({
      url: urls['getLogoUrl'],
      data: params
    })
  },
  deleteLogo: (params = null) => {
    return _delete({
      url: urls['deleteLogo'],
      data: params
    })
  }
}
//MEWS设置
export const ApiMewsManage={
  select:(params = null)=>{
    return _get({
      url: urls['mewsManage'],
      data: params
    })
  },
  save:(params = null)=>{
    return _post({
      url: urls['mewsManage'],
      data: params
    })
  },
  selectRecord:(params = null)=>{
    return _post({
      url: urls['mewsManageList'],
      data: params
    })
  }
}

// 请求用户
export const GetNurseUserLeader = (type = 'nurseTeamLeader') => {
  const obj = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
  const empId = obj.deptId || ''
  const url = `/ifms/app-org/emps/${empId}/${type}`
  return new Promise((resolve, reject) => {
    _get({ url: url, data: { deptId: empId, jobTypeCode: type } }).then(res => {
      const data = res.data || []
      resolve(data)
    })
  })
}

// 危急值查询列表 接收患者
export const ApiWarningList = {
  getWarningList: (params = null) => {
    return _get({
      url: urls['warnList'],
      data: params
    })
  },
  receivePatient: (params = null) => {
    return _put({
      url: urls['warningListReceive'],
      data: params
    })
  }
}

export const ApiMedication = {
  getMedicationInfo: (params = null) => {
    return _get({
      url: urls['medicationInfo'],
      data: params
    })
  }
}