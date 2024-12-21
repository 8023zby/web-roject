import request from '@/assets/hpms/utils/request'
import {
  bmms
} from './commonUrl'

export function getToken () {
  return request({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}

export function Uploads (data) {
  return request({
    url: `${bmms}/web-bm/file`,
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

// 删除服务器文件
export function DeleteFileds (params) {
  // http://192.168.30.168:8090/pages/viewpage.action?pageId=22547666
  return request({
    url: `${bmms}/web-bm/file`, //
    method: 'DELETE',
    params
  })
}
export function all (promiseAll) {
  return request.all(promiseAll)
}
