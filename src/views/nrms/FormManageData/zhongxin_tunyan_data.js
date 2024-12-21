// 吞咽障碍评估
export const zhongxinTunYanData =
    [{
      'type': 'table_column_loop',
      'loop': '5',
      'key': '1618020989000_67859',
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
            'text': '吞咽障碍因素'
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
                  'key': '1618020989000_90569'
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
              'key': '1618020989000_62206'
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
              'key': '1617266399000_54421'
            }]
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'children': [{
              'options': [{
                'score': 1,
                'id': '1618020989000_36641-0',
                'label': '1分：一口喝完，无噎呛，<5秒'
              }, {
                'score': 2,
                'id': '1618020989000_36641-1',
                'label': '2分：分两次以上喝完，无噎呛，>5秒'
              }, {
                'score': 3,
                'id': '1618020989000_36641-2',
                'label': '3分：一次喝完，有噎呛，>5秒'
              }, {
                'score': 4,
                'id': '1618020989000_36641-3',
                'label': '4分：分两次以上喝完，有噎呛，>5秒'
              }, {
                'score': 5,
                'id': '1618020989000_36641-4',
                'label': '5分：常常呛住，难以全部喝完，>5秒'
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
              'key': '1618020989000_36641'
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
                'total': ['1618020989000_36641'],
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
