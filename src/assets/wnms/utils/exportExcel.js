import axios from 'axios'
/**
 * @author: chenwenliang
 * @description:
 * @Date: 2019/06/06 11:05
 */

// 导出表格
export function exportExecl (url, param) {
  axios({
    method: 'GET',
    url: url,
    params: param,
    responseType: 'blob'
  }).then(res => {
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    window.location.href = url
  }).catch(err => {
    console.log(err)
  })
}
