export const zhongxinMiniaoData =
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
              'key': '1618216575000_4027'
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
          'key': '1618216575000_58677'
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
          'key': '1618216575000_10479'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 1,
            'id': '1618216575000_7149-0',
            'label': '0分：无导管'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'borderLine': true,
            'readonly': false,
            'prefix': '',
            'disabled': false,
            'inputType': 'checkbox',
            'prefixWidth': ''
          },
          'key': '1618216575000_7149'
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
            'id': '1618216575000_65000-0',
            'label': '0分：<60岁'
          }, {
            'score': 1,
            'id': '1618216575000_65000-1',
            'label': '1分：≥60岁'
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
          'key': '1618216575000_65000'
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
            'id': '1618216575000_20947-0',
            'label': '0分：男'
          }, {
            'score': 1,
            'id': '1618216575000_20947-1',
            'label': '1分：女'
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
          'key': '1618216575000_20947'
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
            'score': 3,
            'id': '1618216575000_40989-0',
            'label': '3分：卧床'
          }, {
            'score': 2,
            'id': '1618216575000_40989-1',
            'label': '2分：恶性肿瘤患者'
          }, {
            'score': 3,
            'id': '1618216575000_40989-2',
            'label': '3分：有糖尿病史者'
          }, {
            'score': 0,
            'id': '1618216575000_40989-3',
            'label': '0分：无'
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
          'key': '1618216575000_40989'
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
            'score': 5,
            'id': '1618216575000_27722-0',
            'label': '5分：2周内进行过泌尿系统侵袭性操作（导尿、介入、手术等）'
          }, {
            'score': 5,
            'id': '1618216575000_27722-1',
            'label': '5分：留置导尿>3天'
          }, {
            'score': 0,
            'id': '1618216575000_27722-2',
            'label': '0分：无'
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
          'key': '1618216575000_27722'
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
            'score': 3,
            'id': '1618216575000_64917-0',
            'label': '3分：免疫抑制剂'
          }, {
            'score': 0,
            'id': '1618216575000_64917-1',
            'label': '0分：无'
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
          'key': '1618216575000_64917'
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
              '1618216575000_7149',
              '1618216575000_65000',
              '1618216575000_20947',
              '1618216575000_40989',
              '1618216575000_27722',
              '1618216575000_64917'
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
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'type': 'input',
          'value': '',
          'config': {
            'total': [
              '1618216575000_7149',
              '1618216575000_65000',
              '1618216575000_20947',
              '1618216575000_40989',
              '1618216575000_27722',
              '1618216575000_64917'
            ],
            'borderLine': 'true',
            'readonly': false,
            'maxlength': 20,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '140px',
            'setColorKey': '1617930427000_15821',
            'disabled': false,
            'scoreColor': true,
            'placeholder': ''
          },
          'key': '1617262462000_93802'
        }, {
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
          'key': '1617930427000_15821'
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
        'text': '无导管'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '年龄'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '性别'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '疾病因素'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '诊疗操作'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '用药'
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
  }],
  'type': 'table_column_loop',
  'config': {
    'thAlign': 'center',
    'tdWidth': '186px',
    'thWidth': '119px',
    'borderWidth': '1px'
  },
  'key': '1618216575000_43258',
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
      'key': '1618216575000_29567'
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
  'key': '1618216575000_85250'
}, {
  'loop': '5',
  'tbody': [{
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 0,
            'id': '1618216575000_75887-0',
            'label': '保持尿管通畅，观察尿液颜色、性质、量'
          }, {
            'score': 0,
            'id': '1618216575000_75887-1',
            'label': '保持会阴部清洁干燥，每日尿护2次'
          }, {
            'score': 0,
            'id': '1618216575000_75887-2',
            'label': '病情许可前提下，指导患者适量多饮水'
          }, {
            'score': 0,
            'id': '1618216575000_75887-3',
            'label': '留置导尿患者每周换尿袋1-2次'
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
          'key': '1618216575000_75887'
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
        'text': '泌尿感染护理措施'
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
  'key': '1618216575000_91637',
  'tbodyList': []
}]
