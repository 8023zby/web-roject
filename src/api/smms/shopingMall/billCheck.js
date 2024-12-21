/**
 * @author: zhangyh-k@glondon.com
 * @description:
 * @Date: 2019/5/13 9:49
 */
import request from '@/assets/smms/utils/request'
import { smms } from '../commonUrl'
export function queryBill(param) {
  return request({
    url: `${smms}/web-sm/shopAccounts`,
    method: 'get',
    params: param
  })
}

export function billDetails(param) {
  return request({
    url: `${smms}/web-sm/order/listAccounts`,
    method: 'get',
    params: param
  })
}

export function saveReplay(data) {
  return request({
    url: `${smms}/web-sm/order/saveReply`,
    method: 'put',
    data: data
  })
}
