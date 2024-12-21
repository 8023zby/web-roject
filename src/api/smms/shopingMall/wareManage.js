import request from '@/assets/smms/utils/request'
import {
  smms
} from '../commonUrl'

const URL = `${smms}/web-sm/ware`

/* 获取数据 */
export function getInfo (params) {
  return request({
    url: URL,
    method: 'get',
    params: params
  })
}
/* 添加数据 */
export function Add (data) {
  return request({
    url: URL,
    method: 'post',
    data
  })
}

/* 修改数据 */
export function Edit (data) {
  return request({
    url: URL,
    method: 'put',
    data
  })
}

/* 查看详情 */
export function Detail (Id) {
  return request({
    url: URL + '/' + Id,
    method: 'get'
  })
}

/* 删除数据 */
export function Delete (id) {
  return request({
    url: URL + `/${id}`,
    method: 'delete'
  })
}

/* 排序 */
export function Sort (data) {
  return request({
    url: URL + `/updateSort/${data.ids}/${data.sortIndexs}`,
    method: 'put'
  })
}

/* 上架,下架 */
export function UpdateSort (data) {
  return request({
    url: URL + `/${data.ids}/${data.state}`,
    method: 'put'
  })
}

/* 审核记录 */
export function wareAuditLog (params) {
  return request({
    url: `${smms}/web-sm/wareAuditLog`,
    method: 'get',
    params
  })
}

/* 置满 */
export function getFul (id) {
  return request({
    url: URL + `/getFull/` + id,
    method: 'get'
  })
}

/* 置空 */
export function getEmpty (id) {
  return request({
    url: URL + `/getEmpty/` + id,
    method: 'get'
  })
}

/* 获取分类信息 */
export function getCategoryList () {
  return request({
    url: `${smms}/web-sm/wareCategory?isPage=0`,
    method: 'get'
  })
}

/* 上传头像 */
export function UPload () {
  return request({
    url: `${smms}/web-sm/upload/`,
    method: 'post'
  })
}

/* 检测商家 */
export function getshopState () {
  return request({
    url: `${smms}/web-sm/shop/getSmShopByIdForEdit`,
    method: 'get'
  })
}

/* 商品推荐 是否推荐0：否，1：是。 */
export function UpdateRecommend (params) {
  return request({
    url: `${smms}/web-sm/ware/toRecommend/${params.id}/${params.isRecommend}`,
    method: 'get'
  })
}
