// 术后患者护理评估记录单(术后      日)
export const DATA3 = [{
    "type": "grid",
    "key": "1600073159000_14283",
    "value": "",
    "config": {
      "borderWidth": "1px",
      "borderColor": "#ddd",
      "borderStyle": "solid"
    },
    "columns": [{
      "width": "",
      "flex": 1,
      "align": "flex-start",
      "justify": "flex-start",
      "direction": "column",
      "gapTB": "5px",
      "gapLR": "",
      "childWidth": "auto",
      "padding": "10px",
      "children": [{
          "type": "grid",
          "key": "1600073159000_25383",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-between",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_22832",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "T",
                  "prefixWidth": "10px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "suffix": "℃",
                  "suffixWidth": "20px",
                  "suffixAlign": "left",
                  "width": "70px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600073159000_76101",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "P",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "次/分",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "width": "70px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600073159000_12220",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "R",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "次/分",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "width": "70px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600073159000_94833",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "BP",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "mmHg",
                  "suffixWidth": "60px",
                  "suffixAlign": "left",
                  "width": "80px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "date",
                "value": "",
                "key": "1600073159000_62949",
                "score": 0,
                "config": {
                  "prefix": "测量时间",
                  "prefixWidth": "70px",
                  "prefixAlign": "right",
                  "placeholder": "",
                  "width": "190px",
                  "disabled": false,
                  "readonly": false,
                  "type": "datetime"
                }
              }
            ]
          }]
        },
        {
          "type": "grid",
          "key": "1600073159000_16478",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-between",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_85425",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "术后诊断：",
                  "prefixWidth": "70px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "suffix": "",
                  "suffixWidth": "20px",
                  "suffixAlign": "left",
                  "width": "300px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600073159000_59449",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "手术名称：",
                  "prefixWidth": "120px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "width": "330px",
                  "disabled": false,
                  "readonly": false
                }
              }
            ]
          }]
        },
        {
          "type": "checkbox",
          "key": "1600073159000_11540",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "神志：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold",
            "marginRight": "20px"
          },
          "options": [{
              "label": "清醒",
              "id": "1600073159000_11540-1",
              "score": 0
            },
            {
              "label": "未清醒",
              "id": "1600073159000_11540-2",
              "score": 0
            },
            {
              "label": "烦躁",
              "id": "1600073159000_11540-3",
              "score": 0
            },
            {
              "label": "嗜睡",
              "id": "1600073159000_11540-4",
              "score": 0
            },
            {
              "label": "昏睡",
              "id": "1600073159000_11540-5",
              "score": 0
            },
            {
              "label": "昏迷",
              "id": "1600073159000_11540-6",
              "score": 0
            },
            {
              "label": "其他",
              "id": "1600073159000_11540-7",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_36601",
                "score": 0,
                "config": {
                  "prefix": "",
                  "prefixWidth": "75px",
                  "prefixAlign": "right",
                  "placeholder": "",
                  "borderLine": true,
                  "width": "181px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            }
          ]
        },
        {
          "type": "grid",
          "key": "1600073159000_16219",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            children: [{
              type: "text",
              value: "",
              key: "1600323561000_69947",
              config: {
                label: "压疮危险性评估：",
                align: "left",
                weight: "bold",
                width: '170px'
              },
            }, {
              type: 'button',
              value: '',
              key: '1600323572000_99383',
              config: {
                label: "开始评估",
                importTitle: '压疮危险性评估',
                btnType: 'import',
                importTime: 'last',
                printHidden: true,
                size: 'mini',
                width: '80px',
                scoreKey: '1600323580000_72941',
                assId: '10004',
              }
            }, {
              type: "input",
              value: "",
              key: "1600323580000_72941",
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
              key: "1600323590000_1542",
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
                  id: "1600323590000_1542-1",
                  score: 0,
                },
                {
                  label: "及时翻身",
                  id: "1600323590000_1542-2",
                  score: 0,
                },
                {
                  label: "局部减压",
                  id: "1600323590000_1542-3",
                  score: 0,
                },
                {
                  label: "使用气垫床",
                  id: "1600323590000_1542-4",
                  score: 0,
                },
              ]
            }, ]
          }]
        },
        {
          "type": "grid",
          "key": "1600073159000_53890",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            children: [{
              type: "text",
              value: "",
              key: "1600323369000_66886",
              config: {
                label: "跌倒/坠床危险性评估：",
                align: "left",
                weight: "bold",
                width: '170px'
              },
            }, {
              type: 'button',
              value: '',
              key: '1600323377000_82857',
              config: {
                label: "开始评估",
                importTitle: '跌倒/坠床危险性评估',
                btnType: 'import',
                importTime: 'last',
                printHidden: true,
                size: 'mini',
                width: '80px',
                scoreKey: '1600323397000_80024',
                assId: '10002',
              }
            }, {
              type: "input",
              value: "",
              key: "1600323397000_80024",
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
              key: "1600323409000_16474",
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
                  id: "1600323409000_16474-1",
                  score: 0,
                },
                {
                  label: "加强巡视及看护",
                  id: "1600323409000_16474-2",
                  score: 0,
                },
                {
                  label: "使用床栏",
                  id: "1600323409000_16474-3",
                  score: 0,
                },
                {
                  label: "使用约束带",
                  id: "1600323409000_16474-4",
                  score: 0,
                },
              ]
            }, ]
          }]
        },
        {
          "type": "checkbox",
          "key": "1600073159000_36869",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "皮肤状况：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold"
          },
          "options": [{
              "label": "正常",
              "id": "1600073159000_36869-1",
              "score": 0
            },
            {
              "label": "异常",
              "id": "1600073159000_36869-2",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_42545",
                "score": 0,
                "config": {
                  "inputType": "textarea",
                  "borderLine": true,
                  "prefix": " ",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "suffix": "",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "width": "400px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            }
          ]
        },
        {
          type: "grid",
          key: "1600324625000_99516",
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
                key: "1600324637000_28144",
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
                key: '1600324646000_53507',
                config: {
                  label: "开始评估",
                  importTitle: '疼痛分级',
                  btnType: 'import',
                  importTime: 'last',
                  printHidden: true,
                  size: 'mini',
                  width: '80px',
                  scoreKey: '1600324652000_32008',
                  levelKey: '1600324662000_74665',
                  assId: '10009',
                }
              },
              {
                type: "input",
                value: "",
                key: "1600324652000_32008",
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
                key: "1600324662000_74665",
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
          "type": "checkbox",
          "key": "1600073159000_5458",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "疼痛症状管理：",
            "prefixWidth": "120px",
            "prefixAlign": "left",
            "prefixWeight": "bold"
          },
          "options": [{
              "label": "心理护理",
              "id": "1600073159000_5458-1",
              "score": 0
            },
            {
              "label": "通知医生",
              "id": "1600073159000_5458-2",
              "score": 0
            },
            {
              "label": "镇痛泵",
              "id": "1600073159000_5458-3",
              "score": 0
            },
            {
              "label": "用药",
              "id": "1600073159000_5458-4",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_41412",
                "score": 0,
                "config": {
                  "inputType": "textarea",
                  "borderLine": true,
                  "prefix": "",
                  "prefixWidth": "75px",
                  "prefixAlign": "right",
                  "placeholder": "",
                  "width": "300px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            }
          ]
        },
        {
          "type": "checkbox",
          "key": "1600073159000_23413",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "术后宣教：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold"
          },
          "options": [{
              "label": "1.安全宣教:",
              "id": "1600073159000_23413-1",
              "checkboxHidden": true,
              "score": 0
            },
            {
              "label": "防跌倒、坠床、烫伤",
              "id": "1600073159000_23413-2",
              "score": 0
            },
            {
              "label": "禁止吸烟、禁止使用电器、禁止使用明火",
              "id": "1600073159000_23413-3",
              "score": 0
            },
            {
              "label": "2.术后常见并发症的预防",
              "id": "1600073159000_23413-4",
              "score": 0
            },
            {
              "label": "3.指导腹式呼吸、深呼吸及咳嗽咳痰",
              "id": "1600073159000_23413-5",
              "score": 0
            },
            {
              "label": "4.管道护理宣教",
              "id": "1600073159000_23413-6",
              "score": 0
            },
            {
              "label": "5.吸氧注意事项",
              "id": "1600073159000_23413-7",
              "score": 0
            },
            {
              "label": "6.按分级护理提供优质服务",
              "id": "1600073159000_23413-8",
              "score": 0
            },
            {
              "label": "7.陪人管理",
              "id": "1600073159000_23413-9",
              "score": 0
            },
            {
              "label": "8.刀口注意事项",
              "id": "1600073159000_23413-10",
              "score": 0
            },
            {
              "label": "9.饮食及活动指导",
              "id": "1600073159000_23413-11",
              "score": 0
            },
            {
              "label": "10.功能锻炼",
              "id": "1600073159000_23413-12",
              "score": 0
            },
            {
              "label": "11.心电监护",
              "id": "1600073159000_23413-13",
              "score": 0
            },
            {
              "label": "12.用药宣教",
              "id": "1600073159000_23413-14",
              "score": 0
            },
            {
              "label": "13.心理指导",
              "id": "1600073159000_23413-15",
              "score": 0
            },
            {
              "label": "14.镇痛泵的使用及注意事项",
              "id": "1600073159000_23413-16",
              "score": 0
            },
            {
              "label": "15. 药物",
              "id": "1600073159000_23413-17",
              "score": 0
            },
            {
              "label": "16. 咳痰护理",
              "id": "1600073159000_23413-18",
              "score": 0
            },
            {
              "label": "17.其它：",
              "id": "1600073159000_23413-19",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_47163",
                "score": 0,
                "config": {
                  "inputType": "textarea",
                  "borderLine": true,
                  "prefix": "",
                  "prefixWidth": "75px",
                  "prefixAlign": "right",
                  "placeholder": "",
                  "width": "300px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            }
          ]
        },
        {
          "type": "checkbox",
          "key": "1600073159000_74101",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "心理状态：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold"
          },
          "options": [{
              "label": "良好",
              "id": "1600073159000_74101-1",
              "score": 0
            },
            {
              "label": "焦虑",
              "id": "1600073159000_74101-2",
              "score": 0
            },
            {
              "label": "抑郁",
              "id": "1600073159000_74101-3",
              "score": 0
            },
            {
              "label": "恐惧",
              "id": "1600073159000_74101-4",
              "score": 0
            }
          ]
        },
        {
          type: "grid",
          key: "1600323707000_75773",
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
                key: "1600323723000_60923",
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
                key: '1600323736000_79622',
                config: {
                  label: "开始评估",
                  importTitle: '自理能力',
                  btnType: 'import',
                  importTime: 'last',
                  printHidden: true,
                  size: 'mini',
                  width: '80px',
                  scoreKey: '1600323745000_59566',
                  levelKey: '1600323755000_85185',
                  assId: '10007',
                }
              },
              {
                type: "input",
                value: "",
                key: "1600323745000_59566",
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
                key: "1600323755000_85185",
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
          "type": "grid",
          "key": "1600073159000_64535",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
              "width": "400px",
              "flex": "",
              "align": "center",
              "justify": "space-start",
              "direction": "row",
              "gapTB": "0",
              "gapLR": "0",
              "childWidth": "auto",
              "padding": "0",
              "children": [{
                "type": "checkbox",
                "key": "1600073159000_26514",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "刀口敷料：",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold"
                },
                "options": [{
                    "label": "无",
                    "id": "1600073159000_26514-1",
                    "score": 0
                  },
                  {
                    "label": "清洁干燥",
                    "id": "1600073159000_26514-2",
                    "score": 0
                  },
                  {
                    "label": "渗出",
                    "id": "1600073159000_26514-3",
                    "score": 0
                  }
                ]
              }]
            },
            {
              "width": "400px",
              "flex": "",
              "align": "center",
              "justify": "space-start",
              "direction": "row",
              "gapTB": "0",
              "gapLR": "0",
              "childWidth": "auto",
              "padding": "0",
              "children": [{
                "type": "checkbox",
                "key": "1600073159000_55774",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "换药：",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold"
                },
                "options": [{
                    "label": "是",
                    "id": "1600073159000_55774-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600073159000_55774-2",
                    "score": 0
                  }
                ]
              }]
            }
          ]
        },
        {
          "type": "checkbox",
          "key": "1600073159000_87177",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "吸氧方式：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold",
            "marginRight": "15px"
          },
          "options": [{
              "label": "无",
              "id": "1600073159000_87177-1",
              "score": 0
            },
            {
              "label": "鼻塞",
              "id": "1600073159000_87177-2",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_45207",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "流量：",
                  "prefixWidth": "40px",
                  "prefixAlign": "right",
                  "suffix": "升/分",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "placeholder": "",
                  "width": "60px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            },
            {
              "label": "面罩",
              "id": "1600073159000_87177-3",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_75994",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "流量：",
                  "prefixWidth": "40px",
                  "prefixAlign": "right",
                  "suffix": "升/分",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "placeholder": "",
                  "width": "60px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            },
            {
              "label": "鼻导管",
              "id": "1600073159000_87177-4",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_97746",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "流量：",
                  "prefixWidth": "40px",
                  "prefixAlign": "right",
                  "suffix": "升/分",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "placeholder": "",
                  "width": "60px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            }
          ]
        },
        {
          "type": "checkbox",
          "key": "1600073159000_481",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "呼吸道管理：",
            "prefixWidth": "100px",
            "prefixAlign": "left",
            "prefixWeight": "bold"
          },
          "options": [{
              "label": "无",
              "id": "1600073159000_481-1",
              "score": 0
            },
            {
              "label": "拍背咳痰",
              "id": "1600073159000_481-2",
              "score": 0
            },
            {
              "label": "雾化吸入",
              "id": "1600073159000_481-3",
              "score": 0
            },
            {
              "label": "吸痰",
              "id": "1600073159000_481-4",
              "score": 0
            }
          ]
        },
        {
          "type": "grid",
          "key": "1600073159000_87321",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
              "width": "330px",
              "flex": "",
              "align": "center",
              "justify": "space-start",
              "direction": "row",
              "gapTB": "0",
              "gapLR": "0",
              "childWidth": "auto",
              "padding": "0",
              "children": [{
                "type": "checkbox",
                "key": "1600073159000_83004",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "痰量：",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "多",
                    "id": "1600073159000_83004-1",
                    "score": 0
                  },
                  {
                    "label": "少",
                    "id": "1600073159000_83004-2",
                    "score": 0
                  },
                  {
                    "label": "易咳",
                    "id": "1600073159000_83004-3",
                    "score": 0
                  },
                  {
                    "label": "难咳",
                    "id": "1600073159000_83004-4",
                    "score": 0
                  }
                ]
              }]
            },
            {
              "width": "540px",
              "flex": "",
              "align": "center",
              "justify": "space-start",
              "direction": "row",
              "gapTB": "0",
              "gapLR": "0",
              "childWidth": "auto",
              "padding": "0",
              "children": [{
                "type": "checkbox",
                "key": "1600073159000_10849",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "痰液颜色性状：",
                  "prefixWidth": "120px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "白色粘痰",
                    "id": "1600073159000_10849-1",
                    "score": 0
                  },
                  {
                    "label": "黄色粘痰",
                    "id": "1600073159000_10849-2",
                    "score": 0
                  },
                  {
                    "label": "血性痰",
                    "id": "1600073159000_10849-3",
                    "score": 0
                  },
                  {
                    "label": "粉红色泡沫痰",
                    "id": "1600073159000_10849-4",
                    "score": 0
                  }
                ]
              }]
            }
          ]
        },
        {
          "type": "grid",
          "key": "1600073159000_42123",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
              "width": "400px",
              "flex": "",
              "align": "center",
              "justify": "space-start",
              "direction": "row",
              "gapTB": "0",
              "gapLR": "0",
              "childWidth": "auto",
              "padding": "0",
              "children": [{
                "type": "checkbox",
                "key": "1600073159000_73432",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "卫生处置：",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold"
                },
                "options": [{
                    "label": "已执行",
                    "id": "1600073159000_73432-1",
                    "score": 0
                  },
                  {
                    "label": "未执行",
                    "id": "1600073159000_73432-2",
                    "score": 0
                  }
                ]
              }]
            },
            {
              "width": "420px",
              "flex": "",
              "align": "center",
              "justify": "space-start",
              "direction": "row",
              "gapTB": "0",
              "gapLR": "0",
              "childWidth": "auto",
              "padding": "0",
              "children": [{
                "type": "checkbox",
                "key": "1600073159000_43791",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "治疗依从性：",
                  "prefixWidth": "100px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold"
                },
                "options": [{
                    "label": "好",
                    "id": "1600073159000_43791-1",
                    "score": 0
                  },
                  {
                    "label": "一般",
                    "id": "1600073159000_43791-2",
                    "score": 0
                  },
                  {
                    "label": "差",
                    "id": "1600073159000_43791-3",
                    "score": 0
                  }
                ]
              }]
            }
          ]
        },
        {
          "type": "grid",
          "key": "1600073159000_54119",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "checkbox",
                "key": "1600073159000_50397",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "静脉通路：",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "无",
                    "id": "1600073159000_50397-1",
                    "score": 0
                  },
                  {
                    "label": "有",
                    "id": "1600073159000_50397-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "checkbox",
                "key": "1600073159000_56527",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "1、头皮针输液：",
                  "prefixWidth": "110px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "通畅",
                    "id": "1600073159000_56527-1",
                    "score": 0
                  },
                  {
                    "label": "已拔除",
                    "id": "1600073159000_56527-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "checkbox",
                "key": "1600073159000_6854",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "2、静脉留置：",
                  "prefixWidth": "110px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "通畅",
                    "id": "1600073159000_6854-1",
                    "score": 0
                  },
                  {
                    "label": "封管",
                    "id": "1600073159000_6854-2",
                    "score": 0
                  }
                ]
              }
            ]
          }]
        },
        {
          "type": "checkbox",
          "key": "1600838818000_91285",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "管道护理：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold",
            "marginRight": "15px"
          },
          "options": [{
              "label": "无",
              "id": "1600838818000_91285-1",
              "score": 0
            },
            {
              "label": "有",
              "id": "1600838818000_91285-2",
              "score": 0
            }
          ]
        },
        {
          "type": "grid",
          "key": "1600073159000_24013",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_13790",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "1：",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "通畅：",
                  "suffixWidth": "60px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "checkbox",
                "key": "1600073159000_21932",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "是",
                    "id": "1600073159000_21932-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600073159000_21932-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "input",
                "value": "",
                "key": "1600073159000_96864",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "颜色性质",
                  "prefixWidth": "70px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "",
                  "suffixWidth": "100px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600073159000_82593",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "本班引流量",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "ml",
                  "suffixWidth": "50px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "50px",
                  "disabled": false,
                  "readonly": false
                }
              }
            ]
          }]
        },
        {
          "type": "grid",
          "key": "1600073159000_50315",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_80429",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "2：",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "通畅：",
                  "suffixWidth": "60px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "checkbox",
                "key": "1600073159000_7394",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "是",
                    "id": "1600073159000_7394-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600073159000_7394-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "input",
                "value": "",
                "key": "1600073159000_43479",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "颜色性质",
                  "prefixWidth": "70px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "",
                  "suffixWidth": "100px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600073159000_30598",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "本班引流量",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "ml",
                  "suffixWidth": "50px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "50px",
                  "disabled": false,
                  "readonly": false
                }
              }
            ]
          }]
        },
        {
          "type": "grid",
          "key": "1600073159000_95696",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_13621",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "3：",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "通畅：",
                  "suffixWidth": "60px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "checkbox",
                "key": "1600073159000_46079",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "是",
                    "id": "1600073159000_46079-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600073159000_46079-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "input",
                "value": "",
                "key": "1600073159000_87173",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "颜色性质",
                  "prefixWidth": "70px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "",
                  "suffixWidth": "100px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600073159000_24619",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "本班引流量",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "ml",
                  "suffixWidth": "50px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "50px",
                  "disabled": false,
                  "readonly": false
                }
              }
            ]
          }]
        },
        {
          "type": "grid",
          "key": "1600073159000_29318",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_36530",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "4：",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "通畅：",
                  "suffixWidth": "60px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "checkbox",
                "key": "1600073159000_76340",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "是",
                    "id": "1600073159000_76340-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600073159000_76340-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "input",
                "value": "",
                "key": "1600073159000_95630",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "颜色性质",
                  "prefixWidth": "70px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "",
                  "suffixWidth": "100px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600073159000_12922",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "本班引流量",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "ml",
                  "suffixWidth": "50px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "50px",
                  "disabled": false,
                  "readonly": false
                }
              }
            ]
          }]
        },
        {
          "type": "input",
          "value": "",
          "key": "1600073159000_22918",
          "score": 0,
          "config": {
            "inputType": "textarea",
            "borderLine": true,
            "prefix": "其他：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold",
            "suffix": "",
            "suffixWidth": "40px",
            "suffixAlign": "left",
            "width": "600px",
            "disabled": false,
            "readonly": false
          }
        },
        {
          type: "grid",
          key: "1600137963000_9806",
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
                  signKey: '1600137971000_45863',
                  signTimeKey: '1600137986000_26306',
                  size: 'mini',
                  width: '80px',
                  printHidden: true
                }
              }, {
                type: "input",
                value: "",
                key: "1600137971000_45863",
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
                key: "1600137986000_26306",
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
  },
  {
    "type": "grid",
    "key": "1600073159000_48451",
    "value": "",
    "config": {
      "borderWidth": "1px",
      "borderColor": "#ddd",
      "borderStyle": "solid"
    },
    "columns": [{
      "width": "",
      "flex": 1,
      "align": "flex-start",
      "justify": "flex-start",
      "direction": "column",
      "gapTB": "5px",
      "gapLR": "",
      "childWidth": "auto",
      "padding": "10px",
      "children": [{
          "type": "checkbox",
          "key": "1600073159000_39238",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "神志：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold",
            "marginRight": "20px"
          },
          "options": [{
              "label": "清醒",
              "id": "1600073159000_39238-1",
              "score": 0
            },
            {
              "label": "未清醒",
              "id": "1600073159000_39238-2",
              "score": 0
            },
            {
              "label": "烦躁",
              "id": "1600073159000_39238-3",
              "score": 0
            },
            {
              "label": "嗜睡",
              "id": "1600073159000_39238-4",
              "score": 0
            },
            {
              "label": "昏睡",
              "id": "1600073159000_39238-5",
              "score": 0
            },
            {
              "label": "昏迷",
              "id": "1600073159000_39238-6",
              "score": 0
            },
          ]
        },
        {
          "type": "checkbox",
          "key": "1600073159000_28241",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "皮肤状况：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold"
          },
          "options": [{
              "label": "正常",
              "id": "1600073159000_28241-1",
              "score": 0
            },
            {
              "label": "异常",
              "id": "1600073159000_28241-2",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_71908",
                "score": 0,
                "config": {
                  "inputType": "textarea",
                  "borderLine": true,
                  "prefix": " ",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "suffix": "",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "width": "400px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            }
          ]
        },
        {
          type: "grid",
          key: "1600324679000_39680",
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
                key: "1600324686000_62802",
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
                key: '1600324696000_78797',
                config: {
                  label: "开始评估",
                  importTitle: '疼痛分级',
                  btnType: 'import',
                  importTime: 'last',
                  printHidden: true,
                  size: 'mini',
                  width: '80px',
                  scoreKey: '1600324705000_35988',
                  levelKey: '1600324712000_24622',
                  assId: '10009',
                }
              },
              {
                type: "input",
                value: "",
                key: "1600324705000_35988",
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
                key: "1600324712000_24622",
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
          "type": "checkbox",
          "key": "1600073159000_14502",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "症状管理：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold"
          },
          "options": [{
              "label": "心理护理",
              "id": "1600073159000_14502-1",
              "score": 0
            },
            {
              "label": "通知医生",
              "id": "1600073159000_14502-2",
              "score": 0
            },
            {
              "label": "镇痛泵",
              "id": "1600073159000_14502-3",
              "score": 0
            },
            {
              "label": "用药",
              "id": "1600073159000_14502-4",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_44922",
                "score": 0,
                "config": {
                  "inputType": "textarea",
                  "borderLine": true,
                  "prefix": "",
                  "prefixWidth": "75px",
                  "prefixAlign": "right",
                  "placeholder": "",
                  "width": "300px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            }
          ]
        },
        {
          type: "grid",
          key: "1600323857000_51940",
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
                key: "1600323866000_18950",
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
                key: '1600323874000_5550',
                config: {
                  label: "开始评估",
                  importTitle: '自理能力',
                  btnType: 'import',
                  importTime: 'last',
                  printHidden: true,
                  size: 'mini',
                  width: '80px',
                  scoreKey: '1600323887000_72561',
                  levelKey: '1600323894000_65446',
                  assId: '10007',
                }
              },
              {
                type: "input",
                value: "",
                key: "1600323887000_72561",
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
                key: "1600323894000_65446",
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
          "type": "grid",
          "key": "1600073159000_28242",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
              "width": "400px",
              "flex": "",
              "align": "flex-start",
              "justify": "flex-start",
              "direction": "row",
              "gapTB": "",
              "gapLR": "",
              "childWidth": "auto",
              "padding": "",
              "children": [{
                "type": "checkbox",
                "key": "1600073159000_41830",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "刀口敷料：",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold"
                },
                "options": [{
                    "label": "无",
                    "id": "1600073159000_41830-1",
                    "score": 0
                  },
                  {
                    "label": "清洁干燥",
                    "id": "1600073159000_41830-2",
                    "score": 0
                  },
                  {
                    "label": "渗出",
                    "id": "1600073159000_41830-3",
                    "score": 0
                  }
                ]
              }]
            },
            {
              "width": "400px",
              "flex": "",
              "align": "flex-start",
              "justify": "flex-start",
              "direction": "row",
              "gapTB": "",
              "gapLR": "",
              "childWidth": "auto",
              "padding": "",
              "children": [{
                "type": "checkbox",
                "key": "1600073159000_13793",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "换药：",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold"
                },
                "options": [{
                    "label": "是",
                    "id": "1600073159000_13793-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600073159000_13793-2",
                    "score": 0
                  }
                ]
              }]
            }
          ]
        },
        {
          "type": "checkbox",
          "key": "1600073159000_34264",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "吸氧方式：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold",
            "marginRight": "15px"
          },
          "options": [{
              "label": "无",
              "id": "1600073159000_34264-1",
              "score": 0
            },
            {
              "label": "鼻塞",
              "id": "1600073159000_34264-2",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_33255",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "流量：",
                  "prefixWidth": "40px",
                  "prefixAlign": "right",
                  "suffix": "升/分",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "placeholder": "",
                  "width": "60px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            },
            {
              "label": "面罩",
              "id": "1600073159000_34264-3",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_88642",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "流量：",
                  "prefixWidth": "40px",
                  "prefixAlign": "right",
                  "suffix": "升/分",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "placeholder": "",
                  "width": "60px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            },
            {
              "label": "鼻导管",
              "id": "1600073159000_34264-4",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_32551",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "流量：",
                  "prefixWidth": "40px",
                  "prefixAlign": "right",
                  "suffix": "升/分",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "placeholder": "",
                  "width": "60px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            }
          ]
        },
        {
          "type": "grid",
          "key": "1600073159000_6766",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
              "width": "450px",
              "flex": "",
              "align": "center",
              "justify": "space-start",
              "direction": "row",
              "gapTB": "0",
              "gapLR": "0",
              "childWidth": "auto",
              "padding": "0",
              "children": [{
                "type": "checkbox",
                "key": "1600073159000_74795",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "呼吸道管理：",
                  "prefixWidth": "100px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "10px"
                },
                "options": [{
                    "label": "无",
                    "id": "1600073159000_74795-1",
                    "score": 0
                  },
                  {
                    "label": "拍背咳痰",
                    "id": "1600073159000_74795-2",
                    "score": 0
                  },
                  {
                    "label": "雾化吸入",
                    "id": "1600073159000_74795-3",
                    "score": 0
                  },
                  {
                    "label": "吸痰",
                    "id": "1600073159000_74795-4",
                    "score": 0
                  }
                ]
              }]
            },
            {
              "width": "380px",
              "flex": "",
              "align": "center",
              "justify": "space-start",
              "direction": "row",
              "gapTB": "0",
              "gapLR": "0",
              "childWidth": "auto",
              "padding": "0",
              "children": [{
                "type": "checkbox",
                "key": "1600073159000_20060",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "痰量：",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "marginRight": "10px"
                },
                "options": [{
                    "label": "多",
                    "id": "1600073159000_20060-1",
                    "score": 0
                  },
                  {
                    "label": "少",
                    "id": "1600073159000_20060-2",
                    "score": 0
                  },
                  {
                    "label": "易咳",
                    "id": "1600073159000_20060-3",
                    "score": 0
                  },
                  {
                    "label": "难咳",
                    "id": "1600073159000_20060-4",
                    "score": 0
                  },
                  {
                    "label": "无",
                    "id": "1600073159000_20060-5",
                    "score": 0
                  }
                ]
              }]
            }
          ]
        },
        {
          "type": "grid",
          "key": "1600073159000_19060",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "checkbox",
                "key": "1600073159000_28387",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "睡眠状况：",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "好",
                    "id": "1600073159000_28387-1",
                    "score": 0
                  },
                  {
                    "label": "一般",
                    "id": "1600073159000_28387-2",
                    "score": 0
                  },
                  {
                    "label": "差",
                    "id": "1600073159000_28387-3",
                    "score": 0
                  }
                ]
              },
              {
                "type": "input",
                "value": "",
                "key": "1600073159000_97310",
                "score": 0,
                "config": {
                  "inputType": "textarea",
                  "borderLine": true,
                  "prefix": "用药：",
                  "prefixWidth": "60px",
                  "prefixAlign": "right",
                  "suffix": "",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "placeholder": "",
                  "width": "200px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "date",
                "value": "",
                "key": "1600073159000_68151",
                "score": 0,
                "config": {
                  "prefix": "时间：",
                  "prefixWidth": "60px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "placeholder": "",
                  "width": "190px",
                  "disabled": false,
                  "readonly": false,
                  "type": "datetime"
                }
              }
            ]
          }]
        },
        {
          "type": "grid",
          "key": "1600073159000_56888",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "checkbox",
                "key": "1600073159000_23239",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "静脉通路：",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "无",
                    "id": "1600073159000_23239-1",
                    "score": 0
                  },
                  {
                    "label": "有",
                    "id": "1600073159000_23239-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "checkbox",
                "key": "1600073159000_66113",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "1、头皮针输液：",
                  "prefixWidth": "110px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "通畅",
                    "id": "1600073159000_66113-1",
                    "score": 0
                  },
                  {
                    "label": "已拔除",
                    "id": "1600073159000_66113-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "checkbox",
                "key": "1600073159000_14831",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "2、静脉留置：",
                  "prefixWidth": "110px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "通畅",
                    "id": "1600073159000_14831-1",
                    "score": 0
                  },
                  {
                    "label": "封管",
                    "id": "1600073159000_14831-2",
                    "score": 0
                  }
                ]
              }
            ]
          }]
        },
        {
          "type": "checkbox",
          "key": "1600073159000_2780",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "管道护理：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold",
            "marginRight": "15px"
          },
          "options": [{
              "label": "无",
              "id": "1600073159000_2780-1",
              "score": 0
            },
            {
              "label": "有",
              "id": "1600073159000_2780-2",
              "score": 0
            }
          ]
        },
        {
          "type": "grid",
          "key": "1600839157000_99855",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "input",
                "value": "",
                "key": "1600839169000_11318",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "1：",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "通畅：",
                  "suffixWidth": "60px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "checkbox",
                "key": "1600839181000_87258",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "是",
                    "id": "1600839181000_87258-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600839181000_87258-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839196000_52290",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "颜色性质",
                  "prefixWidth": "70px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "",
                  "suffixWidth": "100px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839203000_20283",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "本班引流量",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "ml",
                  "suffixWidth": "50px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "50px",
                  "disabled": false,
                  "readonly": false
                }
              }
            ]
          }]
        },
        {
          "type": "grid",
          "key": "1600839211000_77626",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "input",
                "value": "",
                "key": "1600839222000_94042",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "2：",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "通畅：",
                  "suffixWidth": "60px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "checkbox",
                "key": "1600839242000_96609",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "是",
                    "id": "1600839242000_96609-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600839242000_96609-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839265000_10077",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "颜色性质",
                  "prefixWidth": "70px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "",
                  "suffixWidth": "100px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839273000_35063",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "本班引流量",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "ml",
                  "suffixWidth": "50px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "50px",
                  "disabled": false,
                  "readonly": false
                }
              }
            ]
          }]
        },
        {
          "type": "grid",
          "key": "1600839280000_58584",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "input",
                "value": "",
                "key": "1600839286000_56866",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "3：",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "通畅：",
                  "suffixWidth": "60px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "checkbox",
                "key": "1600839296000_53013",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "是",
                    "id": "1600839296000_53013-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600839296000_53013-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839305000_35482",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "颜色性质",
                  "prefixWidth": "70px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "",
                  "suffixWidth": "100px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839313000_63690",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "本班引流量",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "ml",
                  "suffixWidth": "50px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "50px",
                  "disabled": false,
                  "readonly": false
                }
              }
            ]
          }]
        },
        {
          "type": "grid",
          "key": "1600839320000_93416",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "input",
                "value": "",
                "key": "1600839327000_7223",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "4：",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "通畅：",
                  "suffixWidth": "60px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "checkbox",
                "key": "1600839334000_29061",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "是",
                    "id": "1600839334000_29061-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600839334000_29061-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839344000_58313",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "颜色性质",
                  "prefixWidth": "70px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "",
                  "suffixWidth": "100px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839351000_84454",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "本班引流量",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "ml",
                  "suffixWidth": "50px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "50px",
                  "disabled": false,
                  "readonly": false
                }
              }
            ]
          }]
        },
        {
          "type": "input",
          "value": "",
          "key": "1600073159000_79757",
          "score": 0,
          "config": {
            "inputType": "textarea",
            "borderLine": true,
            "prefix": "其他：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold",
            "suffix": "",
            "suffixWidth": "40px",
            "suffixAlign": "left",
            "width": "600px",
            "disabled": false,
            "readonly": false
          }
        },
        {
          type: "grid",
          key: "1600138025000_60291",
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
                key: '1600138033000_61238',
                config: {
                  label: "签名",
                  btnType: 'signature',
                  signKey: '1600138040000_24201',
                  signTimeKey: '1600138052000_91267',
                  size: 'mini',
                  width: '80px',
                  printHidden: true
                }
              }, {
                type: "input",
                value: "",
                key: "1600138040000_24201",
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
                key: "1600138052000_91267",
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
  },
  {
    "type": "grid",
    "key": "1600073159000_77743",
    "value": "",
    "config": {
      "borderWidth": "1px",
      "borderColor": "#ddd",
      "borderStyle": "solid"
    },
    "columns": [{
      "width": "",
      "flex": 1,
      "align": "flex-start",
      "justify": "flex-start",
      "direction": "column",
      "gapTB": "5px",
      "gapLR": "",
      "childWidth": "auto",
      "padding": "10px",
      "children": [{
          "type": "checkbox",
          "key": "1600073159000_54958",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "神志：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold",
            "marginRight": "20px"
          },
          "options": [{
              "label": "清醒",
              "id": "1600073159000_54958-1",
              "score": 0
            },
            {
              "label": "未清醒",
              "id": "1600073159000_54958-2",
              "score": 0
            },
            {
              "label": "烦躁",
              "id": "1600073159000_54958-3",
              "score": 0
            },
            {
              "label": "嗜睡",
              "id": "1600073159000_54958-4",
              "score": 0
            },
            {
              "label": "昏睡",
              "id": "1600073159000_54958-5",
              "score": 0
            },
            {
              "label": "昏迷",
              "id": "1600073159000_54958-6",
              "score": 0
            },
          ]
        },
        {
          "type": "checkbox",
          "key": "1600073159000_72681",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "皮肤状况：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold"
          },
          "options": [{
              "label": "正常",
              "id": "1600073159000_72681-1",
              "score": 0
            },
            {
              "label": "异常",
              "id": "1600073159000_72681-2",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_16012",
                "score": 0,
                "config": {
                  "inputType": "textarea",
                  "borderLine": true,
                  "prefix": " ",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "suffix": "",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "width": "400px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            }
          ]
        },
        {
          type: "grid",
          key: "1600324731000_19220",
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
                key: "1600324738000_86301",
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
                key: '1600324746000_91666',
                config: {
                  label: "开始评估",
                  importTitle: '疼痛分级',
                  btnType: 'import',
                  importTime: 'last',
                  printHidden: true,
                  size: 'mini',
                  width: '80px',
                  scoreKey: '1600324755000_87754',
                  levelKey: '1600324763000_80042',
                  assId: '10009',
                }
              },
              {
                type: "input",
                value: "",
                key: "1600324755000_87754",
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
                key: "1600324763000_80042",
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
          "type": "checkbox",
          "key": "1600073159000_76812",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "症状管理：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold"
          },
          "options": [{
              "label": "心理护理",
              "id": "1600073159000_76812-1",
              "score": 0
            },
            {
              "label": "通知医生",
              "id": "1600073159000_76812-2",
              "score": 0
            },
            {
              "label": "镇痛泵",
              "id": "1600073159000_76812-3",
              "score": 0
            },
            {
              "label": "用药",
              "id": "1600073159000_76812-4",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_42620",
                "score": 0,
                "config": {
                  "inputType": "textarea",
                  "borderLine": true,
                  "prefix": "",
                  "prefixWidth": "75px",
                  "prefixAlign": "right",
                  "placeholder": "",
                  "width": "300px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            }
          ]
        },
        {
          type: "grid",
          key: "1600323918000_53701",
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
                key: "1600323926000_67691",
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
                key: '1600323935000_10654',
                config: {
                  label: "开始评估",
                  importTitle: '自理能力',
                  btnType: 'import',
                  importTime: 'last',
                  printHidden: true,
                  size: 'mini',
                  width: '80px',
                  scoreKey: '1600323946000_66725',
                  levelKey: '1600323953000_95020',
                  assId: '10007',
                }
              },
              {
                type: "input",
                value: "",
                key: "1600323946000_66725",
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
                key: "1600323953000_95020",
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
          "type": "grid",
          "key": "1600073159000_64099",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
              "width": "400px",
              "flex": "",
              "align": "flex-start",
              "justify": "flex-start",
              "direction": "row",
              "gapTB": "",
              "gapLR": "",
              "childWidth": "auto",
              "padding": "",
              "children": [{
                "type": "checkbox",
                "key": "1600073159000_61977",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "刀口敷料：",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold"
                },
                "options": [{
                    "label": "无",
                    "id": "1600073159000_61977-1",
                    "score": 0
                  },
                  {
                    "label": "清洁干燥",
                    "id": "1600073159000_61977-2",
                    "score": 0
                  },
                  {
                    "label": "渗出",
                    "id": "1600073159000_61977-3",
                    "score": 0
                  }
                ]
              }]
            },
            {
              "width": "400px",
              "flex": "",
              "align": "flex-start",
              "justify": "flex-start",
              "direction": "row",
              "gapTB": "",
              "gapLR": "",
              "childWidth": "auto",
              "padding": "",
              "children": [{
                "type": "checkbox",
                "key": "1600073159000_4529",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "换药：",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold"
                },
                "options": [{
                    "label": "是",
                    "id": "1600073159000_4529-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600073159000_4529-2",
                    "score": 0
                  }
                ]
              }]
            }
          ]
        },
        {
          "type": "checkbox",
          "key": "1600073159000_7674",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "吸氧方式：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold",
            "marginRight": "15px"
          },
          "options": [{
              "label": "无",
              "id": "1600073159000_7674-1",
              "score": 0
            },
            {
              "label": "鼻塞",
              "id": "1600073159000_7674-2",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_70125",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "流量：",
                  "prefixWidth": "40px",
                  "prefixAlign": "right",
                  "suffix": "升/分",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "placeholder": "",
                  "width": "60px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            },
            {
              "label": "面罩",
              "id": "1600073159000_7674-3",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_73999",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "流量：",
                  "prefixWidth": "40px",
                  "prefixAlign": "right",
                  "suffix": "升/分",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "placeholder": "",
                  "width": "60px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            },
            {
              "label": "鼻导管",
              "id": "1600073159000_7674-4",
              "score": 0,
              "children": [{
                "type": "input",
                "value": "",
                "key": "1600073159000_32581",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "流量：",
                  "prefixWidth": "40px",
                  "prefixAlign": "right",
                  "suffix": "升/分",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "placeholder": "",
                  "width": "60px",
                  "disabled": false,
                  "readonly": false
                }
              }]
            }
          ]
        },
        {
          "type": "grid",
          "key": "1600073159000_58554",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
              "width": "450px",
              "flex": "",
              "align": "center",
              "justify": "space-start",
              "direction": "row",
              "gapTB": "0",
              "gapLR": "0",
              "childWidth": "auto",
              "padding": "0",
              "children": [{
                "type": "checkbox",
                "key": "1600073159000_14111",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "呼吸道管理：",
                  "prefixWidth": "100px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "10px"
                },
                "options": [{
                    "label": "无",
                    "id": "1600073159000_14111-1",
                    "score": 0
                  },
                  {
                    "label": "拍背咳痰",
                    "id": "1600073159000_14111-2",
                    "score": 0
                  },
                  {
                    "label": "雾化吸入",
                    "id": "1600073159000_14111-3",
                    "score": 0
                  },
                  {
                    "label": "吸痰",
                    "id": "1600073159000_14111-4",
                    "score": 0
                  }
                ]
              }]
            },
            {
              "width": "380px",
              "flex": "",
              "align": "center",
              "justify": "space-start",
              "direction": "row",
              "gapTB": "0",
              "gapLR": "0",
              "childWidth": "auto",
              "padding": "0",
              "children": [{
                "type": "checkbox",
                "key": "1600073159000_17892",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "痰量：",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "marginRight": "10px"
                },
                "options": [{
                    "label": "多",
                    "id": "1600073159000_17892-1",
                    "score": 0
                  },
                  {
                    "label": "少",
                    "id": "1600073159000_17892-2",
                    "score": 0
                  },
                  {
                    "label": "易咳",
                    "id": "1600073159000_17892-3",
                    "score": 0
                  },
                  {
                    "label": "难咳",
                    "id": "1600073159000_17892-4",
                    "score": 0
                  },
                  {
                    "label": "无",
                    "id": "1600073159000_17892-5",
                    "score": 0
                  }
                ]
              }]
            }
          ]
        },
        {
          "type": "grid",
          "key": "1600073159000_60466",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "checkbox",
                "key": "1600073159000_23898",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "睡眠状况：",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "好",
                    "id": "1600073159000_23898-1",
                    "score": 0
                  },
                  {
                    "label": "一般",
                    "id": "1600073159000_23898-2",
                    "score": 0
                  },
                  {
                    "label": "差",
                    "id": "1600073159000_23898-3",
                    "score": 0
                  }
                ]
              },
              {
                "type": "input",
                "value": "",
                "key": "1600073159000_59872",
                "score": 0,
                "config": {
                  "inputType": "textarea",
                  "borderLine": true,
                  "prefix": "用药：",
                  "prefixWidth": "60px",
                  "prefixAlign": "right",
                  "suffix": "",
                  "suffixWidth": "40px",
                  "suffixAlign": "left",
                  "placeholder": "",
                  "width": "200px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "date",
                "value": "",
                "key": "1600073159000_86113",
                "score": 0,
                "config": {
                  "prefix": "时间：",
                  "prefixWidth": "60px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "placeholder": "",
                  "width": "190px",
                  "disabled": false,
                  "readonly": false,
                  "type": "datetime"
                }
              }
            ]
          }]
        },
        {
          "type": "grid",
          "key": "1600073159000_81680",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "checkbox",
                "key": "1600073159000_73337",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "静脉通路：",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "无",
                    "id": "1600073159000_73337-1",
                    "score": 0
                  },
                  {
                    "label": "有",
                    "id": "1600073159000_73337-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "checkbox",
                "key": "1600073159000_99619",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "1、头皮针输液：",
                  "prefixWidth": "110px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "通畅",
                    "id": "1600073159000_99619-1",
                    "score": 0
                  },
                  {
                    "label": "已拔除",
                    "id": "1600073159000_99619-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "checkbox",
                "key": "1600073159000_99920",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "2、静脉留置：",
                  "prefixWidth": "110px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "通畅",
                    "id": "1600073159000_99920-1",
                    "score": 0
                  },
                  {
                    "label": "封管",
                    "id": "1600073159000_99920-2",
                    "score": 0
                  }
                ]
              }
            ]
          }]
        },
        {
          "type": "checkbox",
          "key": "1600073159000_67036",
          "value": [

          ],
          "score": 0,
          "config": {
            "prefix": "管道护理：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold",
            "marginRight": "15px"
          },
          "options": [{
              "label": "无",
              "id": "1600073159000_67036-1",
              "score": 0
            },
            {
              "label": "有",
              "id": "1600073159000_67036-2",
              "score": 0
            }
          ]
        },
        {
          "type": "grid",
          "key": "1600839522000_63467",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "input",
                "value": "",
                "key": "1600839535000_28800",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "1：",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "通畅：",
                  "suffixWidth": "60px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "checkbox",
                "key": "1600839542000_27395",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "是",
                    "id": "1600839542000_27395-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600839542000_27395-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839557000_12441",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "颜色性质",
                  "prefixWidth": "70px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "",
                  "suffixWidth": "100px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839566000_79130",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "本班引流量",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "ml",
                  "suffixWidth": "50px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "50px",
                  "disabled": false,
                  "readonly": false
                }
              }
            ]
          }]
        },
        {
          "type": "grid",
          "key": "1600839572000_88700",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "input",
                "value": "",
                "key": "1600839582000_7487",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "2：",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "通畅：",
                  "suffixWidth": "60px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "checkbox",
                "key": "1600839597000_57278",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "是",
                    "id": "1600839597000_57278-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600839597000_57278-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839617000_24767",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "颜色性质",
                  "prefixWidth": "70px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "",
                  "suffixWidth": "100px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839624000_89835",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "本班引流量",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "ml",
                  "suffixWidth": "50px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "50px",
                  "disabled": false,
                  "readonly": false
                }
              }
            ]
          }]
        },
        {
          "type": "grid",
          "key": "1600839631000_42044",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "input",
                "value": "",
                "key": "1600839638000_10634",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "3：",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "通畅：",
                  "suffixWidth": "60px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "checkbox",
                "key": "1600839651000_31341",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "是",
                    "id": "1600839651000_31341-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600839651000_31341-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839661000_43832",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "颜色性质",
                  "prefixWidth": "70px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "",
                  "suffixWidth": "100px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839671000_96726",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "本班引流量",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "ml",
                  "suffixWidth": "50px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "50px",
                  "disabled": false,
                  "readonly": false
                }
              }
            ]
          }]
        },
        {
          "type": "grid",
          "key": "1600839682000_76829",
          "value": "",
          "config": {
            "borderWidth": "0",
            "borderColor": "#ddd",
            "borderStyle": "solid"
          },
          "columns": [{
            "width": "",
            "flex": 1,
            "align": "center",
            "justify": "space-start",
            "direction": "row",
            "gapTB": "0",
            "gapLR": "0",
            "childWidth": "auto",
            "padding": "0",
            "children": [{
                "type": "input",
                "value": "",
                "key": "1600839692000_44605",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "4：",
                  "prefixWidth": "20px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "通畅：",
                  "suffixWidth": "60px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "checkbox",
                "key": "1600839700000_26658",
                "value": [

                ],
                "score": 0,
                "config": {
                  "prefix": "",
                  "prefixWidth": "80px",
                  "prefixAlign": "left",
                  "prefixWeight": "bold",
                  "marginRight": "15px"
                },
                "options": [{
                    "label": "是",
                    "id": "1600839700000_26658-1",
                    "score": 0
                  },
                  {
                    "label": "否",
                    "id": "1600839700000_26658-2",
                    "score": 0
                  }
                ]
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839719000_84192",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "颜色性质",
                  "prefixWidth": "70px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "",
                  "suffixWidth": "100px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "100px",
                  "disabled": false,
                  "readonly": false
                }
              },
              {
                "type": "input",
                "value": "",
                "key": "1600839709000_69282",
                "score": 0,
                "config": {
                  "inputType": "text",
                  "borderLine": true,
                  "prefix": "本班引流量",
                  "prefixWidth": "80px",
                  "prefixAlign": "right",
                  "prefixWeight": "bold",
                  "suffix": "ml",
                  "suffixWidth": "50px",
                  "suffixAlign": "left",
                  "suffixWeight": "bold",
                  "width": "50px",
                  "disabled": false,
                  "readonly": false
                }
              }
            ]
          }]
        },
        {
          "type": "input",
          "value": "",
          "key": "1600073159000_83053",
          "score": 0,
          "config": {
            "inputType": "textarea",
            "borderLine": true,
            "prefix": "其他：",
            "prefixWidth": "80px",
            "prefixAlign": "left",
            "prefixWeight": "bold",
            "suffix": "",
            "suffixWidth": "40px",
            "suffixAlign": "left",
            "width": "600px",
            "disabled": false,
            "readonly": false
          }
        },
        {
          type: "grid",
          key: "1600138061000_71919",
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
                key: '1600138069000_51799',
                config: {
                  label: "签名",
                  btnType: 'signature',
                  signKey: '1600138081000_32572',
                  signTimeKey: '1600138090000_88668',
                  size: 'mini',
                  width: '80px',
                  printHidden: true
                }
              }, {
                type: "input",
                value: "",
                key: "1600138081000_32572",
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
                key: "1600138090000_88668",
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
  }
]
