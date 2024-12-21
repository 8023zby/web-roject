import request from "@/assets/wnms/utils/request";
import { wnms, ifms } from "@/api/wnms//msgManage/commonUrl";

const URL = `${wnms}/app-wn/nurseInOrOut`;
// 列表
export function getInfo (params) {
  return request({
    url: URL,
    method: "get",
    params
  });
}

// 获取房间列表
export function queryRoomListApi (params) {
  return request({
    url: `${ifms}/web-org/rooms/currentDept`,
    method: 'GET',
    params: params
  });
}

// 获取护士列表
export function queryNurseListApi (params) {
  return request({
    url: `${ifms}/web-org/emp/listSortNurse/currentDeptByMode`,
    method: 'GET',
    params: params
  });
}
