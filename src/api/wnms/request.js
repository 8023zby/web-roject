import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
let MessageBoxHandle = null
// import store from '../../store/wnms/store'
// import { getToken } from '../../assets/wnms/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // if (store.getters.token) {
    //   // let each request carry token --['X-Token'] as a custom key.
    //   // please modify it according to the actual situation.
    //   config.headers['token'] = getToken()
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code.
   */
  response => {
    const res = response
    const code = res.data.status
    // if the custom code is not 20000, it is judged as an error.
    if (code !== 200) {
      if (code === 4011 || code === 4012 || code === 4013) {
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
        response.data.data = null
        // return response.data
      } else if (code === 50008 || code === 50012 || code === 50014 || code === 400) {
        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          // cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          // store.dispatch('user/resetToken').then(() => {
          //   location.reload()
          // })
        })
      } else if (code === 500) {
        Message({
          message: res.data.data || 'error',
          type: 'error',
          duration: 5 * 1000
        })
      } else if (code === 401) {
        Message({
          message: res.data.data || 'error',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: res.data.desc || 'error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(res.data || 'error')
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.desc,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
