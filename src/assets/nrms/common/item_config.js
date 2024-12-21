export const  sign = {
  storage_type: {
    1: '按时间点',
    2: '按半天',
    3: '按天'
  },
  suit_type: {
    1: '成人',
    2: '儿童'
  },
  inout_item: {
    0: '非出入项',
    1: '入项',
    2: '出项'
  },
  gather_item: {
    0: '非汇总项',
    1: '入量汇总项',
    2: '出量汇总项'
  },
  item_display_rule: {
    1: '始终显示',
    2: '有值显示'
  },
  tiwen_type: {
    'yw': '腋温',
    'kw': '口温',
    'gw': '肛温'
  },
  // 体征项字段类型 之前5代表下拉选线可手输，后来拆分为可手输文本和数字，用于pad端区分键盘
  sign_item_field_type: {
    '1': '文本',
    '2': '数字',
    '3': '单选',
    '4': '下拉选项',
    '6': '下拉选项可手输(数字)',
    '7': '下拉选项可手输(文本)'
  },
  // 体征项svg图标
  sign_item_svg_type: [
    {
      id: 1,
      name: 'solidCircle'
    },
    {
      id: 2,
      name: 'textP'
    },
    {
      id: 3,
      name: 'circle'
    },
    {
      id: 4,
      name: 'cha'
    },
    {
      id: 5,
      name: 'circleR'
    },
    {
      id: 6,
      name: 'chaAndDot'
    },
    {
      id: 7,
      name: 'arrowHead'
    },
    {
      id: 8,
      name: 'fiveStar'
    }
  ],
  // 体征项数据来源
  sign_source: {
    '1': '患者录入',
    '2': '设备采集'
  }
}
