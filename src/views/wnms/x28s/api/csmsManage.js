import request from '@/assets/wnms/utils/request'

const URL = `/csms/web-cs/screen`
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
    url: URL + `/${data.screenId}`,
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
/* 排序 */
export function Sort (data) {
  return request({
    url: URL + `/updateSort/${data.ids}/${data.sortIndexs}`,
    method: 'put'
  })
}
/* 查看显示屏 */
export function getDetails (params) {
  return request({
    url: URL + `/preview`,
    method: 'get',
    params
  })
}

/* 是否轮播 */
export function UpdateLoop (data) {
  return request({
    url: URL + `/${data.screenId}/${data.isLoop}`,
    method: 'put'
  })
}

/* 删除文件接口 */
export function Del (params) {
  return request({
    url: URL + `/removeVideo`,
    method: 'delete',
    params
  })
}
