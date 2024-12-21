import request from "@/assets/msms/utils/request";

export function getToken () {
  return request({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}

export function Uploads (data) {
  return request({
    url: '/bmms/web-bm/file',
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

export function all (promiseAll) {
  return request.all(promiseAll)
}
