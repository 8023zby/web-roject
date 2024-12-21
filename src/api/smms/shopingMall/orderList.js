import request from '@/assets/smms/utils/request'
import { smms } from '../commonUrl'
export function queryList(query) {
  return request({
    url: `${smms}/web-sm/order`,
    method: 'get',
    params: query
  })
}
export function exportOrder(query) {
  return request({
    url: '/unifiedApi/web-sm/order/exportOrder',
    method: 'get',
    params: query,
    responseType: 'blob',
    headers: {
      responseType: 'blob'
    }
  })
}

export function updateState(data) {
  return request({
    url: `${smms}/web-sm/order`,
    method: 'put',
    data
  })
}
