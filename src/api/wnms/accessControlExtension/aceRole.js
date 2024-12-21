/*
 * @Author: 范博
 * @Owner: 
 * @Date: 2022-05-12 14:02:44
 * @LastEditTime: 2022-05-27 16:59:03
 * @LastEditors: 范博
 * @Description: 
 * @FilePath: \yarward-wnms-frontEnd\src\api\wnms\accessControlExtension\aceRole.js
 */
import request from '@/assets/wnms/utils/request';
const URL = '/tdms/web-wn/entranceGuardRole';

export function ListEntranceGuardDeviceInfo (params) {
  return request({//?deviceType=wnEntranceGuard
    url: 'passport/web-org/device/dept/all',
    method: 'get',
    params: params
  });
}

export function ListInpatientAceRecord (data) {
  return request({
    url: '/tdms/web-td/entrance/list',
    method: 'post',
    data
  });
}

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
export function DetailUserRoleAuthInfo (params) {
  return request({
    url: `${URL}/${params}`,
    method: 'get',
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