import request from "@/assets/hpms/utils/request";
import { hpms, tdms } from "../commonUrl";

const URL = `${hpms}/web-hp/edArticle`;
/* 列表 */
export function getInfo(params) {
  return request({
    url: URL,
    method: "get",
    params
  });
}

/* 添加 */
export function Add(data) {
  return request({
    url: URL,
    method: "post",
    data
  });
}
/* 判断是否重名 */
export function checkAdd(data) {
  return request({
    url: URL+'/checkAdd',
    method: "post",
    data
  });
}

/* 修改 */
export function Edit(data) {
  return request({
    url: URL,
    method: "put",
    data
  });
}

/* 删除 */
export function Delete(id) {
  return request({
    url: URL + `/${id}`,
    method: "delete"
  });
}
/* 删除验证是否在门口机使用 */
export function checkDelete(id) {
  return request({
    url: '/tdms/web-wn/systemConfig/doorway/getIsUsed/'+id,
    method: "get"
  });
}
/* 查看 */
export function Detail(id) {
  return request({
    url: URL + `/${id}`,
    method: "get"
  });
}
/* 分类排序 */
export function Sort(params) {
  return request({
    url: URL + `/updateSort/${params.ids}/${params.sortIndexs}`,
    method: "put"
  });
}

/* 分类管理接口 */
const typeUrl = `${hpms}/web-hp/articleCategory`;
/* 获取列表 */
export function getTypeList(params) {
  return request({
    url: typeUrl,
    method: "get",
    params
  });
}

/* 分类添加 */
export function AddType(data) {
  return request({
    url: typeUrl,
    method: "post",
    data
  });
}

/* 分类修改 */
export function EditType(data) {
  return request({
    url: typeUrl,
    method: "put",
    data
  });
}

/* 分类删除 */
export function DelType(id) {
  return request({
    url: typeUrl + `/${id}`,
    method: "delete"
  });
}
/* 分类查看 */
export function DetailType(id) {
  return request({
    url: typeUrl + `/${id}`,
    method: "get"
  });
}
/* 分类排序 */
export function SortType(params) {
  return request({
    url: typeUrl + `/updateSort/${params.ids}/${params.sortIndexs}`,
    method: "put"
  });
}

/* 启用停用 */
export function updateState(params) {
  return request({
    url: URL + `/updateState/${params.ids}/${params.state}`,
    method: "put"
  });
}

const tdmsUrl = `${tdms}/web-td/device/`;
/* 列表 */
export function getBedSideInfo(params) {
  return request({
    url: tdmsUrl,
    method: "get",
    params
  });
}
