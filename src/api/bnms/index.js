import Axios from 'axios';
import { _get, _post, _post_qs, _put, _put_qs, _delete, _delete_json } from './http';
import urls from './config';

export const ApiPatient = {
  selectIn: (params = null) => {
    return _get({ url: urls['InPatient'], data: params });
  },
  selectOut: (params = null) => {
    return _get({ url: urls['OutPatient'], data: params });
  },
  selectTrans: (params = null) => {
    return _get({ url: urls['TransPatient'], data: params });
  }
};
// 床位一览
export const ApiBedCard = {
  patientList: (params = null) => {
    return _post({
      url: urls['bedCardPatientList'],
      data: params
    });
  },
  patientLabel: (params = null) => {
    return _get({
      url: urls['bedCardSelectPatientLabel'],
      data: params
    });
  },
  patientDetailLabel: (params = null) => {
    return _get({
      url: urls['bedDetailSelectPatientLabel'],
      data: params
    });
  },
  nurseLabel: (params = null) => {
    return _get({
      url: urls['bedCardSelectNurseLabel'],
      data: params
    });
  },
  detailNrseLabel: (params = null) => {
    return _get({
      url: urls['bedCardSelectDetailNurseLabel'],
      data: params
    });
  },
  statisticsLabel: (params = null) => {
    return _get({
      url: urls['bedCardSelectStatisticsLabel'],
      data: params
    });
  },
  insert: (params = null) => {
    return _post({
      url: urls['bedCardPatientInsert'],
      data: params
    });
  },
  update: (params = null) => {
    return _put({
      url: urls['bedCardPatientUpdate'],
      data: params
    });
  },
  out: (params = null) => {
    return _delete_json({
      url: urls['bedCardPatientDelete'],
      data: params
    });
  },
  change: (params = null) => {
    return _post_qs({
      url: urls['bedCardPatientChange'],
      data: params
    });
  },
  hasPatientBed: (params = null) => {
    return _get({
      url: urls['bedCardAllPatientBed'],
      data: params
    });
  },
  patientDynamics: (params = null) => {
    return _get({
      url: urls['bnmsPatientDynamics'],
      data: params
    });
  },
  patientOutHospitalList: (params = null) => {
    return _get({
      url: urls['bnmsPatientOutHospitalList'],
      data: params
    });
  },
  patientWaitingList: (params = null) => {
    return _post({
      url: urls['bnmsPatientWaitingList'],
      data: params
    });
  },
  patientWaitingToHis: (params = null) => {
    return _post({
      url: urls['bnmsPatientWaitingListSendToHis'],
      data: params
    });
  },
  patientOutHospitalRecall: (params = null) => {
    return _post_qs({
      url: urls['bnmsPatientOutHospitalRecall'],
      data: params
    });
  },
  selectMyPatient: (params = null) => {
    return _get({
      url: urls['myPatient'],
      data: params
    });
  },
  setMyPatient: (params = null) => {
    return _post_qs({
      url: urls['myPatient'],
      data: params
    });
  }
};
// / / 标签管理
export const ApiPatientManage = {
  selectRelationLabel: (params = null) => {
    return _get({
      url: urls['labelRelationLabel'],
      data: params
    });
  },
  selectApplyDept: (params = null) => {
    return _get({
      url: urls['labelManageApplyDept'],
      data: params
    });
  },
  select: (params = null) => {
    return _get({
      url: urls['labelManage'],
      data: params
    });
  },
  save: (params = {}) => {
    return params['labelId']
      ? ApiStatisticsManage.update(params)
      : ApiStatisticsManage.insert(params);
  },
  insert: (params = null) => {
    return _post({
      url: urls['labelManage'],
      data: params
    });
  },
  update: (params = null) => {
    return _put({
      url: urls['labelManage'],
      data: params
    });
  },
  deleteBefore: (params = null) => {
    return _get({
      url: urls['labelManageDelBefore'],
      data: params
    });
  },
  delete: (params = null) => {
    return _delete({
      url: urls['labelManage'],
      data: params
    });
  }
};

export const ApiNursingUsedManage = {
  detail: (params = null) => {
    return _get({
      url: urls['labelApplyDetail'],
      data: params
    });
  },
  custom: (params = null) => {
    return _put({
      url: urls['labelApplyEdit'],
      data: params
    });
  }
};

