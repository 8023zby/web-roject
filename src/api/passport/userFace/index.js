/**
 * Api接口统一管理
 */
import { AxiosJsonApi, AxiosApi } from '../http/index'

// 获取生物识别数据
export const getUserFace = (data) => AxiosApi(`/passport/web-rbac/biometric/${data.userId}/${data.type}`, {}, 'GET')

// 生物识别上传
export const saveUserFace = (data) => AxiosJsonApi(`/passport/web-rbac/biometric`, data, 'POST')

// 生物识别修改
export const updateUserFace = (data) => AxiosJsonApi(`/passport/web-rbac/biometric/${data.biometricId}`, data, 'PUT')

// 生物识别删除
export const deleteUserFace = (data) => AxiosApi(`/passport/web-rbac/biometric/${data.userId}/${data.biometricId}`, {}, 'DELETE')
