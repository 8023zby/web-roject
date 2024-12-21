
import {
  selectDeptInfo,
  selectDeptInfoData,
  formatter,
  getDeptInfo
} from '@/assets/wnms/utils/common'

// 验证规则
var validateRules = (rule, value, callback) => {
  if (value.trim() == '') {
    callback(new Error('不能全是空格'));
  } else {
    callback();
  }
}
export default {
  data () {
    return {

    }
  },
  methods: {
    // 获取护理单元ID
    selectDeptInfo () {
      return selectDeptInfo()
    },

    initForm () {
      return {
        deptId: this.selectDeptInfo(),
        groupCode: 'LeaveMessage',
        groupName: 'LeaveMessage',
        name: '',
        remark: '',
      }
    },
    initRules () {
      return {
        name: [
          { required: true, message: '请输入留言类型', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
          { validator: validateRules, trigger: 'blur' }
        ]
      }
    }
  }
}
