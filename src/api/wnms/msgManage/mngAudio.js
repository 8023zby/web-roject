import request from '@/assets/wnms/utils/request'
import {
  wnms,
  fuds
} from '@/api/wnms//msgManage/commonUrl'

const BASE_URL = `${ wnms }/web-wn`
const URL = BASE_URL + `/audioFiles`

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
    data,
    timeout: 1000 * 60 * 5
  })
}

// 编辑
export function editApi(data) {
  return request({
    url: URL,
    method: 'PUT',
    data,
    timeout: 1000 * 60 * 5
  })
}

// 删除
export function delApi(param) {
  return request({
    url: `${URL}/${param}`,
    method: 'DELETE'
  })
}

// 文件上传
export function uploadApi(param) {
  return request({
    url: `${ fuds }/Upload`,
    method: 'POST'
  })
}

// 视音频组删除
export function delShiyinpin(data) {
  return request({
    url: `/janus/rm_audio`,
    method: 'POST',
    data
  })
}

// 视音频组-获取解析状态
export function getJieXiStu(data) {
  return request({
    url: `/janus/check_audio_status`,
    method: 'POST',
    data
  })
}

// 获取宣教点播音频列表
export function getBroadCastManage(params) {
  return request({
    url: `/iems/web-iems/broadcast-manage`,
    method: 'GET',
    params
  })
}

// 添加宣教点播音频列表
export function addBroadCastManage(data) {
  return request({
    url: `/iems/web-iems/broadcast-manage`,
    method: 'POST',
    data
  })
}

// 编辑宣教点播音频列表
export function editBroadCastManage(data) {
  return request({
    url: `/iems/web-iems/broadcast-manage`,
    method: 'PUT',
    data
  })
}

// 删除宣教点播音频列表
export function delBroadCastManage(broadcastId) {
  return request({
    url: `/iems/web-iems/broadcast-manage`,
    method: 'DELETE',
    params: { broadcastId }
  })
}

export function getBroadCastManageDiskSpace() {
  return request({
    url: `/iems/web-iems/broadcast-manage/getDiskSpace`,
    method: 'get',
  })
}


