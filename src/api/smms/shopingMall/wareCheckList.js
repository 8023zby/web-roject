import request from '@/assets/smms/utils/request'
import { smms } from '../commonUrl'
export function queryList(query) {
  return request({
    url: `${smms}/web-sm/wareAuditLog/`,
    method: 'get',
    params: query
  })
}
