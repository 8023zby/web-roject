// 获取日期[日志查询]
export function GetDateByType (tt) {
  let sd = new Date()
  sd.setDate(sd.getDate() - 1)
  let sy = sd.getFullYear()
  let sm = sd.getMonth() + 1
  let sdd = sd.getDate()
  let nowDate = new Date().getDate()
  let weekFirstDay = (new Date(sd - (sd.getDay() - 1) * 86400000)).getDate()

  let myDate = new Date()
  let mDD = myDate.getMonth() + 1

  if (sm >= 1 && sm <= 9) {
    sm = '0' + sm
  }
  if (mDD >= 1 && mDD <= 9) {
    mDD = '0' + mDD
  }
  if (sdd >= 0 && sdd <= 9) {
    sdd = '0' + sdd
  }
  if (weekFirstDay >= 0 && weekFirstDay <= 9) {
    weekFirstDay = '0' + weekFirstDay
  }
  if (nowDate >= 0 && nowDate <= 9) {
    nowDate = '0' + nowDate
  }

  // 昨天
  if (tt + '' === '0') {
    return sy + '-' + sm + '-' + sdd
  } else if (tt + '' === '1') { // 本周开始
    return sy + '-' + mDD + '-' + weekFirstDay
  } else if (tt + '' === '2') { // 本月开始
    return sy + '-' + mDD + '-01'
  } else if (tt + '' === '3') { // 今天
    return sy + '-' + mDD + '-' + nowDate
  }
}
// 为空就过滤
export const filterData = (data) => {
  let temp = {}
  for (let p in data) {
    if (data[p] === '') {
      continue
    }
    temp[p] = data[p]
  }
  return temp
}
