import request from '@/assets/smms/utils/request'
import { smms, passport } from '../commonUrl'
export function editShop (data) {
  return request({
    url: `${smms}/web-sm/shop/updateSmShop`,
    method: 'put',
    data
  })
}
export function getSmShopByIdForEdit () {
  return request({
    url: `${smms}/web-sm/shop/getSmShopByIdForEdit`,
    method: 'get'
  })
}
export function updateState (isOpened) {
  return request({
    url: `${smms}/web-sm/shop/updateIsOpened/` + isOpened,
    method: 'get'
  })
}

export function editBusinesses (data) {
  return request({
    url: `${passport}/web-org/businesses/` + data.orgId,
    method: 'put',
    data
  })
}
/* 添加和编辑前的验证 */
export function checkout (data) {
  return request({
    url: `${smms}/web-sm/shop/getUpdateOrSave`,
    method: 'POST',
    data
  })
}
