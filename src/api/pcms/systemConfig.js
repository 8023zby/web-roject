import request from '@/assets/wnms/utils/request'

const BASE_URL = `/web-wn`
const SYSTEMCONFIG_URL = BASE_URL + `/systemConfig`

// 获取配置列表
export function fetchSystemConfig(query) {
  return request({
    url: SYSTEMCONFIG_URL,
    method: 'GET',
    params: query
  })
}

// 获取配置详情
export function fetchSystemConfigDetails(id) {
  return request({
    url: SYSTEMCONFIG_URL + `/${id}`,
    method: 'GET'
  })
}

// 保存配置
export function addSystemConfig(data) {
  return request({
    url: SYSTEMCONFIG_URL,
    method: 'POST',
    data
  })
}

// 重启分机
export function reboot(data) {
  return request({
    url: SYSTEMCONFIG_URL + `/broad`,
    method: 'POST',
    data
  })
}

// 获取护理级别
export function nursingLevel() {
  return request({
    url: BASE_URL + `/nursingLevel`,
    method: 'GET'
  })
}
