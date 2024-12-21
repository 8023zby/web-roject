import request from "@/assets/hpms/utils/request";
import { hpms } from "../commonUrl";

// 获取标签tree列表
export function getTreeList(params) {
  return request({
    url: '/wsms/web-hp/tagCategory/queryAll',
    method: "get",
    params
  })
}

const URL = `${hpms}/web-hp/edTag`;

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

/* 修改 */
export function Edit(data) {
  return request({
    url: URL,
    method: "put",
    data
  });
}

/* 删除 */
export function Del(id) {
  return request({
    url: URL + `/${id}`,
    method: "delete"
  });
}
/* 查看 */
export function Detail(id) {
  return request({
    url: URL + `/${id}`,
    method: "get"
  });
}

/* 标签分类管理 */

const lableURL = `${hpms}/web-hp/tagCategory`;

/* 列表 */
export function LableInfo(params) {
  return request({
    url: lableURL,
    method: "get",
    params
  });
}
/* 列表 */
export function getLableInfo(params) {
  return request({
    url: lableURL + `/tree`,
    method: "get",
    params
  });
}

/* 添加 */
export function AddLable(data) {
  return request({
    url: lableURL,
    method: "post",
    data
  });
}

/* 修改 */
export function EditLable(data) {
  return request({
    url: lableURL,
    method: "put",
    data
  });
}

/* 删除 */
export function DelLable(id) {
  console.log(id);
  return request({
    url: lableURL + `/${id}`,
    method: "delete"
  });
}
/* 查看 */
export function DetailLable(id) {
  return request({
    url: lableURL + `${id}`,
    method: "get"
  });
}

/* 查看 */
export function getEdTagCategory(params) {
  /* return request({
    url: lableURL + `/getEdTagCategory`,
    method: 'get',
    params
  }) */

  return request({
    url: lableURL + `/${params.id}`,
    method: "get"
  });
}
