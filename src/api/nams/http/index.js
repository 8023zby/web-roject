import Axios from 'axios'
import Qs from 'qs'
import urls from './config'

// 字符串参数请求啊
export const AxiosApi = (url, data = {}, type = 'post', param = {}, urlKey = 'default') => {
  return new Promise((resolve, reject) => {
    Axios({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cache-Control': 'no-cache'
      },
      transformRequest: [(data) => {
        data = Qs.stringify(data)
        return data
      }],
      method: type,
      url: url,
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
      url: url,
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
export const GetNurseUser = (type = 'NURSE') => {
  let url = '/ifms/web-org/emp/listSortNurseByMode'
  let obj = JSON.parse(localStorage.getItem('empInfo')) || {}
  let empId = obj.empId || ''
  if (type === 'DOCTOR') {
    url = '/ifms/web-org/emp/listSortDoctorByMode'
  }
  return new Promise((resolve, reject) => {
    AxiosApi(url, {}, 'GET', { deptId: empId }, 'ifms').then(res => {
      let data = res.data || []
      resolve(data)
    })
  })
}
// 请求护理单元
export const GetUnit = () => {
  return new Promise((resolve, reject) => {
    AxiosApi('/ifms/web-org/depts', {}, 'GET', { page: 1, size: 1000 }, 'ifms').then(res => {
      let { data } = res
      let { list } = data
      resolve(list || [])
    })
  })
}
// 请求班次库
export const GetPubDuty = (type = 'NURSE', enable = true) => {
  return new Promise((resolve, reject) => {
    AxiosApi('/hsms/web-hs/repository', {}, 'GET', { page: 1, size: 1000, businessType: type, enable: enable }).then(res =>{
      let { data } = res
      let { list } = data
      resolve(list || [])
    })
  })
}

// 请求班次
export const GetDuty = (type = 'NURSE', enable = true) => {
  return new Promise((resolve, reject) => {
    AxiosApi('/hsms/web-hs/shift', {}, 'GET', { page: 1, size: 1000, businessType: type, enable: enable }).then(res =>{
      let { data } = res
      let { list } = data
      resolve(list || [])
    })
  })
}

// 请求备注
export const GetRemark = (params) => {
  return new Promise((resolve, reject) => {
    AxiosApi('/hsms/web-hs/note/findByDate', {}, 'GET', params).then(res => {
      let { data } = res
      resolve(data || [])
    })
  })
}

// 请求房间
export const GetRoom = () => {
  return new Promise((resolve, reject) => {
    AxiosApi('/ifms/web-org/rooms', {}, 'GET', { page: 1, size: 1000 }, 'ifms').then(res => {
      let { data } = res
      let { list } = data
      resolve(list || [])
    })
  })
}
// 请求床位
export const GetBed = () => {
  return new Promise((resolve, reject) => {
    AxiosApi('/ifms/web-org/beds', {}, 'GET', { page: 1, size: 1000 }, 'ifms').then(res => {
      let { data } = res
      let { list } = data
      resolve(list || [])
    })
  })
}
// 请求层级
export const GetLevel = () => {
  return new Promise((resolve, reject) => {
    AxiosApi('/hsms/web-hs/hierarchy', {}, 'GET', { page: 1, size: 1000 }).then(res => {
      let { data } = res
      let { list } = data
      resolve(list || [])
    })
  })
}
// 请求管房类型
export const GetModelType = () => {
  return new Promise((resolve, reject) => {
    AxiosApi('/hsms/web-hs/dept/config', {}, 'GET').then(res => {
      let { data } = res
      resolve(data)
    })
  })
}
// 请求岗位
export const GetPost = () => {
  return new Promise((resolve, reject) => {
    AxiosApi('/hsms/web-hs/post', {}, 'GET', { page: 1, size: 1000 }).then(res => {
      let { data } = res
      let { list } = data
      resolve(list || [])
    })
  })
}
//请求病人列表
export const ApiPatient = {
  selectIn: (params = null) => {
    return new Promise((resolve, reject) => {
      AxiosApi( urls['nurseNotesGetInPatient'], params, 'GET',{},'bnms').then(res => {
        let data = res.data || []
        resolve(res)
      })
    })

    //return _get({ url: urls['nurseNotesGetInPatient'], data: params })
  },
  selectOut: (params = null) => {
    return new Promise((resolve, reject) => {
      AxiosApi( urls['nurseNotesGetOutPatient'], params, 'GET',{},'bnms').then(res => {
        let data = res.data || []
        resolve(res)
      })
    })

    //return _get({ url: urls['nurseNotesGetOutPatient'], data: params })
  },
  selectTrans: (params = null) => {
    return new Promise((resolve, reject) => {
      AxiosApi( urls['nurseNotesGetTransPatient'], params, 'GET',{},'bnms').then(res => {
        let data = res.data || []
        resolve(res)
      })
    })

    //return _get({ url: urls['nurseNotesGetTransPatient'], data: params })
  }
}