export const ApiNursingManage = {
  classify: (params = null) => {
    return _get({
      url: urls['labelManageClassify'],
      data: params
    });
  },
  selectApplyDept: (params = null) => {
    return _get({
      url: urls['labelManageApplyDept'],
      data: params
    });
  },
  select: (params = null) => {
    return _get({
      url: urls['labelManage'],
      data: params
    });
  },
  selectAssess: (params = null) => {
    return _get({
      url: urls['labelAssess'],
      data: params
    });
  },
  save: (params = {}) => {
    return params['labelId']
      ? ApiStatisticsManage.update(params)
      : ApiStatisticsManage.insert(params);
  },
  insert: (params = null) => {
    return _post({
      url: urls['labelManage'],
      data: params
    });
  },
  update: (params = null) => {
    return _put({
      url: urls['labelManage'],
      data: params
    });
  },
  deleteBefore: (params = null) => {
    return _get({
      url: urls['labelManageDelBefore'],
      data: params
    });
  },
  delete: (params = null) => {
    return _delete({
      url: urls['labelManage'],
      data: params
    });
  }
};

// 护理标签分类
export const ApiClassifyManage = {
  select: (params = null) => {
    return _get({
      url: urls['classifyManage'],
      data: params
    });
  },
  save: (params = {}) => {
    return params['classId']
      ? ApiClassifyManage.update(params)
      : ApiClassifyManage.insert(params);
  },
  insert: (params = null) => {
    return _post({
      url: urls['classifyManage'],
      data: params
    });
  },
  update: (params = null) => {
    return _put({
      url: urls['classifyManage'],
      data: params
    });
  },
  delete: (params = null) => {
    return _delete({
      url: urls['classifyManage'],
      data: params
    });
  },
  sort: (params = null) => {
    return _put({
      url: urls['classifyManageSort'],
      data: params
    });
  }
};

// 护理标签标识
export const ApiNursingIdentifyManage = {
  selectAll: (params = null) => {
    return _get({
      url: urls['identifyManageAll'],
      data: params
    });
  },
  selectImage: (params = null) => {
    return _get({
      url: urls['identifyManageImage'],
      data: params
    });
  },
  select: (params = null) => {
    return _get({
      url: urls['identifyManage'],
      data: params
    });
  },
  save: (params = {}) => {
    return params['identifyId']
      ? ApiNursingIdentifyManage.update(params)
      : ApiNursingIdentifyManage.insert(params);
  },
  insert: (params = null) => {
    return _post({
      url: urls['identifyManage'],
      data: params
    });
  },
  update: (params = null) => {
    return _put({
      url: urls['identifyManage'],
      data: params
    });
  },
  delete: (params = null) => {
    return _delete({
      url: urls['identifyManage'],
      data: params
    });
  }
};

export const ApiStatisticsManage = {
  classify: (params = null) => {
    return _get({
      url: urls['labelManageClassify'],
      data: params
    });
  },
  selectApplyDept: (params = null) => {
    return _get({
      url: urls['labelManageApplyDept'],
      data: params
    });
  },
  select: (params = null) => {
    return _get({
      url: urls['labelManage'],
      data: params
    });
  },
  save: (params = {}) => {
    return params['labelId']
      ? ApiStatisticsManage.update(params)
      : ApiStatisticsManage.insert(params);
  },
  insert: (params = null) => {
    return _post({
      url: urls['labelManage'],
      data: params
    });
  },
  update: (params = null) => {
    return _put({
      url: urls['labelManage'],
      data: params
    });
  },
  deleteBefore: (params = null) => {
    return _get({
      url: urls['labelManageDelBefore'],
      data: params
    });
  },
  delete: (params = null) => {
    return _delete({
      url: urls['labelManage'],
      data: params
    });
  }
};
// / /  标签应用
export const ApiLabelApply = {
  select: (params = null) => {
    return _get({
      url: urls['labelApply'],
      data: params
    });
  },
  updatePosition: (params = null) => {
    return _put({
      url: urls['labelApply'],
      data: params
    });
  },
  batchUpdatePosition: (params = null) => {
    return _put({
      url: urls['labelBatchApply'],
      data: params
    });
  },
  sort: (params = null) => {
    return _put({
      url: urls['labelApplySort'],
      data: params
    });
  },
  position: (params = null) => {
    return _get({
      url: urls['labelApplyPosition'],
      data: params
    });
  }
};

