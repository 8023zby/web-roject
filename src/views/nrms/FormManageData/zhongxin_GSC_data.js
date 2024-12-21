export const zhongxinGSCData =
[{
  'type': 'table_column_loop',
  'loop': '5',
  'key': '1618207428000_43174',
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
        'text': '睁眼'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '语言'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '运动'
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
              'key': '1618207428000_58591'
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
          'key': '1618207428000_76426'
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
          'key': '1618207428000_91190'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 1,
            'id': '1618207428000_74479-0',
            'label': '1分：无睁眼'
          }, {
            'score': 2,
            'id': '1618207428000_74479-1',
            'label': '2分：疼痛刺激睁眼'
          }, {
            'score': 3,
            'id': '1618207428000_74479-2',
            'label': '3分：呼叫睁眼'
          }, {
            'score': 4,
            'id': '1618207428000_74479-3',
            'label': '4分：自动睁眼'
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
          'key': '1618207428000_74479'
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
          'options': [{
            'score': 1,
            'id': '1618207428000_80130-0',
            'label': '1分：不能发音'
          }, {
            'score': 2,
            'id': '1618207428000_80130-1',
            'label': '2分：只能发音'
          }, {
            'score': 3,
            'id': '1618207428000_80130-2',
            'label': '3分：用词错误'
          }, {
            'score': 4,
            'id': '1618207428000_80130-3',
            'label': '4分：答非所问'
          }, {
            'score': 5,
            'id': '1618207428000_80130-4',
            'label': '5分：回答切题'
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
          'key': '1618207428000_80130'
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
          'options': [{
            'score': 1,
            'id': '1618207428000_35467-0',
            'label': '1分：刺激后无反应'
          }, {
            'score': 2,
            'id': '1618207428000_35467-1',
            'label': '2分：刺激后四肢强直'
          }, {
            'score': 3,
            'id': '1618207428000_35467-2',
            'label': '3分：刺激后双上肢屈曲'
          }, {
            'score': 4,
            'id': '1618207428000_35467-3',
            'label': '4分：对疼痛能逃避'
          }, {
            'score': 5,
            'id': '1618207428000_35467-4',
            'label': '5分：对疼痛能定位'
          }, {
            'score': 6,
            'id': '1618207428000_35467-5',
            'label': '6分：按指示运动'
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
          'key': '1618207428000_35467'
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
            'total': [
              '1618207428000_74479',
              '1618207428000_80130',
              '1618207428000_35467'
            ],
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
            'total': [
              '1618207428000_74479',
              '1618207428000_80130',
              '1618207428000_35467'
            ],
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
