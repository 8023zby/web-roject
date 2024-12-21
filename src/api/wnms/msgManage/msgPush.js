import request from "@/assets/wnms/utils/request";
import { wnms, ifms, wnas,msbm  } from "@/api/wnms//msgManage/commonUrl";

const URL = `${msbm}/web-wn/message`;
// 列表
export function getInfo(params) {
  return request({
    url: URL,
    method: "get",
    params
  });
}
// 添加
export function Add(data) {
  return request({
    url: URL,
    method: "post",
    data
  });
}

// 修改
export function Edit(data) {
  return request({
    url: URL + `/${data.messageId}`,
    method: "put",
    data
  });
}
// 删除
export function Delete(id) {
  return request({
    url: URL + `/${id}`,
    method: "delete"
  });
}

// 详情
export function Details(ids) {
  return request({
    url: URL + `/${ids}`,
    method: "get"
  });
}

// 修改
export function IsEdit(messageId) {
  return request({
    url: URL + `/${messageId}`,
    method: "get"
  });
}

// 新接口-wnas 床位管理接口
export function getBedList(params) {
  return request({
    url: `${wnas}/device-info/receive-info`,
    method: "get",
    params
  });
}

// 新接口-wnas 获取当前的推送详情 //推送情况
export function getStatus(params) {
  return request({
    url: `${URL}/status`,
    method: "get",
    params
  });
}

// /* 床位管理接口---移动护理废弃 */
// export function getBedList (params) {
//   return request({
//     url: `${ifms}/web-org/beds/currentDept`,
//     method: 'get',
//     params
//   })
// }

// 阅读情况查看
export function getbedState(params) {
  return request({
    url: URL + `/bedState/${params.messageId}/${params.classify}`,
    method: "get"
  });
}

// 获取所有的护理单元

export function getNursinglIist(orgid) {
  return request({
    url: `${ifms}/web-org/depts/${orgid}/list`,
    method: "get"
  });
}

export function getMessageID(params) {
  return request({
    url: URL + `/listDept`,
    method: "get",
    params
  });
}
