import request from '@/assets/wnms/utils/request'

// 查询 床垫列表
export function getBedcardRunList (data) {
  return request({
    url: '/wsms/app-check/flushRebootRecord?page=' + data.page + '&size=' + data.size,
    method: 'post',
    data
  })
}

// 查询床位
export function getBedsList (params) {
  return request({
    url: '/ifms/web-org/beds',
    method: 'get',
    params
  })
}

export function getdepts (params) {
  return request({
    url: '/ifms/web-org/depts',
    method: 'get',
    params
  })
}
