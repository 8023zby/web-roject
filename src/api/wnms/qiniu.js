import request from '@/assets/wnms/utils/request'

export function getToken () {
  return request({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}

export function Uploads (data) {
  return request({
    url: '/bmms/web-bm/file', //
    method: 'post',
    data,
    timeout: 0
  })
}
export function Uploads2 (data) {
  return request({
    url: '/bmms/web-bm/file/batch', //
    method: 'post',
    data,
    timeout: 0
  })
}

export function getUploads (url) {
  return request({
    url: url, //
    method: 'get'
  })
}


// 图片压缩上传
export function ImageUpload (url) {
  return request({
    url: '/bmms/web-bm/file/scale', //
    method: 'get'
  })
}

// 获取预约情况数据列表
export function getAppointList (data) {
  return request({
    url: "/nrms/web-nr/appoint/query-list",
    method: 'post',
    data: data
  })
}


export function all (promiseAll) {
  return request.all(promiseAll)
}
