import request from '@/assets/smms/utils/request'

const BASE_URL = `/web-wn`
const URL = BASE_URL + `/audioBroadcast`

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
    data
  })
}

// 编辑
export function editApi(data) {
  return request({
    url: URL,
    method: 'PUT',
    data
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
    url: `/Upload`,
    method: 'POST'
  })
}

// 获取床位列表
export function queryBedListApi(query) {
  return request({
    url: '/ifms/web-org/beds',
    method: 'GET',
    params: query
  })
}

// 获取房间列表
export function queryRoomListApi(query) {
  return request({
    url: '/ifms/web-org/rooms',
    method: 'GET',
    params: query
  })
}
