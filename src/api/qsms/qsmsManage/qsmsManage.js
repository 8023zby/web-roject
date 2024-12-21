import request from '@/assets/qsms/utils/request'
import {
  qsms

} from '@/api/qsms/commonUrl'

const BASE_URL = `${qsms}/web-qs`
const URL = BASE_URL + `/papers`

// 获取问卷列表
export function fetchQsmsList (query) {
  return request({
    url: URL,
    method: 'GET',
    params: query
  })
}

// 新建问卷
export function addQsms (data) {
  return request({
    url: URL,
    method: 'POST',
    data
  })
}

// 编辑问卷
export function editQsms (data) {
  return request({
    url: URL,
    method: 'PUT',
    data
  })
}

// 修改问卷状态
export function putQsmsState (param) {
  return request({
    url: `${URL}/${param.id}/${param.state}`,
    method: 'PUT'
  })
}

// 删除问卷
export function delQsms (param) {
  return request({
    url: `${URL}/${param}`,
    method: 'DELETE'
  })
}

// 获取问卷详情
export function fetchQsmsDetails (param) {
  return request({
    url: `${URL}/${param}`,
    method: 'GET'
  })
}

// 检查是否可编辑
export function getState (param) {
  return request({
    url: `${URL}/getState/${param}`,
    method: 'GET'
  })
}
