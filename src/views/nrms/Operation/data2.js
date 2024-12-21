// 术前患者护理评估记录单
export const DATA2 = [{
  type: "grid",
  key: "1599793548000_73536",
  value: "",
  config: {
    borderWidth: "1px", 
    borderColor: "#ddd",
    borderStyle: "solid",
  },
  columns: [{
    width: "",
    flex: 1,
    align: "flex-start", 
    justify: "flex-start", 
    direction: "column", 
    gapTB: "5px", 
    gapLR: "",
    childWidth: "auto", 
    padding: "10px", 
    children: [{
        type: "grid",
        key: "1599793969000_67940",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "",
          flex: 1,
          align: "center", 
          justify: "space-between", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "0",
          childWidth: "auto", 
          padding: "0", 
          children: [{
            type: "input", 
            value: "", 
            key: "1599793641000_51025", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: "T", 
              prefixWidth: "10px", 
              prefixAlign: "left", 
              prefixWeight: 'bold',
              suffix: "℃", 
              suffixWidth: "20px", 
              suffixAlign: "left", 
              width: "70px", 
              disabled: false, 
              readonly: false, 
            },
          }, {
            type: "input", 
            value: "", 
            key: "1599794101000_68002", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: "P", 
              prefixWidth: "20px", 
              prefixAlign: "right", 
              prefixWeight: 'bold',
              suffix: "次/分", 
              suffixWidth: "40px", 
              suffixAlign: "left", 
              width: "70px", 
              disabled: false, 
              readonly: false, 
            },
          }, {
            type: "input", 
            value: "", 
            key: "1599794257000_55173", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: "R", 
              prefixWidth: "20px", 
              prefixAlign: "right", 
              prefixWeight: 'bold',
              suffix: "次/分", 
              suffixWidth: "40px", 
              suffixAlign: "left", 
              width: "70px", 
              disabled: false, 
              readonly: false, 
            },
          }, {
            type: "input", 
            value: "", 
            key: "1599794347000_61133", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: "W", 
              prefixWidth: "20px", 
              prefixAlign: "right", 
              prefixWeight: 'bold',
              suffix: "kg", 
              suffixWidth: "60px", 
              suffixAlign: "left", 
              width: "70px", 
              disabled: false, 
              readonly: false, 
            },
          }, {
            type: "date", 
            value: "", 
            key: "1599794507000_78647", 
            score: 0, 
            config: {
              prefix: "测量时间", 
              prefixWidth: "70px", 
              prefixAlign: "right", 
              placeholder: "", 
              width: "190px", 
              disabled: false, 
              readonly: false, 
              type: "datetime",
            },
          }, ]
        }]
      },
      {
        type: "date", 
        value: "", 
        key: "1599795077000_67349", 
        score: 0, 
        config: {
          prefix: "拟行手术时间：", 
          prefixWidth: "120px", 
          prefixAlign: "left", 
          prefixWeight: "bold", 
          placeholder: "", 
          width: "190px", 
          disabled: false, 
          readonly: false, 
          type: "datetime",
        },
      },
      {
        type: "checkbox",
        key: "1599800246000_23943",
        value: [],
        score: 0,
        config: {
          prefix: "拟行麻醉方式：",
          prefixWidth: "120px",
          prefixAlign: "left",
          prefixWeight: 'bold',
          marginRight: "20px",
        },
        options: [{
            label: "局麻",
            id: "1599800246000_23943-1",
            score: 0,
          },
          {
            label: "全麻",
            id: "1599800246000_23943-2",
            score: 0,
          },
          {
            label: "硬膜外",
            id: "1599800246000_23943-3",
            score: 0,
          },
          {
            label: "颈丛",
            id: "1599800246000_23943-4",
            score: 0,
          },
          {
            label: "臀丛",
            id: "1599800246000_23943-5",
            score: 0,
          },
          {
            label: "其他",
            id: "1599800246000_23943-6",
            score: 0,
            children: [{
              type: "input", 
              value: "", 
              key: "1599800284000_80989", 
              score: 0, 
              config: {
                borderLine: true,
                prefix: "", 
                prefixWidth: "75px", 
                prefixAlign: "right", 
                placeholder: "", 
                width: "181px", 
                disabled: false, 
                readonly: false, 
              },
            }, ],
          },
        ]
      },
      {
        type: "grid",
        key: "1599800820000_78980",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "",
          flex: 1,
          align: "center", 
          justify: "space-between", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "0",
          childWidth: "auto", 
          padding: "0", 
          children: [{
            type: "input", 
            value: "", 
            key: "1599800846000_81805", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: "诊断：", 
              prefixWidth: "80px", 
              prefixAlign: "left", 
              prefixWeight: 'bold',
              suffix: "", 
              suffixWidth: "20px", 
              suffixAlign: "left", 
              width: "300px", 
              disabled: false, 
              readonly: false, 
            },
          }, {
            type: "input", 
            value: "", 
            key: "1599800884000_80243", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: "拟行手术名称：", 
              prefixWidth: "120px", 
              prefixAlign: "right", 
              prefixWeight: 'bold',
              suffix: "", 
              suffixWidth: "40px", 
              suffixAlign: "left", 
              width: "330px", 
              disabled: false, 
              readonly: false, 
            },
          }]
        }]
      },
      {
        type: "grid",
        key: "1599801131000_8897",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "",
          flex: 1,
          align: "center", 
          justify: "space-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "0",
          childWidth: "auto", 
          padding: "0", 
          children: [{
              type: "checkbox",
              key: "1599801297000_27611",
              value: [],
              score: 0,
              config: {
                prefix: "备皮：",
                prefixWidth: "80px",
                prefixAlign: "left",
                prefixWeight: "bold",
                marginRight: '10px'
              },
              options: [{
                  label: "无",
                  id: "1599801297000_27611-1",
                  score: 0,
                },
                {
                  label: "已执行",
                  id: "1599801297000_27611-2",
                  score: 0,
                },
                {
                  label: "未执行",
                  id: "1599801297000_27611-3",
                  score: 0
                }
              ]
            },
            {
              type: "checkbox",
              key: "1599801591000_51087",
              value: [],
              score: 0,
              config: {
                prefix: "合血：",
                prefixWidth: "70px",
                prefixAlign: "right",
                prefixWeight: "bold",
                marginRight: '10px'
              },
              options: [{
                  label: "无",
                  id: "1599801591000_51087-1",
                  score: 0,
                },
                {
                  label: "已执行",
                  id: "1599801591000_51087-2",
                  score: 0,
                },
                {
                  label: "未执行",
                  id: "1599801591000_51087-3",
                  score: 0,
                },
              ]
            },
            {
              type: "checkbox",
              key: "1599801714000_92424",
              value: [],
              score: 0,
              config: {
                prefix: "卫生处置：",
                prefixWidth: "120px",
                prefixAlign: "right",
                prefixWeight: "bold",
                marginRight: '10px',
              },
              options: [{
                  label: "已执行",
                  id: "1599801714000_92424-1",
                  score: 0,
                },
                {
                  label: "未执行",
                  id: "1599801714000_92424-2",
                  score: 0,
                },
              ]
            },
          ]
        }]
      },
      {
        type: "checkbox",
        key: "1599801972000_90808",
        value: [],
        score: 0,
        config: {
          prefix: "皮试：",
          prefixWidth: "80px",
          prefixAlign: "left",
          prefixWeight: "bold",
        },
        options: [{
            label: "无",
            id: "1599801972000_90808-1",
            score: 0,
          },
          {
            label: "有",
            id: "1599801972000_90808-2",
            score: 0,
            children: [{
              type: "input", 
              value: "", 
              key: "1599802039000_53994", 
              score: 0, 
              config: {
                inputType: 'textarea',
                borderLine: true,
                prefix: "药物1：", 
                prefixWidth: "70px", 
                prefixAlign: "right", 
                suffix: "", 
                suffixWidth: "40px", 
                suffixAlign: "left", 
                width: "200px", 
                disabled: false, 
                readonly: false, 
              },
            }, {
              type: "input", 
              value: "", 
              key: "1599802121000_41383", 
              score: 0, 
              config: {
                inputType: 'textarea',
                borderLine: true,
                prefix: "药物2：", 
                prefixWidth: "70px", 
                prefixAlign: "right", 
                suffix: "", 
                suffixWidth: "40px", 
                suffixAlign: "left", 
                width: "200px", 
                disabled: false, 
                readonly: false, 
              },
            }]
          },
        ]
      },
      {
        type: "checkbox",
        key: "1599802216000_94173",
        value: [],
        score: 0,
        config: {
          prefix: "术前用药：",
          prefixWidth: "80px",
          prefixAlign: "left",
          prefixWeight: "bold",
        },
        options: [{
            label: "无",
            id: "1599802216000_94173-1",
            score: 0,
          },
          {
            label: "有",
            id: "1599802216000_94173-2",
            score: 0,
            children: [{
              type: "input", 
              value: "", 
              key: "1599802252000_9032", 
              score: 0, 
              config: {
                inputType: 'textarea',
                borderLine: true,
                prefix: " ", 
                prefixWidth: "20px", 
                prefixAlign: "right", 
                suffix: "", 
                suffixWidth: "40px", 
                suffixAlign: "left", 
                width: "400px", 
                disabled: false, 
                readonly: false, 
              },
            }]
          },
        ]
      },
      {
        type: "grid",
        key: "1599802419000_53809",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "",
          flex: 1,
          align: "center", 
          justify: "space-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "0",
          childWidth: "auto", 
          padding: "0", 
          children: [{
            type: "text",
            value: "",
            key: "1600149589000_17179",
            config: {
              label: "跌倒/坠床危险性评估：",
              align: "left",
              weight: "bold",
              width: '170px'
            },
          },{
            type: 'button',
            value: '',
            key: '1600149598000_36333',
            config: {
              label: "开始评估",
              importTitle: '跌倒/坠床危险性评估',
              btnType: 'import',
              importTime: 'last',
              printHidden: true,
              size: 'mini',
              width: '80px',
              scoreKey: '1599802471000_5976',
              assId: '10002',
            }
          },{
            type: "input", 
            value: "", 
            key: "1599802471000_5976", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: " ", 
              prefixWidth: "2px", 
              prefixAlign: "left", 
              prefixWeight: "bold", 
              suffix: "分", 
              suffixWidth: "15px", 
              suffixAlign: "left", 
              width: "55px", 
              disabled: false, 
              readonly: false, 
            },
          }, {
            type: "checkbox",
            key: "1599802622000_75866",
            value: [],
            score: 0,
            config: {
              prefix: "≥45分采取措施",
              prefixWidth: "120px",
              prefixAlign: "right",
              prefixWeight: "bold",
              marginRight: '5px'
            },
            options: [{
                label: "悬挂标示",
                id: "1599802622000_75866-1",
                score: 0,
              },
              {
                label: "加强巡视及看护",
                id: "1599802622000_75866-2",
                score: 0,
              },
              {
                label: "使用床栏",
                id: "1599802622000_75866-3",
                score: 0,
              },
              {
                label: "使用约束带",
                id: "1599802622000_75866-4",
                score: 0,
              },
            ]
          }, ]
        }]
      },
      {
        type: "grid",
        key: "1599803001000_29298",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "",
          flex: 1,
          align: "center", 
          justify: "space-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "0",
          childWidth: "auto", 
          padding: "0", 
          children: [{
            type: "text",
            value: "",
            key: "1600148224000_83335",
            config: {
              label: "压疮危险性评估：",
              align: "left",
              weight: "bold",
              width: '170px'
            },
          },{
            type: 'button',
            value: '',
            key: '1600148128000_25581',
            config: {
              label: "开始评估",
              importTitle: '压疮危险性评估',
              btnType: 'import',
              importTime: 'last',
              printHidden: true,
              size: 'mini',
              width: '80px',
              scoreKey: '1599803011000_76336',
              assId: '10004',
            }
          },{
            type: "input", 
            value: "", 
            key: "1599803011000_76336", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: " ", 
              prefixWidth: "2px", 
              prefixAlign: "left", 
              prefixWeight: "bold", 
              suffix: "分", 
              suffixWidth: "15px", 
              suffixAlign: "left", 
              width: "55px", 
              disabled: false, 
              readonly: false, 
            },
          },{
            type: "checkbox",
            key: "1599803024000_88399",
            value: [],
            score: 0,
            config: {
              prefix: "≤18分采取措施",
              prefixWidth: "120px",
              prefixAlign: "right",
              prefixWeight: "bold",
              marginRight: '5px'
            },
            options: [{
                label: "保持清洁干燥",
                id: "1599803024000_88399-1",
                score: 0,
              },
              {
                label: "及时翻身",
                id: "1599803024000_88399-2",
                score: 0,
              },
              {
                label: "局部减压",
                id: "1599803024000_88399-3",
                score: 0,
              },
              {
                label: "使用气垫床",
                id: "1599803024000_88399-4",
                score: 0,
              },
            ]
          }, ]
        }]
      },
      {
        type: "checkbox",
        key: "1599803161000_24096",
        value: [],
        score: 0,
        config: {
          prefix: "皮肤状况：",
          prefixWidth: "80px",
          prefixAlign: "left",
          prefixWeight: "bold",
        },
        options: [{
            label: "正常",
            id: "1599803161000_24096-1",
            score: 0,
          },
          {
            label: "异常",
            id: "1599803161000_24096-2",
            score: 0,
            children: [{
              type: "input", 
              value: "", 
              key: "1599803175000_70594", 
              score: 0, 
              config: {
                inputType: 'textarea',
                borderLine: true,
                prefix: " ", 
                prefixWidth: "20px", 
                prefixAlign: "right", 
                suffix: "", 
                suffixWidth: "40px", 
                suffixAlign: "left", 
                width: "400px", 
                disabled: false, 
                readonly: false, 
              },
            }]
          },
        ]
      },
      {
        type: "grid",
        key: "1600151715000_49543",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "",
          flex: 1,
          align: "center", 
          justify: "space-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "0",
          childWidth: "auto", 
          padding: "0", 
          children: [
            {
              type: "text",
              value: "",
              key: "1600151722000_39207",
              config: {
                label: "自理能力：",
                align: "left",
                weight: "bold",
                width: '90px'
              },
            },
            {
              type: 'button',
              value: '',
              key: '1600151730000_50889',
              config: {
                label: "开始评估",
                importTitle: '自理能力',
                btnType: 'import',
                importTime: 'last',
                printHidden: true,
                size: 'mini',
                width: '80px',
                scoreKey: '1600151737000_78258',
                levelKey: '1600151743000_70185',
                assId: '10007',
              }
            },
            {
              type: "input", 
              value: "", 
              key: "1600151737000_78258", 
              score: 0, 
              config: {
                inputType: 'text',
                borderLine: true,
                prefix: "分数", 
                prefixWidth: "50px", 
                prefixAlign: "right", 
                suffix: "", 
                suffixWidth: "40px", 
                suffixAlign: "left", 
                width: "80px", 
                disabled: false, 
                readonly: false, 
              },
            },
            {
              type: "input", 
              value: "", 
              key: "1600151743000_70185", 
              score: 0, 
              config: {
                inputType: 'text',
                borderLine: true,
                prefix: "风险评估", 
                prefixWidth: "70px", 
                prefixAlign: "right", 
                suffix: "", 
                suffixWidth: "40px", 
                suffixAlign: "left", 
                width: "100px", 
                disabled: false, 
                readonly: false, 
              },
            }
          ]
        }]
      },
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      {
        type: "checkbox",
        key: "1599804656000_14754",
        value: [],
        score: 0,
        config: {
          prefix: "术前宣教：",
          prefixWidth: "80px",
          prefixAlign: "left",
          prefixWeight: "bold",
        },
        options: [{
            label: "1.指导床上大小便",
            id: "1599804656000_14754-1",
            score: 0,
          },
          {
            label: "2.指导功能锻炼、腹式呼吸、深呼吸及咳嗽咳痰",
            id: "1599804656000_14754-2",
            score: 0,
          },
          {
            label: "3.心理指导",
            id: "1599804656000_14754-3",
            score: 0,
          },
          {
            label: "4.术后常见的并发症",
            id: "1599804656000_14754-4",
            score: 0,
          },
          {
            label: "5.术前是否置管，置管名称及注意事项",
            id: "1599804656000_14754-5",
            score: 0,
          },
          {
            label: "6.肠道准备注意事项",
            id: "1599804656000_14754-6",
            score: 0,
          },
          {
            label: "7.手术体位",
            id: "1599804656000_14754-7",
            score: 0,
          },
          {
            label: "8.禁饮食开始时间",
            id: "1599804656000_14754-8",
            score: 0,
            children: [
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
            ]
          },
          {
            label: "9.咳痰护理",
            id: "1599804656000_14754-9",
            score: 0,
          },
          {
            label: "10.药物",
            id: "1599804656000_14754-10",
            score: 0,
          },
          {
            label: "11.卫生处置：",
            id: "1599804656000_14754-11",
            score: 0,
            checkboxHidden: true
          },
          {
            label: "洗澡",
            id: "1599804656000_14754-12",
            score: 0,
          },
          {
            label: "剪指（趾）甲",
            id: "1599804656000_14754-13",
            score: 0,
          },
          {
            label: "洗头",
            id: "1599804656000_14754-14",
            score: 0,
          },
          {
            label: "洗脚",
            id: "1599804656000_14754-15",
            score: 0,
          },
          {
            label: "更衣",
            id: "1599804656000_14754-16",
            score: 0,
          },
          {
            label: "12.去手术室前的相关准备工作：",
            id: "1599804656000_14754-17",
            score: 0,
            checkboxHidden: true
          },
          {
            label: "排空大小便",
            id: "1599804656000_14754-18",
            score: 0,
          },
          {
            label: "贴身穿病员服",
            id: "1599804656000_14754-19",
            score: 0,
          },
          {
            label: "取下义齿、首饰 、手表、眼镜及隐形眼镜",
            id: "1599804656000_14754-20",
            score: 0,
          },
          {
            label: "避免化妆、涂指甲油",
            id: "1599804656000_14754-21",
            score: 0,
          },
          {
            label: "术中带药",
            id: "1599804656000_14754-22",
            score: 0,
          },
          {
            label: "CT片、MRI片",
            id: "1599804656000_14754-23",
            score: 0,
          },
          {
            label: "病历",
            id: "1599804656000_14754-24",
            score: 0,
          },
          {
            label: "13.手术时间",
            id: "1599804656000_14754-25",
            score: 0,
          },
          {
            label: "14.保证夜间睡眠",
            id: "1599804656000_14754-26",
            score: 0,
          },
          {
            label: "15.其他",
            id: "1599804656000_14754-27",
            score: 0,
            children: [{
              type: "input", 
              value: "", 
              key: "1599807333000_59780", 
              score: 0, 
              config: {
                inputType: 'textarea',
                borderLine: true,
                prefix: " ", 
                prefixWidth: "20px", 
                prefixAlign: "right", 
                suffix: "", 
                suffixWidth: "40px", 
                suffixAlign: "left", 
                width: "400px", 
                disabled: false, 
                readonly: false, 
              },
            }]
          },
        ]
      },
      {
        type: "grid",
        key: "1599808572000_63176",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "420px",
          flex: '',
          align: "center", 
          justify: "space-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "0",
          childWidth: "auto", 
          padding: "0", 
          children: [{
            type: "checkbox",
            key: "1599808033000_51342",
            value: [],
            score: 0,
            config: {
              prefix: "家庭支持：",
              prefixWidth: "80px",
              prefixAlign: "left",
              prefixWeight: "bold",
            },
            options: [{
                label: "好",
                id: "1599808033000_51342-1",
                score: 0,
              },
              {
                label: "一般",
                id: "1599808033000_51342-2",
                score: 0,
              },
              {
                label: "差",
                id: "1599808033000_51342-3",
                score: 0,
              },
            ]
          }]
        }, {
          width: "420px",
          flex: '',
          align: "center", 
          justify: "space-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "0",
          childWidth: "auto", 
          padding: "0", 
          children: [{
            type: "checkbox",
            key: "1599808264000_34689",
            value: [],
            score: 0,
            config: {
              prefix: "营养状况：",
              prefixWidth: "100px",
              prefixAlign: "left",
              prefixWeight: "bold",
            },
            options: [{
                label: "良好",
                id: "1599808264000_34689-1",
                score: 0,
              },
              {
                label: "一般",
                id: "1599808264000_34689-2",
                score: 0,
              },
              {
                label: "差",
                id: "1599808264000_34689-3",
                score: 0,
              },
            ]
          }]
        }]
      },
      {
        type: "grid",
        key: "1599808180000_21106",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "420px",
          flex: '',
          align: "center", 
          justify: "space-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "0",
          childWidth: "auto", 
          padding: "0", 
          children: [{
            type: "checkbox",
            key: "1599808457000_51133",
            value: [],
            score: 0,
            config: {
              prefix: "心理状态：",
              prefixWidth: "80px",
              prefixAlign: "left",
              prefixWeight: "bold",
            },
            options: [{
                label: "良好",
                id: "1599808457000_51133-1",
                score: 0,
              },
              {
                label: "焦虑",
                id: "1599808457000_51133-2",
                score: 0,
              },
              {
                label: "抑郁",
                id: "1599808457000_51133-3",
                score: 0,
              },
              {
                label: "恐惧",
                id: "1599808457000_51133-4",
                score: 0,
              },
            ]
          }]
        }, {
          width: "420px",
          flex: '',
          align: "center", 
          justify: "space-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "0",
          childWidth: "auto", 
          padding: "0", 
          children: [{
            type: "checkbox",
            key: "1599808548000_47437",
            value: [],
            score: 0,
            config: {
              prefix: "治疗依从性：",
              prefixWidth: "100px",
              prefixAlign: "left",
              prefixWeight: "bold",
            },
            options: [{
                label: "好",
                id: "1599808548000_47437-1",
                score: 0,
              },
              {
                label: "一般",
                id: "1599808548000_47437-2",
                score: 0,
              },
              {
                label: "差",
                id: "1599808548000_47437-3",
                score: 0,
              },
            ]
          }]
        }]
      },
      {
        type: "grid",
        key: "1599808826000_39747",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "420px",
          flex: '',
          align: "center", 
          justify: "space-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "0",
          childWidth: "auto", 
          padding: "0", 
          children: [{
            type: "checkbox",
            key: "1599808844000_21610",
            value: [],
            score: 0,
            config: {
              prefix: "手术用物准备：",
              prefixWidth: "120px",
              prefixAlign: "left",
              prefixWeight: "bold",
            },
            options: [{
                label: "无",
                id: "1599808844000_21610-1",
                score: 0,
              },
              {
                label: "执行",
                id: "1599808844000_21610-2",
                score: 0,
              },
              {
                label: "未执行",
                id: "1599808844000_21610-3",
                score: 0,
              },
            ]
          }]
        }]
      },
      {
        type: "grid",
        key: "1600150851000_45974",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "",
          flex: 1,
          align: "center", 
          justify: "space-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "0",
          childWidth: "auto", 
          padding: "0", 
          children: [
            {
              type: "text",
              value: "",
              key: "1600150844000_85026",
              config: {
                label: "疼痛分级：",
                align: "left",
                weight: "bold",
                width: '90px'
              },
            },
            {
              type: 'button',
              value: '',
              key: '1600151133000_77742',
              config: {
                label: "开始评估",
                importTitle: '疼痛分级',
                btnType: 'import',
                importTime: 'last',
                printHidden: true,
                size: 'mini',
                width: '80px',
                scoreKey: '1600151315000_89072',
                levelKey: '1600151328000_31307',
                showEdit: true,
                assId: '10009',
              }
            },
            {
              type: "input", 
              value: "", 
              key: "1600151315000_89072", 
              score: 0, 
              config: {
                inputType: 'text',
                borderLine: true,
                prefix: "分数", 
                prefixWidth: "50px", 
                prefixAlign: "right", 
                suffix: "", 
                suffixWidth: "40px", 
                suffixAlign: "left", 
                width: "80px", 
                disabled: false, 
                readonly: false, 
              },
            },
            {
              type: "input", 
              value: "", 
              key: "1600151328000_31307", 
              score: 0, 
              config: {
                inputType: 'text',
                borderLine: true,
                prefix: "风险评估", 
                prefixWidth: "70px", 
                prefixAlign: "right", 
                suffix: "", 
                suffixWidth: "40px", 
                suffixAlign: "left", 
                width: "100px", 
                disabled: false, 
                readonly: false, 
              },
            }
          ]
        }]
      },
      {
        type: "checkbox",
        key: "1599809017000_46302",
        value: [],
        score: 0,
        config: {
          prefix: "疼痛症状管理：",
          prefixWidth: "120px",
          prefixAlign: "left",
          prefixWeight: "bold",
          marginRight: '10px'
        },
        options: [{
            label: "心理护理",
            id: "1599809017000_46302-1",
            score: 0,
          },
          {
            label: "通知医生",
            id: "1599809017000_46302-2",
            score: 0,
          },
          {
            label: "用药",
            id: "1599809017000_46302-3",
            score: 0,
            children: [{
              type: "input", 
              value: "", 
              key: "1599809190000_40918", 
              score: 0, 
              config: {
                inputType: 'textarea',
                borderLine: true,
                prefix: " ", 
                prefixWidth: "20px", 
                prefixAlign: "right", 
                suffix: "", 
                suffixWidth: "40px", 
                suffixAlign: "left", 
                width: "200px", 
                disabled: false, 
                readonly: false, 
              },
            }]
          },
        ]
      },
      {
        type: "input", 
        value: "", 
        key: "1599811065000_41425", 
        score: 0, 
        config: {
          inputType: 'textarea',
          borderLine: true,
          prefix: "其他:", 
          prefixWidth: "70px", 
          prefixAlign: "left", 
          prefixWeight: "bold", 
          suffix: "", 
          suffixWidth: "40px", 
          suffixAlign: "left", 
          width: "400px", 
          disabled: false, 
          readonly: false, 
        },
      },
      {
        type: "grid",
        key: "1599811344000_39906",
        value: "",
        config: {
          borderWidth: "0px", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "300px",
          flex: '',
          align: "flex-start", 
          justify: "flex-start", 
          direction: "column", 
          gapTB: "5px", 
          gapLR: "",
          childWidth: "auto", 
          padding: "", 
        }, {
          width: "",
          flex: 1,
          align: "flex-start", 
          justify: "flex-start", 
          direction: "row", 
          gapTB: "5px", 
          gapLR: "",
          childWidth: "auto", 
          padding: "", 
          children: [{
            type: 'button',
            value: '',
            key: '1600137607000_91349',
            config: {
              label: "签名",
              btnType: 'signature',
              signKey: '1600137616000_54170',
              signTimeKey: '1600137626000_52105',
              size: 'mini',
              width: '80px',
              printHidden: true
            }
          },{
            type: "input", 
            value: "", 
            key: "1600137616000_54170", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: "护士签名：", 
              prefixWidth: "100px", 
              prefixAlign: "right", 
              prefixWeight: "bold", 
              suffix: "", 
              suffixWidth: "20px", 
              suffixAlign: "left", 
              width: "100px", 
              disabled: false, 
              readonly: false, 
            },
          },
          {
            type: "date", 
            value: "", 
            key: "1600137626000_52105", 
            score: 0, 
            config: {
              prefix: "时间：", 
              prefixWidth: "50px", 
              prefixAlign: "right", 
              placeholder: "", 
              width: "190px", 
              disabled: false, 
              readonly: false, 
              type: "datetime",
            },
          }
          ]
        }]
      }
    ]
  }]
}, {
  type: "grid",
  key: "1599812083000_19049",
  value: "",
  config: {
    borderWidth: "1px", 
    borderColor: "#ddd",
    borderStyle: "solid",
  },
  columns: [{
    width: "",
    flex: 1,
    align: "flex-start", 
    justify: "flex-start", 
    direction: "column", 
    gapTB: "5px", 
    gapLR: "",
    childWidth: "auto", 
    padding: "10px", 
    children: [{
        type: "grid",
        key: "1599812083000_19049",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "",
          flex: 1,
          align: "center", 
          justify: "flex-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "",
          childWidth: "auto", 
          padding: "", 
          children: [{
            type: "checkbox",
            key: "1599812383000_82189",
            value: [],
            score: 0,
            config: {
              prefix: "睡眠情况：",
              prefixWidth: "80px",
              prefixAlign: "left",
              prefixWeight: 'bold',
            },
            options: [{
                label: "好",
                id: "1599812383000_82189-1",
                score: 0,
              },
              {
                label: "一般",
                id: "1599812383000_82189-2",
                score: 0,
              },
              {
                label: "差",
                id: "1599812383000_82189-3",
                score: 0,
              },
            ]
          }, {
            type: "input", 
            value: "", 
            key: "1599812544000_88493", 
            score: 0, 
            config: {
              inputType: 'textarea',
              borderLine: true,
              prefix: "用药：", 
              prefixWidth: "60px", 
              prefixAlign: "right", 
              suffix: "", 
              suffixWidth: "20px", 
              suffixAlign: "left", 
              width: "150px", 
              disabled: false, 
              readonly: false, 
            },
          }, {
            type: "date", 
            value: "", 
            key: "1599812745000_13079", 
            score: 0, 
            config: {
              prefix: "时间", 
              prefixWidth: "100px", 
              prefixAlign: "right", 
              placeholder: "", 
              width: "190px", 
              disabled: false, 
              readonly: false, 
              type: "datetime",
            },
          }, ]
        }]
      }, {
        type: "grid",
        key: "1599812878000_19383",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "",
          flex: 1,
          align: "center", 
          justify: "flex-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "",
          childWidth: "auto", 
          padding: "", 
          children: [{
              type: "date", 
              value: "", 
              key: "1599812965000_55268", 
              score: 0, 
              config: {
                prefix: "禁饮食开始时间：", 
                prefixWidth: "130px", 
                prefixAlign: "left", 
                prefixWeight: "bold",
                placeholder: "", 
                width: "190px", 
                disabled: false, 
                readonly: false, 
                type: "datetime",
              },
            },
            {
              type: "checkbox",
              key: "1599812987000_38818",
              value: [],
              score: 0,
              config: {
                prefix: " ",
                prefixWidth: "20px",
                prefixAlign: "left",
                prefixWeight: 'bold',
              },
              options: [{
                  label: "已告知",
                  id: "1599812987000_38818-1",
                  score: 0,
                },
                {
                  label: "未告知",
                  id: "1599812987000_38818-2",
                  score: 0,
                },
              ]
            },
          ]
        }]
      }, {
        type: "grid",
        key: "1599813277000_77180",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "",
          flex: 1,
          align: "center", 
          justify: "flex-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "",
          childWidth: "auto", 
          padding: "", 
          children: [{
              type: "checkbox",
              key: "1599813314000_74415",
              value: [],
              score: 0,
              config: {
                prefix: "去手术室前的相关准备工作：",
                prefixWidth: "220px",
                prefixAlign: "left",
                prefixWeight: 'bold',
              },
              options: [{
                  label: "已告知",
                  id: "1599813314000_74415-1",
                  score: 0,
                },
                {
                  label: "未告知",
                  id: "1599813314000_74415-2",
                  score: 0,
                },
              ]
            },
            {
              type: "checkbox",
              key: "1599813392000_8118",
              value: [],
              score: 0,
              config: {
                prefix: "卫生处置：",
                prefixWidth: "150px",
                prefixAlign: "right",
                prefixWeight: 'bold',
              },
              options: [{
                  label: "已执行",
                  id: "1599813392000_8118-1",
                  score: 0,
                },
                {
                  label: "未执行",
                  id: "1599813392000_8118-2",
                  score: 0,
                },
              ]
            },
          ]
        }]
      }, {
        type: "input", 
        value: "", 
        key: "1599813723000_7065", 
        score: 0, 
        config: {
          inputType: 'textarea',
          borderLine: true,
          prefix: "其他:", 
          prefixWidth: "70px", 
          prefixAlign: "left", 
          prefixWeight: "bold", 
          suffix: "", 
          suffixWidth: "40px", 
          suffixAlign: "left", 
          width: "400px", 
          disabled: false, 
          readonly: false, 
        },
      },
      {
        type: "grid",
        key: "1599813731000_38645",
        value: "",
        config: {
          borderWidth: "0px", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "300px",
          flex: '',
          align: "flex-start", 
          justify: "flex-start", 
          direction: "column", 
          gapTB: "5px", 
          gapLR: "",
          childWidth: "auto", 
          padding: "", 
        }, {
          width: '',
          flex: 1,
          align: "flex-start", 
          justify: "flex-start", 
          direction: "row", 
          gapTB: "5px", 
          gapLR: "",
          childWidth: "auto", 
          padding: "", 
          children: [{
            type: 'button',
            value: '',
            key: '1600137710000_73330',
            config: {
              label: "签名",
              btnType: 'signature',
              signKey: '1600137720000_80442',
              signTimeKey: '1600137729000_35198',
              size: 'mini',
              width: '80px',
              printHidden: true
            }
          },{
            type: "input", 
            value: "", 
            key: "1600137720000_80442", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: "护士签名：", 
              prefixWidth: "100px", 
              prefixAlign: "right", 
              prefixWeight: "bold", 
              suffix: "", 
              suffixWidth: "20px", 
              suffixAlign: "left", 
              width: "100px", 
              disabled: false, 
              readonly: false, 
            },
          },
          {
            type: "date", 
            value: "", 
            key: "1600137729000_35198", 
            score: 0, 
            config: {
              prefix: "时间：", 
              prefixWidth: "50px", 
              prefixAlign: "right", 
              placeholder: "", 
              width: "190px", 
              disabled: false, 
              readonly: false, 
              type: "datetime",
            },
          }
          ]
        }]
      }
    ]
  }]
}, {
  type: "grid",
  key: "1599813953000_59808",
  value: "",
  config: {
    borderWidth: "1px", 
    borderColor: "#ddd",
    borderStyle: "solid",
  },
  columns: [{
    width: "",
    flex: 1,
    align: "flex-start", 
    justify: "flex-start", 
    direction: "column", 
    gapTB: "5px", 
    gapLR: "",
    childWidth: "auto", 
    padding: "10px", 
    children: [{
        type: "grid",
        key: "1599814292000_82765",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "",
          flex: 1,
          align: "center", 
          justify: "space-between", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "0",
          childWidth: "auto", 
          padding: "0", 
          children: [{
            type: "input", 
            value: "", 
            key: "1599814300000_59121", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: "T", 
              prefixWidth: "10px", 
              prefixAlign: "left", 
              prefixWeight: 'bold',
              suffix: "℃", 
              suffixWidth: "20px", 
              suffixAlign: "left", 
              width: "70px", 
              disabled: false, 
              readonly: false, 
            },
          }, {
            type: "input", 
            value: "", 
            key: "1599814309000_54991", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: "P", 
              prefixWidth: "20px", 
              prefixAlign: "right", 
              prefixWeight: 'bold',
              suffix: "次/分", 
              suffixWidth: "40px", 
              suffixAlign: "left", 
              width: "70px", 
              disabled: false, 
              readonly: false, 
            },
          }, {
            type: "input", 
            value: "", 
            key: "1599814319000_17674", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: "R", 
              prefixWidth: "20px", 
              prefixAlign: "right", 
              prefixWeight: 'bold',
              suffix: "次/分", 
              suffixWidth: "40px", 
              suffixAlign: "left", 
              width: "70px", 
              disabled: false, 
              readonly: false, 
            },
          }, {
            type: "input", 
            value: "", 
            key: "1599814325000_65921", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: "BP", 
              prefixWidth: "20px", 
              prefixAlign: "right", 
              prefixWeight: 'bold',
              suffix: "mmHg", 
              suffixWidth: "60px", 
              suffixAlign: "left", 
              width: "80px", 
              disabled: false, 
              readonly: false, 
            },
          }, {
            type: "date", 
            value: "", 
            key: "1599814332000_25111", 
            score: 0, 
            config: {
              prefix: "测量时间", 
              prefixWidth: "70px", 
              prefixAlign: "right", 
              placeholder: "", 
              width: "190px", 
              disabled: false, 
              readonly: false, 
              type: "datetime",
            },
          }, ]
        }]
      }, {
        type: "grid",
        key: "1599813962000_59999",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "",
          flex: 1,
          align: "center", 
          justify: "flex-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "",
          childWidth: "auto", 
          padding: "", 
          children: [{
            type: "checkbox",
            key: "1599813973000_67739",
            value: [],
            score: 0,
            config: {
              prefix: "睡眠情况：",
              prefixWidth: "80px",
              prefixAlign: "left",
              prefixWeight: 'bold',
            },
            options: [{
                label: "好",
                id: "1599813973000_67739-1",
                score: 0,
              },
              {
                label: "一般",
                id: "1599813973000_67739-2",
                score: 0,
              },
              {
                label: "差",
                id: "1599813973000_67739-3",
                score: 0,
              },
            ]
          }, {
            type: "input", 
            value: "", 
            key: "1599813999000_36839", 
            score: 0, 
            config: {
              inputType: 'textarea',
              borderLine: true,
              prefix: "用药：", 
              prefixWidth: "60px", 
              prefixAlign: "right", 
              suffix: "", 
              suffixWidth: "20px", 
              suffixAlign: "left", 
              width: "150px", 
              disabled: false, 
              readonly: false, 
            },
          }, {
            type: "date", 
            value: "", 
            key: "1599814006000_40053", 
            score: 0, 
            config: {
              prefix: "时间", 
              prefixWidth: "100px", 
              prefixAlign: "right", 
              placeholder: "", 
              width: "190px", 
              disabled: false, 
              readonly: false, 
              type: "datetime",
            },
          }, ]
        }]
      }, {
        type: "grid",
        key: "1599814021000_59778",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "",
          flex: 1,
          align: "center", 
          justify: "flex-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "",
          childWidth: "auto", 
          padding: "", 
          children: [{
              type: "date", 
              value: "", 
              key: "1599814044000_68574", 
              score: 0, 
              config: {
                prefix: "禁饮食开始时间：", 
                prefixWidth: "130px", 
                prefixAlign: "left", 
                prefixWeight: "bold",
                placeholder: "", 
                width: "190px", 
                disabled: false, 
                readonly: false, 
                type: "datetime",
              },
            },
            {
              type: "checkbox",
              key: "1599814054000_31493",
              value: [],
              score: 0,
              config: {
                prefix: " ",
                prefixWidth: "20px",
                prefixAlign: "left",
                prefixWeight: 'bold',
              },
              options: [{
                  label: "已告知",
                  id: "1599814054000_31493-1",
                  score: 0,
                },
                {
                  label: "未告知",
                  id: "1599814054000_31493-2",
                  score: 0,
                },
              ]
            },
            {
              type: "checkbox",
              key: "1599814105000_44201",
              value: [],
              score: 0,
              config: {
                prefix: "卫生处置：",
                prefixWidth: "150px",
                prefixAlign: "right",
                prefixWeight: 'bold',
              },
              options: [{
                  label: "已执行",
                  id: "1599814105000_44201-1",
                  score: 0,
                },
                {
                  label: "未执行",
                  id: "1599814105000_44201-2",
                  score: 0,
                },
              ]
            },
          ]
        }]
      }, {
        type: "checkbox",
        key: "1599815219000_9134",
        value: [],
        score: 0,
        config: {
          prefix: "术前用药：",
          prefixWidth: "80px",
          prefixAlign: "left",
          prefixWeight: 'bold',
        },
        options: [{
            label: "无",
            id: "1599815219000_9134-1",
            score: 0,
          },
          {
            label: "有",
            id: "1599815219000_9134-2",
            score: 0,
            children: [{
                type: "input", 
                value: "", 
                key: "1599815310000_3658", 
                score: 0, 
                config: {
                  inputType: 'textarea',
                  borderLine: true,
                  prefix: "", 
                  prefixWidth: "70px", 
                  prefixAlign: "left", 
                  prefixWeight: "bold", 
                  suffix: "", 
                  suffixWidth: "40px", 
                  suffixAlign: "left", 
                  width: "200px", 
                  disabled: false, 
                  readonly: false, 
                },
              },
              {
                type: "checkbox",
                key: "1599815395000_45690",
                value: [],
                score: 0,
                config: {
                  prefix: "",
                  prefixWidth: "70px",
                  prefixAlign: "left",
                  prefixWeight: 'bold',
                },
                options: [{
                    label: "已执行",
                    id: "1599815395000_45690-1",
                    score: 0,
                    children: [{
                      type: "date", 
                      value: "", 
                      key: "1599815498000_55177", 
                      score: 0, 
                      config: {
                        prefix: "执行时间", 
                        prefixWidth: "70px", 
                        prefixAlign: "right", 
                        placeholder: "", 
                        width: "190px", 
                        disabled: false, 
                        readonly: false, 
                        type: "datetime",
                      },
                    }]
                  },
                  {
                    label: "未执行",
                    id: "1599815395000_45690-2",
                    score: 0,
                  },
                ]
              }
            ]
          },
        ]
      }, {
        type: "grid",
        key: "1599814073000_6578",
        value: "",
        config: {
          borderWidth: "0", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "",
          flex: 1,
          align: "center", 
          justify: "flex-start", 
          direction: "row", 
          gapTB: "0", 
          gapLR: "",
          childWidth: "auto", 
          padding: "", 
          children: [{
              type: "checkbox",
              key: "1599814087000_22035",
              value: [],
              score: 0,
              config: {
                prefix: "去手术室前的相关准备工作：",
                prefixWidth: "220px",
                prefixAlign: "left",
                prefixWeight: 'bold',
              },
              options: [{
                  label: "已执行",
                  id: "1599814087000_22035-1",
                  score: 0,
                },
                {
                  label: "未执行",
                  id: "1599814087000_22035-2",
                  score: 0,
                },
              ]
            },

          ]
        }]
      }, {
        type: "checkbox",
        key: "1599815572000_3761",
        value: [],
        score: 0,
        config: {
          prefix: "去手术室时间：",
          prefixWidth: "120px",
          prefixAlign: "left",
          prefixWeight: 'bold',
        },
        options: [{
            label: "已去",
            id: "1599815572000_3761-1",
            score: 0,
            children: [{
              type: "date", 
              value: "", 
              key: "1599815605000_83913", 
              score: 0, 
              config: {
                prefix: "时间", 
                prefixWidth: "40px", 
                prefixAlign: "right", 
                placeholder: "", 
                width: "190px", 
                disabled: false, 
                readonly: false, 
                type: "datetime",
              },
            }]
          },
          {
            label: "未去",
            id: "1599815572000_3761-2",
            score: 0,
          },
        ]
      }, {
        type: "input", 
        value: "", 
        key: "1599814123000_10531", 
        score: 0, 
        config: {
          inputType: 'textarea',
          borderLine: true,
          prefix: "其他:", 
          prefixWidth: "70px", 
          prefixAlign: "left", 
          prefixWeight: "bold", 
          suffix: "", 
          suffixWidth: "40px", 
          suffixAlign: "left", 
          width: "400px", 
          disabled: false, 
          readonly: false, 
        },
      },
      {
        type: "grid",
        key: "1599814149000_71728",
        value: "",
        config: {
          borderWidth: "0px", 
          borderColor: "#ddd",
          borderStyle: "solid",
        },
        columns: [{
          width: "300px",
          flex: '',
          align: "flex-start", 
          justify: "flex-start", 
          direction: "column", 
          gapTB: "5px", 
          gapLR: "",
          childWidth: "auto", 
          padding: "", 
        }, {
          width: '',
          flex: 1,
          align: "flex-start", 
          justify: "flex-start", 
          direction: "row", 
          gapTB: "5px", 
          gapLR: "",
          childWidth: "auto", 
          padding: "", 
          children: [{
            type: 'button',
            value: '',
            key: '1600137757000_30084',
            config: {
              label: "签名",
              btnType: 'signature',
              signKey: '1600137764000_83834',
              signTimeKey: '1600137774000_59420',
              size: 'mini',
              width: '80px',
              printHidden: true
            }
          },{
            type: "input", 
            value: "", 
            key: "1600137764000_83834", 
            score: 0, 
            config: {
              inputType: 'text',
              borderLine: true,
              prefix: "护士签名：", 
              prefixWidth: "100px", 
              prefixAlign: "right", 
              prefixWeight: "bold", 
              suffix: "", 
              suffixWidth: "20px", 
              suffixAlign: "left", 
              width: "100px", 
              disabled: false, 
              readonly: false, 
            },
          },
          {
            type: "date", 
            value: "", 
            key: "1600137774000_59420", 
            score: 0, 
            config: {
              prefix: "时间：", 
              prefixWidth: "50px", 
              prefixAlign: "right", 
              placeholder: "", 
              width: "190px", 
              disabled: false, 
              readonly: false, 
              type: "datetime",
            },
          }
          ]
        }]
      }
    ]
  }]
}];
