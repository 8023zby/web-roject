// 验证手机号
export function isvalidPhone (str) {
  const reg = /^1\d{10}$/
  return reg.test(str)
}
// 验证大于0的整数
export function isvalInteger (str) {
  let reg = /^[1-9]\d*$/
  return reg.test(str)
}
// 验证用户名，限制2-20位，必须包含字母、数字组成，特殊字符可输入
export function isvalUserName (str) {
  let reg = /^[0-9A-Za-z]{6,20}$/
  return reg.test(str)
}

// 验证手机号
export function validTel () {
  let validPhone = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入手机号码'))
    } else if (!isvalidPhone(value)) {
      callback(new Error('请输入正确的11位手机号码'))
    } else {
      callback()
    }
  }
  return validPhone
}
// 验证密码，6-20位字母+数字，区分大小写
export function isvalUserPwd (str) {
  let reg = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z]{6,20}$/
  return reg.test(str)
}
// 验证密码，1-20位
export function isvalUserPwdLen (str) {
  let reg = /^.{1,20}$/
  return reg.test(str)
}