// / / 标签应用到科室
export const ApiLabel2Nurse = {
  one: (params = null) => {
    return _put_qs({
      url: urls['labelManageApply'],
      data: params
    });
  },
  multi: (params = null) => {
    return _put_qs({ url: urls['labelManageApplyBatch'], data: params });
  }
};
// / / 组织架构 - 护理单元
export const ApiDept = {
  select: (params = null) => {
    return _get({ url: urls['deptList'], data: params });
  }
};
export const ApiUsers = {
  doctor: (params = null) => {
    return _get({ url: urls['userDoctorList'], data: params });
  },
  nurse: (params = null) => {
    return _get({ url: urls['userNurseList'], data: params });
  },
  doctor2: (params = null) => {
    return _get({ url: urls['userDoctorList2'], data: params });
  },
  nurse2: (params = null) => {
    return _get({ url: urls['userNurseList2'], data: params });
  },
  all: (params = null) => {
    return _get({ url: urls['DoctorNurseUsers'], data: params });
  }
};
export const ApiBedRoom = {
  bedList: (params = null) => {
    return _get({ url: urls['bedList'], data: params });
  },
  roomList: (params = null) => {
    return _get({ url: urls['roomList'], data: params });
  },
  roomDN: (params = null) => {
    return _get({ url: urls['roomDoctorNurse'], data: params });
  }
};
// / / 护理级别
export const ApiNurseLevel = {
  selectApplyDept: (params = null) => {
    return _get({
      url: urls['nurseLevelApplyDept'],
      data: params
    });
  },
  select: (params = null) => {
    return _get({
      url: urls['nurseLevel'],
      data: params
    });
  },
  selectAll: (params = null) => {
    return _get({
      url: urls['nurseLevelAll'],
      data: params
    });
  },
  save: (params = {}) => {
    return params['nurseLevelId']
      ? ApiNurseLevel.update(params)
      : ApiNurseLevel.insert(params);
  },
  insert: (params = null) => {
    return _post({
      url: urls['nurseLevelInsert'],
      data: params
    });
  },
  update: (params = null) => {
    return _put({
      url: urls['nurseLevelUpdate'],
      data: params
    });
  },
  delete: (params = null) => {
    return _delete({
      url: urls['nurseLevelDelete'],
      data: params
    });
  }
};
// / / 护理级别应用到科室
export const ApiNurseLevel2Dept = {
  one: (params = null) => {
    return _post_qs({
      url: urls['nurseLevelApply'],
      data: params
    });
  }
};
export const ApiNurseShift = {
  select: (params = null) => {
    return _get({
      url: urls['nurseShift'],
      data: params
    });
  },
  insert: (params = null) => {
    return _post_qs({
      url: urls['nurseShift'],
      data: params
    });
  },
  delete: (params = null) => {
    return _delete({
      url: urls['nurseShift'],
      data: params
    });
  },
  deletePatient: (params = null) => {
    return _delete({
      url: urls['nurseShiftDeleteChild'],
      data: params
    });
  },
  selectStatistics: (params = null) => {
    return _get({
      url: urls['nurseShiftStatistics'],
      data: params
    });
  },
  selectChildPatient: (params = null) => {
    return _get({
      url: urls['nurseShiftChild'],
      data: params
    });
  },
  selectPatient: (params = null) => {
    return _get({
      url: urls['nurseShiftPatient'],
      data: params
    });
  },
  saveChild: (params = {}) => {
    return params['recordId']
      ? ApiNurseShift.updateChild(params)
      : ApiNurseShift.insertChild(params);
  },
  insertChild: (params = null) => {
    return _post({
      url: urls['nurseShiftAddChild'],
      data: params
    });
  },
  updateChild: (params = null) => {
    return _put({
      url: urls['nurseShift'],
      data: params
    });
  },
  updateStatistics: (params = null) => {
    return _put_qs({
      url: urls['nurseShiftUpdateStatistics'],
      data: params
    });
  },
  selectRecordCount: (params = null) => {
    return _get({
      url: urls['nurseShiftCount'],
      data: params
    });
  },
  printPatient: (params = null) => {
    return _get({
      url: urls['nurseShiftPrintPatient'],
      data: params
    });
  },
  printStatistic: (params = null) => {
    return _get({
      url: urls['nurseShiftPrintStatistic'],
      data: params
    });
  },
  selectSbarPatient: (params = null) => {
    return _get({
      url: urls['nurseShiftSbarPatient'],
      data: params
    });
  },
  SBARShiftTakeOver: (params = null) => {
    return _put_qs({
      url: urls['SBARShiftTakeOver'],
      data: params
    });
  },
  SBARShiftSave: (params = null) => {
    return _put({
      url: urls['SBARShiftEdit'],
      data: params
    });
  },
  ShiftTakeSave: (params = null) => {
    return _put({
      url: urls['nurseShiftUpdateChildStatus'],
      data: params
    });
  }
};
export const ApiNurseNotes = {
  select: (params = null) => {
    return _get({
      url: urls['nurseNotes'],
      data: params
    });
  }
};
export const ApiSBARShift = {
  select: (params = null) => {
    return _get({
      url: urls['SBARShift'],
      data: params
    });
  },
  save: (params = {}) => {
    return params['shiftId']
      ? ApiNurseLevel.update(params)
      : ApiNurseLevel.insert(params);
  },
  insert: (params = null) => {
    return _post({
      url: urls['SBARShift'],
      data: params
    });
  },
  update: (params = null) => {
    return _put({
      url: urls['SBARShift'],
      data: params
    });
  },
  delete: (params = null) => {
    return _delete({
      url: urls['SBARShift'],
      data: params
    });
  },
  deletePatient: (params = null) => {
    return _delete({
      url: urls['SBARShift'],
      data: params
    });
  },
  selectPatient: (params = null) => {
    return _get({
      url: urls['SBARShift'],
      data: params
    });
  }
};
export const ApiShifts = {
  select: (params = null) => {
    return _get({
      url: urls['shiftsList'],
      data: params
    });
  },
  save: (params = {}) => {
    return params['shiftMainId']
      ? ApiShifts.update(params)
      : ApiShifts.insert(params);
  },
  insert: (params = null) => {
    return _post({
      url: urls['shiftsList'],
      data: params
    });
  },
  update: (params = null) => {
    return _put({
      url: urls['shiftsList'],
      data: params
    });
  },
  delete: (params = null) => {
    return _delete({
      url: urls['shiftsList'],
      data: params
    });
  },
  shifts: (params = null) => {
    return _get({
      url: urls['shifts'],
      data: params
    });
  },
  deptList: (params = null) => {
    return _get({
      url: urls['shiftsDeptList'],
      data: params
    });
  }
};
// / / 护士交班记录
export const ApiNurseShiftRecord = {
  select: (params = null) => {
    return _get({
      url: urls['nurseShiftRecord'],
      data: params
    });
  }
};
// / / 班次应用到科室
export const ApiShifts2Dept = {
  apply: (params = null) => {
    return _put_qs({
      url: urls['shiftsApply'],
      data: params
    });
  },
  select: (params = null) => {
    return _get({
      url: urls['shiftsUsedDept'],
      data: params
    });
  }
};
// / / 手术安排
export const ApiOperativeArrangement = {
  select: (params = null) => {
    return _get({
      url: urls['OperativeArrangement'],
      data: params
    });
  }
};

