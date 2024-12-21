export const extendItem = {
  'blood_sugar': [
    { code: 'measurePeriod', title: '血糖测量时刻' },
    { code: 'measureResult', title: '血糖测量结果' },
    { code: 'glucometerNumber', title: '血糖仪编号' }
    // { code: 'nurseName', title: '血糖护士签名' }
  ],
  bracelet: [
    { code: 'energyConsumption', title: '消耗能量' },
    { code: 'stepNumber', title: '步数' },
    { code: 'walkingDistance', title: '走动距离' }
    // { code: 'heartRate', title: '心跳' }
  ]
}

export const bloodSugarTime = {
  1: '临时',
  2: '空腹',
  3: '早餐后',
  4: '午餐前',
  5: '午餐后',
  6: '晚餐前',
  7: '晚餐后',
  8: '睡前',
  9: '夜间'
}
