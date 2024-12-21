/*
 * @Description: 压疮json表单
 * @Author: bjp
 * @Date: 2021-03-31 14:27:06
 */
export const yachuangJSON = [{
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
              'key': '1617764922000_69932'
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
          'key': '1617764922000_73046'
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
          'key': '1617764922000_30984'
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
            'readonly': false,
            'showFormat': 'HH:mm',
            'prefixAlign': 'right',
            'width': '160px',
            'disabled': false,
            'placeholder': '',
            'type': 'time'
          },
          'key': '1617764922000_28773'
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
          'key': '1617764922000_14354'
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
            'id': '1617764922000_59005-0',
            'label': '10分:病人为压疮高风险,风险因素为',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1617764922000_59005-1',
            'label': '0分:强迫体位患者',
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
          'key': '1617764922000_59005'
        }],
        'config': {
          'align': 'flex-start'
        }
      }]
    }]
  }, {
    'columns': [{
      'thHeight': '61px',
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 0,
            'id': '1617764922000_38969-0',
            'label': '0分:提示:满足上方条件以下内容无需再评',
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
          'key': '1617764922000_38969'
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
            'id': '1617764922000_73543-0',
            'label': '1分:完全受限',
            'marginLeft': '6px'
          }, {
            'score': 2,
            'id': '1617764922000_73543-1',
            'label': '2分:大部分受限',
            'marginLeft': '6px'
          }, {
            'score': 3,
            'id': '1617764922000_73543-2',
            'label': '3分:轻度受限',
            'marginLeft': '6px'
          }, {
            'score': 4,
            'id': '1617764922000_73543-3',
            'label': '4分:没有改变',
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
          'key': '1617764922000_73543'
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
            'id': '1617764922000_84735-0',
            'label': '1分:持续潮湿',
            'marginLeft': '6px'
          }, {
            'score': 2,
            'id': '1617764922000_84735-1',
            'label': '2分:经常潮湿',
            'marginLeft': '6px'
          }, {
            'score': 3,
            'id': '1617764922000_84735-2',
            'label': '3分:偶尔潮湿',
            'marginLeft': '6px'
          }, {
            'score': 4,
            'id': '1617764922000_84735-3',
            'label': '4分:很少潮湿',
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
          'key': '1617764922000_84735'
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
            'id': '1617764922000_27679-0',
            'label': '1分:卧床不起',
            'marginLeft': '6px'
          }, {
            'score': 2,
            'id': '1617764922000_27679-1',
            'label': '2分:局限于轮椅',
            'marginLeft': '6px'
          }, {
            'score': 3,
            'id': '1617764922000_27679-2',
            'label': '3分:可偶尔步行',
            'marginLeft': '6px'
          }, {
            'score': 4,
            'id': '1617764922000_27679-3',
            'label': '4分:经常步行',
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
          'key': '1617764922000_27679'
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
            'id': '1617764922000_55982-0',
            'label': '1分:完全受限',
            'marginLeft': '6px'
          }, {
            'score': 2,
            'id': '1617764922000_55982-1',
            'label': '2分:严重受限',
            'marginLeft': '6px'
          }, {
            'score': 3,
            'id': '1617764922000_55982-2',
            'label': '3分:轻度受限',
            'marginLeft': '6px'
          }, {
            'score': 4,
            'id': '1617764922000_55982-3',
            'label': '4分:不受限',
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
          'key': '1617764922000_55982'
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
            'id': '1617764922000_68313-0',
            'label': '1分:重度营养摄入不足',
            'marginLeft': '6px'
          }, {
            'score': 2,
            'id': '1617764922000_68313-1',
            'label': '2分:营养摄入不足',
            'marginLeft': '6px'
          }, {
            'score': 3,
            'id': '1617764922000_68313-2',
            'label': '3分:营养摄入适当',
            'marginLeft': '6px'
          }, {
            'score': 4,
            'id': '1617764922000_68313-3',
            'label': '4分:营养摄入良好',
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
          'key': '1617764922000_68313'
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
            'id': '1617764922000_82011-0',
            'label': '1分:有此问题',
            'marginLeft': '6px'
          }, {
            'score': 2,
            'id': '1617764922000_82011-1',
            'label': '2分:有潜在问题',
            'marginLeft': '6px'
          }, {
            'score': 3,
            'id': '1617764922000_82011-2',
            'label': '3分:无明显问题',
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
          'key': '1617764922000_82011'
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
              '1617764922000_59005',
              '1617764922000_38969',
              '1617764922000_73543',
              '1617764922000_84735',
              '1617764922000_27679',
              '1617764922000_55982',
              '1617764922000_68313',
              '1617764922000_82011' ],
            'borderLine': true,
            'readonly': false,
            'suffixAlign': 'center',
            'width': '180px',
            'disabled': false,
            'inputType': 'text',
            'hasTextAlign': true
          },
          'key': '1617764922000_69465'
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
              '1617764922000_59005',
              '1617764922000_38969',
              '1617764922000_73543',
              '1617764922000_84735',
              '1617764922000_27679',
              '1617764922000_55982',
              '1617764922000_68313',
              '1617764922000_82011'
            ],
            'setColorKey': '1617930543000_44678',
            'scoreColor': true,
            'borderLine': true,
            'readonly': false,
            'width': '180px',
            'disabled': false,
            'inputType': 'text',
            'prefixWidth': '50px',
            'hasTextAlign': true
          },
          'key': '1617764922000_58371'
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
          'key': '1617930543000_44678'
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
        'text': '自动列入压疮高风险患者'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '自动列入高风险患者(以下内容无需再评)'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '感知能力'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '皮肤湿度'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '活动能力'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '移动能力'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '营养'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '摩擦力和剪切力'
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
  'key': '1617764922000_33820',
  'tbodyList': []
},

