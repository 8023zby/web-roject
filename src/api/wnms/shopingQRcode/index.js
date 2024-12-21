import request from "@/assets/wnms/utils/request"
import { wnms, ifms, wnas } from "@/api/wnms//msgManage/commonUrl"

const URL = `${wnms}/app-wn/bedQrcode/`

// 列表
export function getInfo (params) {
  return request({
    url: URL,
    method: "get",
    params
  })
}

// 添加
export function Add (data) {
  return request({
    url: URL,
    method: "post",
    data
  })
}

// 修改
export function Edit (data) {
  return request({
    url: URL,
    method: "put",
    data
  })
}
// 删除
export function Delete (id) {
  return request({
    url: URL + `/${id}`,
    method: "delete"
  })
}

// 详情
export function Details (ids) {
  return request({
    url: URL + `/${ids}`,
    method: "get"
  })
}


// 查询全院
export function getQycount (params) {
  return request({
    url: URL + `/getQycount`,
    method: "get",
    params
  })
}
