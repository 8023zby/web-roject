import { AxiosApi, AxiosJsonApi } from '../http'

/**
 *
 * @returns {Promise}||{}
 */
export const $getLocationsTree = p => AxiosApi('/ifms/web-org/locations', {}, 'GET', p)
export const $getLocationsLevel = p => AxiosApi('/ifms/web-org/locationLevels', {}, 'GET', p)
export const $addLocationsTree = p => AxiosJsonApi('/ifms/web-org/locations', p)
export const $editLocationsTree = p => AxiosJsonApi('/ifms/web-org/locations', p, 'PUT')
export const $delLocationsTree = p => AxiosApi(`/ifms/web-org/locations/${p}`, {}, 'DELETE')
