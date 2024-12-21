import request from '@/assets/smms/utils/request'
const URL = '/web-wn/message'
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
    url: URL + `/${data.messageId}`,
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

// 获取床位
export function getBedList (params) {
  return request({
    url: `/ifms/web-org/beds`,
    method: 'get',
    params
  })
}
// 阅读情况查看
export function getbedState (params) {
  return request({
    url: URL + `/bedState/${params.messageId}/${params.classify}`,
    method: 'get'
  })
}
