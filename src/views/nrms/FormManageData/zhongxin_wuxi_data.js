/*
 * @Description: 误吸窒息风险评估
 * @Author: bjp
 */
export const wuxiJSON = [{
  'loop': '5',
  'tbody': [{
    'columns': [{
      'rows': [{
        'children': [{
          'columns': [{
            'padding': '13px',
            'gapLR': '0',
            'children': [{
              'type': 'text',
              'value': '',
              'config': {
                'weight': '100px',
                'label': '评估日期',
                'align': 'center'
              },
              'key': '1618197789000_9828'
            }],
            'flex': 1,
            'justify': 'center',
            'width': '',
            'childWidth': 'auto',
            'align': 'center',
            'gapTB': '0',
            'direction': 'row'
          }],
          'type': 'grid',
          'value': '',
          'config': {
            'borderColor': '#ddd',
            'borderWidth': '0',
            'borderStyle': 'solid'
          },
          'key': '1618197789000_14099'
        }],
        'isWholeRow': true
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'hiddenBorderBottom': true,
        'children': [{
          'score': 0,
          'default': 'now',
          'type': 'date',
          'value': '',
          'config': {
            'readonly': false,
            'prefixAlign': 'right',
            'width': '160px',
            'disabled': false,
            'placeholder': '',
            'type': 'date'
          },
          'key': '1618197789000_78384'
        }]
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'default': 'now',
          'type': 'date',
          'value': '',
          'config': {
            'showFormat': 'HH:mm',
            'readonly': false,
            'prefixAlign': 'right',
            'width': '160px',
            'disabled': false,
            'placeholder': '',
            'type': 'time'
          },
          'key': '1618197789000_64140'
        }]
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'children': [{
          'type': 'button',
          'value': '',
          'config': {
            'size': 'mini',
            'label': '导入上次评测结果',
            'firstButton': true,
            'btnType': 'importLast',
            'printHidden': true
          },
          'key': '1618197789000_73787'
        }]
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 3,
            'id': '1618197789000_9373-0',
            'label': '3分:<5岁',
            'marginLeft': '6px'
          },
          {
            'score': 0,
            'id': '1618197789000_9373-1',
            'label': '0分:>=5岁',
            'marginLeft': '6px'
          }
          ],
          'type': 'checkbox',
          'value': [],
          'config': {
            'marginRight': '0px',
            'borderLine': true,
            'readonly': false,
            'disabled': false,
            'inputType': 'checkbox',
            'isRadio': true
          },
          'key': '1618197789000_9373'
        }],
        'config': {
          'align': 'flex-start'
        }
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 3,
            'id': '1618197789000_24791-0',
            'label': '3分:昏迷',
            'marginLeft': '6px'
          },
          {
            'score': 3,
            'id': '1618197789000_24791-1',
            'label': '3分:吞咽障碍',
            'marginLeft': '6px'
          },
          {
            'score': 3,
            'id': '1618197789000_24791-2',
            'label': '3分:咳嗽',
            'marginLeft': '6px'
          },
          {
            'score': 3,
            'id': '1618197789000_24791-3',
            'label': '3分:反射减弱或消失',
            'marginLeft': '6px'
          }
          ],
          'type': 'checkbox',
          'value': [],
          'config': {
            'borderLine': true,
            'readonly': false,
            'disabled': false,
            'inputType': 'checkbox',
            'isRadio': true
          },
          'key': '1618197789000_24791'
        }],
        'config': {
          'align': 'flex-start'
        }
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 3,
            'id': '1618197789000_962-0',
            'label': '3分:镇静催眠药',
            'marginLeft': '6px'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'borderLine': true,
            'readonly': false,
            'disabled': false,
            'inputType': 'checkbox',
            'isRadio': true
          },
          'key': '1618197789000_962'
        }],
        'config': {
          'align': 'flex-start'
        }
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 3,
            'id': '1618197789000_75330-0',
            'label': '3分:颌面、口腔或颈部手术后',
            'marginLeft': '6px'
          },
          {
            'score': 2,
            'id': '1618197789000_75330-1',
            'label': '2分:呕吐或反流(胃内容物或血液)',
            'marginLeft': '6px'
          },
          {
            'score': 5,
            'id': '1618197789000_75330-2',
            'label': '5分:咯血',
            'marginLeft': '6px'
          },
          {
            'score': 5,
            'id': '1618197789000_75330-3',
            'label': '5分:强制性体位-仰卧',
            'marginLeft': '6px'
          },
          {
            'score': 1,
            'id': '1618197789000_75330-4',
            'label': '1分:肥胖',
            'marginLeft': '6px'
          },
          {
            'score': 2,
            'id': '1618197789000_75330-5',
            'label': '2分:麻醉未醒',
            'marginLeft': '6px'
          },
          {
            'score': 3,
            'id': '1618197789000_75330-6',
            'label': '3分:人工气道',
            'marginLeft': '6px'
          },
          {
            'score': 2,
            'id': '1618197789000_75330-7',
            'label': '2分:痰液量多',
            'marginLeft': '6px'
          }
          ],
          'type': 'checkbox',
          'value': [],
          'config': {
            'borderLine': true,
            'readonly': false,
            'disabled': false,
            'inputType': 'checkbox',
            'isRadio': true
          },
          'key': '1618197789000_75330'
        }],
        'config': {
          'align': 'flex-start'
        }
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'total': [
              '1618197789000_9373',
              '1618197789000_24791',
              '1618197789000_962',
              '1618197789000_75330'
            ],
            'borderLine': true,
            'readonly': false,
            'suffixAlign': 'center',
            'width': '180px',
            'disabled': false,
            'inputType': 'text',
            'hasTextAlign': true
          },
          'key': '1618197789000_87641'
        }]
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'total': [
              '1618197789000_9373',
              '1618197789000_24791',
              '1618197789000_962',
              '1618197789000_75330'
            ],
            'borderLine': true,
            'readonly': false,
            'width': '180px',
            'setColorKey': '1618197789000_31104',
            'disabled': false,
            'inputType': 'text',
            'scoreColor': true,
            'prefixWidth': '50px',
            'hasTextAlign': true
          },
          'key': '1618197789000_72724'
        },
        {
          'score': 0,
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'hidden': true,
            'readonly': false,
            'maxlength': 20,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '140px',
            'disabled': false,
            'placeholder': ''
          },
          'key': '1618197789000_31104'
        }
        ]
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'children': [{
          'type': 'input',
          'value': '',
          'config': {
            'default': 'nurseName',
            'borderLine': true,
            'readonly': true,
            'width': '180px',
            'disabled': false,
            'inputType': 'text',
            'prefixWidth': '50px',
            'hasTextAlign': true
          },
          'key': '1618197789000_97383'
        }]
      }]
    }]
  }
  ],
  'thead': [{
    'columns': [{
      'rows': [{
        'columnNumber': 4,
        'text': '项目'
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'text': '年龄'
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'text': '神经损伤'
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'text': '用药'
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'text': '疾病因素'
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'text': '总分'
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'text': '风险等级'
      }]
    }]
  },
  {
    'columns': [{
      'rows': [{
        'text': '护士签名'
      }]
    }]
  }
  ],
  'type': 'table_column_loop',
  'config': {
    'thAlign': 'center',
    'tdWidth': '186px',
    'thWidth': '119px',
    'borderWidth': '1px'
  },
  'key': '1618197789000_36793',
  'tbodyList': []
}]
