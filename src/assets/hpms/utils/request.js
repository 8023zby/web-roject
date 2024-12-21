import axios from "axios";
import { MessageBox, Message } from "element-ui";
let MessageBoxHandle = null
// import store from '@/store'
// import {
//   getToken
// } from '@/utils/auth'
let loadingInstance;
// create an axios instance
const service = axios.create({
  baseURL: "", // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

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
    const res = response;
    const code = res.data.status;
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
            // return false
          }
        }))
        response.data.data = null
        // return response.data
      } else if (code === 50008 || code === 50012 || code === 50014 || code === 400) {
        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        // to re-login
        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            // cancelButtonText: 'Cancel',
            type: "warning"
          }
        ).then(() => {});
      } else if (code === 500) {
        Message({
          message: res.data.desc || "error",
          type: "error",
          duration: 5 * 1000
        });
      } else if (code === 401) {
        Message({
          message: res.data.desc || "error",
          type: "error",
          duration: 5 * 1000
        });
      } else if (code === 4011) {
        Message({
          message: "您还未登录，请重新登录！",
          type: "warning",
          duration: 1000
        });
        localStorage.clear();
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        Message({
          message: res.data.desc || "error",
          type: "error",
          duration: 5 * 1000
        });
      }
      return Promise.reject(res.data || "error");
    } else {
      return res.data;
    }
  },
  error => {
    if (
      error.code === "ECONNABORTED" &&
      error.message.indexOf("timeout") !== -1
    ) {
      console.log(
        "根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案"
      );
      // return service.request(originalRequest);//例如再重复请求一次
      //  loadingInstance.close()
      Message({
        message: "请求超时！",
        type: "error",
        duration: 5 * 1000
      });
    }
    console.log("err" + error); // for debug
    Message({
      message: error.response.data.message || "",
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
