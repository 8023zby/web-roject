import request from '@/assets/wnms/utils/request'
import {
  wnms
} from '@/api/wnms//msgManage/commonUrl'

const BASE_URL = `${wnms}/web-wn/bedHeadConfig`

// 获取列表
export function queryList (query) {
  return request({
    url: BASE_URL,
    method: 'GET',
    params: query
  })
}
export function getDetail (query) {
  return request({
    url: BASE_URL + '/'+query,
    method: 'GET'
  })
}

// 床头卡类型查询
export function queryType (query) {
  return request({
    url: BASE_URL + '/queryType',
    method: 'GET',
    params: query
  })
}
// 添加
export function Add (data) {
  return request({
    url: BASE_URL,
    method: 'post',
    data
  })
}
// 上传
export function UploadFile (data) {
  return request({
    url: BASE_URL + '/upload',
    method: 'post',
    data
  })
}

// 修改
export function Edit (data) {
  return request({
    url: BASE_URL,
    method: 'put',
    data
  })
}
// 删除
export function Delete (id) {
  return request({
    url: BASE_URL + `/${id}`,
    method: 'delete'
  })
}
export function deleteFile (data) {
  return request({
    url: BASE_URL + '/delete' ,
    method: 'delete',
    data
  })
}

// 详情
export function Details (id) {
  return request({
    url: BASE_URL + `/${id}`,
    method: 'get'
  })
}
