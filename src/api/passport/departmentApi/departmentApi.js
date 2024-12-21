import { AxiosApi, AxiosJsonApi } from '../http'

/**
 * 获取部门树
 * @returns {Promise}||{}
 */
export const $getDepartTree = p => AxiosApi('/ifms/web-org/depts', {}, 'GET', p)
export const $addDepartTree = p => AxiosJsonApi('/ifms/web-org/depts', p)
export const $delDepartTree = p => AxiosApi(`/ifms/web-org/depts/${p}`, {}, 'DELETE')
export const $departDetails = p => AxiosApi(`/ifms/web-org/depts/${p}`, {}, 'GET')
export const $editDepart = p => AxiosApi('/ifms/web-org/depts', p, 'PUT')
