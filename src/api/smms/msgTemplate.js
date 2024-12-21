import request from '@/assets/smms/utils/request'
const URL = '/web-wn/template'
// 列表
export function getInfo (params) {
  return request({
    url: URL,
    method: 'get',
    params
  })
}
// 添加
export function Add (data) {
  return request({
    url: URL,
    method: 'post',
    data
  })
}

// 修改
export function Edit (data) {
  return request({
    url: URL + `/${data.templateId}`,
    method: 'put',
    data
  })
}
// 删除
export function Delete (id) {
  return request({
    url: URL + `/${id}`,
    method: 'delete'
  })
}

// 详情
export function Details (ids) {
  return request({
    url: URL + `/${ids}`,
    method: 'get'
  })
}
