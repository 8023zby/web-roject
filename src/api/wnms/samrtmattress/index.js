import request from '@/assets/wnms/utils/request'

// 查询 床垫列表
export function getSmartList (params) {
  return request({
    url: '/mattress-yhrh/web-td/device/mattress',
    method: 'get',
    params
  })
}

// 查询床位
export function getBedsList (params) {
  return request({
    url: '/mattress-yhrh/web-org/bed/mattress',
    method: 'get',
    params
  })
}

// 绑定床位
export function setBed (data) {
  return request({
    url: ' /mattress-yhrh/web-td/device/mattress',
    method: 'post',
    data
  })
}

// 解除床位绑定
export function cancelBed (data) {
  return request({
    url: '/mattress-yhrh/web-td/device/mattress/unbind',
    method: 'post',
    data
  })
}

export function getdepts (params) {
  return request({
    url: '/ifms/web-org/depts',
    method: 'get',
    params
  })
}

// 删除床位
export function delBed (data) {
  return request({
    url: '/mattress-yhrh/web-td/device/mattress/remove',
    method: 'post',
    data
  })
}

// 批量绑定床位
export function someSetBeds (data) {
  return request({
    url: '/mattress-yhrh/web-td/device/mattress/batch',
    method: 'post',
    data
  })
}