// / / 费用管理--预交金
export const ApiAdvanceAmount = {
  select: (params = null) => {
    return _get({
      url: urls['AdvanceAmount'],
      data: params
    });
  }
};

// / / 费用管理--费用明细
export const ApiCostDetail = {
  select: (params = null) => {
    return _get({
      url: urls['CostDetail'],
      data: params
    });
  }
};

// / / 费用管理--费用汇总信息
export const ApiCostAggregation = {
  select: (params = null) => {
    return _get({
      url: urls['CostAggregation'],
      data: params
    });
  }
};
// / / 费用管理--结算信息
export const ApiCostInformation = {
  select: (params = null) => {
    return _get({
      url: urls['CostInformation'],
      data: params
    });
  }
};
// 腕带设置
export const ApiWristbandSetting = {
  select: (params = null) => {
    return _get({
      url: urls['WristbandSetting'],
      data: params
    });
  },
  save: (params = null) => {
    return _post({
      url: urls['WristbandSetting'],
      data: params
    });
  }
};
// / / 腕带打印--查询二维码显示
export const ApiWristbandPrint = {
  select: (params = null) => {
    return _get({
      url: urls['wristbandPrint'],
      data: params
    });
  }
};
// / / 病例病程--查询
export const ApiCaseHistory = {
  select: (params = null) => {
    return _get({
      url: urls['caseHistory'],
      data: params
    });
  }
};

