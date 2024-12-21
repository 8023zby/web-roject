/**
 * Api接口统一管理
 */
import { AxiosApi, AxiosJsonApi } from './http/index'

const URL = '/passport/web-rbac/logins/'
/**
 * postLogin 登录
 * @param { username: "", password: "" }
 */
export const postLogin = params => AxiosJsonApi(URL + 'login', params)

/**
 * getPhotoCode 验证码
 * @param {}
 */
export const getPhotoCode = params => AxiosApi(URL + 'getPhotoCode', {}, 'GET', params)
// 检测是否重复
export const checkLoginGet = params => AxiosApi(URL + 'check', {}, 'GET', params)
// 获取验证码
export const getTelCode = params => AxiosApi(`${URL}getSmsCode/${params}`, {}, 'GET')
// 注册
export const regPost = params => AxiosJsonApi(`${URL}register`, params)

// 验证用户名
export const checkUserGet = params => AxiosApi(`${URL}userPhoneNum`, {}, 'GET', params)
// 验证手机号
export const checkTelGet = params => AxiosApi(`${URL}userId`, {}, 'GET', params)
// 修改密码
export const setPassword = params => AxiosApi(`${URL}pwd`, params, 'PUT')
// 找回密码
export const setPasswordGet = params => AxiosApi(`${URL}reset`, params, 'PUT')
// 保存科室
export const saveUnit = params => AxiosApi(`${URL}selectDataDeptID/${params}`)

// 手机登录
export const postLoginPhone = params => AxiosJsonApi(`${URL}/login/sms`, params)

// 获取是否显示验证码 getAuthorityMethod
export const getCodeCheck = params => AxiosApi(`/passport/web-rbac/systemConfigs/photoCodeConfig`, {}, 'GET', params)

// 获取登陆权限动作
export const getAuthorityMethod = () => AxiosApi(`${URL}button`, {}, 'GET')

// 获取授权到期预警
export const getWarning = () => AxiosApi(`${URL}auth/warning`, {}, 'GET')

// 获取上次登录的部门
export const getLastDept = () => AxiosApi(`${URL}selectDataDeptID`, {}, 'GET')

// 获取上次登陆的登录应用
export const getLastLandingEndId = () => AxiosApi(`${URL}selectLandingEndId`, {}, 'GET')

// 是否首次授权
export const searchAuth = () => AxiosApi(`${URL}auth/authorized`, {}, 'GET')

// 保存登录应用
export const loginDevice = params => AxiosApi(`${URL}auth/${params}`, {}, 'GET')
