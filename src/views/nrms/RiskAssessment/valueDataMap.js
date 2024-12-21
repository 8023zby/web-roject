const moment = require('moment')

const keyMap = new Map([
  // 日期
  ['date', [
    '1617787638000_6562', // 跌倒
    '1617764922000_30984', // 压疮
    '1618026429000_92645', // 失禁
    '1618197789000_78384', // 自理能力 / 误吸窒息
    '1617262462000_44167' // 非计划拔管-疼痛-吞咽-VTE-GSC-Ramsay-泌尿-营养
  ]],
  // 时间
  ['time', [
    '1617787638000_40025', // 跌倒
    '1617764922000_28773', // 时间
    '1618026429000_44985', // 失禁
    '1618197789000_64140', // 自理能力 / 误吸窒息
    '1617262462000_96823' // 非计划-疼痛-吞咽-VTE-GSC-Ramsay-泌尿-营养
  ]],
  // 总分
  ['total', [
    '1617679267000_30993', // 非计划-疼痛-吞咽-VTE-GSC-Ramsay-泌尿-营养
    '1617764922000_69465', // 压疮
    '1617787638000_35931', // 跌倒
    '1618026429000_26707', // 失禁
    '1618197789000_87641' // 自理能力 / 误吸窒息
  ]],
  // 签名
  ['sign', [
    '1617764922000_87972', // 压疮签名
    '1618026429000_98093', // 失禁
    '1618197789000_97383', // 自理能力 / 误吸窒息
    '1617679267000_90450', // 非计划-疼痛-吞咽-VTE-GSC-Ramsay-泌尿-营养
    '1617787638000_78421' // 跌倒
  ]],
  // 风险等级
  ['riskLevel', [
    '1617787638000_41352', // 跌倒
    '1617764922000_58371', // 压疮
    '1618026429000_59026', // 失禁
    '1618197789000_72724', // 自理能力 / 误吸窒息
    '1617262462000_93802' // 非计划-VTE-GSC-Ramsay-泌尿
  ]],
  // 颜色
  ['levelColor', [
    '1617927591000_75018', // 跌倒
    '1617930543000_44678', // 压疮
    '1618026429000_77981', // 失禁
    '1618197789000_31104', // 自理能力 / 误吸窒息
    '1617930427000_15821' // 非计划-VTE-GSC-Ramsay-泌尿
  ]]
])

export const getColumnData = (valueData = [], index, arr) => {
  let columnValue = []
  let time = ''
  let date = ''
  valueData.map(v => {
    if (keyMap.get('date').indexOf(v.key) >= 0) {
      // 日期
      if (!v.value) {
        v.value = moment().format('YYYY-MM-DD')
      }
      date = v.value
    }
    if (keyMap.get('time').indexOf(v.key) >= 0) {
      // 时间
      if (!v.value) {
        v.value = moment().format('HH:mm:ss')
      }
      time = v.value
    }
    if (keyMap.get('total').indexOf(v.key) >= 0) {
      // 总分
      columnValue.push({
        key: 'grade',
        value: v.value || v.value === 0 ? v.value : ''
      })
    }
    if (keyMap.get('riskLevel').indexOf(v.key) >= 0) {
      // 风险等级
      columnValue.push({
        key: 'riskLevel',
        value: v.value
      })
    }
    if (keyMap.get('levelColor').indexOf(v.key) >= 0) {
      // 颜色
      columnValue.push({
        key: 'levelColor',
        value: v.value
      })
    }
    if (keyMap.get('sign').indexOf(v.key) >= 0) {
      const empInfo = JSON.parse(localStorage.getItem('empInfo'))
      if (!v.value) v.value = empInfo.empName
      if (arr.indexOf(index) >= 0) v.value = empInfo.empName
      columnValue.push({
        key: 'assessPerson',
        value: v.value
      })
    }
  })
  let assDate = ''
  assDate = date + ' ' + time
  columnValue.push({
    key: 'assessmentTime',
    value: assDate
  })
  return {
    columnValue,
    assDate
  }
}
