
export const valueMap = new Map([
  [
    '1603160240000_48222',
    (columnValue, value) => {
      columnValue.push({
        key: 'assDate',
        value
      })
    }
  ],
  [
    '1603160240000_2013',
    (columnValue, value) => {
      columnValue.push({
        key: 'assTime',
        value
      })
    }
  ],
  [
    '1603160240000_4706',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'assProject', 'left')
    }
  ],
  [
    '1603160240000_82149',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'assProject', 'right')
    }
  ],
  [
    '1603160240000_32374',
    (columnValue, value) => {
      valueMapFn(columnValue, '左', 'position', 'left')
    }
  ],
  [
    '1603160240000_78917',
    (columnValue, value) => {
      valueMapFn(columnValue, '右', 'position', 'right')
    }
  ],
  [
    '1603160240000_99233',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'popliteal', 'left')
    }
  ],
  [
    '1603160240000_74031',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'popliteal', 'right')
    }
  ],
  [
    '1603160240000_13043',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'acrotarsium', 'left')
    }
  ],
  [
    '1603160240000_97916',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'acrotarsium', 'right')
    }
  ],
  [
    '1603160240000_34019',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'leg', 'left')
    }
  ],
  [
    '1603160240000_22798',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'leg', 'right')
    }
  ],
  [
    '1603160240000_77',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'homan', 'left')
    }
  ],
  [
    '1603160240000_91560',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'homan', 'right')
    }
  ],
  [
    '1603160240000_22243',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'pain', 'left')
    }
  ],
  [
    '1603160240000_22624',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'pain', 'right')
    }
  ],
  [
    '1603160240000_10637',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'swelling', 'left')
    }
  ],
  [
    '1603160240000_75449',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'swelling', 'right')
    }
  ],
  [
    '1603160240000_79917',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'skin', 'left')
    }
  ],
  [
    '1603160240000_84254',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'skin', 'right')
    }
  ],
  [
    '1603160240000_72145',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'paralysis', 'left')
    }
  ],
  [
    '1603160240000_14072',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'paralysis', 'right')
    }
  ],
  [
    '1603160240000_16304',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'shank', 'left')
    }
  ],
  [
    '1603160240000_75602',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'shank', 'right')
    }
  ],
  [
    '1603160240000_50110',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'problem', 'left')
    }
  ],
  [
    '1603160240000_61318',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'problem', 'right')
    }
  ],
  [
    '1603160240000_92957',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'assenssment', 'left')
    }
  ],
  [
    '1603160240000_26955',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'assenssment', 'right')
    }
  ],
  [
    '1603160240000_42084',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'measures', 'left')
    }
  ],
  [
    '1603160240000_69124',
    (columnValue, value) => {
      valueMapFn(columnValue, value, 'measures', 'right')
    }
  ]
])
const valueMapFn = (columnValue, value, key, position) => {
  if (
    columnValue.every((item) => {
      if (item.key == key) {
        switch (position) {
          case 'left':
            item.value.push({
              position: 'left',
              value
            })
            break
          case 'right':
            item.value.push({
              position: 'right',
              value
            })
            break
          default:
            break
        }
        return false
      }
      return true
    })
  ) {
    switch (position) {
      case 'left':
        columnValue.push({
          key,
          value: [{
            position: 'left',
            value
          }]
        })
        break
      case 'right':
        columnValue.push({
          key,
          value: [{
            position: 'right',
            value
          }]
        })
        break
      default:
        columnValue.push({
          key,
          value: [{
            position: 'left',
            value
          }]
        }, {
          key,
          value: [{
            position: 'right',
            value
          }]
        })
        break
    }
  }
}
export const tableList = [
  {
    name1: '日期',
    name2: '日期',
    list: [],
    name1Key: 'assDate',
    name2Key: 'assDate'
  },
  {
    name1: '时间',
    name2: '时间',
    list: [],
    name1Key: 'assTime',
    name2Key: 'assTime'
  },
  {
    name1: '评估项目',
    name2: '评估项目',
    list: [],
    name1Key: 'assProject',
    name2Key: 'assProject'
  },
  {
    name1: '部位（下肢）',
    name2: '部位（下肢）',
    list: [],
    name1Key: 'position',
    name2Key: 'position'
  },
  {
    name1: '腘动脉搏动',
    name2: '正常',
    list: [],
    name1Key: 'popliteal',
    name2Key: '1'
  },
  {
    name1: '腘动脉搏动',
    name2: '变弱',
    list: [],
    name1Key: 'popliteal',
    name2Key: '2'
  },
  {
    name1: '腘动脉搏动',
    name2: '不能触及',
    list: [],
    name1Key: 'popliteal',
    name2Key: '3'
  },
  {
    name1: '足背动脉搏动',
    name2: '正常',
    list: [],
    name1Key: 'acrotarsium',
    name2Key: '1'
  },
  {
    name1: '足背动脉搏动',
    name2: '变弱',
    list: [],
    name1Key: 'acrotarsium',
    name2Key: '2'
  },
  {
    name1: '足背动脉搏动',
    name2: '不能触及',
    list: [],
    name1Key: 'acrotarsium',
    name2Key: '3'
  },
  {
    name1: '下肢皮肤颜色',
    name2: '淡红',
    list: [],
    name1Key: 'leg',
    name2Key: '1'
  },
  {
    name1: '下肢皮肤颜色',
    name2: '紫色',
    list: [],
    name1Key: 'leg',
    name2Key: '2'
  },
  {
    name1: '下肢皮肤颜色',
    name2: '红色',
    list: [],
    name1Key: 'leg',
    name2Key: '3'
  },
  {
    name1: '下肢皮肤颜色',
    name2: '正常',
    list: [],
    name1Key: 'leg',
    name2Key: '4'
  },
  {
    name1: 'Homans征阳性',
    name2: '阴性',
    list: [],
    name1Key: 'homan',
    name2Key: '1'
  },
  {
    name1: 'Homans征阳性',
    name2: '阳性',
    list: [],
    name1Key: 'homan',
    name2Key: '2'
  },
  {
    name1: '疼痛尺评分',
    name2: '疼痛尺评分',
    list: [],
    name1Key: 'pain',
    name2Key: 'pain'
  },
  {
    name1: '肿胀',
    name2: '无',
    list: [],
    name1Key: 'swelling',
    name2Key: '1'
  },
  {
    name1: '肿胀',
    name2: 'Ⅰ度',
    list: [],
    name1Key: 'swelling',
    name2Key: '2'
  },
  {
    name1: '肿胀',
    name2: 'Ⅱ度',
    list: [],
    name1Key: 'swelling',
    name2Key: '3'
  },
  {
    name1: '肿胀',
    name2: 'Ⅲ度',
    list: [],
    name1Key: 'swelling',
    name2Key: '4'
  },
  {
    name1: '皮肤温度',
    name2: '温暖',
    list: [],
    name1Key: 'skin',
    name2Key: '1'
  },
  {
    name1: '皮肤温度',
    name2: '凉',
    list: [],
    name1Key: 'skin',
    name2Key: '2'
  },
  {
    name1: '主观感觉麻痹',
    name2: '无',
    list: [],
    name1Key: 'paralysis',
    name2Key: '1'
  },
  {
    name1: '主观感觉麻痹',
    name2: '有',
    list: [],
    name1Key: 'paralysis',
    name2Key: '2'
  },
  {
    name1: '周径（cm）',
    name2: '周径（cm）',
    list: [],
    name1Key: 'shank',
    name2Key: 'shank'
  },
  {
    name1: '评估意见',
    name2: '未发现问题',
    list: [],
    name1Key: 'problem',
    name2Key: '1'
  },
  {
    name1: '评估意见',
    name2: '进一步评估',
    list: [],
    name1Key: 'assenssment',
    name2Key: '1'
  },
  {
    name1: '评估意见',
    name2: '采取相应护理措施',
    list: [],
    name1Key: 'measures',
    name2Key: 'measures'
  },
  {
    name1: '护士签名',
    name2: '护士签名',
    list: [],
    name1Key: 'autograph',
    name2Key: 'autograph'
  },
  {
    name: '操作',
    name1: '操作',
    name1Key: 'operator',
    name2Key: 'operator',
    list: []
  }
]
export const valueChange = new Map([
  ['assDate', (tableItem, value, key) => {
    valueChangeFn1(tableItem, value, key)
  }],
  ['assTime', (tableItem, value, key) => {
    valueChangeFn1(tableItem, value, key)
  }],
  ['assProject', (tableItem, value, key) => {
    valueChangeFn2(tableItem, value, key)
  }],
  ['position', (tableItem, value, key) => {
    valueChangeFn2(tableItem, value, key)
  }],
  ['popliteal', (tableItem, value, key) => {
    valueChangeFn3(tableItem, value, key)
  }],
  ['acrotarsium', (tableItem, value, key) => {
    valueChangeFn3(tableItem, value, key)
  }],
  ['leg', (tableItem, value, key) => {
    valueChangeFn3(tableItem, value, key)
  }],
  ['homan', (tableItem, value, key) => {
    valueChangeFn3(tableItem, value, key)
  }],
  ['pain', (tableItem, value, key) => {
    valueChangeFn2(tableItem, value, key)
  }],
  ['swelling', (tableItem, value, key) => {
    valueChangeFn3(tableItem, value, key)
  }],
  ['skin', (tableItem, value, key) => {
    valueChangeFn3(tableItem, value, key)
  }],
  ['paralysis', (tableItem, value, key) => {
    valueChangeFn3(tableItem, value, key)
  }],
  ['shank', (tableItem, value, key) => {
    valueChangeFn2(tableItem, value, key)
  }],
  ['problem', (tableItem, value, key) => {
    valueChangeFn4(tableItem, value, key)
  }],
  ['assenssment', (tableItem, value, key) => {
    valueChangeFn4(tableItem, value, key)
  }],
  ['measures', (tableItem, value, key) => {
    try {
      const arrMap = ['基础预防', '药物预防', '物理预防']
      value = JSON.parse(value)
      for (let index = 0; index < value.length; index++) {
        const element = value[index]
        const valArr = element.value.map(item => {
          let indexArr = item.split('-')
          return arrMap[indexArr[indexArr.length - 1] - 1]
        })
        tableItem.list.push({
          key,
          value: valArr.join('')
        })
      }
    } catch (error) {

    }
  }],
  ['autograph', (tableItem, value, key) => {
    valueChangeFn1(tableItem, value, key)
  }]
])
const valueChangeFn1 = (tableItem, value = '', key = '') => {
  tableItem.list.push({
    key,
    value
  })
  tableItem.list.push({
    key,
    value
  })
}
const valueChangeFn2 = (tableItem, value, key) => {
  try {
    value = JSON.parse(value)
    for (let index = 0; index < value.length; index++) {
      const element = value[index]
      tableItem.list.push({
        key,
        value: element.value
      })
    }
  } catch (error) {

  }
}

