import config from './config'
import qs from 'qs'
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
let MessageBoxHandle = null

let _axios = axios.create({
  baseUrl: config.baseUrl,
  timeout: 0,
  withCredentials: true,
  responseType: 'json',
  maxContentLength: 2000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  transformRequest: [
    data => {
      return qs.stringify(data)
    }
  ],
  transformResponse: [
    data => {
      // 特殊处理逻辑
      // 1. 验证跳转登录
      if (data && data.rs === '1211') {
        // router.push("login");
      }
      return data
    }
  ]
})
// 添加请求拦截器
_axios.interceptors.request.use(
  config => {
    // 发送token
    config.headers.Authorization = 'sdfsf56s5df65s6f43s45gsada5sd6fsdAds' // token
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 添加响应拦截器
_axios.interceptors.response.use(
  response => {
    // 4011 4012 4013 当作无数据来处理
    if (response.data.status === 4011 || response.data.status === 4012 || response.data.status === 4013) {
      const msg = response.data.desc || '页面超时，请重新登录！'
      !MessageBoxHandle && (MessageBoxHandle = MessageBox.alert(msg, '提示', {
        confirmButtonText: '确认',
        showClose: false,
        callback: action => {
          localStorage.clear()
          window.location.href = '/'
          return false
        }
      }))
      console.log(MessageBoxHandle, 111)
      return response
    } else if (response.data.status === 401) {
      Message.error(response.data.desc || '您没有权限！')
      return response
    } else if (response.data.status === 200) {
      return Promise.resolve(response.data)
    } else {
      response.data.message = response.data.desc
      return Promise.reject(response.data)
    }
  },
  error => {
    switch (error.response.status) {
      case 400:
        error.message = '请求错误'
        break

      case 401:
        error.message = '未授权，请登录'
        break

      case 403:
        error.message = '拒绝访问'
        break

      case 404:
        error.message = `请求地址出错: ${error.response.config.url}`
        break

      case 408:
        error.message = '请求超时'
        break

      case 500:
        error.message = '服务器内部错误'
        break

      case 501:
        error.message = '服务未实现'
        break

      case 502:
        error.message = '网关错误'
        break

      case 503:
        error.message = '服务不可用'
        break

      case 504:
        error.message = '网关超时'
        break

      case 505:
        error.message = 'HTTP版本不受支持'
        break

      default:
    }
    return Promise.reject(error)
  }
)
// get
export const _get = req => {
  return _axios.get(req.url, { params: req.data })
}
// post
export const _post = req => {
  return _axios({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [
      data => {
        return JSON.stringify(data)
      }
    ],
    method: 'post',
    url: `${req.url}`,
    data: req.data
  })
}
// post _ qs
export const _post_qs = req => {
  return _axios({ method: 'post', url: `${req.url}`, data: req.data })
}
// patch
export const _put = req => {
  return _axios({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [
      data => {
        return JSON.stringify(data)
      }
    ],
    method: 'put',
    url: `${req.url}`,
    data: req.data
  })
}
// patch _ qs
export const _put_qs = req => {
  return _axios({ method: 'put', url: `${req.url}`, data: req.data })
}
// delete
export const _delete = req => {
  return _axios({ method: 'delete', url: `${req.url}`, data: req.data })
}
// post and no withCredentials
export const _postNoWithCredentials = req => {
  return _axios({
    method: 'post',
    url: `${req.url}`,
    data: req.data,
    withCredentials: false
  })
}
// wangjuan
export const _postEx = req => {
  return _axios({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [
      data => {
        return JSON.stringify(data)
      }
    ],
    method: 'post',
    url: `${req.url}?`.concat(qs.stringify(req.data.pageParameters)),
    data: req.data.conditionParameters
  })
}
