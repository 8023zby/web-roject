// 手术患者交接单
export const DATA = [{
    type: "grid",
    key: "1599528233000_33040",
    value: "",
    config: {
      borderWidth: "1px", //表格宽度和颜色
      borderColor: "#ddd",
      borderStyle: "solid",
    },
    columns: [{
      width: "",
      flex: 1,
      align: "center", //表格每一项align-items
      justify: "space-between", //表格每一项justify
      direction: "row", //表格方向
      gapTB: "0", //表格间距
      gapLR: "0",
      childWidth: "auto", //子表格宽度
      padding: "", //表格padding
      children: [{
          type: "grid",
          key: "1599528247000_19622",
          value: "",
          config: {
            borderWidth: "0", //表格宽度和颜色
            borderColor: "#ddd",
            borderStyle: "solid",
          },
          columns: [{
            width: "",
            flex: 1,
            align: "center", //表格每一项align-items
            justify: "flex-start", //表格每一项justify
            direction: "row", //表格方向
            gapTB: "5px", //表格间距
            gapLR: "3px",
            childWidth: "auto", //子表格宽度
            padding: "5px 10px 5px 10px", //表格padding
            children: [{
                type: "date", //类型
                value: "", //值
                key: "1599528264000_68349", //key
                score: 0, //分支
                config: {
                  prefix: "手术日期", //input框前字段
                  prefixWidth: "70px", //input匡倩字段宽度
                  prefixAlign: "right", //input框前字段align
                  placeholder: "", //input框placeholder
                  width: "150px", //input框宽度
                  disabled: false, //input是否禁止输入
                  readonly: false, //input框是否只读
                  type: "date",
                },
              },
              {
                type: "input", //类型
                value: "", //值
                key: "1599528281000_79822", //key
                score: 0, //分支
                config: {
                  borderLine: true,
                  borderLine: true,
                  prefix: "术前诊断", //input框前字段
                  prefixWidth: "80px", //input匡倩字段宽度
                  prefixAlign: "right", //input框前字段align
                  placeholder: "", //input框placeholder
                  width: "195px", //input框宽度
                  disabled: false, //input是否禁止输入
                  readonly: false, //input框是否只读
                },
              },
              {
                type: "input", //类型
                value: "", //值
                key: "1599528292000_32752", //key
                score: 0, //分支
                config: {
                  borderLine: true,
                  prefix: "拟手术名称", //input框前字段
                  prefixWidth: "80px", //input匡倩字段宽度
                  prefixAlign: "right", //input框前字段align
                  placeholder: "", //input框placeholder
                  width: "255px", //input框宽度
                  disabled: false, //input是否禁止输入
                  readonly: false, //input框是否只读
                },
              },
            ],
          }, ],
        },
        {
          type: "grid",
          key: "1",
          value: "",
          config: {
            borderWidth: "0", //表格宽度和颜色
            borderColor: "#ddd",
            borderStyle: "solid",
          },
          columns: [{
            width: "",
            flex: 1,
            align: "center", //表格每一项align-items
            justify: "flex-start", //表格每一项justify
            direction: "row", //表格方向
            gapTB: "5px", //表格间距
            gapLR: "3px",
            childWidth: "auto", //子表格宽度
            padding: "5px 10px 5px 10px", //表格padding
            children: [{
              type: "checkbox",
              key: "1599529542000_52168",
              value: [],
              score: 0,
              config: {
                prefix: "麻醉方式",
                prefixWidth: "70px",
                prefixAlign: "right",
              },
              options: [{
                  label: "全麻",
                  id: "1599529542000_52168-1",
                  score: 0,
                },
                {
                  label: "硬脊联",
                  id: "1599529542000_52168-2",
                  score: 0,
                },
                {
                  label: "硬膜外",
                  id: "1599529542000_52168-3",
                  score: 0,
                },
                {
                  label: "颈丛",
                  id: "1599529542000_52168-4",
                  score: 0,
                },
                {
                  label: "臀丛",
                  id: "1599529542000_52168-5",
                  score: 0,
                },
                {
                  label: "局部麻醉",
                  id: "1599529542000_52168-6",
                  score: 0,
                },
                {
                  label: "其他",
                  id: "1599529542000_52168-7",
                  score: 0,
                  children: [{
                    type: "input", //类型
                    value: "", //值
                    key: "1599529956000_43733", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      prefix: "", //input框前字段
                      prefixWidth: "75px", //input匡倩字段宽度
                      prefixAlign: "right", //input框前字段align
                      placeholder: "", //input框placeholder
                      width: "181px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  }, ],
                },
              ],
            }, ],
          }, ],
        },
      ],
    }, ],
  },
  {
    type: "grid",
    key: "1599530450000_36822",
    value: "",
    config: {
      borderWidth: "1px", //表格宽度和颜色
      borderColor: "#ddd",
      borderStyle: "solid",
    },
    columns: [{
        width: "20px",
        flex: "",
        align: "center", //表格每一项align-items
        justify: "space-between", //表格每一项justify
        direction: "row", //表格方向
        gapTB: "0", //表格间距
        gapLR: "0",
        childWidth: "auto", //子表格宽度
        padding: "10px", //表格padding
        children: [{
          type: "text",
          value: "",
          key: "1599530565000_52895",
          config: {
            label: "术前交接情况记录",
            align: "center",
            weight: "",
          },
        }, ],
      },
      {
        width: "",
        flex: 1,
        align: "flex-start", //表格每一项align-items
        justify: "flex-start", //表格每一项justify
        direction: "column", //表格方向
        gapTB: "5px", //表格间距
        gapLR: "0",
        childWidth: "auto", //子表格宽度
        padding: "10px", //表格padding
        children: [{
            type: "checkbox",
            key: "1599531115000_13123",
            value: [],
            score: 0,
            config: {
              prefix: "意识状态",
              prefixWidth: "70px",
              prefixAlign: "left",
            },
            options: [{
                label: "清醒",
                id: "1599531115000_13123-1",
                score: 0,
              },
              {
                label: "意识障碍",
                id: "1599531115000_13123-2",
                score: 0,
              },
              {
                label: "其他",
                id: "1599531115000_13123-3",
                score: 0,
                children: [{
                  type: "input", //类型
                  value: "", //值
                  key: "1599531219000_617", //key
                  score: 0, //分支
                  config: {
                    borderLine: true,
                    prefix: "", //input框前字段
                    prefixWidth: "75px", //input匡倩字段宽度
                    prefixAlign: "right", //input框前字段align
                    placeholder: "", //input框placeholder
                    width: "", //input框宽度
                    disabled: false, //input是否禁止输入
                    readonly: false, //input框是否只读
                  },
                }, ],
              },
            ],
          },
          {
            type: "grid",
            key: "1599531374000_72857",
            value: "",
            config: {
              borderWidth: "0", //表格宽度和颜色
              borderColor: "#ddd",
              borderStyle: "solid",
            },
            columns: [{
                width: "70px",
                flex: "",
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "0",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                  type: "text",
                  value: "",
                  key: "1599531682000_30708",
                  config: {
                    label: "生命体征",
                    align: "left",
                    weight: "",
                  },
                }, ],
              },
              {
                width: "",
                flex: 1,
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "5px",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                    type: "input", //类型
                    value: "", //值
                    key: "1599532529000_31824", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      prefix: "体温", //input框前字段
                      prefixWidth: "40px", //input匡倩字段宽度
                      prefixAlign: "right", //input框前字段align
                      suffix: "℃", //input框后字段
                      suffixWidth: "40px", //input框后字段宽度
                      suffixAlign: "left", //input框align
                      placeholder: "", //input框placeholder
                      width: "70px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  },
                  {
                    type: "input", //类型
                    value: "", //值
                    key: "1599532549000_26157", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      prefix: "脉搏", //input框前字段
                      prefixWidth: "40px", //input匡倩字段宽度
                      prefixAlign: "right", //input框前字段align
                      suffix: "次/分", //input框后字段
                      suffixWidth: "40px", //input框后字段宽度
                      suffixAlign: "left", //input框align
                      placeholder: "", //input框placeholder
                      width: "70px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  },
                  {
                    type: "input", //类型
                    value: "", //值
                    key: "1599532693000_24451", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      prefix: "呼吸", //input框前字段
                      prefixWidth: "40px", //input匡倩字段宽度
                      prefixAlign: "right", //input框前字段align
                      suffix: "次/分", //input框后字段
                      suffixWidth: "40px", //input框后字段宽度
                      suffixAlign: "left", //input框align
                      placeholder: "", //input框placeholder
                      width: "70px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  },
                  {
                    type: "input", //类型
                    value: "", //值
                    key: "1599532745000_44357", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      prefix: "血压", //input框前字段
                      prefixWidth: "40px", //input匡倩字段宽度
                      prefixAlign: "right", //input框前字段align
                      suffix: "mmHg", //input框后字段
                      suffixWidth: "40px", //input框后字段宽度
                      suffixAlign: "left", //input框align
                      placeholder: "", //input框placeholder
                      width: "70px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  },
                ],
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599533195000_38340",
            value: [],
            score: 0,
            config: {
              prefix: "术前禁饮食",
              prefixWidth: "80px",
              prefixAlign: "left",
            },
            options: [{
                label: "已禁食",
                id: "1599533195000_38340-1",
                score: 0,
              },
              {
                label: "无需禁食",
                id: "1599533195000_38340-2",
                score: 0,
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599533672000_22230",
            value: [],
            score: 0,
            config: {
              prefix: "术前留置",
              prefixWidth: "70px",
              prefixAlign: "left",
              marginRight: "15px",
            },
            options: [{
                label: "无",
                id: "1599533672000_22230-1",
                score: 0,
              },
              {
                label: "有：",
                id: "1599533672000_22230-2",
                score: 0,
              },
              {
                label: "外周静脉",
                id: "1599533672000_22230-3",
                score: 0,
              },
              {
                label: "中心静脉",
                id: "1599533672000_22230-4",
                score: 0,
              },
              {
                label: "胃管",
                id: "1599533672000_22230-5",
                score: 0,
              },
              {
                label: "尿道",
                id: "1599533672000_22230-6",
                score: 0,
              },
              {
                label: "造瘘",
                id: "1599533672000_22230-7",
                score: 0,
              },
              {
                label: "其他",
                id: "1599533672000_22230-8",
                score: 0,
                children: [{
                  type: "input", //类型
                  value: "", //值
                  key: "1599533704000_15791", //key
                  score: 0, //分支
                  config: {
                    borderLine: true,
                    prefix: "", //input框前字段
                    prefixWidth: "75px", //input匡倩字段宽度
                    prefixAlign: "right", //input框前字段align
                    placeholder: "", //input框placeholder
                    width: "150px", //input框宽度
                    disabled: false, //input是否禁止输入
                    readonly: false, //input框是否只读
                  },
                }, ],
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599535032000_57132",
            value: [],
            score: 0,
            config: {
              prefix: "皮肤情况",
              prefixWidth: "70px",
              prefixAlign: "left",
            },
            options: [{
                label: "正常",
                id: "1599535032000_57132-1",
                score: 0,
              },
              {
                label: "异常",
                id: "1599535032000_57132-2",
                score: 0,
                children: [{
                  type: "input", //类型
                  value: "", //值
                  key: "1599535046000_10337", //key
                  score: 0, //分支
                  config: {
                    borderLine: true,
                    prefix: "", //input框前字段
                    prefixWidth: "75px", //input匡倩字段宽度
                    prefixAlign: "right", //input框前字段align
                    placeholder: "", //input框placeholder
                    width: "", //input框宽度
                    disabled: false, //input是否禁止输入
                    readonly: false, //input框是否只读
                  },
                }, ],
              },
            ],
          },
          {
            type: "grid",
            key: "1599535513000_54353",
            value: "",
            config: {
              borderWidth: "0", //表格宽度和颜色
              borderColor: "#ddd",
              borderStyle: "solid",
            },
            columns: [{
                width: "",
                flex: 1,
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "0",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                  type: "checkbox",
                  key: "1599535401000_40263",
                  value: [],
                  score: 0,
                  config: {
                    prefix: "首饰、发卡",
                    prefixWidth: "80px",
                    prefixAlign: "left",
                  },
                  options: [{
                      label: "已摘除",
                      id: "1599535401000_40263-1",
                      score: 0,
                    },
                    {
                      label: "无法摘除",
                      id: "1599535401000_40263-2",
                      score: 0,
                    },
                  ],
                }, ],
              },
              {
                width: "500px",
                flex: "",
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "5px",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                  type: "checkbox",
                  key: "1599535470000_83280",
                  value: [],
                  score: 0,
                  config: {
                    prefix: "义齿",
                    prefixWidth: "70px",
                    prefixAlign: "right",
                  },
                  options: [{
                      label: "已摘除",
                      id: "1599535470000_83280-1",
                      score: 0,
                    },
                    {
                      label: "固定",
                      id: "1599535470000_83280-2",
                      score: 0,
                    },
                    {
                      label: "无",
                      id: "1599535470000_83280-3",
                      score: 0,
                    },
                  ],
                }, ],
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599540537000_20634",
            value: [],
            score: 0,
            config: {
              prefix: "手术部位标识",
              prefixWidth: "90px",
              prefixAlign: "left",
            },
            options: [{
                label: "有",
                id: "1599540537000_20634-1",
                score: 0,
              },
              {
                label: "无",
                id: "1599540537000_20634-2",
                score: 0,
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599540713000_12938",
            value: [],
            score: 0,
            config: {
              prefix: "术前用药",
              prefixWidth: "70px",
              prefixAlign: "left",
            },
            options: [{
                label: "已执行",
                id: "1599540713000_12938-1",
                score: 0,
              },
              {
                label: "无",
                id: "1599540713000_12938-2",
                score: 0,
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599540976000_23396",
            value: [],
            score: 0,
            config: {
              prefix: "携带物品",
              prefixWidth: "70px",
              prefixAlign: "left",
            },
            options: [{
                label: "病例",
                id: "1599540976000_23396-1",
                score: 0,
              },
              {
                label: "影像资料",
                id: "1599540976000_23396-2",
                score: 0,
              },
              {
                label: "血液制品：",
                id: "1599540976000_23396-3",
                score: 0,
                children: [{
                  type: "input", //类型
                  value: "", //值
                  key: "1599540993000_11771", //key
                  score: 0, //分支
                  config: {
                    borderLine: true,
                    width: "", //input框宽度
                    disabled: false, //input是否禁止输入
                    readonly: false, //input框是否只读
                  },
                }, ],
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599541397000_12076",
            value: [],
            score: 0,
            config: {
              prefix: "术中带药",
              prefixWidth: "70px",
              prefixAlign: "left",
            },
            options: [{
                label: "无",
                id: "1599541397000_12076-1",
                score: 0,
              },
              {
                label: "有",
                id: "1599541397000_12076-2",
                score: 0,
                children: [{
                  type: "input", //类型
                  value: "", //值
                  key: "1599541448000_32611", //key
                  score: 0, //分支
                  config: {
                    borderLine: true,
                    prefix: "药品名称",
                    prefixWidth: "80px",
                    prefixAlign: "right",
                    inputType: "textarea",
                    width: "500px", //input框宽度
                    disabled: false, //input是否禁止输入
                    readonly: false, //input框是否只读
                  },
                }, ],
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599542042000_71651",
            value: [],
            score: 0,
            config: {
              prefix: "带物品",
              prefixWidth: "70px",
              prefixAlign: "left",
            },
            options: [{
                label: "无",
                id: "1599542042000_71651-1",
                score: 0,
              },
              {
                label: "有",
                id: "1599542042000_71651-2",
                score: 0,
                children: [{
                  type: "input", //类型
                  value: "", //值
                  key: "1599542055000_5753", //key
                  score: 0, //分支
                  config: {
                    borderLine: true,
                    prefix: "物品名称",
                    prefixWidth: "80px",
                    prefixAlign: "right",
                    width: "200px", //input框宽度
                    disabled: false, //input是否禁止输入
                    readonly: false, //input框是否只读
                  },
                }, ],
              },
            ],
          },
          {
            type: "grid",
            key: "1599542481000_70792",
            value: "",
            config: {
              borderWidth: "0", //表格宽度和颜色
              borderColor: "#ddd",
              borderStyle: "solid",
            },
            columns: [{
                width: "250px",
                flex: 1,
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "0",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                  type: "text",
                  value: "",
                  key: "1599542494000_12687",
                  config: {
                    label: "病区护士签名：",
                    align: "center",
                    weight: "",
                  },
                }, ],
              },
              {
                width: "250px",
                flex: 1,
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "5px",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                  type: "text",
                  value: "",
                  key: "1599542509000_36798",
                  config: {
                    label: "离开病房时间：",
                    align: "center",
                    weight: "",
                  },
                }, ],
              },
              {
                width: "250px",
                flex: 1,
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "5px",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                  type: "text",
                  value: "",
                  key: "1599542527000_78449",
                  config: {
                    label: "手术室接病者签名：",
                    align: "center",
                    weight: "",
                  },
                }, ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "grid",
    key: "1599544014000_43344",
    value: "",
    config: {
      borderWidth: "1px", //表格宽度和颜色
      borderColor: "#ddd",
      borderStyle: "solid",
    },
    columns: [{
        width: "20px",
        flex: "",
        align: "center", //表格每一项align-items
        justify: "space-between", //表格每一项justify
        direction: "row", //表格方向
        gapTB: "0", //表格间距
        gapLR: "0",
        childWidth: "auto", //子表格宽度
        padding: "10px", //表格padding
        children: [{
          type: "text",
          value: "",
          key: "1599544080000_30723",
          config: {
            label: "复苏室交接记录",
            align: "center",
            weight: "",
          },
        }, ],
      },
      {
        width: "",
        flex: 1,
        align: "flex-start", //表格每一项align-items
        justify: "flex-start", //表格每一项justify
        direction: "column", //表格方向
        gapTB: "5px", //表格间距
        gapLR: "0",
        childWidth: "auto", //子表格宽度
        padding: "10px", //表格padding
        children: [{
            type: "grid",
            key: "1599544168000_75632",
            value: "",
            config: {
              borderWidth: "0", //表格宽度和颜色
              borderColor: "#ddd",
              borderStyle: "solid",
            },
            columns: [{
                width: "70px",
                flex: "",
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "0",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                  type: "text",
                  value: "",
                  key: "1599544202000_59158",
                  config: {
                    label: "生命体征",
                    align: "left",
                    weight: "",
                  },
                }, ],
              },
              {
                width: "",
                flex: 1,
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "5px",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                    type: "input", //类型
                    value: "", //值
                    key: "1599544236000_84979", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      prefix: "脉搏", //input框前字段
                      prefixWidth: "40px", //input匡倩字段宽度
                      prefixAlign: "right", //input框前字段align
                      suffix: "次/分", //input框后字段
                      suffixWidth: "40px", //input框后字段宽度
                      suffixAlign: "left", //input框align
                      placeholder: "", //input框placeholder
                      width: "70px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  },
                  {
                    type: "input", //类型
                    value: "", //值
                    key: "1599544248000_43188", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      prefix: "呼吸", //input框前字段
                      prefixWidth: "40px", //input匡倩字段宽度
                      prefixAlign: "right", //input框前字段align
                      suffix: "次/分", //input框后字段
                      suffixWidth: "40px", //input框后字段宽度
                      suffixAlign: "left", //input框align
                      placeholder: "", //input框placeholder
                      width: "70px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  },
                  {
                    type: "input", //类型
                    value: "", //值
                    key: "1599544225000_64791", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      prefix: "氧饱和度", //input框前字段
                      prefixWidth: "70px", //input匡倩字段宽度
                      prefixAlign: "right", //input框前字段align
                      suffix: "%", //input框后字段
                      suffixWidth: "40px", //input框后字段宽度
                      suffixAlign: "left", //input框align
                      placeholder: "", //input框placeholder
                      width: "70px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  },
                ],
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599544588000_40140",
            value: [],
            score: 0,
            config: {
              prefix: "意识状态",
              prefixWidth: "70px",
              prefixAlign: "left",
            },
            options: [{
                label: "清醒",
                id: "1599544588000_40140-1",
                score: 0,
              },
              {
                label: "半清醒",
                id: "1599544588000_40140-2",
                score: 0,
              },
              {
                label: "未清醒",
                id: "1599544588000_40140-3",
                score: 0,
              },
              {
                label: "其他",
                id: "1599544588000_40140-4",
                score: 0,
                children: [{
                  type: "input", //类型
                  value: "", //值
                  key: "1599544607000_81418", //key
                  score: 0, //分支
                  config: {
                    borderLine: true,
                    prefix: "", //input框前字段
                    prefixWidth: "75px", //input匡倩字段宽度
                    prefixAlign: "right", //input框前字段align
                    placeholder: "", //input框placeholder
                    width: "200px", //input框宽度
                    disabled: false, //input是否禁止输入
                    readonly: false, //input框是否只读
                  },
                }, ],
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599544818000_32867",
            value: [],
            score: 0,
            config: {
              prefix: "携带物品",
              prefixWidth: "70px",
              prefixAlign: "left",
            },
            options: [{
                label: "病例",
                id: "1599544818000_32867-1",
                score: 0,
              },
              {
                label: "影像资料",
                id: "1599544818000_32867-2",
                score: 0,
              },
              {
                label: "血液制品：",
                id: "1599544818000_32867-3",
                score: 0,
                children: [{
                  type: "input", //类型
                  value: "", //值
                  key: "1599544831000_49719", //key
                  score: 0, //分支
                  config: {
                    borderLine: true,
                    width: "", //input框宽度
                    disabled: false, //input是否禁止输入
                    readonly: false, //input框是否只读
                  },
                }, ],
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599545399000_66264",
            value: [],
            score: 0,
            config: {
              prefix: "术后管路",
              prefixWidth: "70px",
              prefixAlign: "left",
              marginRight: "20px",
            },
            options: [{
                label: "无",
                id: "1599545399000_66264-1",
                score: 0,
              },
              {
                label: "有：",
                id: "1599545399000_66264-2",
                score: 0,
              },
              {
                label: "气管插管",
                id: "1599545399000_66264-3",
                score: 0,
              },
              {
                label: "胃管",
                id: "1599545399000_66264-4",
                score: 0,
              },
              {
                label: "尿管",
                id: "1599545399000_66264-5",
                score: 0,
              },
              {
                label: "引流管",
                id: "1599545399000_66264-6",
                score: 0,
                children: [{
                    type: "input", //类型
                    value: "", //值
                    key: "1599545414000_38935", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      width: "50px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                      suffix: "根", //input框后字段
                      suffixWidth: "40px", //input框后字段宽度
                      suffixAlign: "left", //input框align
                    },
                  },
                  {
                    type: "input", //类型
                    value: "", //值
                    key: "1599545425000_65164", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      prefix: "其他", //input框前字段
                      prefixWidth: "40px", //input匡倩字段宽度
                      prefixAlign: "right", //input框前字段align
                      width: "100px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  },
                ],
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599545617000_54406",
            value: [],
            score: 0,
            config: {
              prefix: "皮肤情况",
              prefixWidth: "70px",
              prefixAlign: "left",
            },
            options: [{
                label: "正常",
                id: "1599545617000_54406-1",
                score: 0,
              },
              {
                label: "异常",
                id: "1599545617000_54406-2",
                score: 0,
                children: [{
                  type: "input", //类型
                  value: "", //值
                  key: "1599545642000_680", //key
                  score: 0, //分支
                  config: {
                    borderLine: true,
                    prefix: "", //input框前字段
                    prefixWidth: "75px", //input匡倩字段宽度
                    prefixAlign: "right", //input框前字段align
                    placeholder: "", //input框placeholder
                    width: "", //input框宽度
                    disabled: false, //input是否禁止输入
                    readonly: false, //input框是否只读
                  },
                }, ],
              },
            ],
          },
          {
            type: "input", //类型
            value: "", //值
            key: "1599545642000_680", //key
            score: 0, //分支
            config: {
              inputType: "textarea",
              borderLine: true,
              prefix: "备注", //input框前字段
              prefixWidth: "70px", //input匡倩字段宽度
              prefixAlign: "left", //input框前字段align
              placeholder: "", //input框placeholder
              width: "500px", //input框宽度
              disabled: false, //input是否禁止输入
              readonly: false, //input框是否只读
            },
          },
          {
            type: "grid",
            key: "1599545893000_80658",
            value: "",
            config: {
              borderWidth: "0", //表格宽度和颜色
              borderColor: "#ddd",
              borderStyle: "solid",
            },
            columns: [{
                width: "400px",
                flex: 1,
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "0",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                  type: "text",
                  value: "",
                  key: "1599545907000_10961",
                  config: {
                    label: "病区护士签名：",
                    align: "center",
                    weight: "",
                  },
                }, ],
              },
              {
                width: "400px",
                flex: 1,
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "5px",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                  type: "text",
                  value: "",
                  key: "1599545920000_3520",
                  config: {
                    label: "离开病房时间：",
                    align: "center",
                    weight: "",
                  },
                }, ],
              },
            ],
          },
          {
            type: "text",
            value: "",
            key: "1599545907000_10961",
            config: {
              label: "备注：患者未入复苏室（PACU）无需填写",
              align: "center",
              weight: "bold",
            },
          },
        ],
      },
    ],
  },
  {
    type: "grid",
    key: "1599546178000_58545",
    value: "",
    config: {
      borderWidth: "1px", //表格宽度和颜色
      borderColor: "#ddd",
      borderStyle: "solid",
    },
    columns: [{
        width: "20px",
        flex: "",
        align: "flex-start", //表格每一项align-items
        justify: "center", //表格每一项justify
        direction: "column", //表格方向
        gapTB: "0", //表格间距
        gapLR: "0",
        childWidth: "auto", //子表格宽度
        padding: "10px", //表格padding
        children: [{
          type: "text",
          value: "",
          key: "1599546287000_72773",
          config: {
            label: "术后返回病房交接记录",
            align: "center",
            weight: "",
          },
        }, ],
      },
      {
        width: "",
        flex: 1,
        align: "flex-start", //表格每一项align-items
        justify: "flex-start", //表格每一项justify
        direction: "column", //表格方向
        gapTB: "5px", //表格间距
        gapLR: "0",
        childWidth: "auto", //子表格宽度
        padding: "10px", //表格padding
        children: [{
            type: "grid",
            key: "1599546445000_96122",
            value: "",
            config: {
              borderWidth: "0", //表格宽度和颜色
              borderColor: "#ddd",
              borderStyle: "solid",
            },
            columns: [{
                width: "70px",
                flex: "",
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "0",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                  type: "text",
                  value: "",
                  key: "1599546461000_26533",
                  config: {
                    label: "生命体征",
                    align: "left",
                    weight: "",
                  },
                }, ],
              },
              {
                width: "",
                flex: 1,
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "5px",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                    type: "input", //类型
                    value: "", //值
                    key: "1599546473000_70708", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      prefix: "脉搏", //input框前字段
                      prefixWidth: "40px", //input匡倩字段宽度
                      prefixAlign: "right", //input框前字段align
                      suffix: "次/分", //input框后字段
                      suffixWidth: "40px", //input框后字段宽度
                      suffixAlign: "left", //input框align
                      placeholder: "", //input框placeholder
                      width: "70px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  },
                  {
                    type: "input", //类型
                    value: "", //值
                    key: "1599546483000_48656", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      prefix: "呼吸", //input框前字段
                      prefixWidth: "40px", //input匡倩字段宽度
                      prefixAlign: "right", //input框前字段align
                      suffix: "次/分", //input框后字段
                      suffixWidth: "40px", //input框后字段宽度
                      suffixAlign: "left", //input框align
                      placeholder: "", //input框placeholder
                      width: "70px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  },
                  {
                    type: "input", //类型
                    value: "", //值
                    key: "1599546493000_54687", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      prefix: "氧饱和度", //input框前字段
                      prefixWidth: "70px", //input匡倩字段宽度
                      prefixAlign: "right", //input框前字段align
                      suffix: "%", //input框后字段
                      suffixWidth: "40px", //input框后字段宽度
                      suffixAlign: "left", //input框align
                      placeholder: "", //input框placeholder
                      width: "70px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  },
                ],
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599546621000_85776",
            value: [],
            score: 0,
            config: {
              prefix: "意识状态",
              prefixWidth: "70px",
              prefixAlign: "left",
            },
            options: [{
                label: "清醒",
                id: "1599546621000_85776-1",
                score: 0,
              },
              {
                label: "半清醒",
                id: "1599546621000_85776-2",
                score: 0,
              },
              {
                label: "未清醒",
                id: "1599546621000_85776-3",
                score: 0,
              },
              {
                label: "其他",
                id: "1599546621000_85776-4",
                score: 0,
                children: [{
                  type: "input", //类型
                  value: "", //值
                  key: "1599546635000_23376", //key
                  score: 0, //分支
                  config: {
                    borderLine: true,
                    prefix: "", //input框前字段
                    prefixWidth: "75px", //input匡倩字段宽度
                    prefixAlign: "right", //input框前字段align
                    placeholder: "", //input框placeholder
                    width: "200px", //input框宽度
                    disabled: false, //input是否禁止输入
                    readonly: false, //input框是否只读
                  },
                }, ],
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599546802000_84084",
            value: [],
            score: 0,
            config: {
              prefix: "患者身份核对",
              prefixWidth: "90px",
              prefixAlign: "left",
            },
            options: [{
                label: "有",
                id: "1599546802000_84084-1",
                score: 0,
              },
              {
                label: "无",
                id: "1599546802000_84084-2",
                score: 0,
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599546914000_459",
            value: [],
            score: 0,
            config: {
              prefix: "镇痛泵",
              prefixWidth: "70px",
              prefixAlign: "left",
            },
            options: [{
                label: "有",
                id: "1599546914000_459-1",
                score: 0,
              },
              {
                label: "无",
                id: "1599546914000_459-2",
                score: 0,
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599546989000_35151",
            value: [],
            score: 0,
            config: {
              prefix: "静脉通路",
              prefixWidth: "70px",
              prefixAlign: "left",
              marginRight: '20px'
            },
            options: [{
                label: "无",
                id: "1599546989000_35151-1",
                score: 0,
              },
              {
                label: "有：",
                id: "1599546989000_35151-2",
                score: 0,
                children: [{
                  type: "checkbox",
                  key: "1599547075000_90140",
                  value: [],
                  score: 0,
                  config: {
                    prefix: "",
                    prefixWidth: "70px",
                    prefixAlign: "left",
                    marginRight: '20px'
                  },
                  options: [{
                      label: "外周静脉",
                      id: "1599547075000_90140-1",
                      score: 0,
                    },
                    {
                      label: "中心静脉",
                      id: "1599547075000_90140-2",
                      score: 0,
                    },
                    {
                      label: "其他",
                      id: "1599547075000_90140-3",
                      score: 0,
                      children: [{
                          type: "input", //类型
                          value: "", //值
                          key: "1599547239000_16002", //key
                          score: 0, //分支
                          config: {
                            borderLine: true,
                            width: "90px", //input框宽度
                            disabled: false, //input是否禁止输入
                            readonly: false, //input框是否只读
                          },
                        },
                        {
                          type: "input", //类型
                          value: "", //值
                          key: "1599547250000_9230", //key
                          score: 0, //分支
                          config: {
                            borderLine: true,
                            prefix: "输注药品（血制品）:", //input框前字段
                            prefixWidth: "125px", //input匡倩字段宽度
                            prefixAlign: "right", //input框前字段align
                            width: "100px", //input框宽度
                            disabled: false, //input是否禁止输入
                            readonly: false, //input框是否只读
                          },
                        },
                      ],
                    },
                  ],
                }, ],
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599547944000_93281",
            value: [],
            score: 0,
            config: {
              prefix: "术后管路",
              prefixWidth: "70px",
              prefixAlign: "left",
              marginRight: "20px",
            },
            options: [{
                label: "无",
                id: "1599547944000_93281-1",
                score: 0,
              },
              {
                label: "有：",
                id: "1599547944000_93281-2",
                score: 0,
              },
              {
                label: "气管插管",
                id: "1599547944000_93281-3",
                score: 0,
              },
              {
                label: "胃管",
                id: "1599547944000_93281-4",
                score: 0,
              },
              {
                label: "尿管",
                id: "1599547944000_93281-5",
                score: 0,
              },
              {
                label: "引流管",
                id: "1599547944000_93281-6",
                score: 0,
                children: [{
                    type: "input", //类型
                    value: "", //值
                    key: "1599547968000_34326", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      width: "50px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                      suffix: "根", //input框后字段
                      suffixWidth: "40px", //input框后字段宽度
                      suffixAlign: "left", //input框align
                    },
                  },
                  {
                    type: "input", //类型
                    value: "", //值
                    key: "1599547981000_2740", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      prefix: "其他", //input框前字段
                      prefixWidth: "40px", //input匡倩字段宽度
                      prefixAlign: "right", //input框前字段align
                      width: "100px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  },
                ],
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599548067000_65972",
            value: [],
            score: 0,
            config: {
              prefix: "携带物品",
              prefixWidth: "70px",
              prefixAlign: "left",
              marginRight: "20px",
            },
            options: [{
                label: "影像资料",
                id: "1599548067000_65972-1",
                score: 0,
              },
              {
                label: "病例",
                id: "1599548067000_65972-2",
                score: 0,
              },
              {
                label: "血液制品",
                id: "1599548067000_65972-3",
                score: 0,
              },
              {
                label: "血液制品名称：",
                id: "1599548067000_65972-4",
                score: 0,
                children: [{
                    type: "input", //类型
                    value: "", //值
                    key: "1599548453000_86465", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      width: "100px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  },
                  {
                    type: "input", //类型
                    value: "", //值
                    key: "1599548472000_33210", //key
                    score: 0, //分支
                    config: {
                      borderLine: true,
                      prefix: "其他", //input框前字段
                      prefixWidth: "40px", //input匡倩字段宽度
                      prefixAlign: "right", //input框前字段align
                      width: "100px", //input框宽度
                      disabled: false, //input是否禁止输入
                      readonly: false, //input框是否只读
                    },
                  },
                ]
              },
            ],
          },
          {
            type: "checkbox",
            key: "1599548428000_24563",
            value: [],
            score: 0,
            config: {
              prefix: "带回药品",
              prefixWidth: "70px",
              prefixAlign: "left",
              marginRight: "20px",
            },
            options: [{
                label: "无",
                id: "1599548428000_24563-1",
                score: 0,
              },
              {
                label: "有",
                id: "1599548428000_24563-2",
                score: 0,
                children: [{
                  type: "input", //类型
                  value: "", //值
                  key: "1599548554000_72930", //key
                  score: 0, //分支
                  config: {
                    borderLine: true,
                    inputType: 'textarea',
                    prefix: "药品名称", //input框前字段
                    prefixWidth: "70px", //input匡倩字段宽度
                    prefixAlign: "right", //input框前字段align
                    width: "300px", //input框宽度
                    disabled: false, //input是否禁止输入
                    readonly: false, //input框是否只读
                  },
                }, ]
              },
            ],
          },
          {
            type: "grid",
            key: "1599548809000_33700",
            value: "",
            config: {
              borderWidth: "0", //表格宽度和颜色
              borderColor: "#ddd",
              borderStyle: "solid",
            },
            columns: [{
                width: "250px",
                flex: 1,
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "0",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                  type: "text",
                  value: "",
                  key: "1599548820000_27909",
                  config: {
                    label: "返回病房时间：",
                    align: "center",
                    weight: "",
                  },
                }, ],
              },
              {
                width: "250px",
                flex: 1,
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "5px",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                  type: "text",
                  value: "",
                  key: "1599548837000_93013",
                  config: {
                    label: "手术室护士签名：",
                    align: "center",
                    weight: "",
                  },
                }, ],
              },
              {
                width: "250px",
                flex: 1,
                align: "center", //表格每一项align-items
                justify: "flex-start", //表格每一项justify
                direction: "row", //表格方向
                gapTB: "0", //表格间距
                gapLR: "5px",
                childWidth: "auto", //子表格宽度
                padding: "0", //表格padding
                children: [{
                  type: "text",
                  value: "",
                  key: "1599548847000_83398",
                  config: {
                    label: "病区护士签名：",
                    align: "center",
                    weight: "",
                  },
                }, ],
              },
            ],
          },
        ],
      },
    ],
  },
];