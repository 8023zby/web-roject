import request from '@/assets/wnms/utils/request';
import {
  wnms
} from '@/api/wnms//msgManage/commonUrl';

const URL = `/csms/web-cs/screen`;
// const URL = `${hpms}/web-hp/edArticle`
// 列表
export function getInfo (params) {
  return request({
    url: URL,
    method: 'get',
    params
  });
}
// 点阵屏列表
export function litticeList (params) {
  return request({
    url: '/wnms/web-wn/dotMatrixDisplay',
    method: 'get',
    params
  });
}

// 添加
export function Add (data) {
  return request({
    url: '/upload/web-cs/screen',
    method: 'post',
    data: data.formData,
    headers: { 'Content-Type': 'multipart/form-data', 'uuid': data.uuid },
    timeout: 1000000
  });
}
// 点阵屏添加
export function latticeAdd (data) {
  return request({
    url: '/wnms/web-wn/dotMatrixDisplay',
    method: 'post',
    data
  });
}

// 修改
export function Edit (data) {
  return request({
    url: '/upload/web-cs/screen/edit',
    method: 'post',
    data: data.formData,
    headers: { 'Content-Type': 'multipart/form-data', 'uuid': data.uuid },
    timeout: 1000000
  });
}
// 点阵屏修改
export function latticeEdit (data) {
  return request({
    url: '/wnms/web-wn/dotMatrixDisplay',
    method: 'put',
    data
  });
}

// 删除
export function Delete (id) {
  return request({
    url: URL + `/${id}`,
    method: 'delete'
  });
}
// 点阵屏删除
export function latticeDelete (id) {
  return request({
    url: '/wnms/web-wn/dotMatrixDisplay/' + id,
    method: 'delete'
    // data: { id }
  });
}

// 详情
export function Details (ids) {
  return request({
    url: URL + `/${ids}`,
    method: 'get'
  });
}
// 点阵屏详情
export function latticeDetails (ids) {
  return request({
    url: `/wnms/web-wn/dotMatrixDisplay/${ids}`,
    method: 'get'
  });
}

/* 排序 */
export function Sort (data) {
  return request({
    url: URL + `/updateSort/${data.ids}/${data.sortIndexs}`,
    method: 'put'
  });
}
/* 点阵屏排序 */
export function latticeSort (data) {
  return request({
    url: '/wnms/web-wn/dotMatrixDisplay/updateSort',
    method: 'put',
    data
  });
}
/* 更新点阵屏 */
export function updateLittice (params) {
  return request({
    url: '/wnms/web-wn/dotMatrixDisplay/sendMessage',
    method: 'get',
    params
  });
}
/* 更新LED屏 */
export function updateLed (params) {
  return request({
    url: '/wnms/web-cs/screen/sendMessage',
    method: 'get',
    params
  });
}

/* 判断该科室有无LED显示屏，LCD显示屏 */
export function getDeviceType (params) {
  return request({
    url: '/wnms/web-wn/dotMatrixDisplay/getCount',
    method: 'get',
    params
  });
}

/* 查看显示屏 */
export function getDetails (params) {
  return request({
    url: URL + `/preview`,
    method: 'get',
    params
  });
}

/* 是否轮播 */
export function UpdateLoop (data) {
  return request({
    url: URL + `/${data.screenId}/${data.isLoop}`,
    method: 'put'
  });
}
/* 是否播放 */
export function UpdatePlayType (data) {
  return request({
    url: URL + `/playType/${data.screenId}/${data.playType}`,
    method: 'put'
  });
}
/* 删除文件接口 */
export function Del (params) {
  return request({
    url: URL + `/removeVideo`,
    method: 'delete',
    params
  });
}
// 获取分机公告
export function getDeviceNotice (params) {
  return request({
    url: `/iems/app-iems/device_notice`,
    method: 'get',
    params
  })
}
export function addDeviceNotice (params) {
  return request({
    url: `/iems/app-iems/device_notice`,
    method: 'post',
    data: params
  })
}
export function searchProgess (data) {
  return request({
    url: `/wnms/web-cs/screen/uploadStatus?uuid=${data.uuid}`,
    method: 'get',
    timeout: 1000000
  })
}
export function selectContentName (data) {
  return request({
    url: `/wnms/web-cs/screen/checkAddOrUpdate`,
    method: 'post',
    data,
  })
}