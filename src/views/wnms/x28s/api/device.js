import request from '@/assets/wnms/utils/request'

const URL = `/csms/app-cs/screen/device`
// const URL = `${hpms}/web-hp/edArticle`
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
    url: URL + `/${data.deviceId}`,
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
// 详情
export function getLog (deviceId) {
  return request({
    url: `/csms/app-cs/${deviceId}`,
    method: 'get'
  })
}
