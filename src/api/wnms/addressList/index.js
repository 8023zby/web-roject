import request from '@/assets/wnms/utils/request'
import {
  wnms
} from '@/api/wnms/msgManage/commonUrl'

const BASE_URL = `${wnms}/web-wn`

// 获取列表
export function queryList (query) {
  return request({
    url: BASE_URL + `/liaison`,
    method: 'GET',
    params: query
  })
}

// 筛选列表
export function queryFilter (query) {
  return request({
    url: BASE_URL + `/liaison/filter`,
    method: 'GET',
    params: query
  })
}

export function queryDeptTree (query) {
  return request({
    url: BASE_URL + `/liaison/dept`,
    method: 'GET',
    params: query
  })
}

export function queryAddTree (query) {
  return request({
    url: BASE_URL + `/liaison/org`,
    method: 'GET',
    params: query
  })
}

export function saveAddTree (data) {
  return request({
    url: BASE_URL + `/liaison`,
    method: 'POST',
    data: data
  })
}
