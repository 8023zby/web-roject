import Axios from 'axios'
import Qs from 'qs'
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
