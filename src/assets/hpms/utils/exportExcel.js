import axios from 'axios'
/**
 * @author: chenwenliang
 * @description:
 * @Date: 2019/06/06 11:05
 */

// 导出表格
export function exportExecl (url, param, fileName) {
  axios({
    method: 'GET',
    url: url,
    params: param,
    responseType: 'blob'
  }).then(res => {
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
    let downloadElement = document.createElement('a')
    let href = window.URL.createObjectURL(blob)
    downloadElement.href = href
    downloadElement.download = fileName + '.xls'
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(href) // 释放掉blob对象
  }).catch(err => {
    console.log(err)
  })
}
