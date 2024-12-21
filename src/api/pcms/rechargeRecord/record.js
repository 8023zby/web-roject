/**
 * @author: zhangyh-k@glondon.com
 * @description:
 * @Date: 2019/5/13 9:49
 */
import request from '@/assets/pcms/utils/request'
import { pcms } from '../commonUrl'
export function queryRecord(param) {
  return request({
    url: `${pcms}/web-pc/hospital`,
    method: 'get',
    params: param
  })
}