{
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
      'key': '1617764922000_28458'
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
  'key': '1617764922000_67388'
},
{
  'loop': '5',
  'tbody': [{
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'options': [{
            'score': 0,
            'id': '1617764922000_45154-0',
            'label': '高危以上患者填写《护理风险高危通知书》',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1617764922000_45154-1',
            'label': '床尾放置防压疮警示标识',
            'marginLeft': '6px'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'marginRight': '0px',
            'borderLine': true,
            'readonly': false,
            'disabled': false,
            'inputType': 'checkbox'
          },
          'key': '1617764922000_45154'
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
            'score': 0,
            'id': '1617764922000_37470-0',
            'label': '清洁皮肤:勤清洗、勤更换,禁用碱性护肤品',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1617764922000_37470-1',
            'label': '皮肤保护:使用薄膜敷料、水胶体敷料',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1617764922000_37470-2',
            'label': '皮肤保护:泡沫敷料、多层硅胶敷料',
            'marginLeft': '6px'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'borderLine': true,
            'readonly': false,
            'disabled': false,
            'inputType': 'checkbox'
          },
          'key': '1617764922000_37470'
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
            'score': 0,
            'id': '1617764922000_45004-0',
            'label': '安置合适的体位',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1617764922000_45004-1',
            'label': '协助患者定时改变体位',
            'marginLeft': '6px'
          }, {
            'score': 0,
            'id': '1617764922000_45004-2',
            'label': '避免躺卧姿势如90°侧卧位、半斜卧位',
            'marginLeft': '6px'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'borderLine': true,
            'readonly': false,
            'disabled': false,
            'inputType': 'checkbox'
          },
          'key': '1617764922000_45004'
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
            'score': 0,
            'id': '1617764922000_96982-0',
            'label': '增大支撑面与人体的接触面(低压床垫、减压坐垫等)',
            'marginLeft': '6px'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'borderLine': true,
            'readonly': false,
            'disabled': false,
            'inputType': 'checkbox'
          },
          'key': '1617764922000_96982'
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
            'score': 0,
            'id': '1617764922000_35049-0',
            'label': '加强营养支持',
            'marginLeft': '6px'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'borderLine': true,
            'readonly': false,
            'disabled': false,
            'inputType': 'checkbox'
          },
          'key': '1617764922000_35049'
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
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': true,
            'readonly': true,
            'width': '180px',
            'disabled': false,
            'inputType': 'text',
            'prefixWidth': '50px',
            'hasTextAlign': true,
            'default': 'nurseName'
          },
          'key': '1617764922000_87972'
        }]
      }]
    }]
  }],
  'thead': [{
    'columns': [{
      'rows': [{
        'text': '高危以上'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '皮肤护理'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '体位安装与变换'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '支撑面与接触面'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '加强营养支持'
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
  'key': '1617266399000_91972',
  'tbodyList': []
}]
