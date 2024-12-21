export const zhongxinYingyangData =
[{
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
              'key': '1618222267000_99071'
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
          'key': '1618222267000_92417'
        }],
        'isWholeRow': true
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'hiddenBorderBottom': true,
        'children': [{
          'score': 0,
          'default': 'now',
          'type': 'date',
          'value': '',
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
          'default': 'now',
          'type': 'date',
          'value': '',
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
            'firstButton': true,
            'btnType': 'importLast',
            'printHidden': true
          },
          'key': '1618222267000_28300'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 0,
            'id': '1618222267000_78180-0',
            'label': '0分：BMI >= 18.5'
          }, {
            'score': 3,
            'id': '1618222267000_78180-1',
            'label': '3分：BMI < 18.5KG/㎡，伴一般临床状况差'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'borderLine': true,
            'readonly': false,
            'prefix': '',
            'disabled': false,
            'inputType': 'checkbox',
            'isRadio': true,
            'prefixWidth': ''
          },
          'key': '1618222267000_78180'
        }],
        'config': {
          'padding': '0 5px',
          'align': 'flex-start'
        }
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 0,
            'id': '1618222267000_59729-0',
            'label': '0分：近1月~3月内体重无下降'
          }, {
            'score': 1,
            'id': '1618222267000_59729-1',
            'label': '1分：近3月内体重下降>5%'
          }, {
            'score': 2,
            'id': '1618222267000_59729-2',
            'label': '2分：近2月内体重下降>5%'
          }, {
            'score': 3,
            'id': '1618222267000_59729-3',
            'label': '3分：近1月内体重下降>5%或近3月内体重下降15%'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'borderLine': true,
            'readonly': false,
            'prefix': '',
            'disabled': false,
            'inputType': 'checkbox',
            'prefixWidth': '',
            'isRadio': true
          },
          'key': '1618222267000_59729'
        }],
        'config': {
          'padding': '0 5px',
          'align': 'flex-start'
        }
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 0,
            'id': '1618222267000_1284-0',
            'label': '0分：近1周进食量无变化'
          }, {
            'score': 1,
            'id': '1618222267000_1284-1',
            'label': '1分：近1周进食量减少25%~50%'
          }, {
            'score': 2,
            'id': '1618222267000_1284-2',
            'label': '2分：近1周进食量减少51%~75%'
          }, {
            'score': 3,
            'id': '1618222267000_1284-3',
            'label': '3分：近1周进食量减少76%及以上'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'borderLine': true,
            'readonly': false,
            'prefix': '',
            'disabled': false,
            'inputType': 'checkbox',
            'prefixWidth': '',
            'isRadio': true
          },
          'key': '1618222267000_1284'
        }],
        'config': {
          'padding': '0 5px',
          'align': 'flex-start'
        }
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 0,
            'id': '1618222267000_31239-0',
            'label': '0分：最高0分'
          }, {
            'score': 1,
            'id': '1618222267000_31239-1',
            'label': '1分：最高1分'
          }, {
            'score': 2,
            'id': '1618222267000_31239-2',
            'label': '2分：最高2分'
          }, {
            'score': 3,
            'id': '1618222267000_31239-3',
            'label': '3分：最高3分'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'borderLine': true,
            'readonly': false,
            'prefix': '',
            'disabled': false,
            'inputType': 'checkbox',
            'prefixWidth': '',
            'isRadio': true
          },
          'key': '1618222267000_31239'
        }],
        'config': {
          'padding': '0 5px',
          'align': 'flex-start'
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
              '1618222267000_78180',
              '1618222267000_59729',
              '1618222267000_1284',
              '1618222267000_31239'
            ],
            'borderLine': 'true',
            'readonly': false,
            'maxlength': 20,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '140px',
            'disabled': false,
            'placeholder': ''
          },
          'key': '1617679267000_30993'
        }]
      }]
    }]
  }],
  'thead': [{
    'columns': [{
      'rows': [{
        'columnNumber': 4,
        'text': '项目'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '营养状态受损-BMI评估'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '营养状态受损-体重评估'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '营养状态受损-进食评估'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '营养状态受损评分最高分'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '总分'
      }]
    }]
  }],
  'type': 'table_column_loop',
  'config': {
    'thAlign': 'center',
    'tdWidth': '186px',
    'thWidth': '119px',
    'borderWidth': '1px'
  },
  'key': '1618222267000_63872',
  'tbodyList': []
}, {
  'columns': [{
    'padding': '10px',
    'gapLR': '0',
    'children': [{
      'type': 'text',
      'value': '',
      'config': {
        'weight': '100px',
        'label': '护理措施',
        'align': 'center'
      },
      'key': '1618222267000_7750'
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
    'borderWidth': '1px',
    'borderStyle': 'solid'
  },
  'key': '1618222267000_32589'
}, {
  'loop': '5',
  'tbody': [{
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 0,
            'id': '1618222267000_46546-0',
            'label': '患者有营养不良的风险，需营养支持治疗并通知医生'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'readonly': false,
            'prefix': '',
            'disabled': false,
            'inputType': 'checkbox',
            'prefixWidth': ''
          },
          'key': '1618222267000_46546'
        }],
        'config': {
          'padding': '0 5px',
          'align': 'flex-start'
        }
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 0,
            'id': '1618222267000_72472-0',
            'label': '若患者将接受重大手术，则每周重新评估其营养状况'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'readonly': false,
            'prefix': '',
            'disabled': false,
            'inputType': 'checkbox',
            'prefixWidth': ''
          },
          'key': '1618222267000_72472'
        }],
        'config': {
          'padding': '0 5px',
          'align': 'flex-start'
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
            'default': 'nurseName',
            'borderLine': 'true',
            'readonly': true,
            'maxlength': 20,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '140px',
            'disabled': false,
            'placeholder': ''
          },
          'key': '1617679267000_90450'
        }]
      }]
    }]
  }],
  'thead': [{
    'columns': [{
      'rows': [{
        'text': '≥3'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '<3'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '护士签名'
      }]
    }]
  }],
  'type': 'table_column_loop',
  'config': {
    'thAlign': 'center',
    'tdWidth': '186px',
    'thWidth': '119px',
    'borderWidth': '1px'
  },
  'key': '1618222267000_46154',
  'tbodyList': []
}]
