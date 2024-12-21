import request from '@/utils/request'

/* 获取数据 */
export function getInfo (token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
/* 添加数据 */
export function wareAdd (data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout () {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
