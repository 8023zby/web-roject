import request from '@/assets/wnms/utils/request';
import {
  wnms,
  msbm
} from '@/api/wnms/msgManage/commonUrl';

const URL = `${wnms}/web-wn/remind`;

const URLNew = `${msbm}/web-even/eventConfig`;
// 列表
export function getInfo (params) {
  return request({
    url: URLNew,
    method: 'get',
    params
  });
}
// 宣教列表
export function getEducationList (params) {
  return request({
    url: '/hpms/app-hp/edArticle/listForPDA',
    method: 'get',
    params
  });
}
// 问卷列表
export function getQuestionnaireList (params) {
  return request({
    url: '/qsms/web-qs/papers/getTree',
    method: 'get',
    params
  });
}

// 获取护理单元树
export function getdepts (params) {
  return request({
    url: '/ifms/web-org/depts',
    method: 'get'
  });
}

// 添加
export function Add (data) {
  return request({
    url: URLNew,
    method: 'post',
    data
  });
}

// 修改
export function Edit (data) {
  return request({
    url: URLNew,
    method: 'put',
    data
  });
}
// 修改---本护理单元
export function EditUse (data) {
  return request({
    url: `${msbm}/web-even/eventConfig/updateByDept`,
    method: 'put',
    data
  });
}

// 删除
export function Delete (id, dept) {
  return request({
    url: URLNew + `/${id}/${dept}`,
    method: 'delete'
  });
}

// 详情
export function Details (ids) {
  return request({
    url: URLNew + `/${ids}`,
    method: 'get'
  });
}

// 获取表
export function getlistTables () {
  return request({
    url: `${msbm}/web-even/listenItem/listTables`,
    //url: 'http://192.168.3.41:8303/web-even/listenItem/listTables',
    method: 'get'
  });
}
// 获取关联表
export function getlistRelatedTables () {
  return request({
    url: `${msbm}/web-even/sqlConfig`,
    method: 'get'
  });
}

// 获取表字段
export function getlistTableFields (params) {
  return request({
    url: `${msbm}/web-even/listenItem/listTableFields`,
    method: 'get',
    params
  });
}
// 获取表达式
export function getExpressionList (params) {
  return request({
    url: `${msbm}/web-bm/engine`,
    method: 'get',
    params
  });
}

// 获取 消息类型
export function getConfigType () {
  return request({
    url: `${msbm}/web-bm/configType?type=1`,
    method: 'get'
  });
}
// 获取分机呼叫类型
export function getCallTypes () {
  return request({
    url: `${wnms}/app-wn/callType`,
    method: 'get'
  });
}
