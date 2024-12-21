import request from '@/api/msms/http/index.js'

const AppURL = `/msms/web-ms`
/* 获取电子书分类 */
export function geteEbooksType (params) {
  return request({
    url: `${AppURL}/ebooksType`,
    method: 'get',
    params
  })
}
/* 新增电子书分类 */
export function addEbooksType (data) {
  return request({
    url: `${AppURL}/ebooksType`,
    method: 'post',
    data
  })
}
/* 新增电子书分类 */
export function editEbooksType (data) {
  return request({
    url: `${AppURL}/ebooksType`,
    method: 'put',
    data
  })
}
/* 电子书分类删除 */
export function delEbookType (params) {
  return request({
    url: `${AppURL}/ebooksType/${params}`,
    method: 'DELETE'
  })
}

/* web端获取电子书列表 */
export function getEbooksList (params) {
  return request({
    url: `${AppURL}/ebooks`,
    method: 'get',
    params
  })
}

/* 电子书新增 */
export function addEbook (data) {
  return request({
    url: `${AppURL}/ebooks`,
    method: 'post',
    data
  })
}
/* 电子书修改 */
export function editEbook (data) {
  return request({
    url: `${AppURL}/ebooks`,
    method: 'put',
    data
  })
}

/* 电子书删除 */
export function delEbook (params) {
  return request({
    url: `${AppURL}/ebooks/${params}`,
    method: 'DELETE'
  })
}

/* 电子书分类排序 */
export function sortEbookTypes (data) {
  return request({
    url: `${AppURL}/ebooksType/updateSort`,
    method: 'put',
    data
  })
}

/* 电子书排序 */
export function sortEbook (data) {
  return request({
    url: `${AppURL}/ebooks/updateSort`,
    method: 'put',
    data
  })
}