const valueChangeFn3 = (tableItem, value, key) => {
  try {
    value = JSON.parse(value)
    for (let index = 0; index < value.length; index++) {
      const element = value[index]
      if (
        element.value.some(item => {
          let indexArr = item.split('-')
          let item2Key = indexArr[indexArr.length - 1]
          if (item2Key == tableItem.name2Key) {
            tableItem.list.push({
              key,
              value: true
            })
            return true
          }
          return false
        })
      ) {
        continue
      }
      tableItem.list.push({
        key,
        value: false
      })
    }
  } catch (error) {
  }
}
const valueChangeFn4 = (tableItem, value, key) => {
  try {
    value = JSON.parse(value)
    for (let index = 0; index < value.length; index++) {
      const element = value[index]
      if (!element.value) {
        tableItem.list.push({
          key,
          value: ''
        })
        continue
      }
      let indexArr = element.value.split('-')
      let item2Key = indexArr[indexArr.length - 1]
      if (item2Key == tableItem.name2Key) {
        tableItem.list.push({
          key,
          value: '是'
        })
        continue
      }
      tableItem.list.push({
        key,
        value: '否'
      })
    }
  } catch (error) {
  }
}
export const defaultValue = {
  acrotarsium: '',
  assDate: '',
  assProject: '',
  assTime: '',
  ass_date: '',
  ass_id: '',
  ass_name: '',
  ass_record_id: '',
  ass_times: 0,
  assenssment: '',
  autograph: '',
  column_version: 1,
  create_time: '',
  create_user: '',
  create_user_name: '',
  dept_id: '',
  have_record_rate: true,
  homan: '',
  is_print: false,
  leg: '',
  measures: '',
  module_id: '10017',
  module_value: '',
  org_id: '',
  pain: '',
  paralysis: '',
  patient_id: '',
  popliteal: '',
  position: '',
  problem: '',
  shank: '',
  skin: '',
  swelling: ''
}
