import request from '@/assets/wnms/utils/request'
import {
  wnms
} from '@/api/wnms//msgManage/commonUrl'

const BASE_URL = `${wnms}/web-wn`
const URL = BASE_URL + `/alarmTones`

// 获取列表
export function queryListApi(query) {
  return request({
    url: URL,
    method: 'GET',
    params: query
  })
}

// 获取详情
export function queryDetailsApi(param) {
  return request({
    url: `${URL}/${param}`,
    method: 'GET'
  })
}

// 新建
export function addApi(data) {
  return request({
    url: URL,
    method: 'POST',
    data
  })
}

// 编辑
export function editApi(data) {
  return request({
    url: URL,
    method: 'PUT',
    data
  })
}

// 删除
export function delApi(param) {
  return request({
    url: `${URL}/${param}`,
    method: 'DELETE'
  })
}
