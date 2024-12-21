/*
 * @Author: 翟冲
 * @Owner:
 * @Date: 2021-06-02 13:28:36
 * @LastEditTime: 2021-12-15 09:15:01
 * @LastEditors: 翟冲
 * @Description:
 * @FilePath: \yarward-qsms-frontEnd\src\api\qsms\qsmsManage\qsmsList.js
 */
import request from '@/assets/qsms/utils/request';

import {
  qsms,
  ifms
} from '@/api/qsms/commonUrl';

const URL = `${qsms}/web-qs/`;
/* 列表 */
export function getInfo (params) {
  return request({
    url: URL + 'report/answerslist',
    method: 'get',
    params
  });
}

export function Details (ids) {
  return request({
    url: URL + `papers/getPapersAnswerById/${ids}`,
    method: 'get'
  });
}

export function getDoctors (params) {
  return request({
    url: `${ifms}/web-org/emp/listSortDoctor/currentDeptByMode`,
    method: 'get',
    params
  });
}
export function getNurses (params) {
  return request({
    url: `${ifms}/web-org/emp/listSortNurse/currentDeptByMode`,
    method: 'get',
    params
  });
}

/* 2019-12-25
  更换移动护理的接口改为A10自己的接口
*/
export function getcardId (params) {
  return request({
    //  url: `${bnms}/web-bn/patient-list/by-patient-id?patientId=${id}`,
    url: `${qsms}/web-qs/patientPaper/${params.patientId}/${params.paperId}`,
    method: 'get'
  });
}
