import request from '@/assets/wnms/utils/request'

// 列表
export function getHomeConList (params) {
  return request({
    url: '/smarthome-xjd/web-mdap/smart-home/query-list',
    method: 'GET',
    params
  })
}

// 编辑
export function editSmartHome (data) {
  return request({
    url: '/smarthome-xjd/web-mdap/smart-home',
    method: 'PUT',
    data
  })
}

// 获取单个设备信息
export function getSmartHomeOne (params) {
  return request({
    url: '/smarthome-xjd/web-mdap/smart-home/query-one',
    method: 'GET',
    params
  })
}

// 删除
export function deleteDevices (params) {
  return request({
    url: '/smarthome-xjd/web-mdap/smart-home',
    method: 'DELETE',
    params
  })
}

// 获取房间列表
export function queryRoomListApi (query) {
  return request({
    url: '/ifms/web-org/rooms',
    method: 'GET',
    params: query
  })
}
