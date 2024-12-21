import request from '@/assets/wnms/utils/request'
import {
  wnms
} from '@/api/wnms//msgManage/commonUrl'

const URL = `${wnms}/web-wn/patientCaseHistory`
// 列表
export function getInfo (params) {
  return request({
    url: URL,
    method: 'get',
    params
  })
}
