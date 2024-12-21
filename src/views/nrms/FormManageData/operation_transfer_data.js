// 手术交接单
export const OperationTransferData = [{
  'mConfig': {},
  'columns': [{
    'padding': '',
    'gapLR': '0',
    'children': [{
      'mConfig': {},
      'columns': [{
        'padding': '0 10px 0 10px',
        'gapLR': '3px',
        'children': [{
          'score': 0,
          'mConfig': {
            'label': '日期',
            'type': 'date'
          },
          'type': 'date',
          'value': '',
          'config': {
            'readonly': false,
            'prefix': '手术日期：',
            'prefixAlign': 'right',
            'width': '150px',
            'disabled': false,
            'placeholder': '',
            'type': 'date',
            'prefixWidth': '90px'
          },
          'key': '1601365086000_82474'
        }, {
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '术前诊断',
            'prefixAlign': 'right',
            'width': '195px',
            'disabled': false,
            'placeholder': '',
            'prefixWidth': '80px'
          },
          'key': '1601365086000_51169'
        }, {
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '拟手术名称',
            'prefixAlign': 'right',
            'width': '245px',
            'disabled': false,
            'placeholder': '',
            'prefixWidth': '90px'
          },
          'key': '1601365086000_49919'
        }],
        'flex': 1,
        'justify': 'flex-start',
        'width': '',
        'childWidth': 'auto',
        'align': 'center',
        'gapTB': '2px',
        'direction': 'row'
      }],
      'type': 'grid',
      'value': '',
      'config': {
        'borderColor': '#ddd',
        'borderWidth': '0',
        'borderStyle': 'solid'
      },
      'key': '1601365086000_19685'
    }, {
      'mConfig': {},
      'columns': [{
        'padding': '0px 10px 0px 10px',
        'gapLR': '3px',
        'children': [{
          'score': 0,
          'mConfig': {
            'gapLR': '5px',
            'justify': 'flex-start',
            'labelWidth': '50px',
            'align': 'flex-start',
            'gapTB': '2px',
            'direction': 'row'
          },
          'options': [{
            'score': 0,
            'id': '1601365086000_8790-1',
            'label': '全麻'
          }, {
            'score': 0,
            'id': '1601365086000_8790-2',
            'label': '硬脊联'
          }, {
            'score': 0,
            'id': '1601365086000_8790-3',
            'label': '硬膜外'
          }, {
            'score': 0,
            'id': '1601365086000_8790-4',
            'label': '颈丛'
          }, {
            'score': 0,
            'id': '1601365086000_8790-5',
            'label': '臂丛'
          }, {
            'score': 0,
            'mWidth': '80px',
            'id': '1601365086000_8790-6',
            'label': '局部麻醉'
          }, {
            'score': 0,
            'children': [{
              'score': 0,
              'mConfig': {},
              'type': 'input',
              'value': '',
              'config': {
                'borderLine': 'true',
                'readonly': false,
                'prefix': '',
                'prefixAlign': 'right',
                'width': '171px',
                'disabled': false,
                'placeholder': '',
                'prefixWidth': '75px'
              },
              'key': '1601365086000_71924'
            }],
            'id': '1601365086000_8790-7',
            'label': '其他'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'prefix': '麻醉方式：',
            'prefixAlign': 'right',
            'prefixWidth': '90px'
          },
          'key': '1601365086000_8790'
        }],
        'flex': 1,
        'justify': 'flex-start',
        'width': '',
        'childWidth': 'auto',
        'align': 'center',
        'gapTB': '2px',
        'direction': 'row'
      }],
      'type': 'grid',
      'value': '',
      'config': {
        'borderColor': '#ddd',
        'borderWidth': '0',
        'borderStyle': 'solid'
      },
      'key': '1601365086000_55039'
    }],
    'flex': 1,
    'justify': 'space-between',
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
  'key': '1601365086000_46932'
}, {
  'mConfig': {
    'title': '术前交接情况记录',
    'isCollapse': true
  },
  'columns': [{
    'padding': '10px',
    'gapLR': '0',
    'children': [{
      'mConfig': {
        'hidden': true
      },
      'type': 'text',
      'value': '',
      'config': {
        'weight': '',
        'label': '术前交接情况记录',
        'align': 'center'
      },
      'key': '1601365086000_92396'
    }],
    'flex': '',
    'justify': 'space-between',
    'width': '40px',
    'childWidth': 'auto',
    'align': 'center',
    'gapTB': '0',
    'direction': 'row'
  }, {
    'padding': '0 10px',
    'gapLR': '0',
    'children': [{
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_97462-1',
        'label': '清醒'
      }, {
        'score': 0,
        'mWidth': '80px',
        'id': '1601365086000_97462-2',
        'label': '意识障碍'
      }, {
        'score': 0,
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'maxlength': 20,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '400px',
            'disabled': false,
            'placeholder': '',
            'prefixWidth': '75px'
          },
          'key': '1601365086000_20267'
        }],
        'id': '1601365086000_97462-3',
        'label': '其他'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '意识状态：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_97462'
    }, {
      'mConfig': {},
      'columns': [{
        'padding': '0',
        'gapLR': '0',
        'children': [{
          'mConfig': {
            'bgColor': '#F8FBFF'
          },
          'type': 'text',
          'value': '',
          'config': {
            'weight': '',
            'label': '生命体征：',
            'align': 'left',
            'width': '90px'
          },
          'key': '1601365086000_21448'
        }],
        'flex': '',
        'justify': 'flex-start',
        'width': '80px',
        'childWidth': 'auto',
        'align': 'center',
        'gapTB': '0',
        'direction': 'row'
      }, {
        'padding': '0',
        'gapLR': '5px',
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '体温',
            'prefixAlign': 'right',
            'suffixAlign': 'left',
            'width': '70px',
            'disabled': false,
            'placeholder': '',
            'suffix': '℃',
            'prefixWidth': '40px',
            'suffixWidth': '40px'
          },
          'key': '1601365086000_84457'
        }, {
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '脉搏',
            'prefixAlign': 'right',
            'suffixAlign': 'left',
            'width': '70px',
            'disabled': false,
            'placeholder': '',
            'suffix': '次/分',
            'prefixWidth': '40px',
            'suffixWidth': '50px'
          },
          'key': '1601365086000_20515'
        }, {
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '呼吸',
            'prefixAlign': 'right',
            'suffixAlign': 'left',
            'width': '70px',
            'disabled': false,
            'placeholder': '',
            'suffix': '次/分',
            'prefixWidth': '40px',
            'suffixWidth': '50px'
          },
          'key': '1601365086000_18602'
        }, {
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '血压',
            'prefixAlign': 'right',
            'suffixAlign': 'left',
            'width': '80px',
            'disabled': false,
            'placeholder': '',
            'suffix': 'mmHg',
            'prefixWidth': '40px',
            'suffixWidth': '40px'
          },
          'key': '1601365086000_30219'
        }],
        'flex': 1,
        'justify': 'flex-start',
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
      'key': '1601365086000_47851'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_53221-1',
        'label': '已禁食'
      }, {
        'score': 0,
        'mWidth': '80px',
        'id': '1601365086000_53221-2',
        'label': '无须禁食'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '术前禁饮食：',
        'prefixAlign': 'left',
        'prefixWidth': '110px'
      },
      'key': '1601365086000_53221'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_86594-1',
        'label': '有'
      }, {
        'score': 0,
        'id': '1601365086000_86594-2',
        'label': '无'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '患者身份核对：',
        'prefixAlign': 'left',
        'prefixWidth': '130px'
      },
      'key': '1601365086000_86594'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_57047-1',
        'label': '无'
      }, {
        'score': 0,
        'id': '1601365086000_57047-2',
        'label': '有：'
      }, {
        'score': 0,
        'mWidth': '80px',
        'id': '1601365086000_57047-3',
        'label': '外周静脉'
      }, {
        'score': 0,
        'mWidth': '80px',
        'id': '1601365086000_57047-4',
        'label': '中心静脉'
      }, {
        'score': 0,
        'id': '1601365086000_57047-5',
        'label': '胃管'
      }, {
        'score': 0,
        'id': '1601365086000_57047-6',
        'label': '尿管'
      }, {
        'score': 0,
        'id': '1601365086000_57047-7',
        'label': '造瘘'
      }, {
        'score': 0,
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '150px',
            'disabled': false,
            'placeholder': '',
            'prefixWidth': '75px'
          },
          'key': '1601365086000_12042'
        }],
        'id': '1601365086000_57047-8',
        'label': '其他'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'marginRight': '15px',
        'prefix': '术前留置：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_57047'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_68706-1',
        'label': '正常'
      }, {
        'score': 0,
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'maxlength': 20,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '300px',
            'disabled': false,
            'placeholder': '',
            'prefixWidth': '75px'
          },
          'key': '1601365086000_78570'
        }],
        'id': '1601365086000_68706-2',
        'label': '异常'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '皮肤情况：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_68706'
    }, {
      'mConfig': {},
      'columns': [{
        'padding': '0',
        'gapLR': '0',
        'children': [{
          'score': 0,
          'mConfig': {
            'gapLR': '5px',
            'justify': 'flex-start',
            'labelWidth': '50px',
            'align': 'flex-start',
            'gapTB': '5px',
            'direction': 'row'
          },
          'options': [{
            'score': 0,
            'id': '1601365086000_24447-1',
            'label': '有'
          }, {
            'score': 0,
            'id': '1601365086000_24447-2',
            'label': '无'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'prefix': '皮肤准备：',
            'prefixAlign': 'left',
            'prefixWidth': '90px'
          },
          'key': '1601365086000_24447'
        }],
        'flex': 1,
        'justify': 'flex-start',
        'width': '',
        'childWidth': 'auto',
        'align': 'center',
        'gapTB': '0',
        'direction': 'row'
      }, {
        'padding': '0',
        'gapLR': '5px',
        'children': [{
          'score': 0,
          'mConfig': {
            'gapLR': '5px',
            'justify': 'flex-start',
            'labelWidth': '50px',
            'align': 'flex-start',
            'gapTB': '5px',
            'direction': 'row'
          },
          'options': [{
            'score': 0,
            'id': '1601365086000_87990-1',
            'label': '有'
          }, {
            'score': 0,
            'id': '1601365086000_87990-2',
            'label': '无'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'prefix': '排空大小便：',
            'prefixAlign': 'right',
            'prefixWidth': '120px'
          },
          'key': '1601365086000_87990'
        }],
        'flex': '',
        'justify': 'flex-start',
        'width': '500px',
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
      'key': '1601365086000_87240'
    }, {
      'mConfig': {},
      'columns': [{
        'padding': '0',
        'gapLR': '0',
        'children': [{
          'score': 0,
          'mConfig': {
            'gapLR': '5px',
            'justify': 'flex-start',
            'labelWidth': '50px',
            'align': 'flex-start',
            'gapTB': '5px',
            'direction': 'row'
          },
          'options': [{
            'score': 0,
            'id': '1601365086000_47864-1',
            'label': '已摘除'
          }, {
            'score': 0,
            'mWidth': '80px',
            'id': '1601365086000_47864-2',
            'label': '无法摘除'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'prefix': '首饰、发卡：',
            'prefixAlign': 'left',
            'prefixWidth': '110px'
          },
          'key': '1601365086000_47864'
        }],
        'flex': 1,
        'justify': 'flex-start',
        'width': '',
        'childWidth': 'auto',
        'align': 'center',
        'gapTB': '0',
        'direction': 'row'
      }, {
        'padding': '0',
        'gapLR': '5px',
        'children': [{
          'score': 0,
          'mConfig': {
            'gapLR': '5px',
            'justify': 'flex-start',
            'labelWidth': '50px',
            'align': 'flex-start',
            'gapTB': '5px',
            'direction': 'row'
          },
          'options': [{
            'score': 0,
            'id': '1601365086000_48633-1',
            'label': '已摘除'
          }, {
            'score': 0,
            'id': '1601365086000_48633-2',
            'label': '固定'
          }, {
            'score': 0,
            'id': '1601365086000_48633-3',
            'label': '无'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'prefix': '义齿：',
            'prefixAlign': 'right',
            'prefixWidth': '80px'
          },
          'key': '1601365086000_48633'
        }],
        'flex': '',
        'justify': 'flex-start',
        'width': '500px',
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
      'key': '1601365086000_66327'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_91033-1',
        'label': '有'
      }, {
        'score': 0,
        'id': '1601365086000_91033-2',
        'label': '无'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '手术部位标识：',
        'prefixAlign': 'left',
        'prefixWidth': '130px'
      },
      'key': '1601365086000_91033'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_84600-1',
        'label': '已执行'
      }, {
        'score': 0,
        'id': '1601365086000_84600-2',
        'label': '无'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '术前用药：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_84600'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_93642-1',
        'label': '病历'
      }, {
        'score': 0,
        'mWidth': '80px',
        'id': '1601365086000_93642-2',
        'label': '影像资料'
      }, {
        'score': 0,
        'mWidth': '80px',
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'maxlength': 20,
            'width': '300px',
            'disabled': false
          },
          'key': '1601365086000_15226'
        }],
        'id': '1601365086000_93642-3',
        'label': '血液制品：'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '携带物品：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_93642'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_97985-1',
        'label': '无'
      }, {
        'score': 0,
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'maxlength': 100,
            'prefix': '药品名称：',
            'prefixAlign': 'right',
            'width': '500px',
            'disabled': false,
            'inputType': 'textarea',
            'rows': 3,
            'prefixWidth': '90px',
            'autosize': false
          },
          'key': '1601365086000_63091'
        }],
        'id': '1601365086000_97985-2',
        'label': '有'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '术中带药：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_97985'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_97266-1',
        'label': '无'
      }, {
        'score': 0,
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'maxlength': 50,
            'prefix': '物品名称：',
            'prefixAlign': 'right',
            'width': '500px',
            'disabled': false,
            'inputType': 'textarea',
            'prefixWidth': '90px'
          },
          'key': '1601365086000_1146'
        }],
        'id': '1601365086000_97266-2',
        'label': '有'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '带物品：',
        'prefixAlign': 'left',
        'prefixWidth': '80px'
      },
      'key': '1601365086000_97266'
    }, {
      'mConfig': {},
      'columns': [{
        'padding': '0',
        'gapLR': '0',
        'children': [{
          'mConfig': {},
          'type': 'text',
          'value': '',
          'config': {
            'weight': '',
            'label': '病区护士签名：',
            'align': 'center'
          },
          'key': '1601365086000_32424'
        }],
        'flex': 1,
        'justify': 'flex-start',
        'width': '250px',
        'childWidth': 'auto',
        'align': 'center',
        'gapTB': '0',
        'direction': 'row'
      }, {
        'padding': '0',
        'gapLR': '5px',
        'children': [{
          'mConfig': {},
          'type': 'text',
          'value': '',
          'config': {
            'weight': '',
            'label': '离开病房时间：',
            'align': 'center'
          },
          'key': '1601365086000_51401'
        }],
        'flex': 1,
        'justify': 'flex-start',
        'width': '250px',
        'childWidth': 'auto',
        'align': 'center',
        'gapTB': '0',
        'direction': 'row'
      }, {
        'padding': '0',
        'gapLR': '5px',
        'children': [{
          'mConfig': {},
          'type': 'text',
          'value': '',
          'config': {
            'weight': '',
            'label': '手术室接病人者签名：',
            'align': 'center'
          },
          'key': '1601365086000_68897'
        }],
        'flex': 1,
        'justify': 'flex-start',
        'width': '250px',
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
      'key': '1601365086000_12854'
    }],
    'flex': 1,
    'justify': 'flex-start',
    'width': '',
    'childWidth': 'auto',
    'align': 'flex-start',
    'gapTB': '2px',
    'direction': 'column'
  }],
  'type': 'grid',
  'value': '',
  'config': {
    'borderColor': '#ddd',
    'borderWidth': '1px',
    'borderStyle': 'solid'
  },
  'key': '1601365086000_36818'
}, {
  'mConfig': {
    'title': '复苏室交接记录',
    'isCollapse': true
  },
  'columns': [{
    'padding': '10px',
    'gapLR': '0',
    'children': [{
      'mConfig': {
        'hidden': true
      },
      'type': 'text',
      'value': '',
      'config': {
        'weight': '',
        'label': '复苏室交接记录',
        'align': 'center'
      },
      'key': '1601365086000_13498'
    }],
    'flex': '',
    'justify': 'space-between',
    'width': '40px',
    'childWidth': 'auto',
    'align': 'center',
    'gapTB': '0',
    'direction': 'row'
  }, {
    'padding': '0 10px',
    'gapLR': '0',
    'children': [{
      'mConfig': {},
      'columns': [{
        'padding': '0',
        'gapLR': '0',
        'children': [{
          'mConfig': {
            'bgColor': '#F8FBFF'
          },
          'type': 'text',
          'value': '',
          'config': {
            'weight': '',
            'label': '生命体征：',
            'align': 'left',
            'width': '90px'
          },
          'key': '1601365086000_3049'
        }],
        'flex': '',
        'justify': 'flex-start',
        'width': '80px',
        'childWidth': 'auto',
        'align': 'center',
        'gapTB': '0',
        'direction': 'row'
      }, {
        'padding': '0',
        'gapLR': '5px',
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '脉搏：',
            'prefixAlign': 'right',
            'suffixAlign': 'left',
            'width': '70px',
            'disabled': false,
            'placeholder': '',
            'suffix': '次/分',
            'prefixWidth': '60px',
            'suffixWidth': '50px'
          },
          'key': '1601365086000_3916'
        }, {
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '血压：',
            'prefixAlign': 'right',
            'suffixAlign': 'left',
            'width': '70px',
            'disabled': false,
            'placeholder': '',
            'suffix': 'mmHg',
            'prefixWidth': '60px',
            'suffixWidth': '50px'
          },
          'key': '1601365086000_48328'
        }, {
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '氧饱和度：',
            'prefixAlign': 'right',
            'suffixAlign': 'left',
            'width': '70px',
            'disabled': false,
            'placeholder': '',
            'suffix': '%',
            'prefixWidth': '100px',
            'suffixWidth': '40px'
          },
          'key': '1601365086000_21559'
        }],
        'flex': 1,
        'justify': 'flex-start',
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
      'key': '1601365086000_23743'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_47155-1',
        'label': '清醒'
      }, {
        'score': 0,
        'id': '1601365086000_47155-2',
        'label': '半清醒'
      }, {
        'score': 0,
        'id': '1601365086000_47155-3',
        'label': '未清醒'
      }, {
        'score': 0,
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '200px',
            'disabled': false,
            'placeholder': '',
            'prefixWidth': '75px'
          },
          'key': '1601365086000_54551'
        }],
        'id': '1601365086000_47155-4',
        'label': '其他'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '意识状态：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_47155'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_56475-1',
        'label': '病历'
      }, {
        'score': 0,
        'mWidth': '80px',
        'id': '1601365086000_56475-2',
        'label': '影像资料'
      }, {
        'score': 0,
        'mWidth': '80px',
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'maxlength': 20,
            'width': '300px',
            'disabled': false
          },
          'key': '1601365086000_68084'
        }],
        'id': '1601365086000_56475-3',
        'label': '血液制品：'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '携带物品：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_56475'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_9265-1',
        'label': '无'
      }, {
        'score': 0,
        'id': '1601365086000_9265-2',
        'label': '有：'
      }, {
        'score': 0,
        'mWidth': '80px',
        'id': '1601365086000_9265-3',
        'label': '气管插管'
      }, {
        'score': 0,
        'id': '1601365086000_9265-4',
        'label': '胃管'
      }, {
        'score': 0,
        'id': '1601365086000_9265-5',
        'label': '尿管'
      }, {
        'score': 0,
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'suffixAlign': 'left',
            'width': '50px',
            'disabled': false,
            'suffix': '根',
            'suffixWidth': '40px'
          },
          'key': '1601365086000_61508'
        }, {
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'maxlength': 20,
            'prefix': '其他',
            'prefixAlign': 'right',
            'width': '100px',
            'disabled': false,
            'inputType': 'textarea',
            'prefixWidth': '40px'
          },
          'key': '1601365086000_43175'
        }],
        'id': '1601365086000_9265-6',
        'label': '引流管'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'marginRight': '20px',
        'prefix': '术后管路：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_9265'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_64568-1',
        'label': '正常'
      }, {
        'score': 0,
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'maxlength': 20,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '300px',
            'disabled': false,
            'placeholder': '',
            'prefixWidth': '75px'
          },
          'key': '1601365086000_32347'
        }],
        'id': '1601365086000_64568-2',
        'label': '异常'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '皮肤情况：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_64568'
    }, {
      'score': 0,
      'mConfig': {},
      'type': 'input',
      'value': '',
      'config': {
        'borderLine': 'true',
        'readonly': false,
        'maxlength': 50,
        'prefix': '备注：',
        'prefixAlign': 'left',
        'width': '500px',
        'disabled': false,
        'inputType': 'textarea',
        'placeholder': '',
        'prefixWidth': '80px'
      },
      'key': '1601365086000_4143'
    }, {
      'mConfig': {},
      'columns': [{
        'padding': '0',
        'gapLR': '0',
        'children': [{
          'mConfig': {},
          'type': 'text',
          'value': '',
          'config': {
            'weight': '',
            'label': '入复苏室时间：',
            'align': 'center'
          },
          'key': '1601365086000_16624'
        }],
        'flex': 1,
        'justify': 'flex-start',
        'width': '400px',
        'childWidth': 'auto',
        'align': 'center',
        'gapTB': '0',
        'direction': 'row'
      }, {
        'padding': '0',
        'gapLR': '5px',
        'children': [{
          'mConfig': {},
          'type': 'text',
          'value': '',
          'config': {
            'weight': '',
            'label': '复苏室护士签名：',
            'align': 'center'
          },
          'key': '1601365086000_14474'
        }],
        'flex': 1,
        'justify': 'flex-start',
        'width': '400px',
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
      'key': '1601365086000_69439'
    }, {
      'mConfig': {},
      'type': 'text',
      'value': '',
      'config': {
        'weight': 'bold',
        'label': '备注：患者未入复苏室（PACU）无需填写',
        'align': 'center'
      },
      'key': '1601365086000_10732'
    }],
    'flex': 1,
    'justify': 'flex-start',
    'width': '',
    'childWidth': 'auto',
    'align': 'flex-start',
    'gapTB': '2px',
    'direction': 'column'
  }],
  'type': 'grid',
  'value': '',
  'config': {
    'borderColor': '#ddd',
    'borderWidth': '1px',
    'borderStyle': 'solid'
  },
  'key': '1601365086000_7329'
}, {
  'mConfig': {
    'title': '术后返回病房交接记录',
    'isCollapse': true
  },
  'columns': [{
    'padding': '10px',
    'gapLR': '0',
    'children': [{
      'mConfig': {
        'hidden': true
      },
      'type': 'text',
      'value': '',
      'config': {
        'weight': '',
        'label': '术后返回病房交接记录',
        'align': 'center'
      },
      'key': '1601365086000_29882'
    }],
    'flex': '',
    'justify': 'center',
    'width': '40px',
    'childWidth': 'auto',
    'align': 'flex-start',
    'gapTB': '0',
    'direction': 'column'
  }, {
    'padding': '0 10px',
    'gapLR': '0',
    'children': [{
      'mConfig': {},
      'columns': [{
        'padding': '0',
        'gapLR': '0',
        'children': [{
          'mConfig': {
            'bgColor': '#F8FBFF'
          },
          'type': 'text',
          'value': '',
          'config': {
            'weight': '',
            'label': '生命体征：',
            'align': 'left',
            'width': '90px'
          },
          'key': '1601365086000_26084'
        }],
        'flex': '',
        'justify': 'flex-start',
        'width': '80px',
        'childWidth': 'auto',
        'align': 'center',
        'gapTB': '0',
        'direction': 'row'
      }, {
        'padding': '0',
        'gapLR': '5px',
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '脉搏：',
            'prefixAlign': 'right',
            'suffixAlign': 'left',
            'width': '70px',
            'disabled': false,
            'placeholder': '',
            'suffix': '次/分',
            'prefixWidth': '60px',
            'suffixWidth': '50px'
          },
          'key': '1601365086000_58254'
        }, {
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '血压：',
            'prefixAlign': 'right',
            'suffixAlign': 'left',
            'width': '70px',
            'disabled': false,
            'placeholder': '',
            'suffix': 'mmHg',
            'prefixWidth': '60px',
            'suffixWidth': '50px'
          },
          'key': '1601365086000_61020'
        }, {
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '氧饱和度：',
            'prefixAlign': 'right',
            'suffixAlign': 'left',
            'width': '70px',
            'disabled': false,
            'placeholder': '',
            'suffix': '%',
            'prefixWidth': '100px',
            'suffixWidth': '40px'
          },
          'key': '1601365086000_99406'
        }],
        'flex': 1,
        'justify': 'flex-start',
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
      'key': '1601365086000_90122'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_76517-1',
        'label': '清醒'
      }, {
        'score': 0,
        'id': '1601365086000_76517-2',
        'label': '半清醒'
      }, {
        'score': 0,
        'id': '1601365086000_76517-3',
        'label': '未清醒'
      }, {
        'score': 0,
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'maxlength': 20,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '300px',
            'disabled': false,
            'placeholder': '',
            'prefixWidth': '75px'
          },
          'key': '1601365086000_12135'
        }],
        'id': '1601365086000_76517-4',
        'label': '其他'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '意识状态：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_76517'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_76806-1',
        'label': '有'
      }, {
        'score': 0,
        'id': '1601365086000_76806-2',
        'label': '无'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '患者身份核对：',
        'prefixAlign': 'left',
        'prefixWidth': '130px'
      },
      'key': '1601365086000_76806'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_4529-1',
        'label': '有'
      }, {
        'score': 0,
        'id': '1601365086000_4529-2',
        'label': '无'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '镇痛泵：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_4529'
    },
    {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_34242-1',
        'label': '正常'
      }, {
        'score': 0,
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'maxlength': 20,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '300px',
            'disabled': false,
            'placeholder': '',
            'prefixWidth': '75px'
          },
          'key': '1601365086000_23212'
        }],
        'id': '1601365086000_34242-2',
        'label': '异常'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'prefix': '皮肤情况：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_34242'
    },
    {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_95921-1',
        'label': '无'
      }, {
        'score': 0,
        'children': [{
          'score': 0,
          'mConfig': {
            'gapLR': '5px',
            'justify': 'flex-start',
            'labelWidth': '50px',
            'align': 'flex-start',
            'gapTB': '5px',
            'direction': 'row'
          },
          'options': [{
            'score': 0,
            'mWidth': '80px',
            'id': '1601365086000_17820-1',
            'label': '外周静脉'
          }, {
            'score': 0,
            'mWidth': '80px',
            'id': '1601365086000_17820-2',
            'label': '中心静脉'
          }, {
            'score': 0,
            'children': [{
              'score': 0,
              'mConfig': {},
              'type': 'input',
              'value': '',
              'config': {
                'borderLine': 'true',
                'readonly': false,
                'width': '80px',
                'disabled': false
              },
              'key': '1601365086000_66762'
            }, {
              'score': 0,
              'mConfig': {},
              'type': 'input',
              'value': '',
              'config': {
                'borderLine': 'true',
                'readonly': false,
                'prefix': '输注药品（血制品）:',
                'prefixAlign': 'right',
                'width': '100px',
                'disabled': false,
                'prefixWidth': '155px'
              },
              'key': '1601365086000_67387'
            }],
            'id': '1601365086000_17820-3',
            'label': '其他'
          }],
          'type': 'checkbox',
          'value': [],
          'config': {
            'marginRight': '20px',
            'prefix': '',
            'prefixAlign': 'left',
            'prefixWidth': '70px'
          },
          'key': '1601365086000_17820'
        }],
        'id': '1601365086000_95921-2',
        'label': '有：'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'marginRight': '20px',
        'prefix': '静脉通路：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_95921'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_8020-1',
        'label': '无'
      }, {
        'score': 0,
        'id': '1601365086000_8020-2',
        'label': '有：'
      }, {
        'score': 0,
        'mWidth': '80px',
        'id': '1601365086000_8020-3',
        'label': '气管插管'
      }, {
        'score': 0,
        'id': '1601365086000_8020-4',
        'label': '胃管'
      }, {
        'score': 0,
        'id': '1601365086000_8020-5',
        'label': '尿管'
      }, {
        'score': 0,
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'suffixAlign': 'left',
            'width': '50px',
            'disabled': false,
            'suffix': '根',
            'suffixWidth': '40px'
          },
          'key': '1601365086000_33585'
        }, {
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '其他',
            'prefixAlign': 'right',
            'width': '100px',
            'disabled': false,
            'prefixWidth': '40px'
          },
          'key': '1601365086000_94884'
        }],
        'id': '1601365086000_8020-6',
        'label': '引流管'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'marginRight': '20px',
        'prefix': '术后管路：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_8020'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'mWidth': '80px',
        'id': '1601365086000_62954-1',
        'label': '影像资料'
      }, {
        'score': 0,
        'id': '1601365086000_62954-2',
        'label': '病历'
      }, {
        'score': 0,
        'mWidth': '80px',
        'id': '1601365086000_62954-3',
        'label': '血液制品'
      }, {
        'score': 0,
        'mWidth': '100px',
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'width': '100px',
            'disabled': false
          },
          'key': '1601365086000_48272'
        }, {
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'prefix': '其他',
            'prefixAlign': 'right',
            'width': '100px',
            'disabled': false,
            'prefixWidth': '40px'
          },
          'key': '1601365086000_75302'
        }],
        'id': '1601365086000_62954-4',
        'label': '血液制品名称：'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'marginRight': '20px',
        'prefix': '携带物品：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_62954'
    }, {
      'score': 0,
      'mConfig': {
        'gapLR': '5px',
        'justify': 'flex-start',
        'labelWidth': '50px',
        'align': 'flex-start',
        'gapTB': '5px',
        'direction': 'row'
      },
      'options': [{
        'score': 0,
        'id': '1601365086000_12730-1',
        'label': '无'
      }, {
        'score': 0,
        'children': [{
          'score': 0,
          'mConfig': {},
          'type': 'input',
          'value': '',
          'config': {
            'borderLine': 'true',
            'readonly': false,
            'maxlength': 50,
            'prefix': '药品名称：',
            'prefixAlign': 'right',
            'width': '300px',
            'disabled': false,
            'inputType': 'textarea',
            'prefixWidth': '80px'
          },
          'key': '1601365086000_41166'
        }],
        'id': '1601365086000_12730-2',
        'label': '有'
      }],
      'type': 'checkbox',
      'value': [],
      'config': {
        'marginRight': '20px',
        'prefix': '带回药品：',
        'prefixAlign': 'left',
        'prefixWidth': '90px'
      },
      'key': '1601365086000_12730'
    }, {
      'mConfig': {},
      'columns': [{
        'padding': '0',
        'gapLR': '0',
        'children': [{
          'mConfig': {},
          'type': 'text',
          'value': '',
          'config': {
            'weight': '',
            'label': '返回病房时间：',
            'align': 'center'
          },
          'key': '1601365086000_71848'
        }],
        'flex': 1,
        'justify': 'flex-start',
        'width': '250px',
        'childWidth': 'auto',
        'align': 'center',
        'gapTB': '0',
        'direction': 'row'
      }, {
        'padding': '0',
        'gapLR': '5px',
        'children': [{
          'mConfig': {},
          'type': 'text',
          'value': '',
          'config': {
            'weight': '',
            'label': '手术室护士签名：',
            'align': 'center'
          },
          'key': '1601365086000_49729'
        }],
        'flex': 1,
        'justify': 'flex-start',
        'width': '250px',
        'childWidth': 'auto',
        'align': 'center',
        'gapTB': '0',
        'direction': 'row'
      }, {
        'padding': '0',
        'gapLR': '5px',
        'children': [{
          'mConfig': {},
          'type': 'text',
          'value': '',
          'config': {
            'weight': '',
            'label': '病区护士签名：',
            'align': 'center'
          },
          'key': '1601365086000_36644'
        }],
        'flex': 1,
        'justify': 'flex-start',
        'width': '250px',
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
      'key': '1601365086000_49265'
    }],
    'flex': 1,
    'justify': 'flex-start',
    'width': '',
    'childWidth': 'auto',
    'align': 'flex-start',
    'gapTB': '2px',
    'direction': 'column'
  }],
  'type': 'grid',
  'value': '',
  'config': {
    'borderColor': '#ddd',
    'borderWidth': '1px',
    'borderStyle': 'solid'
  },
  'key': '1601365086000_70574'
}]
