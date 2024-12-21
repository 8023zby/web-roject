import request from '@/assets/wnms/utils/request'
import {
  wnms,
  ifms
} from '@/api/wnms//msgManage/commonUrl'

const BASE_URL = `${wnms}/web-wn`
const URL = BASE_URL + `/audioBroadcast`

// 获取列表
export function queryListApi (query) {
  return request({
    url: URL,
    method: 'GET',
    params: query
  })
}

// 获取详情
export function queryDetailsApi (param) {
  return request({
    url: `${URL}/${param}`,
    method: 'GET'
  })
}

// 新建
export function addApi (data) {
  return request({
    url: URL,
    method: 'POST',
    data
  })
}

// 编辑
export function editApi (data) {
  return request({
    url: URL,
    method: 'PUT',
    data
  })
}

// 删除
export function delApi (param) {
  return request({
    url: `${URL}/${param}`,
    method: 'DELETE'
  })
}

// 文件上传
export function uploadApi (param) {
  return request({
    url: `/Upload`,
    method: 'POST'
  })
}

// 获取床位列表
export function queryBedListApi (query) {
  return request({
    url: `${ifms}/web-org/beds/currentDept`,
    method: 'GET',
    params: query
  })
}

// 获取房间列表
export function queryRoomListApi (query) {
  return request({
    url: `${ifms}/web-org/rooms/currentDept`,
    method: 'GET',
    params: query
  })
}

// 检查是否可编辑
export function getState (param) {
  return request({
    url: `${URL}/getState/${param}`,
    method: 'GET'
  })
}

// 添加播放丹，调用视音频接口
export function createManifest(data) {
  return request({
    url: `/janus/create_manifest`,
    method: 'POST',
    data
  })
}
//删除播放丹
export function delManifest(data) {
  return request({
    url: `/janus/rm_manifest`,
    method: 'POST',
    data
  })
}
