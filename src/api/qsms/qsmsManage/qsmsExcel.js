import request from '@/assets/qsms/utils/request'

import {
  qsms
} from '@/api/qsms/commonUrl'

const URL = `${qsms}/web-qs/`
/*
导出EXCEL */
export function ApiExportExcel (params) {
  return request({
    url: URL + 'rePaperPerson',
    method: 'GET',
    params: params
  })
}
// 查询文件是否生成
export function ApiCheckExcel (params) {
  return request({
    url: URL + 'rePaperPerson/checkExcel',
    method: 'GET',
    params: params
  })
}
