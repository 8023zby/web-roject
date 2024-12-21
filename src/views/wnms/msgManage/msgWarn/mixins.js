import {
  isChinaEnglish,
  isChines
} from '@/assets/wnms/utils/validate'

export default {
  data () {
    return {
      menusTree: [],
      users: [],
      groups: [],
      depts: []
    }
  },
  methods: {
    initForm () {
      return {
      }
    },
    initRules () {
      const tempContent = (rule, value, callback) => {
        if (isChines(value)) {
          callback(new Error('只能输入中文'))
        } else {
          callback()
        }
      }
      const tempName = (rule, value, callback) => {
        if (isChinaEnglish(value)) {
          callback(new Error('只能输入中英文以及数字'))
        } else {
          callback()
        }
      }
      const timeTypeTimes = (rule, value, callback) => {
        var re = /^\d+$|^\d*\.\d+$/g
        if (!re.test(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value > 1000) {
            callback(new Error('数字值不能大于1000'))
          } else {
            callback()
          }
        }
      }
      return {
        msgType: [{
          required: true,
          message: '消息类型不能为空',
          trigger: 'change'
        }],
        itemId: [{
          required: true,
          message: '数据库表名不能为空',
          trigger: 'change'
        }],
        eventType: [{
          required: true,
          message: '提醒规则不能为空',
          trigger: 'change'
        }],
        patientIdField: [{
          required: true,
          message: '患者ID字段不能为空',
          trigger: 'change'
        }],
        timeType: [{
          required: true,
          message: '触发时刻不能为空',
          trigger: 'change'
        }],
        recipient: [{
          required: true,
          message: '接收者不能为空',
          trigger: 'change'
        }],
        msgName: [{
          required: true,
          message: '消息名称不能为空',
          trigger: 'blur'
        }, {
          validator: tempName,
          trigger: 'blur'
        }, {
          min: 1,
          max: 10,
          message: '长度在 1 到 10 个字符'
        }],
        // 公式验证
        eventTyperules: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        requireds: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        timeTypeTimes: [{
          required: true,
          message: '次数不能为空',
          trigger: 'blur'
        }, {
          validator: timeTypeTimes,
          trigger: 'blur'
        }, {
          pattern: /^\d+\.?\d{0,0}$/,
          message: '只能输入整数',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '提醒内容不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 100,
          message: '长度在 1 到 100 个字符'
        }],
        keyword: [{
          required: true,
          message: '医嘱关键词不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 200,
          message: '长度在 1 到 200 个字符'
        }]
      }
    }
  }
}
