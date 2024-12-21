/*
 * @Author: 翟冲
 * @Owner:
 * @Date: 2021-06-02 13:25:30
 * @LastEditTime: 2021-12-15 09:12:51
 * @LastEditors: 翟冲
 * @Description:
 * @FilePath: \yarward-smms-frontEnd\src\api\smms\wardRoundRecord.js
 */
import request from '@/assets/smms/utils/request';

const BASE_URL = `/web-wn`;
const URL = BASE_URL + `/roomCheckOrder`;

// 获取列表
export function queryListApi (query) {
  return request({
    url: URL,
    method: 'GET',
    params: query
  });
}

// 获取房间列表
export function queryRoomListApi (query) {
  return request({
    url: '/ifms/web-org/rooms',
    method: 'GET',
    params: query
  });
}

// 获取护士列表
export function queryNurseListApi (query) {
  return request({
    url: '/ifms/web-org/emp/currentDeptByMode',
    method: 'GET',
    params: query
  });
}
