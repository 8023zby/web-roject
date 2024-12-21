import request from "@/assets/hpms/utils/request";
import { hpms, ifms } from "../commonUrl";

export function getInfo(params) {
  return request({
    url: `${hpms}/web-hp/edReadStatistics`,
    method: "get",
    params
  });
}
/* 床位管理接口 */
/* 获取列表 */
export function getBedsList(params) {
  return request({
    url: `${ifms}/web-org/beds/` + params + `/bedDept`,
    method: "get"
  });
}

// 获取宣教记录
export function getEduRecord(params) {
  return request({
    url: `${hpms}/app-hp/articleSend`,
    method: "get",
    params
  });
}

// 宣教记录添加
export function addEduRecord(data) {
  return request({
    url: `${hpms}/web-hp/articleSend`,
    method: "post",
    data
  });
}

// 宣教状态
export function recordState(params) {
  return request({
    url: `${hpms}/web-hp/edReadStatistics`,
    method: "get",
    params
  });
}

// 宣教记录详情
export function recordDetails(id) {
  return request({
    url: `${hpms}/web-hp/articleSend/${id}`,
    method: "get"
  });
}

// 删除
export function delEduRecord(id) {
  return request({
    url: `${hpms}/web-hp/articleSend/${id}`,
    method: "delete"
  });
}

// 编辑或者撤回
export function editEduRecord(data) {
  return request({
    url: `${hpms}/web-hp/articleSend`,
    method: "put",
    data
  });
}

// 添加评论
export function addEduComment(data) {
  return request({
    url: `${hpms}/web-hp/articleSend/updateComment`,
    method: "put",
    data
  });
}

// 获取宣教内容
export function getEdu(params) {
  return request({
    url: `${hpms}/app-hp/edArticle/listForPDA`,
    method: "get",
    params
  });
}
// 获取删除状态
export function isExit(params) {
  return request({
    url: `${hpms}/web-hp/articleSend/isExit`,
    method: "get",
    params
  });
}

// 获取宣教文字详情
export function getEdArticleDetails(id) {
  return request({
    url: `${hpms}/web-hp/edArticle/${id}`,
    method: "get"
  });
}
