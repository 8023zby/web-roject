/*
 * @Author: 翟冲
 * @Owner:
 * @Date: 2021-06-16 09:15:52
 * @LastEditTime: 2022-12-08 15:48:20
 * @LastEditors: 翟冲
 * @Description:
 * @FilePath: \yarward-wnms-frontEnd\src\views\wnms\x28s\api\csmsConfig.js
 */
import request from '@/assets/wnms/utils/request';

const URL = `/csms/web-cs/param`;

// 列表
export function Query (params) {
  return request({
    url: URL + '/' + params,
    method: 'GET'
  });
}

// 修改
export function Edit (data) {
  return request({
    url: URL,
    method: 'POST',
    data
  });
}
// 列表
export function Queryx28sn (params) {
  return request({
    url: '/tdms/web-wn/systemConfig/passagewayMonitor',
    method: 'GET',
    params
  });
}

// x28sn
export function Editx28sn (data) {
  return request({
    url: '/tdms/web-wn/systemConfig/passagewayMonitor',
    method: 'POST',
    data
  });
}

// 获取语音播报列表
export function QueryVoiceBroadcastList () {
  return request({
    url: URL + '/broadcast',
    method: 'GET'
  });
}

// 获取模板列表
export function QuerycardTemplateList () {
  return request({
    url: URL + '/pictures',
    method: 'GET'
  });
}

// 上传图片
export function upload () {
  return request({
    url: URL + '/upload',
    method: 'POST'
  });
}

// 上传图片
export function Reboot (params) {
  return request({
    url: URL + '/reboot/' + params,
    method: 'POST'
  });
}
// 获取机构数据
export function iconConfig (params) {
  return request({
    url: '/passport/web-rbac/iconConfig',
    method: 'GET'
  });
}
// x28sn重启

export function RebootX28sn (data) {
  return request({
    url: '/tdms/web-wn/systemConfig/broad',
    method: 'POST',
    data
  });
}
