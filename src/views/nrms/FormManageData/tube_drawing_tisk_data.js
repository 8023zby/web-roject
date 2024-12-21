// 非计划拔管风险评估
export const tubeDrawingRisk =
    [{
      'type': 'table_column_loop',
      'loop': '5',
      'key': '1617262462000_74773',
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
            'text': '无导管'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '年龄（有导管者评估）'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '非高危导管（Ⅱ类导管）'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '高危导管（Ⅰ类导管）'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '高危导管（Ⅰ类导管）'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '其他导管（多次）'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '意识状态'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '管路刀口'
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
                  'key': '1615966742000_43864'
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
              'key': '1603097492000_94255'
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
                'score': 0,
                'id': '1617262462000_53869-0',
                'label': '0分：无导管'
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
              'key': '1617262462000_53869'
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
                'id': '1617262462000_82491-0',
                'label': '1分：年龄≥70岁或年龄<5岁'
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
              'key': '1617262462000_82491'
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
                'id': '1617262462000_19991-0',
                'label': '1分：导尿管',
                'marginBottom': '10px'
              }, {
                'score': 2,
                'id': '1617262462000_19991-1',
                'label': '2分：胃管/鼻肠管',
                'marginBottom': '10px'
              }, {
                'score': 2,
                'id': '1617262462000_19991-2',
                'label': '2分：盆/腹引流管',
                'marginBottom': '10px'
              }, {
                'score': 2,
                'id': '1617262462000_19991-3',
                'label': '2分：胃肠减压管',
                'marginBottom': '10px'
              }, {
                'score': 2,
                'id': '1617262462000_19991-4',
                'label': '2分：深静脉置管',
                'marginBottom': '10px'
              }, {
                'score': 2,
                'id': '1617262462000_19991-5',
                'label': '2分：PICC',
                'marginBottom': '10px'
              }, {
                'score': 2,
                'id': '1617262462000_19991-6',
                'label': '2分：造瘘管',
                'marginBottom': '10px'
              }, {
                'score': 2,
                'id': '1617262462000_19991-7',
                'label': '2分：专科非高危导管',
                'marginBottom': '10px'
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
              'key': '1617262462000_19991'
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
                'score': 3,
                'id': '1617262462000_71891-0',
                'label': '3分：气管插管/切开',
                'marginBottom': '10px'
              }, {
                'score': 3,
                'id': '1617262462000_71891-1',
                'label': '3分：脑室引流管',
                'marginBottom': '10px'
              }, {
                'score': 3,
                'id': '1617262462000_71891-2',
                'label': '3分：心包引流管',
                'marginBottom': '10px'
              }, {
                'score': 3,
                'id': '1617262462000_71891-3',
                'label': '3分：胸腔引流管',
                'marginBottom': '10px'
              }, {
                'score': 3,
                'id': '1617262462000_71891-4',
                'label': '3分：T管引流管',
                'marginBottom': '10px'
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
              'key': '1617262462000_71891'
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
                'score': 3,
                'id': '1617262462000_89025-0',
                'label': '3分：动静脉插管',
                'marginBottom': '10px'
              }, {
                'score': 5,
                'id': '1617262462000_89025-1',
                'label': '5分：专科高危导管',
                'marginBottom': '10px'
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
              'key': '1617262462000_89025'
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
                'score': 2,
                'id': '1617262462000_43797-0',
                'label': '2分：其他导管',
                'marginBottom': '10px'
              }, {
                'score': 3,
                'id': '1617262462000_43797-1',
                'label': '3分：其他导管',
                'marginBottom': '10px'
              }, {
                'score': 5,
                'id': '1617262462000_43797-2',
                'label': '5分：其他导管1',
                'marginBottom': '10px'
              }, {
                'score': 5,
                'id': '1617262462000_43797-3',
                'label': '5分：其他导管2',
                'marginBottom': '10px'
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
              'key': '1617262462000_43797'
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
                'score': 5,
                'id': '1617262462000_53388-0',
                'label': '5分：烦躁/嗜睡/谵妄/意识模糊/精神障碍'
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
              'key': '1617262462000_53388'
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
                'score': 2,
                'id': '1617262462000_79016-0',
                'label': '2分：粘贴固定局部多汗、渗血或分泌物多'
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
              'key': '1617262462000_79016'
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
                  '1617262462000_53869',
                  '1617262462000_82491',
                  '1617262462000_19991',
                  '1617262462000_71891',
                  '1617262462000_89025',
                  '1617262462000_43797',
                  '1617262462000_53388',
                  '1617262462000_79016'
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
              'mConfig': {},
              'type': 'input',
              'value': '',
              'config': {
                'total': [
                  '1617262462000_53869',
                  '1617262462000_82491',
                  '1617262462000_19991',
                  '1617262462000_71891',
                  '1617262462000_89025',
                  '1617262462000_43797',
                  '1617262462000_53388',
                  '1617262462000_79016'
                ],
                'scoreColor': true,
                'setColorKey': '1617930427000_15821',
                'borderLine': 'true',
                'readonly': false,
                'width': '180px',
                'disabled': false,
                'inputType': 'text',
                'prefixWidth': '50px'
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
          'key': '1615966742000_43832'
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
      'key': '1603097492000_94253'
    }, {
      'type': 'table_column_loop',
      'loop': '5',
      'key': '1608003999110_33166',
      'config': {
        'borderWidth': '1px',
        'thWidth': '119px',
        'thAlign': 'center',
        'tdWidth': '186px'
      },
      'thead': [{
        'columns': [{
          'rows': [{
            'text': '低、中风险措施'
          }]
        }]
      }, {
        'columns': [{
          'rows': [{
            'text': '高风险措施'
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
                'id': '1617262462000_47427-0',
                'label': '*关注患者对留置导管的耐受性及依从性',
                'marginBottom': '10px'
              }, {
                'score': 0,
                'id': '1617262462000_38790-0',
                'label': '*每班观察导管位置、深度及固定情况',
                'marginBottom': '10px'
              }, {
                'score': 0,
                'id': '1617262462000_97843-0',
                'label': '*保持导管的通畅，避免扭曲、打折或阻塞',
                'marginBottom': '10px'
              }, {
                'score': 0,
                'id': '1617262462000_2228-0',
                'label': '*观察留置导管引流液的量、色、性质，并准确记录',
                'marginBottom': '10px'
              }, {
                'score': 0,
                'id': '1617262462000_82694-0',
                'label': '*密切观察导管周围皮肤、敷料有无渗血渗液的情况',
                'marginBottom': '10px'
              }, {
                'score': 0,
                'id': '1617262462000_25572-0',
                'label': '*导管标识是否规范',
                'marginBottom': '10px'
              }, {
                'score': 0,
                'id': '1617262462000_49072-0',
                'label': '*查看引流装置的压力是否正常，如常压或负压等',
                'marginBottom': '10px'
              }, {
                'score': 0,
                'id': '1617262462000_48600-0',
                'label': '*向患者家属提供非计划性拔管预防宣教，评估并记录患者和家属的接受情况',
                'marginBottom': '10px'
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
              'key': '1617262462000_47427'
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
                'id': '1617262462000_27193-0',
                'label': '*执行基础护理及非计划性拔管标准预防性干预措施',
                'marginBottom': '10px'
              }, {
                'score': 0,
                'id': '1617262462000_7617-0',
                'label': '*在床位悬挂“高危导管”警示标识',
                'marginBottom': '10px'
              }, {
                'score': 0,
                'id': '1617262462000_77628-0',
                'label': '*实行床头交接班',
                'marginBottom': '10px'
              }, {
                'score': 0,
                'id': '1617262462000_69294-0',
                'label': '*每小时巡视一次（做到七巡视)',
                'marginBottom': '10px'
              }, {
                'score': 0,
                'id': '1617262462000_65762-0',
                'label': '*如患者神志障碍，必要采取适当有效约束',
                'marginBottom': '10px'
              }, {
                'score': 0,
                'id': '1617262462000_254-0',
                'label': '*注意观察约束部位皮肤情况',
                'marginBottom': '10px'
              }, {
                'score': 0,
                'id': '1617262462000_64463-0',
                'label': '*遵医嘱正确合理选择镇痛镇静方案',
                'marginBottom': '10px'
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
              'key': '1617262462000_27193'
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
