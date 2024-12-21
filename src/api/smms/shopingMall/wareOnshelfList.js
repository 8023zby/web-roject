import request from '@/assets/smms/utils/request'
import { smms } from '../commonUrl'
export function queryList (query) {
  return request({
    // url: `${smms}/web-sm/ware`,
    url: `${smms}/web-sm/ware/listAudit`,
    method: 'get',
    params: query
  })
}
export function showWare (wareId) {
  return request({
    url: `${smms}/web-sm/ware/` + wareId,
    method: 'get'
  })
}

export function queryLogList (params) {
  return request({
    url: `${smms}/web-sm/wareAuditLog`,
    method: 'get',
    params: params
  })
}
export function updateCheck (ids, auditState, remark) {
  return request({
    url: `${smms}/web-sm/ware/getCheck/` + ids + '/' + auditState + '/' + remark,
    method: 'get'
  })
}
/* 商家 */
export function getBusinessInfo (params) {
  return request({
    url: `${smms}/web-sm/shop`,
    method: 'GET',
    params: params
  })
}
