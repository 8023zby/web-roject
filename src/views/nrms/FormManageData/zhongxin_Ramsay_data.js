export const zhongxinRamsayData =
[{
  'type': 'table_column_loop',
  'loop': '5',
  'key': '1618209723000_75481',
  'config': {
    'borderWidth': '1px',
    'thWidth': '119px',
    'thAlign': 'center',
    'tdWidth': '186px'
  },
  'thead': [{
    'columns': [{
      'rows': [{
        'text': '项目',
        'columnNumber': 4
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '镇静评分依据'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '总分'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '风险等级'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '护士签名'
      }]
    }]
  }],
  'tbodyList': [],
  'tbody': [{
    'columns': [{
      'rows': [{
        'isWholeRow': true,
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
              'key': '1618209723000_60330'
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
          'key': '1618209723000_26232'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'hiddenBorderBottom': true,
        'children': [{
          'score': 0,
          'type': 'date',
          'value': '',
          'default': 'now',
          'config': {
            'clearable': false,
            'prefixColor': '#666666',
            'readonly': false,
            'prefix': '',
            'prefixPaddingRight': '0',
            'prefixAlign': 'right',
            'width': '160px',
            'disabled': false,
            'placeholder': '',
            'type': 'date',
            'prefixWidth': ''
          },
          'his_id': 'date',
          'key': '1617262462000_44167'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'type': 'date',
          'value': '',
          'default': 'now',
          'config': {
            'clearable': false,
            'showFormat': 'HH:mm',
            'prefixColor': '#666666',
            'readonly': false,
            'prefix': '',
            'prefixPaddingRight': '0',
            'prefixAlign': 'right',
            'width': '160px',
            'disabled': false,
            'placeholder': '请选择',
            'type': 'time',
            'prefixWidth': ''
          },
          'his_id': 'time1',
          'key': '1617262462000_96823'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'type': 'button',
          'value': '',
          'config': {
            'assId': '10009',
            'size': 'mini',
            'label': '导入上次评测结果',
            'printHidden': true,
            'btnType': 'importLast',
            'firstButton': true
          },
          'key': '1618209723000_39987'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1618209723000_13165-0',
            'label': '0分：患者停镇静'
          }, {
            'score': 1,
            'id': '1618209723000_13165-1',
            'label': '1分：病人焦虑，躁动不安'
          }, {
            'score': 2,
            'id': '1618209723000_13165-2',
            'label': '2分：病人配合，有定向力、安静'
          }, {
            'score': 3,
            'id': '1618209723000_13165-3',
            'label': '3分：病人对指令有反应'
          }, {
            'score': 4,
            'id': '1618209723000_13165-4',
            'label': '4分：嗜睡，对轻叩眉间或大声听觉刺激反应敏捷'
          }, {
            'score': 5,
            'id': '1618209723000_13165-5',
            'label': '5分：嗜睡，对轻叩眉间或大声听觉刺激反应迟钝'
          }, {
            'score': 6,
            'id': '1618209723000_13165-6',
            'label': '6分：嗜睡，无任何反应'
          }],
          'score': 0,
          'type': 'checkbox',
          'value': [],
          'config': {
            'prefix': '',
            'prefixWidth': '',
            'borderLine': true,
            'readonly': false,
            'disabled': false,
            'inputType': 'checkbox',
            'isRadio': true
          },
          'key': '1618209723000_13165'
        }],
        'config': {
          'align': 'flex-start',
          'padding': '0 5px'
        }
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'type': 'input',
          'value': '',
          'config': {
            'total': ['1618209723000_13165'],
            'inputType': 'text',
            'borderLine': true,
            'readonly': false,
            'maxlength': 20,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '180px',
            'disabled': false,
            'placeholder': ''
          },
          'key': '1617679267000_30993'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'type': 'input',
          'value': '',
          'config': {
            'total': ['1618209723000_13165'],
            'scoreColor': true,
            'setColorKey': '1617930427000_15821',
            'inputType': 'text',
            'borderLine': true,
            'readonly': false,
            'width': '180px',
            'disabled': false
          },
          'key': '1617262462000_93802'
        }, {
          'score': 0,
          'type': 'input',
          'value': '',
          'config': {
            'hidden': true,
            'borderLine': 'true',
            'readonly': false,
            'maxlength': 20,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '140px',
            'disabled': false,
            'placeholder': ''
          },
          'key': '1617930427000_15821'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': true,
            'maxlength': 20,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '140px',
            'disabled': false,
            'placeholder': '',
            'default': 'nurseName'
          },
          'key': '1617679267000_90450'
        }]
      }]
    }]
  }]
}]
