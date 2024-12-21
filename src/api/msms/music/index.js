import request from '@/api/msms/http/index.js'

const AppURL = `/msms/web-ms`
/* 获取电子书分类 */
export function geteMusicType (params) {
  return request({
    url: `${AppURL}/musicType`,
    method: 'get',
    params
  })
}
/* 新增电子书分类 */
export function addMusicType (data) {
  return request({
    url: `${AppURL}/musicType`,
    method: 'post',
    data
  })
}
/* 编辑电子书分类 */
export function editMusicType (data) {
  return request({
    url: `${AppURL}/musicType`,
    method: 'put',
    data
  })
}
/* 电子书分类删除 */
export function delMusicType (params) {
  return request({
    url: `${AppURL}/musicType/${params}`,
    method: 'DELETE'
  })
}

/* web端获取电子书列表 */
export function getMusicList (params) {
  return request({
    url: `${AppURL}/music`,
    method: 'get',
    params
  })
}

/* 电子书新增 */
export function addMusic (data) {
  return request({
    url: `${AppURL}/music`,
    method: 'post',
    data
  })
}
/* 电子书修改 */
export function editMusic (data) {
  return request({
    url: `${AppURL}/music`,
    method: 'put',
    data
  })
}

/* 电子书删除 */
export function delMusic (params) {
  return request({
    url: `${AppURL}/music/${params}`,
    method: 'DELETE'
  })
}

/* 电子书分类排序 */
export function sortMusicTypes (data) {
  return request({
    url: `${AppURL}/musicType/updateSort`,
    method: 'put',
    data
  })
}

/* 电子书排序 */
export function sortMusic (data) {
  return request({
    url: `${AppURL}/music/updateSort`,
    method: 'put',
    data
  })
}
