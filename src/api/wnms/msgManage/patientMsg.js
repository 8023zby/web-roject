import request from "@/assets/wnms/utils/request";
import {wnms, ifms, bmms,passport,msbm} from "@/api/wnms//msgManage/commonUrl";

const URL = `${msbm}/web-wn/message`;
const URLPassPort = `${passport}/web-rbac/users`;
const IfmsUrl = `${ifms}/web-org`

//消息模块改造


export function getAppPersonsByDeptId(params) {
  return request({
    url: `ifms/app-org/emps/${params}`,
    method: "GET",
    params
  });
}


/**
 * 患者消息
 * @param params
 */
export function patientMsgListApi(params) {
  return request({
    url: URL,
    method: "GET",
    params
  });
}

/**
 * 获取床位列表
 * @param data
 */
export function bedListApi(params) {
  return request({
    url: `wnas/device-info/receive-info`,
    method: "GET",
    params
  });
}


/***
 * 消息推送
 * @param data
 */
export function pushMsgApi(params) {
  return request({
    url: URL,
    method: "post",
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    data: params
  });
}

/***
 * 编辑消息
 * @param data
 */
export function editMsgApi(data) {
  return request({
    url: URL+ `/${data.messageId}`,
    method: "put",
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    data
  });
}

/***
 * 获取护理单元下的用户
 * @param data
 */
export  function getUsersByDept(params) {
  return  request({
    url: URLPassPort,
    method: "GET",
    params
  });
}


/***
 * 查询消息详情
 * @param data
 */
export function getMsgInfoByMessageID(data) {
  return request({
    url: URL+ `/${data}`,
    method: "GET",
    data
  });
}

/**
 * 获取护理单元列表
 * @param data
 */
export function getDeptsList(data) {
  return request({
    url: IfmsUrl+'/depts',
    method: "GET",
    data
  });
}


// 标记已读
export function markRead(data) {
  return request({
    url: URL + "/mark-read",
    method: "put",
    data
  });
}

// 标记已读
export function markAllRead(data) {
  return request({
    url: URL + "/mark-all-read",
    method: "put",
    data
  });
}

// 列表
export function getInfo(params) {
  return request({
    url: URL + "/client-list",
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
    url: URL + `/${data.remindId}`,
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

// 获取表
export function getlistTables() {
  return request({
    url: `${bmms}/web-even/listenItem/listTables`,
    // url: 'http://192.168.3.41:8303/web-even/listenItem/listTables',
    method: "get"
  });
}

// 获取表字段
export function getlistTableFields(params) {
  return request({
    url: `${bmms}/web-even/listenItem/listTableFields`,
    method: "get",
    params
  });
}

// 获取表达式
export function getExpressionList(params) {
  console.log(params);
  return request({
    url: `${bmms}/web-bm/engine`,
    method: "get",
    params
  });
}

// 获取未读信息条数
export function getWebCount(params) {
  return request({
    url: `${msbm}/web-wn/message/getWebCount`,
    method: "get",
    params
  });
}

// 获取护理单元详情
export function getDeptInfo(id) {
  return request({
    url: `${ifms}/web-org/depts/${id}`,
    method: "get"
  });
}
//医护公告 生效状态操作
export function operateStatusApi(data) {
  return request({
    url: URL + "/updateState",
    method: "put",
    data
  });
}
