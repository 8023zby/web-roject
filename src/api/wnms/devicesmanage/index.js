import request from '@/assets/wnms/utils/request'

// 查询 设置信息
export function getDetail (params) {
  return request({
    url: ' /mattress-yhrh/web-td/device/mattress/config',
    method: 'get',
    params
  })
}

// 保存设置信息
export function saveConfig (data) {
  return request({
    url: '/mattress-yhrh/web-td/device/mattress/config',
    method: 'post',
    data
  })
}

// 查询标签
export function getLabels (params) {
  return request({
    url: '/bnms/web-bn/label-dict',
    method: 'get',
    params
  })
}

// 查询配置的标签列表
export function getSetedLabels (params) {
  return request({
    url: '/mattress-yhrh/web-td/device/mattress/label/list',
    method: 'get',
    params
  })
}

// 删除标签
export function deleteLabel (data) {
  return request({
    url: '/mattress-yhrh/web-td/device/mattress/label/remove',
    method: 'post',
    data
  })
}

// 添加标签
export function addLabel (data) {
  return request({
    url: '/mattress-yhrh/web-td/device/mattress/label/save',
    method: 'post',
    data
  })
}

// 修改标签
export function updLabel (data) {
  return request({
    url: '/mattress-yhrh/web-td/device/mattress/label/update',
    method: 'post',
    data
  })
}