export const ApiKanbanPasswordSetting = {
  selectModel: (params = null) => {
    return _post({
      url: urls['KanBanSelectModel'],
      data: params
    });
  },
  selectModelDetail: (params = null) => {
    return _get({
      url: urls['KanBanModelDetail'] + '/' + params
    });
  },
  selectViews: (params = null) => {
    return _get({
      url: urls['KanBanPasswordSetting'],
      data: params
    });
  },
  save: (params = null) => {
    return _post({
      url: urls['KanBanPasswordSetting'],
      data: params
    });
  }
};

export const ApiKanbanSwitch = {
  select: (params = null) => {
    return _get({
      url: urls['kanBanSwitch'],
      data: params
    });
  },
  save: (params = {}) => {
    return params['switchId']
      ? ApiKanbanSwitch.update(params)
      : ApiKanbanSwitch.insert(params);
  },
  insert: (params = null) => {
    return _post({
      url: urls['kanBanSwitch'],
      data: params
    });
  },
  update: (params = null) => {
    return _put({
      url: urls['kanBanSwitch'],
      data: params
    });
  }
};

export const ApiKanbanDev = {
  select: (params = null) => {
    return _get({
      url: urls['kanBanDevice'],
      data: params
    });
  }
};
// / / 排班设置
export const ApiNurseShiftSetting = {
  select: (params = null) => {
    return _get({
      url: urls['NurseShiftSetting'],
      data: params
    });
  },
  add: (params = null) => {
    return _post({
      url: urls['NurseShiftSetting'],
      data: params
    });
  },
  update: (params = null) => {
    return _put({
      url: urls['NurseShiftSetting'],
      data: params
    });
  }
};
// 病历病程 检查报告数据格式
export const ApiReportCaseHistoryType = {
  select: (params = null) => {
    return _get({
      url: urls['reportType'],
      data: params
    });
  },
  update: (params = null) => {
    return _post({
      url: urls['reportType'],
      data: params
    });
  }
};
export const ApiSwitchSetting = {
  select: (params = null) => {
    return _get({
      url: urls['SwitchSetting'],
      data: params
    });
  },
  update: (params = null) => {
    return _post({
      url: urls['SwitchSetting'],
      data: params
    });
  }
};

export const ApiHlfzSetting = {
  select: (params = null) => {
    return _get({
      url: urls['hlfzSetting'],
      data: params
    });
  },
  update: (params = null) => {
    return _post({
      url: urls['hlfzSetting'],
      data: params
    });
  }
};

// 模板设置
export const ModelSetApi = {
  modelSetList: (params = null) => {
    return _post({
      url: urls['modelSetList'],
      data: params
    });
  },
  oneModelSetList: (params = null) => {
    return _get({
      url: urls['oneModelSetList'] + '/' + params.templateId
    });
  },
  navList: (params = null) => {
    return _get({
      url: urls['navList'],
      data: params
    });
  },
  delModelSet: (params = null) => {
    return _get({
      url: urls['delModelSet'] + '/' + params.templateId
    });
  },
  checkDelModelSet: (params = null) => {
    return _get({
      url: urls['checkDelModelSet'] + params.templateId
    });
  }
};

export const ModelSetApiSave = (data = {}, param = 'add', type = 'post') => {
  let _url = '';
  if (param === 'add') {
    _url = urls['addModelSet'];
  } else {
    _url = urls['modModelSet'];
  }
  return new Promise((resolve, reject) => {
    Axios({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: type,
      url: _url,
      data: data
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data);
    });
  });
};

// 页面设置
export const PageSetApi = {
  pageSetList: (params = null) => {
    return _post({
      url: urls['pageSetList'],
      data: params
    });
  },
  pageNopSetList: (params = null) => {
    return _post({
      url: urls['pageNopSetList'],
      data: params
    });
  },
  addPageSet: (params = null) => {
    return _post({
      url: urls['addPageSet'],
      data: params
    });
  },
  modPageSet: (params = null) => {
    return _post({
      url: urls['modPageSet'],
      data: params
    });
  },
  delPageSet: (params = null) => {
    return _get({
      url: urls['delPageSet'] + params.pageId
    });
  },
  checkDelPageSet: (params = null) => {
    return _get({
      url: urls['checkDelPageSet'] + params.pageId
    });
  },
  save: (params = {}) => { // 通过id判断是添加还是修改，调用不同接口
    return params['pageId']
      ? PageSetApi.modPageSet(params)
      : PageSetApi.addPageSet(params);
  }
};

