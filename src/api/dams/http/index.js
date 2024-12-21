import Axios from 'axios'
import Qs from 'qs'

let urlObj = {}
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'debug') {
  urlObj = {
    unified: '/unifiedApi',
    default: '/api'
  }
} else if (process.env.NODE_ENV === 'production') {
  urlObj = {
    unified: '',
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
