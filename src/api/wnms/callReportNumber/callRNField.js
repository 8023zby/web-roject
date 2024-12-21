/*
 * @Author: 范博
 * @Owner: 
 * @Date: 2021-12-24 14:39:25
 * @LastEditTime: 2022-02-08 17:18:07
 * @LastEditors: 范博
 * @Description: 
 * @FilePath: \yarward-wnms-frontEnd\src\api\wnms\callReportNumber\callRNField.js
 */
import request from '@/assets/wnms/utils/request';
import {
  wnms
} from '@/api/wnms//msgManage/commonUrl';

const URL = `${wnms}/web-wn/reportNumberField`;
const ConfigUrl = `${wnms}/web-wn/reportNumberConfig`;
const DisplayConfigUrl = `${wnms}/web-wn/reportNumberShowConfig`;

// 列表
export function ListInfo (params) {
  return request({
    url: URL,
    method: 'get',
    params: params
  });
}

//添加报号字段
export function AddInfo (data) {
  return request({
    url: URL,
    method: 'post',
    data
  });
}

//字段详情
export function DetailInfo (params) {
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


//添加报号配置
export function AddRNConfigInfo (data) {
  return request({
    url: ConfigUrl,
    method: 'post',
    data
  });
}

//报号显示配置保存
export function AddRNDisplayConfigInfo (data) {
  return request({
    url: DisplayConfigUrl,
    method: 'post',
    data
  });
}

export function QueryRNConfig (param) {
  return request({
    url: `${ConfigUrl}/${param}`,
    method: 'get',
  });
}

export function QueryRNShowConfig (param) {
  return request({
    url: `${DisplayConfigUrl}/${param}`,
    method: 'get'
  });
}

// 文件上传
export function uploadApi (param) {
  return request({
    url: `${wnms}/Upload`,
    method: 'POST'
  });
}

export function hasRNFieldInfoApi (data) {
  return request({
    url: URL,
    method: 'put',
    data
  });
}
