/*
 * @Author: 翟冲
 * @Owner:
 * @Date: 2023-02-01 09:31:41
 * @LastEditTime: 2023-03-08 15:54:29
 * @LastEditors: 翟冲
 * @Description:
 * @FilePath: \yarward-wnms-frontEnd\src\api\wnms\deviceVersion\deviceVersionApi.js
 */
import request from "@/assets/wnms/utils/request";
import { wnms, ifms, wnas, msbm, tdms } from "@/api/wnms/msgManage/commonUrl";

const URL = `${tdms}/web-td/device/version`;
// 列表
export function getInfo (params) {
  return request({
    url: URL,
    method: "get",
    params
  });
}
// 添加
export function Add (data) {
  return request({
    url: URL,
    method: "post",
    data
  });
}

// 修改
export function Edit (data) {
  return request({
    url: URL + `/${data.messageId}`,
    method: "put",
    data
  });
}
// 删除
export function Delete (id) {
  return request({
    url: URL + `/${id}`,
    method: "delete"
  });
}

// 详情
export function Details (ids) {
  return request({
    url: URL + `/${ids}`,
    method: "get"
  });
}

// 修改
export function IsEdit (messageId) {
  return request({
    url: URL + `/${messageId}`,
    method: "get"
  });
}

// 新接口-wnas 床位管理接口
export function getBedList (params) {
  return request({
    url: `${wnas}/device-info/receive-info`,
    method: "get",
    params
  });
}

// 新接口-wnas 获取当前的推送详情 //推送情况
export function getStatus (params) {
  return request({
    url: `${URL}/status`,
    method: "get",
    params
  });
}

// 获取安装包
export function getDevicePackage (params) {
  return request({
    url: `/tdms/web-td/device/package`,
    method: "get",
    params
  });
}

// 获取所有的护理单元

export function getNursinglIist (orgid) {
  return request({
    url: `${ifms}/web-org/depts/${orgid}/list`,
    method: "get"
  });
}

//===========类型=======
//  终端类型
export function getDeviceType (params) {
  return request({
    url: ` ${tdms}/web-td/device/version/device/type`,
    method: "get",
    params
  });
}

//  终号类型  deviceType
export function getdeviceModelType (params) {
  return request({
    url: ` ${tdms}/web-td/device/deviceModel`,
    method: "get",
    params
  });
}

//  终端版本
export function getDeviceVersionType (params) {
  return request({
    url: ` ${tdms}/web-td/device/version/type`,
    method: "get",
    params
  });
}

//  升级
export function UPdatePromote (data) {
  return request({
    url: ` ${tdms}/web-td/device/version/upgrade`,
    method: "post",
    data
  });
}

//  导出
export function exportExcel (data) {
  return request({
    url: ` ${tdms}/web-td/device/version/export`,
    method: "post",
    data
  });
}
