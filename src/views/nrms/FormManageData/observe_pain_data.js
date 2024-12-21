export const ObservePainData = [{
  'type': 'table_column_loop',
  'loop': '6',
  'key': '1608003999000_33166',
  'config': {
    'borderWidth': '1px',
    'thWidth': '100px',
    'thAlign': 'center',
    'tdWidth': '158px'
  },
  'thead': [{
    'columns': [{
      'rows': [{
        'text': '日期'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '时间'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '疼痛评分'
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
        'text': '疼痛程度'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '持续时间'
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
        'text': '加重因素'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '缓解因素'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '睡眠影响'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '心理状况'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '治疗依从性'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '护理措施'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '治疗措施'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '药物',
        'columnNumber': 3
      }]
    }, {
      'rows': [{
        'text': '药名'
      }, {
        'text': '剂量'
      }, {
        'text': '途径'
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'text': '再评估'
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
          'score': 0,
          'type': 'date',
          'value': '',
          'config': {
            'readonly': false,
            'prefixAlign': 'right',
            'width': '140px',
            'disabled': false,
            'placeholder': '',
            'type': 'date'
          },
          'key': '1608003999000_12725'
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
          'config': {
            'readonly': false,
            'prefixAlign': 'right',
            'width': '140px',
            'disabled': false,
            'placeholder': '',
            'type': 'time'
          },
          'key': '1608003999000_7356'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1608003999000_44105-0',
            'label': '0'
          }, {
            'score': 0,
            'id': '1608003999000_44105-1',
            'label': '1'
          }, {
            'score': 0,
            'id': '1608003999000_44105-2',
            'label': '2'
          }, {
            'score': 0,
            'id': '1608003999000_44105-3',
            'label': '3'
          }, {
            'score': 0,
            'id': '1608003999000_44105-4',
            'label': '4'
          }, {
            'score': 0,
            'id': '1608003999000_44105-5',
            'label': '5'
          }, {
            'score': 0,
            'id': '1608003999000_44105-6',
            'label': '6'
          }, {
            'score': 0,
            'id': '1608003999000_44105-7',
            'label': '7'
          }, {
            'score': 0,
            'id': '1608003999000_44105-8',
            'label': '8'
          }, {
            'score': 0,
            'id': '1608003999000_44105-9',
            'label': '9'
          }, {
            'score': 0,
            'id': '1608003999000_44105-10',
            'label': '10'
          }],
          'type': 'select',
          'value': '',
          'config': {
            'size': 'medium',
            'width': '140px',
            'clearable': true
          },
          'key': '1608003999000_44105'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'type': 'import',
          'value': '',
          'config': {
            'importType': 'pain_position'
          },
          'key': '1608003999000_23252'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1608003999000_12190-0',
            'label': '刀割样痛'
          }, {
            'score': 0,
            'id': '1608003999000_12190-1',
            'label': '针刺样痛'
          }, {
            'score': 0,
            'id': '1608003999000_12190-2',
            'label': '牵拉样痛'
          }, {
            'score': 0,
            'id': '1608003999000_12190-3',
            'label': '麻木样痛'
          }, {
            'score': 0,
            'id': '1608003999000_12190-4',
            'label': '烧灼样痛'
          }, {
            'score': 0,
            'id': '1608003999000_12190-5',
            'label': '轻触电'
          }, {
            'score': 0,
            'id': '1608003999000_12190-6',
            'label': '电击样痛'
          }, {
            'score': 0,
            'id': '1608003999000_12190-7',
            'label': '其他：跳痛'
          }, {
            'score': 0,
            'id': '1608003999000_12190-8',
            'label': '绞痛'
          }, {
            'score': 0,
            'id': '1608003999000_12190-9',
            'label': '胀痛'
          }, {
            'score': 0,
            'id': '1608003999000_12190-10',
            'label': '坠痛'
          }, {
            'score': 0,
            'id': '1608003999000_12190-11',
            'label': '酸痛'
          }],
          'type': 'select',
          'value': '',
          'config': {
            'size': 'medium',
            'width': '140px',
            'clearable': true
          },
          'key': '1608003999000_12190'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1608003999000_15794-0',
            'label': '0 无痛'
          }, {
            'score': 0,
            'id': '1608003999000_15794-1',
            'label': '1-3 轻度疼痛'
          }, {
            'score': 0,
            'id': '1608003999000_15794-2',
            'label': '4-6 中度疼痛'
          }, {
            'score': 0,
            'id': '1608003999000_15794-3',
            'label': '7-10 重度疼痛'
          }],
          'type': 'select',
          'value': '',
          'config': {
            'size': 'medium',
            'width': '140px',
            'clearable': true
          },
          'key': '1608003999000_15794'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1608003999000_1681-0',
            'label': '5 分钟内'
          }, {
            'score': 0,
            'id': '1608003999000_1681-1',
            'label': '6-10 分钟'
          }, {
            'score': 0,
            'id': '1608003999000_1681-2',
            'label': '11-30 分钟'
          }, {
            'score': 0,
            'id': '1608003999000_1681-3',
            'label': '30分钟以上'
          }, {
            'score': 0,
            'id': '1608003999000_1681-4',
            'label': '持续性'
          }, {
            'score': 0,
            'id': '1608003999000_1681-5',
            'label': '其他'
          }],
          'type': 'select',
          'value': '',
          'config': {
            'size': 'medium',
            'width': '140px',
            'clearable': true
          },
          'key': '1608003999000_1681'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1608003999000_52511-0',
            'label': '无'
          }, {
            'score': 0,
            'id': '1608003999000_52511-1',
            'label': '恶心'
          }, {
            'score': 0,
            'id': '1608003999000_52511-2',
            'label': '呕吐'
          }, {
            'score': 0,
            'id': '1608003999000_52511-3',
            'label': '腹泻'
          }, {
            'score': 0,
            'id': '1608003999000_52511-4',
            'label': '便秘'
          }, {
            'score': 0,
            'id': '1608003999000_52511-5',
            'label': '瘙痒'
          }, {
            'score': 0,
            'id': '1608003999000_52511-6',
            'label': '眩晕'
          }, {
            'score': 0,
            'id': '1608003999000_52511-7',
            'label': '麻木'
          }, {
            'score': 0,
            'id': '1608003999000_52511-8',
            'label': '其他'
          }],
          'type': 'select',
          'value': '',
          'config': {
            'size': 'medium',
            'width': '140px',
            'clearable': true
          },
          'key': '1608003999000_52511'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1608003999000_7505-0',
            'label': '无'
          }, {
            'score': 0,
            'id': '1608003999000_7505-1',
            'label': '活动'
          }, {
            'score': 0,
            'id': '1608003999000_7505-2',
            'label': '体位改变'
          }, {
            'score': 0,
            'id': '1608003999000_7505-3',
            'label': '进食'
          }, {
            'score': 0,
            'id': '1608003999000_7505-4',
            'label': '咳嗽'
          }, {
            'score': 0,
            'id': '1608003999000_7505-5',
            'label': '情绪'
          }, {
            'score': 0,
            'id': '1608003999000_7505-6',
            'label': '激动'
          }, {
            'score': 0,
            'id': '1608003999000_7505-7',
            'label': '排便'
          }, {
            'score': 0,
            'id': '1608003999000_7505-8',
            'label': '其他'
          }],
          'type': 'select',
          'value': '',
          'config': {
            'size': 'medium',
            'width': '140px',
            'clearable': true
          },
          'key': '1608003999000_7505'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1608003999000_11335-0',
            'label': '休息'
          }, {
            'score': 0,
            'id': '1608003999000_11335-1',
            'label': '药物'
          }, {
            'score': 0,
            'id': '1608003999000_11335-2',
            'label': '理疗'
          }, {
            'score': 0,
            'id': '1608003999000_11335-3',
            'label': '体位改变'
          }, {
            'score': 0,
            'id': '1608003999000_11335-4',
            'label': '其他'
          }],
          'type': 'select',
          'value': '',
          'config': {
            'size': 'medium',
            'width': '140px',
            'clearable': true
          },
          'key': '1608003999000_11335'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1608003999000_38431-0',
            'label': '正常睡眠'
          }, {
            'score': 0,
            'id': '1608003999000_38431-1',
            'label': '间断睡眠'
          }, {
            'score': 0,
            'id': '1608003999000_38431-2',
            'label': '无法入眠'
          }],
          'type': 'select',
          'value': '',
          'config': {
            'size': 'medium',
            'width': '140px',
            'clearable': true
          },
          'key': '1608003999000_38431'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1608003999000_93924-0',
            'label': '正常'
          }, {
            'score': 0,
            'id': '1608003999000_93924-1',
            'label': '焦虑'
          }, {
            'score': 0,
            'id': '1608003999000_93924-2',
            'label': '抑郁'
          }, {
            'score': 0,
            'id': '1608003999000_93924-3',
            'label': '恐惧'
          }, {
            'score': 0,
            'id': '1608003999000_93924-4',
            'label': '绝望'
          }, {
            'score': 0,
            'id': '1608003999000_93924-5',
            'label': '其他'
          }],
          'type': 'select',
          'value': '',
          'config': {
            'size': 'medium',
            'width': '140px',
            'clearable': true
          },
          'key': '1608003999000_93924'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1608003999000_49267-0',
            'label': '配合'
          }, {
            'score': 0,
            'id': '1608003999000_49267-1',
            'label': '部分配合'
          }, {
            'score': 0,
            'id': '1608003999000_49267-2',
            'label': '拒绝'
          }],
          'type': 'select',
          'value': '',
          'config': {
            'size': 'medium',
            'width': '140px',
            'clearable': true
          },
          'key': '1608003999000_49267'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'score': 0,
          'type': 'import',
          'value': '',
          'config': {
            'importType': 'pain_measure'
          },
          'key': '1608003999000_55944'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1608003999000_75447-0',
            'label': '药物'
          }, {
            'score': 0,
            'id': '1608003999000_75447-1',
            'label': '理疗'
          }, {
            'score': 0,
            'id': '1608003999000_75447-2',
            'label': '微创治疗'
          }, {
            'score': 0,
            'id': '1608003999000_75447-3',
            'label': '其他'
          }],
          'type': 'select',
          'value': '',
          'config': {
            'size': 'medium',
            'width': '140px',
            'clearable': true
          },
          'key': '1608003999000_75447'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1608003999000_42104-0',
            'label': '非甾类'
          }, {
            'score': 0,
            'id': '1608003999000_42104-1',
            'label': '吗啡'
          }, {
            'score': 0,
            'id': '1608003999000_42104-2',
            'label': '强痛定'
          }, {
            'score': 0,
            'id': '1608003999000_42104-3',
            'label': '羟考酮'
          }, {
            'score': 0,
            'id': '1608003999000_42104-4',
            'label': '抗抑郁'
          }, {
            'score': 0,
            'id': '1608003999000_42104-5',
            'label': '抗癫痫'
          }, {
            'score': 0,
            'id': '1608003999000_42104-6',
            'label': '酮咯酸氨丁三醇'
          }, {
            'score': 0,
            'id': '1608003999000_42104-7',
            'label': '其他'
          }],
          'type': 'select',
          'value': '',
          'config': {
            'size': 'medium',
            'width': '140px',
            'clearable': true
          },
          'key': '1608003999000_42104'
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
            'readonly': false,
            'maxlength': 20,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '140px',
            'disabled': false,
            'placeholder': ''
          },
          'key': '1608003999000_43712'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1608003999000_48794-0',
            'label': '肌肉注射'
          }, {
            'score': 0,
            'id': '1608003999000_48794-1',
            'label': '静脉注射'
          }, {
            'score': 0,
            'id': '1608003999000_48794-2',
            'label': '口服'
          }, {
            'score': 0,
            'id': '1608003999000_48794-3',
            'label': '外用'
          }],
          'type': 'select',
          'value': '',
          'config': {
            'size': 'medium',
            'width': '140px',
            'clearable': true
          },
          'key': '1608003999000_48794'
        }]
      }]
    }]
  }, {
    'columns': [{
      'rows': [{
        'children': [{
          'options': [{
            'score': 0,
            'id': '1608003999000_65738-0',
            'label': '30min'
          }, {
            'score': 0,
            'id': '1608003999000_65738-1',
            'label': '60min'
          }],
          'type': 'select',
          'value': '',
          'config': {
            'size': 'medium',
            'width': '140px'
          },
          'key': '1608003999000_65738'
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
            'readonly': false,
            'maxlength': 20,
            'prefix': '',
            'prefixAlign': 'right',
            'width': '140px',
            'disabled': false,
            'placeholder': ''
          },
          'key': '1608003999000_31901'
        }]
      }]
    }]
  }]
}]
