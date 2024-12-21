import request from '@/assets/qsms/utils/request'
import {
  qsms
} from '@/api/qsms/commonUrl'

const URL = `${qsms}/web-qs/report/`
/* 列表 */
export function getInfo (params) {
  return request({
    url: URL + '/optionsStatistics',
    method: 'get',
    params
  })
}

/* 获取线图 */
export function getLineChar (params) {
  return request({
    url: URL + `monthly`,
    method: 'get',
    params
  })
}
/* 获取柱状图 */
export function getBarChar (params) {
  return request({
    url: URL + `wholeHospital`,
    method: 'get',
    params
  })
}
/* 详情统计 */
export function getDetails (params) {
  return request({
    url: URL + `optionsDetails`,
    method: 'get',
    params
  })
}
