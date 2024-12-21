/* eslint-disable no-return-await */
import Axios from 'axios'
import Qs from 'qs'
import { _get, _delete, _post, _put } from '../hsms/http'
import urls from '../hsms/config'

// import userData from './userData'
let urlObj = {}
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'debug') {
  urlObj = {
    passport: '',
    ifms: '',
    default: ''
  }
} else if (process.env.NODE_ENV === 'production') {
  urlObj = {
    passport: '',
    ifms: '',
    default: ''
  }
}

// 字符串参数请求啊
export const AxiosApi = (url, data = {}, type = 'post', param = {}, urlKey = 'default') => {
  return new Promise((resolve, reject) => {
    Axios({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      transformRequest: [(data) => {
        data = Qs.stringify(data)
        return data
      }],
      method: type,
      url: urlObj[urlKey] + url,
      data: data,
      params: param
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

// json参数请求
export const AxiosJsonApi = (url, data = {}, type = 'post', param = {}, urlKey = 'default') => {
  return new Promise((resolve, reject) => {
    Axios({
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [(data) => {
        data = JSON.stringify(data)
        return data
      }],
      method: type,
      url: urlObj[urlKey] + url,
      data: data,
      params: param
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

// json参数请求
export const AxiosFormData = (url, data = {}, type = 'post', param = {}, urlKey = 'default') => {
  return new Promise((resolve, reject) => {
    Axios({
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: type,
      url: urlObj[urlKey] + url,
      data: data,
      params: param
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

// 请求用户
export const GetNurseUserLeader = (type = 'nurseTeamLeader') => {
  const obj = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
  const empId = obj.deptId || ''
  const url = `/ifms/app-org/emps/new/${empId}/${type}`
  return new Promise((resolve, reject) => {
    AxiosApi(url, {}, 'GET', { deptId: empId, jobTypeCode: type }, 'ifms').then(res => {
      const data = res.data || []
      resolve(data)
      // resolve(userData)
    })
  })
}

// 获取所有医生
export const GetDoctorByDept = () => {
  const url = `/ifms/web-org/emp/listSortDoctor/currentDeptByMode`
  return new Promise((resolve, reject) => {
    AxiosApi(url, {}, 'GET', {}, 'ifms').then(res => {
      const data = res.data || []
      resolve(data)
      // resolve(userData)
    })
  })
}

// 请求用户
export const GetNurseUser = (type = 'NURSE') => {
  let url = '/ifms/web-org/emp/listSortNurse/currentDeptByMode'
  const obj = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
  const empId = obj.deptId || ''
  if (type === 'DOCTOR') {
    url = '/ifms/web-org/emp/listSortDoctor/currentDeptByMode'
  }
  return new Promise((resolve, reject) => {
    AxiosApi(url, {}, 'GET', { deptId: empId }, 'ifms').then(res => {
      const data = res.data || []
      resolve(data)
      // resolve(userData)
    })
  })
}

// 请求护理单元
export const GetUnit = () => {
  const orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || {}
  const orgId = orgInfo.orgId || ''
  return new Promise((resolve, reject) => {
    AxiosApi(`/ifms/web-org/depts/${orgId}/list`, {}, 'GET', { page: 1, size: 1000 }, 'ifms').then(res => {
      const { data } = res
      resolve(data || [])
    })
  })
}

// 请求护理单元树
export const GetUnitTree = () => {
  return new Promise((resolve, reject) => {
    AxiosApi(`/ifms/web-org/depts`, {}, 'GET', { page: 1, size: 1000 }, 'ifms').then(res => {
      let temp = JSON.stringify(res.data.list || [])
      temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '')
      resolve(temp)
    })
  })
}

// 请求班次库
export const GetPubDuty = (businessType = 'NURSE', enable = true) => {
  return new Promise((resolve, reject) => {
    AxiosApi('/hsms/web-hs/repository/' + businessType, {}, 'GET', {
      page: 1,
      size: 1000,
      businessType: businessType,
      enable: enable
    }).then(res => {
      const { data } = res
      const { list } = data
      resolve(list || [])
    })
  })
}

// 请求班次
export const GetDuty = (businessType = 'NURSE', enable = true) => {
  return new Promise((resolve, reject) => {
    AxiosApi('/hsms/web-hs/shift/' + businessType, {}, 'GET', {
      page: 1,
      size: 1000,
      businessType: businessType,
      enable: enable
    }).then(res => {
      const { data } = res
      const { list } = data
      resolve(list || [])
    })
  })
}

// 获取组合班次
export const GetComposeDuty = async (businessType = 'NURSE') => {
  return await AxiosApi('/hsms/web-hs/shift/compose/' + businessType, {}, 'GET')
}

// 请求备注
export const GetRemark = (params, businessType) => {
  return new Promise((resolve, reject) => {
    AxiosApi('/hsms/web-hs/note/' + businessType + '/findByDate', {}, 'GET', params).then(res => {
      const { data } = res
      resolve(data || [])
    })
  })
}

// 请求房间
export const GetRoom = () => {
  const obj = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
  const deptId = obj.deptId || ''
  return new Promise((resolve, reject) => {
    AxiosApi('/ifms/web-org/rooms', {}, 'GET', { page: 1, size: 1000, deptId: deptId }, 'ifms').then(res => {
      const { data } = res
      const { list } = data
      resolve(list || [])
    })
  })
}

// 请求床位
export const GetBed = () => {
  const obj = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
  const deptId = obj.deptId || ''
  return new Promise((resolve, reject) => {
    AxiosApi('/ifms/web-org/beds', {}, 'GET', { page: 1, size: 1000, deptId: deptId }, 'ifms').then(res => {
      const { data } = res
      const { list } = data
      resolve(list || [])
    })
  })
}

// 请求层级
export const GetLevel = (businessType) => {
  return new Promise((resolve, reject) => {
    AxiosApi('/hsms/web-hs/hierarchy/' + businessType, {}, 'GET', { page: 1, size: 1000 }).then(res => {
      const { data } = res
      const { list } = data
      resolve(list || [])
    })
  })
}

// 请求管房类型
export const GetModelType = (businessType) => {
  return new Promise((resolve, reject) => {
    AxiosApi('/hsms/web-hs/dept/config/' + businessType, {}, 'GET').then(res => {
      const { data } = res
      resolve(data)
    })
  })
}

// 请求岗位
export const GetPost = (businessType) => {
  return new Promise((resolve, reject) => {
    AxiosApi('/hsms/web-hs/post/' + businessType, {}, 'GET', { page: 1, size: 1000 }).then(res => {
      const { data } = res
      const { list } = data
      resolve(list || [])
    })
  })
}
// 存假管理
export const ApiStorgeHolidays = {
  selectStorageSum: (params = null) => {
    return _get({ url: urls['querySum'], data: params })
  },
  selectQueryPage: (params = null) => {
    return _get({ url: urls['queryPage'], data: params })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['storageHoliday'],
      data: params
    })
  },
  save: (params = {}) => {
    return params['id']
      ? ApiStorgeHolidays.update(params)
      : ApiStorgeHolidays.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['storageHoliday'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['storageHoliday'],
      data: params
    })
  }
}

// 年假管理
export const ApiAnnualHolidays = {
  selectAnnualSum: (params = null) => {
    return _get({ url: urls['queryAnnualSum'], data: params })
  },
  selectQueryPage: (params = null) => {
    return _get({ url: urls['queryAnnualPage'], data: params })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['annualHoliday'],
      data: params
    })
  },
  save: (params = {}) => {
    return params['id']
      ? ApiAnnualHolidays.update(params)
      : ApiAnnualHolidays.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['annualHoliday'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['annualHoliday'],
      data: params
    })
  }
}

// 导入排班流水
export const ImportSchedule = async (isContinue = true, formData) => {
  return await AxiosFormData('/hsms/web-hs/schedule/NURSE/importExcel?isContinue=' + isContinue, formData, 'POST')
}

// 导入排班流水
export const ExportSchedule = async (businessType, exportSelect, year, week, month, columnStr) => {
  return await AxiosApi(`/hsms/web-hs/schedule/${businessType
    }/export?businessType=${businessType
    }&exportKey=${exportSelect
    }&year=${year
    }&week=${week
    }&month=${month
    }&columnStr=${columnStr
    }`, {}, 'GET')
}

// 获取层级列表
export const GetRelation = async () => {
  return await AxiosApi('/hsms/web-hs/relation/NURSE', {}, 'GET')
}
// wj 请假类型
export const ApiHolidayType = {
  get: (params = null) => {
    return _get({ url: urls['holidayTypeClass'], data: params })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['holidayTypeClass'],
      data: params
    })
  },
  save: (params = null) => {
    return _post({
      url: urls['holidayTypeClass'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['holidayTypeClass'],
      data: params
    })
  }
}

export const ApiHolidayData = {
  get: (params = null) => {
    return _get({ url: urls['holidayDataClass'], data: params })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['holidayData'],
      data: params
    })
  },
  save: (params = null) => {
    return _post({
      url: urls['holidayData'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['holidayData'],
      data: params
    })
  }
}
export const ApiHolidayNurseList = {
  get: (params = null) => {
    return _get({ url: urls['holidayNurse'], data: params })
  },
  export: (params = null) => {
    return _get({ url: urls['exportExcel'], data: params })
  },
  insert: (params = null) => {
    return _post({
      url: urls['storageHoliday'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['storageHoliday'],
      data: params
    })
  }
}
// 医疗分组
export const ApiDoctorGroup = {
  selectList: (params = null) => {
    return _post({ url: urls['queryDoctorList'], data: params })
  },
  selectTree: (params = null) => {
    return _get({ url: urls['queryTreeList'], data: params })
  },
  selectEdit: (params = null) => {
    return _post({ url: urls['queryEditInfo'], data: params })
  },
  selectAdd: (params = null) => {
    return _get({
      url: urls['queryAddInfo'] + '/' + params.modelType
    })
  },
  delete: (params = null) => {
    return _delete({
      url: urls['medicalGroupDelete'] + '/' + params.id
    })
  },
  save: (params = {}) => {
    return params['id']
      ? ApiDoctorGroup.update(params)
      : ApiDoctorGroup.insert(params)
  },
  insert: (params = null) => {
    return _post({
      url: urls['medicalGroupSave'],
      data: params
    })
  },
  update: (params = null) => {
    return _put({
      url: urls['medicalGroupInsert'],
      data: params
    })
  },
  apiTempDoc: (params = null) => {
    return _post({ url: urls['apiTempDoc'], data: params })
  }
}

// 护理分组
export const ApiNurseGroup = {
  selectTree: (params = null) => {
    return _get({ url: urls['queryNurseTreeList'], data: params })
  },
  selectNurseList: (params = null) => {
    return _post({ url: urls['queryNurseList'], data: params })
  },
  selectEdit: (params = null) => {
    return _post({ url: urls['selectInfo'], data: params })
  },
  saveNurse: (params = {}) => {
    return _post({ url: urls['saveNurse'], data: params })
  },
  updateNurse: (params = {}) => {
    return _put({ url: urls['updateNurse'], data: params })
  },
  delete: (params = null) => {
    return _post({ url: urls['deleteNurse'], data: params })
  },
  selectedNurse: (params = null) => {
    return _get({ url: urls['selectedNurse'], data: params })
  },
  getTimeBeds: (params = null) => {
    return _post({ url: urls['getNurseBedRoomInfo'], data: params })
  }
}
