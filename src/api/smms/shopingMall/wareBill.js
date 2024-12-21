import request from '@/assets/smms/utils/request'
import {
  smms
} from '@/api/smms/wnms/commonUrl'

const URL = `${smms}/web-sm/order`

const URL2 = `${smms}/web-sm`
/* 详情列表 */
export function getInfo (params) {
  return request({
    url: `${URL}/listAccounts`,
    method: 'get',
    params
  })
}

/* 列表查看详情 */
export function orderDetail (id) {
  return request({
    url: URL + `${id}`,
    method: 'get'
  })
}

/* 列表 */
export function getshopAccounts (params) {
  return request({
    url: URL2 + `/shopAccounts`,
    method: 'get',
    params
  })
}

/* 结算 */
export function shopAccounts (data) {
  return request({
    url: URL2 + `/shopAccounts`,
    method: 'put',
    data
  })
}
const URL4 = '/passport/web-rbac/logins/getAuthentication'
/* 校验密码 */
export function Pass (data) {
  return request({
    url: URL4,
    method: 'post',
    data
  })
}

/* 商铺列表 */
export function shopList () {
  return request({
    url: URL2 + `/shop?isPage=0`,
    method: 'get'
  })
}
