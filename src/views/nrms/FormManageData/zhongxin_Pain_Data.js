// 患者疼痛评估
export const zhongxinPainData =
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
            'text': '疼痛评估因素',
            'columnNumber': 2
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '疼痛部位'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '疼痛部位'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '疼痛部位'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '疼痛性质'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '疼痛性质'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '伴随症状'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '疼痛规律'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '总分'
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
            'hiddenBorderBottom': true,
            'children': [{
              'options': [{
                'score': 0,
                'id': '1618020989000_36641-0',
                'label': '0分：睡眠'
              }, {
                'score': 0,
                'id': '1618020989000_36641-1',
                'label': '0分：无痛'
              }, {
                'score': 1,
                'id': '1618020989000_36641-2',
                'label': '1分：被动活动时疼痛'
              }, {
                'score': 2,
                'id': '1618020989000_36641-3',
                'label': '2分：主动活动或变换体位时疼痛'
              }, {
                'score': 3,
                'id': '1618020989000_36641-4',
                'label': '3分：平卧时会痛，有被动体位'
              }, {
                'score': 4,
                'id': '1618020989000_36641-5',
                'label': '4分：间歇疼痛，对日常生活有影响，偶尔会有皱眉、咧嘴或咬牙等表情'
              }, {
                'score': 5,
                'id': '1618020989000_36641-6',
                'label': '5分：持续疼痛，入睡困难，食欲减退，心情烦躁'
              }, {
                'score': 6,
                'id': '1618020989000_36641-7',
                'label': '6分：疼痛较重，容易被疼醒或根本不能入睡，呻吟或呼叫'
              }, {
                'score': 7,
                'id': '1618020989000_36641-8',
                'label': '7分：疼痛严重，翻转不安，焦虑，有冷汗，无法入睡，注意力无法从疼痛部位分散'
              }, {
                'score': 8,
                'id': '1618020989000_36641-9',
                'label': '8分：疼痛持续难忍，全身大汗'
              }, {
                'score': 9,
                'id': '1618020989000_36641-10',
                'label': '9分：剧烈疼痛，不能忍受'
              }, {
                'score': 10,
                'id': '1618020989000_36641-11',
                'label': '10分：最疼痛，痛不欲生'
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
                'inputType': 'checkbox'
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
              'type': 'text',
              'value': '',
              'config': {
                'label': '注意：评分≥4分需评以下内容',
                'inputType': 'text'
              },
              'key': '1618020989000_67791'
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
                'score': 0,
                'id': '1618020989000_53768-0',
                'label': '头'
              }, {
                'score': 0,
                'id': '1618020989000_53768-1',
                'label': '颈'
              }, {
                'score': 0,
                'id': '1618020989000_53768-2',
                'label': '胸'
              }, {
                'score': 0,
                'id': '1618020989000_53768-3',
                'label': '乳房'
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
                'inputType': 'checkbox'
              },
              'key': '1618020989000_53768'
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
                'score': 0,
                'id': '1618020989000_20665-0',
                'label': '腹部'
              }, {
                'score': 0,
                'id': '1618020989000_20665-1',
                'label': '腰'
              }, {
                'score': 0,
                'id': '1618020989000_20665-2',
                'label': '胃'
              }, {
                'score': 0,
                'id': '1618020989000_20665-3',
                'label': '阴部'
              }, {
                'score': 0,
                'id': '1618020989000_20665-4',
                'label': '肩'
              }, {
                'score': 0,
                'id': '1618020989000_20665-5',
                'label': '上臂'
              }, {
                'score': 0,
                'id': '1618020989000_20665-6',
                'label': '前臂'
              }, {
                'score': 0,
                'id': '1618020989000_20665-7',
                'label': '手'
              }, {
                'score': 0,
                'id': '1618020989000_20665-8',
                'label': '大腿'
              }, {
                'score': 0,
                'id': '1618020989000_20665-9',
                'label': '小腿'
              }, {
                'score': 0,
                'id': '1618020989000_20665-10',
                'label': '踝'
              }, {
                'score': 0,
                'id': '1618020989000_20665-11',
                'label': '脚'
              }, {
                'score': 0,
                'id': '1618020989000_20665-12',
                'label': '肘关节'
              }, {
                'score': 0,
                'id': '1618020989000_20665-13',
                'label': '腕关节'
              }, {
                'score': 0,
                'id': '1618020989000_20665-14',
                'label': '髋关节'
              }, {
                'score': 0,
                'id': '1618020989000_20665-15',
                'label': '口腔'
              }, {
                'score': 0,
                'id': '1618020989000_20665-16',
                'label': '鼻部'
              }, {
                'score': 0,
                'id': '1618020989000_20665-17',
                'label': '左膝关节'
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
                'inputType': 'checkbox'
              },
              'key': '1618020989000_20665'
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
                'score': 0,
                'id': '1618020989000_86721-0',
                'label': '右膝关节'
              }, {
                'score': 0,
                'id': '1618020989000_86721-1',
                'label': '左踝关节'
              }, {
                'score': 0,
                'id': '1618020989000_86721-2',
                'label': '右踝关节'
              }, {
                'score': 0,
                'id': '1618020989000_86721-3',
                'label': '其他'
              }, {
                'score': 0,
                'id': '1618020989000_86721-4',
                'label': '臀'
              }, {
                'score': 0,
                'id': '1618020989000_86721-5',
                'label': '背'
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
                'inputType': 'checkbox'
              },
              'key': '1618020989000_86721'
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
                'score': 0,
                'id': '1618020989000_95198-0',
                'label': '跳痛'
              }, {
                'score': 0,
                'id': '1618020989000_95198-1',
                'label': '压迫痛'
              }, {
                'score': 0,
                'id': '1618020989000_95198-2',
                'label': '钝痛'
              }, {
                'score': 0,
                'id': '1618020989000_95198-3',
                'label': '锐痛'
              }, {
                'score': 0,
                'id': '1618020989000_95198-4',
                'label': '刺痛'
              }, {
                'score': 0,
                'id': '1618020989000_95198-5',
                'label': '牵拉痛'
              }, {
                'score': 0,
                'id': '1618020989000_95198-6',
                'label': '烧灼痛'
              }, {
                'score': 0,
                'id': '1618020989000_95198-7',
                'label': '绞痛'
              }, {
                'score': 0,
                'id': '1618020989000_95198-8',
                'label': '放射痛'
              }, {
                'score': 0,
                'id': '1618020989000_95198-9',
                'label': '胀痛'
              }, {
                'score': 0,
                'id': '1618020989000_95198-10',
                'label': '隐痛'
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
                'inputType': 'checkbox'
              },
              'key': '1618020989000_95198'
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
                'score': 0,
                'id': '1618020989000_13419-0',
                'label': '其他'
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
              'key': '1618020989000_13419'
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
                'score': 0,
                'id': '1618020989000_36159-0',
                'label': '恶心'
              }, {
                'score': 0,
                'id': '1618020989000_36159-1',
                'label': '呕吐'
              }, {
                'score': 0,
                'id': '1618020989000_36159-2',
                'label': '便秘'
              }, {
                'score': 0,
                'id': '1618020989000_36159-3',
                'label': '意识模糊'
              }, {
                'score': 0,
                'id': '1618020989000_36159-4',
                'label': '焦虑'
              }, {
                'score': 0,
                'id': '1618020989000_36159-5',
                'label': '瘙痒'
              }, {
                'score': 0,
                'id': '1618020989000_36159-6',
                'label': '大汗淋漓'
              }, {
                'score': 0,
                'id': '1618020989000_36159-7',
                'label': '视力模糊'
              }, {
                'score': 0,
                'id': '1618020989000_36159-8',
                'label': '抽搐'
              }, {
                'score': 0,
                'id': '1618020989000_36159-9',
                'label': '幻觉'
              }, {
                'score': 0,
                'id': '1618020989000_36159-10',
                'label': '便血'
              }, {
                'score': 0,
                'id': '1618020989000_36159-11',
                'label': '口干'
              }, {
                'score': 0,
                'id': '1618020989000_36159-12',
                'label': '其他'
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
                'inputType': 'checkbox'
              },
              'key': '1618020989000_36159'
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
                'score': 0,
                'id': '1618020989000_86682-0',
                'label': '持续性'
              }, {
                'score': 0,
                'id': '1618020989000_86682-1',
                'label': '间歇性'
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
              'key': '1618020989000_86682'
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
      }]
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
          'key': '1618020989000_6404'
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
        'borderColor': '#ccc',
        'borderWidth': '1px',
        'borderStyle': 'solid'
      },
      'key': '1618020989000_18928'
    }, {
      'type': 'table_column_loop',
      'loop': '5',
      'key': '1618020989000_23040',
      'config': {
        'borderWidth': '1px',
        'thWidth': '119px',
        'thAlign': 'center',
        'tdWidth': '186px'
      },
      'thead': [{
        'columns': [{
          'rows': [{
            'text': '物理治疗'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '引导治疗'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '药物治疗'
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
            'children': [{
              'options': [{
                'score': 0,
                'id': '1618020989000_439-0',
                'label': '*复位术'
              }, {
                'score': 0,
                'id': '1618020989000_439-1',
                'label': '*热疗'
              }, {
                'score': 0,
                'id': '1618020989000_439-2',
                'label': '*冷敷'
              }, {
                'score': 0,
                'id': '1618020989000_439-3',
                'label': '*按摩'
              }, {
                'score': 0,
                'id': '1618020989000_439-4',
                'label': '*其他'
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
                'inputType': 'checkbox'
              },
              'key': '1618020989000_439'
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
                'score': 0,
                'id': '1618020989000_72996-0',
                'label': '*分散注意力'
              }, {
                'score': 0,
                'id': '1618020989000_72996-1',
                'label': '*引导想象'
              }, {
                'score': 0,
                'id': '1618020989000_72996-2',
                'label': '*休息'
              }, {
                'score': 0,
                'id': '1618020989000_72996-3',
                'label': '*锻炼'
              }, {
                'score': 0,
                'id': '1618020989000_72996-4',
                'label': '*睡眠'
              }, {
                'score': 0,
                'id': '1618020989000_72996-5',
                'label': '*放松技巧'
              }, {
                'score': 0,
                'id': '1618020989000_72996-6',
                'label': '*其他'
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
                'inputType': 'checkbox'
              },
              'key': '1618020989000_72996'
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
                'score': 0,
                'id': '1618020989000_45991-0',
                'label': '*药物治疗（自定义）'
              }, {
                'score': 0,
                'id': '1618020989000_45991-1',
                'label': '*镇痛泵药'
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
                'inputType': 'checkbox'
              },
              'key': '1618020989000_45991'
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
