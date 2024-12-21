import request from '@/assets/wnms/utils/request'
import { wnms } from '@/api/wnms//msgManage/commonUrl'
import qs from 'qs'
const URL = `${wnms}/web-wn/statistical/`
// 科室呼叫图数据
export function getKeshiData (data) {
  return request({
    url: URL + 'callTimesGroupByDept',
    method: 'post',
    data
  })
}

// 房间对比数据
export function getFangjianData (data) {
  return request({
    url: URL + 'callCountsGroupByRooms',
    method: 'post',
    data
  })
}

// 床位对比数据
export function getChuangWeiData (data) {
  return request({
    url: URL + 'callCountsGroupByBeds',
    method: 'post',
    data
  })
}

// 日趋势数据
export function getRiQuShiData (data) {
  return request({
    url: URL + 'callTimeGroupByDays',
    method: 'post',
    data
  })
}

// 时趋势数据
export function getShiQuShiData (data) {
  return request({
    url: URL + 'callTimeGroupByHours',
    method: 'post',
    data
  })
}

// 入住统计图
export function getRuzhuData (data) {
  return request({
    url: URL + 'occupancy-rate',
    method: 'post',
    data
  })
}

// 呼叫响应对比图
export function getHuJiaoXiangYingData (data) {
  return request({
    url: URL + 'callResponse',
    method: 'post',
    data
  })
}
