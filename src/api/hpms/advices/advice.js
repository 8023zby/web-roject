import request from "@/assets/hpms/utils/request";
import { wnms, bnms } from "../commonUrl";
// 获取tab
export function queryList(para) {
  return request({
    url: `${wnms}/web-wn/patientDrAdvice`,
    method: "GET",
    params: para
  });
}

export function executeTestament(id) {
  return request({
    url: `${wnms}/web-wn/patientDrAdvice/${id}`,
    method: "PUT"
  });
}

export function editRemark(data) {
  return request({
    url: `${wnms}/web-wn/patientDrAdvice`,
    method: "PUT",
    data
  });
}

// 在院患者
export function patientIn() {
  return request({
    url: `${bnms}/web-bn/patient-in-view-list/by-not-null-bed`,
    method: "GET"
    // params: para
  });
}
// 出院患者
export function patientOut() {
  return request({
    url: `${bnms}/web-bn/patient-out-list`,
    method: "GET"
    // params: para
  });
}

// 转院患者
export function patientTransfer() {
  return request({
    url: `${bnms}/web-bn/patient-transfer-list`,
    method: "GET"
    // params: para
  });
}
