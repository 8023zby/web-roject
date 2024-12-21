import request from '@/assets/smms/utils/request'
import {
  passport,
  smms
} from '@/api/smms/wnms/commonUrl'

const UPA_URL = `${passport}/web-org`
const A10_URL = `${smms}/web-sm`

const UPA_URL_BUSINESSES = UPA_URL + `/businesses`
const A10_URL_BUSINESSES = A10_URL + `/shop`

/* 获取数据 */
export function getInfo (params) {
  return request({
    url: A10_URL_BUSINESSES,
    method: 'GET',
    params: params
  })
}

/* 添加和编辑前的验证 */
export function checkout (data) {
  return request({
    url: A10_URL_BUSINESSES + `/getUpdateOrSave`,
    method: 'POST',
    data
  })
}

/* 添加数据 */
export function AddBase (data) {
  return request({
    url: UPA_URL_BUSINESSES,
    method: 'POST',
    data
  })
}
export function Add (data) {
  return request({
    url: A10_URL_BUSINESSES,
    method: 'POST',
    data
  })
}

/* 修改数据 */
export function EditBase (data) {
  return request({
    url: UPA_URL_BUSINESSES + `/${data.orgId}`,
    method: 'PUT',
    data
  })
}
export function Edit (data) {
  return request({
    url: A10_URL_BUSINESSES,
    method: 'PUT',
    data
  })
}

/* 查看详情 */
export function DetailBase (orgId) {
  return request({
    url: UPA_URL_BUSINESSES + `/${orgId}`,
    method: 'GET'
  })
}
export function Detail (Id) {
  return request({
    url: A10_URL_BUSINESSES + '/' + Id,
    method: 'GET'
  })
}

/* 删除数据 */
export function DeleteBase (orgId) {
  return request({
    url: UPA_URL_BUSINESSES + `/${orgId}`,
    method: 'DELETE'
  })
}
export function Delete (id) {
  return request({
    url: A10_URL_BUSINESSES + `/${id}`,
    method: 'DELETE'
  })
}

/* 排序 */
export function Sort (data) {
  return request({
    // url: A10_URL_BUSINESSES + `/updateSort/${data.ids}/${data.sortIndexs}`,
    url: A10_URL_BUSINESSES + `/updateSort/${data.ids}/${data.sortIndexs}`,
    method: 'PUT'
  })
}

/* 启用,停用 */
export function UpdateStatusBase (data) {
  let p = {
    ids: (data.ids instanceof Array ? data.ids.join(',') : data.ids),
    userStatus: data.status
  }
  return request({
    url: UPA_URL_BUSINESSES + `/changeStatus`,
    method: 'PUT',
    data: p
  })
}
export function UpdateStatus (data) {
  return request({
    url: A10_URL_BUSINESSES + `/updateState/${data.ids}/${data.status}`,
    method: 'PUT'
  })
}

/* 上架审核 */
export function isAuditByHospital (data) {
  return request({
    url: A10_URL_BUSINESSES + `/updateAuditByHospital/${data.id}/${data.auditByHospital}`,
    method: 'PUT'
  })
}

/* 重置密码 */
export function resetPassword (orgId) {
  return request({
    url: UPA_URL_BUSINESSES + `/${orgId}/resetPassword`,
    method: 'PUT'
  })
}
/* 解锁 */
export function unlock (param) {
  let data = { ids: param.ids.join(',') }
  return request({
    url: UPA_URL_BUSINESSES + `/frozen`,
    method: 'PUT',
    data
  })
}

/* 获取商户的锁定状态 */
export function getlockStatus () {
  return request({
    url: UPA_URL_BUSINESSES,
    method: 'GET'
  })
}
