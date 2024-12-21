/**
 * @author: chenwenliang
 * @description:
 * @Date: 2019/5/13 14:11
 */

export default function dateFormat (date, fmt) {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

/**
 * @version: V1.0
 * @packageName: T week(周) month(月) 默认是一个月
 * 使用说明：只使用周 T 传入 week即可,
 *          只使用月 T 传入 month nums 是几个月 比如一个月是1 二个月是2 默认是1个月
 * @description: 这是一个获取时间函数
 * @data: 2019-07-10 10:20
 * @special 如果有特殊使用请自行改造 哈
 **/
export function getOneDate (T = 'month', nums = 1, start = new Date(), end = new Date()) {
  if (T === 'week') {
    // 一个周
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
  } else if (T === 'month') {
    // 一个月
    // start.setTime(start.getTime() - 3600 * 1000 * 24 * (nums * 30))

    start.setMonth(start.getMonth() - nums)
  }

  return [dateFormat(start, 'yyyy-MM-dd'), dateFormat(end, 'yyyy-MM-dd')]
}

export function doHandleDate (val = 0) {
  var myDate = new Date()
  var tYear = myDate.getFullYear()
  var tMonth = myDate.getMonth()

  var m = tMonth + 1
  if (val !== 0) {
    m = m - val
  }
  if (m.toString().length === 1) {
    m = '0' + m
  }
  return tYear + '-' + m
}
export function msToDate (msec) {
  const datetime = new Date(msec)
  const year = datetime.getFullYear()
  const month = datetime.getMonth()
  const date = datetime.getDate()
  const hour = datetime.getHours()
  const minute = datetime.getMinutes()
  const second = datetime.getSeconds()

  const result1 = year +
    '-' +
    ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
    '-' +
    ((date + 1) < 10 ? '0' + date : date) +
    ' ' +
    ((hour + 1) < 10 ? '0' + hour : hour) +
    ':' +
    ((minute + 1) < 10 ? '0' + minute : minute) +
    ':' +
    ((second + 1) < 10 ? '0' + second : second)

  const result2 = year +
    '-' +
    ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
    '-' +
    ((date + 1) < 10 ? '0' + date : date)

  const result = {
    hasTime: result1,
    withoutTime: result2
  }

  return result
}
