import Axios from 'axios'
import Qs from 'qs'
import { MessageBox } from 'element-ui'
import { MsgShow } from '../../../assets/passport/js/Message'
let timer = null
let timerLogin = null
// 添加响应拦截器
Axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  let status = response.data.status
  if (status === 4011 || status === 4012 || status === 4013) {
    clearTimeout(timerLogin)
    timerLogin = setTimeout(() => {
      let msg = response.data.desc
      if (!msg || msg === null) {
        msg = '页面超时，请重新登录！'
      }
      MessageBox.alert(msg, '提示', {
        confirmButtonText: '确 认',
        showClose: false,
        callback: action => {
          let pimsEntryData = localStorage.getItem('pimsEntryData')
          let userInfo = localStorage.getItem('yhUserInfo')
          let userInfoList = localStorage.getItem('yhUserInfoList')
          localStorage.clear()
          localStorage.setItem('pimsEntryData', pimsEntryData)
          localStorage.setItem('yhUserInfo', userInfo)
          localStorage.setItem('yhUserInfoList', userInfoList)
          timerLogin = null
          setTimeout(() => {
            window.location.href = '/'
          }, 1000)
          return false
        }
      })
    }, 500)
  } else if (status === 401) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      MsgShow('error', response.data.desc || '对不起，您无操作权限')
      timer = null
    }, 500)
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
// 自定义请求
export const AxiosByYou = (url, data = {}, type = 'post', param = {}) => {
  return new Promise((resolve, reject) => {
    Axios({
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
// 字符串参数请求啊
export const AxiosApi = (url, data = {}, type = 'post', param = {}) => {
  return new Promise((resolve, reject) => {
    Axios({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
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
export const AxiosJsonApi = (url, data = {}, type = 'post', param = {}) => {
  return new Promise((resolve, reject) => {
    Axios({
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
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
