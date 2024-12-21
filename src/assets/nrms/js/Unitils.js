// 时间方法
export const DateFormate = {
  // 格式化时间
  getNowFormatDate (date) {
    if (!date) {
      date = new Date()
    }
    let seperator1 = '-'
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let strDate = date.getDate()
    let h = date.getHours()
    let m = date.getMinutes()
    let s = date.getSeconds()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    if (h >= 0 && h <= 9) {
      h = '0' + h
    }
    if (m >= 0 && m <= 9) {
      m = '0' + m
    }
    if (s >= 0 && s <= 9) {
      s = '0' + s
    }
    let currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + h + ':' + m
    return currentdate
  }
}
