import request from '@/assets/qsms/utils/request'
import {
  qsms
} from '@/api/qsms/commonUrl'

const BASE_URL = `${qsms}/web-qs`
const URL = BASE_URL + `/questionLibrary`

// 获取题库列表
export function fetchQuestionLibrary (query) {
  return request({
    url: URL,
    method: 'GET',
    params: query
  })
}

// 新建题库问题
export function addQuestionLibrary (data) {
  return request({
    url: URL,
    method: 'POST',
    data
  })
}

// 编辑题库问题
export function editQuestionLibrary (data) {
  return request({
    url: URL,
    method: 'PUT',
    data
  })
}

// 删除题库问题
export function delQuestionLibrary (param) {
  return request({
    url: `${URL}/${param}`,
    method: 'DELETE'
  })
}
