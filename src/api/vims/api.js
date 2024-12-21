/*
 * @Author: 刘慧
 * @Owner: 刘慧
 * @Date: 2022-05-24 09:50:55
 * @LastEditTime: 2022-09-07 17:17:44
 * @LastEditors: 刘慧
 * @Description:
 * @FilePath: \yarward-vims-frontEnd\src\api\vims\api.js
 */
import {
  del,
  get,
  post,
  put
} from './http';

/** ****************************探视记录 START*************************** */
// 探视记录列表
export const getVisitRecordList = (data) => {
  return post('/avcs/mvp/callRecord/common', data);
};
export const videoTranscode = (data) => {
  return post('/mvp/req_transcoding', data);
};
/** ****************************探视记录 END*************************** */

/** ****************************亲友管理 START*************************** */
// 科室列表
export const getDeptList = () => {
  return get('/ifms/web-org/depts');
};
// 查询亲友列表
export const getPatientList = (data) => {
  return post('/ivms/web/patient/list', data);
};
// 解绑亲属
export const unbindRelation = (data) => {
  return del('/ivms/web/patient/unbind', data);
};
/** ****************************亲友管理 END*************************** */

/** ****************************探视配置 START*************************** */
// 获取配置信息
export const getConfig = (data) => {
  return post('/ivms/web/getConfig', data);
};
// 更新配置
export const updateConfig = (data) => {
  return put('/ivms/web/updateConfig', data);
};
/** ****************************探视配置 END*************************** */

export default {
  getVisitRecordList,
  getPatientList,
  getDeptList,
  unbindRelation,
  getConfig,
  updateConfig,
  videoTranscode
};
