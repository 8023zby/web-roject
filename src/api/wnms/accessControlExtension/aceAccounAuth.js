/*
 * @Author: 范博
 * @Owner: 
 * @Date: 2022-05-12 14:02:44
 * @LastEditTime: 2022-05-18 13:25:22
 * @LastEditors: 范博
 * @Description: 
 * @FilePath: \yarward-wnms-frontEnd\src\api\wnms\accessControlExtension\aceAccounAuth.js
 */
import request from '@/assets/wnms/utils/request';

const URL = '/tdms/web-wn/reDeviceUser';

export function ListInfo (params) {
  return request({
    url: URL,
    method: 'get',
    params: params
  });
}

export function AddInfo (data) {
  return request({
    url: URL,
    method: 'post',
    data
  });
}
//详情
//http://localhost:81/tdms/web-wn/reDeviceUser?id=000a84de0d8a45adbba4a76c97a5f248
export function DetailInfo (params) {
  return request({
    url: `${URL}/${params}`,
    method: 'get'
  });
}

//删除
export function DeleteInfo (param) {
  return request({
    url: `${URL}/${param}`,
    method: 'DELETE'
  });
}

//修改
export function EditInfo (data) {
  return request({
    url: URL,
    method: 'PUT',
    data
  });
}

export function BatchEditInfo (data) {
  return request({
    url: `${URL}/batch`,
    method: 'PUT',
    data
  });
}
export function GetDeptList (params) {
  return request({
    url: '/ifms/web-org/depts',
    method: 'get'
  });
}