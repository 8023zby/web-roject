export default {
  data () {
    return {}
  },
  methods: {
    initTable () {
      /**
     问题类型
     0 单选  1 多选
     2 填空
     3 单选评分  4 多选评分
     5 段落说明
     */

      const T = {
        '1': [{
          name: '操作',
          field: 'opearte'
        },
        {
          name: '选项',
          field: 'options'
        },
        {
          name: '选项内容',
          field: 'optionTitle'
        },
        {
          name: '被选次数',
          field: 'selectedTimes'
        },
        {
          name: '占比(被选次数/总次数)',
          field: 'percentages'
        }
        ],
        '2': [{
          name: '护理单元',
          field: 'nurseUnitName'
        }, {
          name: '序号',
          field: 'index'
        }, {
          name: '填空内容',
          field: 'answer'
        },
        {
          name: '答卷人',
          field: 'patientName'
        }

        ]
      }
      return T
    }
  }
}
