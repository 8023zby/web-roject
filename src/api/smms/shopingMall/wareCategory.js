import request from '@/assets/smms/utils/request'
import { smms } from '../commonUrl'
export function getWareCategory (query) {
  return request({
    url: `${smms}/web-sm/wareCategory`,
    method: 'get',
    params: query
  })
}
export function addWareCategory (data) {
  return request({
    url: `${smms}/web-sm/wareCategory`,
    method: 'post',
    data
  })
}
export function delWareCategory (WareCategoryId) {
  return request({
    url: `${smms}/web-sm/wareCategory/${WareCategoryId}`,
    method: 'delete'
  })
}
export function editWareCategory (data) {
  return request({
    url: `${smms}/web-sm/wareCategory`,
    method: 'put',
    data
  })
}
export function getWareCategoryEx (WareCategoryId) {
  return request({
    url: `${smms}/web-sm/wareCategory/${WareCategoryId}`,
    method: 'get'
  })
}
export function getSort (data) {
  return request({
    url: `${smms}/web-sm/wareCategory/${data.ids}/${data.sortIndexs}`,
    method: 'put'
  })
}
