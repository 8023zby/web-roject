import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/passport/web-rbac/logins/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/passport/web-rbac/logins/getPhotoCode',
    method: 'get',
    params: {
      token
    }
  })
}
export function getUserRole(token) {
  return request({
    url: '/passport/web-rbac/logins/getRoleInfoList',
    method: 'get',
    params: token
  })
}
export function getUserDept(token) {
  return request({
    url: '/passport/web-rbac/logins/getDeptInfo',
    method: 'get',
    params: token
  })
}
export function getUserDataDepts(token) {
  return request({
    url: '/passport/web-rbac/logins/getDataDeptInfoList',
    method: 'get',
    params: token
  })
}
export function getUserInfo(token) {
  return request({
    url: '/passport/web-rbac/logins/getUserInfo',
    method: 'get',
    params: token
  })
}

export function logout() {
  return request({
    url: '/passport/web-rbac/logins/loginOut',
    method: 'get'
  })
}

export function getPhotoCode() {
  return request({
    url: '/passport/web-rbac/logins/getPhotoCode',
    method: 'get'
  })
}
/* 获取护理单元 */
export function getDeptInfoList() {
  return request({
    url: '/passport/web-rbac/logins/getDataDeptInfoList',
    method: 'get'
  })
}
