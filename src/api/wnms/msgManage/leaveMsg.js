import request from "@/assets/wnms/utils/request";
import { wnms, ifms, wnas } from "@/api/wnms//msgManage/commonUrl";

const URL = `${wnms}/web-wn/typeManager`;

// 列表
export function getInfo(params) {
  return request({
    url: URL,
    method: "GET",
    params
  });
}

// 添加
export function Add(data) {
  return request({
    url: URL,
    method: "POST",
    data
  });
}

// 修改
export function Edit(data) {
  return request({
    url: URL,
    method: "PUT",
    data
  });
}
// 删除
export function Delete(id) {
  return request({
    url: URL + `/${id}`,
    method: "DELETE"
  });
}

// 详情
export function Details(ids) {
  return request({
    url: URL + `/${ids}`,
    method: "GET"
  });
}
