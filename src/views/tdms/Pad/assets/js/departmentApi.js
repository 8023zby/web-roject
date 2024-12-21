import { AxiosApi } from '../../../../../api/tdms/http'

/**
 * 获取部门树
 * @returns {Promise}||{}
 */
export const $getDepartTree = p => AxiosApi('/ifms/app-org/depts', {}, 'GET', p)
// 请求护理单元
export const GetUnit = () => {
  let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || {}
  let orgId = orgInfo.orgId || ''
  return new Promise((resolve, reject) => {
    AxiosApi(`/ifms/app-org/depts/${orgId}/list`, {}, 'GET', { page: 1, size: 1000 }).then(res => {
      let { data } = res
      resolve(data || [])
    })
  })
}
export const $getLocationsTree = p => AxiosApi('/ifms/app-org/locations', {}, 'GET', p)

// 请求床位
export const GetBed = p => AxiosApi('/ifms/app-org/beds', {}, 'GET', p)

// 请求房间
export const GetRoom = p => AxiosApi('/ifms/app-org/rooms', {}, 'GET', p)