// 省立手术安排
export const ArrangeApi = {
  async add (params) {
    return await _post({
      url: urls['OperationArrange'],
      data: params
    });
  },
  async update (params) {
    return await _put({
      url: urls['OperationArrange'],
      data: params
    });
  },
  async del (params) {
    return await _delete({
      url: urls['OperationArrange'],
      data: params
    });
  },
  async list (params) {
    return await _get({
      url: urls['OperationArrange'],
      data: params
    });
  },
  /**
   *手术安排排序
   *
   * @param {*} params [
   * {
   *    “itemId”:主键ID，
   *    “itemSort”:对应排序
   * }
   * ]
   * @return {*}
   */
  async sort (params) {
    return await _post({
      url: urls['OperationArrange'] + '/sort',
      data: params
    });
  },
  /**
   *导出手术安排
   *
   * @param {*} targetDate 日期
   * @return {*}
   */
  async export (targetDate) {
    return await _get({
      url: `${urls['OperationArrange']}/export?targetDate=${targetDate}`
    });
  }
};

// 医嘱字段设置
export const doctorFieldsSet = {
  update: (params = null) => {
    return _put({
      url: urls['doctorFieldsSetUpdate'],
      data: params
    });
  },
  colLength: (params = null) => {
    return _get({
      url: urls['colLength'],
      data: params
    });
  },
  updateColLength: (params = null) => {
    return _put({
      url: urls['updateColLength'],
      data: params
    });
  }
};

/**
* ------------------------------------------------------------------
* 表单管理设置
* ------------------------------------------------------------------
*/

export const ApiAutoForm = {
  getFormDictByType: (params = null) => {
    return _get({ url: urls['getFormDictByType'], data: params });
  }
};
/**
* ------------------------------------------------------------------
* 交班原因设置
* wiki: http://192.168.30.168:8090/pages/viewpage.action?pageId=31040684
* ------------------------------------------------------------------
*/

export const ApiShiftReason = {
  // 查询交班原因列表
  async get (data) {
    return await _get({ url: `${urls['shiftReason']}`, data });
  }
};

export const fileUpLoad = {
  importFile: (params = null) => {
    return _put({
      url: urls['doctorFieldsSetUpdate'],
      data: params
    });
  }
};

// 其它设置上传表单logo
export const ApiNurseUploadLogo = {
  getLogoUrl: (params = null) => {
    return _get({
      url: urls['getLogoUrl']
    });
  },
  deleteLogo: (params = null) => {
    return _delete({
      url: urls['deleteLogo'],
      data: params
    });
  }
};

// 请求护士和护士长和护士组长
export const GetNurseUserLeader = {
  getNames: (deptId = '', jobTypeCodes, dataDeptIds, searchType) => {
    return _get({
      // url: `ifms/web-org/emp/currentDeptByMode`,
      url: `/omms/web-org/emp/currentDept`, // 组员账号的筛选应根据数据存储范围筛选（更换接口）
      data: {
        jobTypeCodes,
        deptId,
        dataDeptIds,
        searchType
      }
    });
  }
};

// 获取床位
export const GetBed = {
  getBed: (deptId = '') => {
    return _get({
      url: `/ifms/web-org/beds`,
      data: {
        page: 1,
        size: 1000,
        deptId: deptId
      }
    });
  }
};

export const LayoutApi = {
  saveLayout: (params = null) => {
    return _post({
      url: urls['saveLayout'],
      data: params
    });
  },
  updateLayout: (params = null) => {
    return _post({
      url: urls['updateLayout'],
      data: params
    });
  },
  delLayout: (params = null) => {
    return _post({
      url: urls['delLayout'],
      data: params
    });
  },
  savePageLayout: (params = null) => {
    return _post({
      url: urls['savePageLayout'],
      data: params
    });
  },
  listLayout: (params = null) => {
    return _post({
      url: urls['listLayout'],
      data: params
    });
  },
  updatePageLayout: (params = null) => {
    return _post({
      url: urls['updatePageLayout'],
      data: params
    });
  }
};

export const TransDept = {
  List: (params = null) => {
    return _get({
      url: urls['transferList'],
      data: params
    });
  },
  Add: (params = null) => {
    return _post({
      url: urls['addTransfer'],
      data: params
    });
  },
  Edit: (params = null) => {
    return _post({
      url: urls['updateTransfer'],
      data: params
    });
  },
  Del: (params = null) => {
    return _put({
      url: urls['delTransfer'],
      data: params
    });
  },
  BatchUpdate: (params = null) => {
    return _post({
      url: urls['batchUpdateTransfer'],
      data: params
    });
  }

};
