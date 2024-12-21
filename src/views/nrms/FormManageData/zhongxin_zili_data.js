/*
 * @Description: 自理能力评估
 * @Author: bjp
 * @Date: 2021-04-12 10:57:53
 */
export const ziliJSON = [{
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
  }, {
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
  }, {
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
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 10,
            'id': '1618197789000_9373-0',
            'label': '10分:完全独立',
            'marginLeft': '6px'
          }, {
            'score': 5,
            'id': '1618197789000_9373-1',
            'label': '5分:需部分帮助',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1618197789000_9373-2',
            'label': '0分:需极大帮助',
            'marginLeft': '6px'
          }],
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
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 5,
            'id': '1618197789000_24791-0',
            'label': '5分:完全独立',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1618197789000_24791-1',
            'label': '0分:需部分帮助',
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
          'key': '1618197789000_24791'
        }],
        'config': {
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
            'id': '1618197789000_962-0',
            'label': '5分:完全独立',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1618197789000_962-1',
            'label': '0分:需部分帮助',
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
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 10,
            'id': '1618197789000_75330-0',
            'label': '10分:完全独立',
            'marginLeft': '6px'
          }, {
            'score': 5,
            'id': '1618197789000_75330-1',
            'label': '5分:需部分帮助',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1618197789000_75330-2',
            'label': '0分:需极大帮助',
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
          'key': '1618197789000_75330'
        }],
        'config': {
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
            'score': 10,
            'id': '1618197789000_1975-0',
            'label': '10分:完全独立',
            'marginLeft': '6px'
          }, {
            'score': 5,
            'id': '1618197789000_1975-1',
            'label': '5分:需部分帮助',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1618197789000_1975-2',
            'label': '0分:需极大帮助',
            'marginLeft': '6px'
          }],
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
          'key': '1618197789000_1975'
        }],
        'config': {
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
            'score': 10,
            'id': '1618197789000_50491-0',
            'label': '10分:完全独立',
            'marginLeft': '6px'
          }, {
            'score': 5,
            'id': '1618197789000_50491-1',
            'label': '5分:需部分帮助',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1618197789000_50491-2',
            'label': '0分:需极大帮助',
            'marginLeft': '6px'
          }],
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
          'key': '1618197789000_50491'
        }],
        'config': {
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
            'score': 10,
            'id': '1618197789000_61472-0',
            'label': '10分:完全独立',
            'marginLeft': '6px'
          }, {
            'score': 5,
            'id': '1618197789000_61472-1',
            'label': '5分:需部分帮助',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1618197789000_61472-2',
            'label': '0分:需极大帮助',
            'marginLeft': '6px'
          }],
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
          'key': '1618197789000_61472'
        }],
        'config': {
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
            'score': 15,
            'id': '1618197789000_73168-0',
            'label': '15分:完全独立',
            'marginLeft': '6px'
          }, {
            'score': 10,
            'id': '1618197789000_73168-1',
            'label': '10分:需部分帮助',
            'marginLeft': '6px'
          }, {
            'score': 5,
            'id': '1618197789000_73168-2',
            'label': '5分:需极大帮助',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1618197789000_73168-3',
            'label': '0分:完全依赖',
            'marginLeft': '6px'
          }],
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
          'key': '1618197789000_73168'
        }],
        'config': {
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
            'score': 15,
            'id': '1618197789000_81685-0',
            'label': '15分:完全独立',
            'marginLeft': '6px'
          }, {
            'score': 10,
            'id': '1618197789000_81685-1',
            'label': '10分:需部分帮助',
            'marginLeft': '6px'
          }, {
            'score': 5,
            'id': '1618197789000_81685-2',
            'label': '5分:需极大帮助',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1618197789000_81685-3',
            'label': '0分:完全依赖',
            'marginLeft': '6px'
          }],
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
          'key': '1618197789000_81685'
        }],
        'config': {
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
            'score': 10,
            'id': '1618197789000_80923-0',
            'label': '10分:完全独立',
            'marginLeft': '6px'
          }, {
            'score': 5,
            'id': '1618197789000_80923-1',
            'label': '5分:需部分帮助',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1618197789000_80923-2',
            'label': '0分:需极大帮助',
            'marginLeft': '6px'
          }],
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
          'key': '1618197789000_80923'
        }],
        'config': {
          'align': 'flex-start'
        }
      }]
    }]
  }, {
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
              '1618197789000_75330',
              '1618197789000_1975',
              '1618197789000_50491',
              '1618197789000_61472',
              '1618197789000_73168',
              '1618197789000_81685',
              '1618197789000_80923'
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
  }, {
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
              '1618197789000_75330',
              '1618197789000_1975',
              '1618197789000_50491',
              '1618197789000_61472',
              '1618197789000_73168',
              '1618197789000_81685',
              '1618197789000_80923'
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
          'key': '1618197789000_31104'
        }]
      }]
    }]
  }, {
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
        'text': '进食'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '洗澡'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '修饰'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '穿衣'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '控制大便'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '控制小便'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '如厕'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '床椅转移'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '平地行走'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '上下楼梯'
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
