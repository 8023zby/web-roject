/*
 * @Author: 刘慧
 * @Owner: 刘慧
 * @Date: 2022-05-21 16:23:37
 * @LastEditTime: 2022-09-07 17:16:09
 * @LastEditors: 刘慧
 * @Description:
 * @FilePath: \yarward-vims-frontEnd\src\api\vims\http.js
 */
import axios from 'axios';
import {
  Message,
  MessageBox
} from 'element-ui';

let messageBoxHandle = null;
const instance = axios.create({
  timeout: 20000 // 请求超时时间
});

instance.interceptors.request.use(function (config) {
  // 在发送请求之前做处理...
  config.headers = Object.assign(config.method === 'get' ? {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  } : {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }, config.headers);
  return Promise.resolve(config);
}, function (error) {
  // 对请求错误做处理...
  return Promise.reject(error);
});
// 实例添加响应拦截器
instance.interceptors.response.use(function (response) {
  const {
    status,
    code,
    data,
    msg,
    desc
  } = response.data || {};

  if (status === 200 || code === 0) {
    return data;
  } else if (status === 4011 || status === 4012 || status === 4013 || code === 4011 || code === 4012 || code === 4013) { // 4011 页面超时，请重新登录 4012 此账号已被其他人登录，请退出或重新登录 4013 用户关键信息发送变化，请重新登录
    if (!messageBoxHandle) {
      messageBoxHandle = MessageBox.alert(msg || desc || '页面超时，请重新登录!', '提示', {
        confirmButtonText: '确认',
        showClose: false,
        callback: () => {
          messageBoxHandle = null;
          localStorage.clear();
          window.location.href = '/';
          return false;
        }
      });
    }
    return Promise.reject(response.data);
  } else if (code === 401) { // 权限不足，无法访问，请联系管理员
    Message.error(msg || desc || '您没有权限！');
    return Promise.reject(response.data);
  } else {
    Message.error(msg || desc);
    return Promise.reject(response.data);
  }
}, function (error) {
  // 对响应错误做处理...
  if (error.response) {
    const {
      status,
      statusText
    } = error.response;
    Message.error(`${status} - ${statusText}`);
    return Promise.reject(error.response);
  } else if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    Message.error('请求超时');
    return Promise.reject(new Error({
      message: '请求超时'
    }));
  } else if (error.message === 'Network Error') {
    Message.error('网络异常');
    return Promise.reject(new Error({
      message: '网络异常'
    }));
  } else {
    Message.error('其他异常');
    return Promise.reject(new Error({
      message: '其他异常'
    }));
  }
});

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    instance.get(url, {
      params
    }).then(resolve).catch(reject);
  });
};

export const post = (url, data) => {
  return new Promise((resolve, reject) => {
    instance.post(url, data).then(resolve).catch(reject);
  });
};

export const del = (url, data) => {
  return new Promise((resolve, reject) => {
    instance.delete(url, {
      data
    }).then(resolve).catch(reject);
  });
};

export const put = (url, data) => {
  return new Promise((resolve, reject) => {
    instance.put(url, data).then(resolve).catch(reject);
  });
};

export default {
  get,
  post,
  del,
  put
};
