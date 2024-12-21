/*
 * @Description: 失禁性皮炎评估
 * @Author: bjp
 * @Date: 2021-04-10 10:56:24
 */
export const shijinJSON = [{
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
              'key': '1618026429000_42768'
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
          'key': '1618026429000_95025'
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
          'key': '1618026429000_92645'
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
          'key': '1618026429000_44985'
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
          'key': '1618026429000_65445'
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
            'id': '1618026429000_40962-0',
            'label': '1分:成形粪便和/或尿液',
            'marginLeft': '6px'
          }, {
            'score': 2,
            'id': '1618026429000_40962-1',
            'label': '2分:软便混合或未混合尿液',
            'marginLeft': '6px'
          }, {
            'score': 3,
            'id': '1618026429000_40962-2',
            'label': '3分:水样便和/或尿液',
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
          'key': '1618026429000_40962'
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
            'score': 1,
            'id': '1618026429000_71267-0',
            'label': '1分:床单/尿布<8h',
            'marginLeft': '6px'
          }, {
            'score': 2,
            'id': '1618026429000_71267-1',
            'label': '2分:床单/尿布<4h',
            'marginLeft': '6px'
          }, {
            'score': 3,
            'id': '1618026429000_71267-2',
            'label': '3分:床单/尿布<2h',
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
          'key': '1618026429000_71267'
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
            'score': 1,
            'id': '1618026429000_38410-0',
            'label': '1分:皮肤干净、完整',
            'marginLeft': '6px'
          }, {
            'score': 2,
            'id': '1618026429000_38410-1',
            'label': '2分:红斑、皮炎合并或不合并念珠菌感染',
            'marginLeft': '6px'
          }, {
            'score': 3,
            'id': '1618026429000_38410-2',
            'label': '3分:皮肤剥落、糜烂合并或不合并皮炎',
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
          'key': '1618026429000_38410'
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
            'score': 1,
            'id': '1618026429000_15896-0',
            'label': '1分:0-1个影响因素',
            'marginLeft': '6px'
          }, {
            'score': 2,
            'id': '1618026429000_15896-1',
            'label': '2分:2个影响因素',
            'marginLeft': '6px'
          }, {
            'score': 3,
            'id': '1618026429000_15896-2',
            'label': '3分:3个以上影响因素',
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
          'key': '1618026429000_15896'
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
              '1618026429000_40962',
              '1618026429000_71267',
              '1618026429000_38410',
              '1618026429000_15896'
            ],
            'borderLine': true,
            'readonly': false,
            'suffixAlign': 'center',
            'width': '180px',
            'disabled': false,
            'inputType': 'text',
            'hasTextAlign': true
          },
          'key': '1618026429000_26707'
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
              '1618026429000_40962',
              '1618026429000_71267',
              '1618026429000_38410',
              '1618026429000_15896'
            ],
            'borderLine': true,
            'readonly': false,
            'width': '180px',
            'setColorKey': '1618026429000_77981',
            'disabled': false,
            'inputType': 'text',
            'scoreColor': true,
            'prefixWidth': '50px',
            'hasTextAlign': true
          },
          'key': '1618026429000_59026'
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
          'key': '1618026429000_77981'
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
          'key': '1618026429000_98093'
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
        'text': '刺激物类型'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '刺激时间'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '会阴皮肤状况'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '影响因素：低蛋白感染等、管饲营养或其他'
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
  'key': '1618026429000_98599',
  'tbodyList': []
}]
