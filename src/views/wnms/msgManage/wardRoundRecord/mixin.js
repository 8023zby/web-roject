import getStorageUser from '@/assets/wnms/utils/storageUser'

import {
  selectDeptInfo,
} from '@/assets/wnms/utils/common'

export default {
  data() {
    return {
      // 护理单元列表
      nurseUnitList: {},
      // 房间列表
      roomList: [],
      // 护士列表
      nurseList: [],
      // 当前页码
      page: 1,
      // 每页数量
      size: 10,
      // 当前页码
      currPage: 1
    }
  },
  mounted() {
    // 获取护理单元
    this.nurseUnitList = getStorageUser('dataDeptInfoList')
  },
  computed: {
    // 登录用户的所有护理单元 ID 字符串
    nurseUnitIdString() {
      return getStorageUser('dataDeptInfoList').map(item => item.deptId)
    }
  },
  methods: {
    // 深拷贝方法
    deepClone(source) {
      const _source = JSON.stringify(source)
      const sourceClone = JSON.parse(_source)
      return sourceClone
    },

    // 每页数量切换
    handleSizeChange(val) {
      this.size = val
      this.queryListHandler({
        page: this.page,
        size: this.size
      })
    },
    // 分页切换
    handleCurrentChange(val) {
      this.page = val
      this.queryListHandler({
        page: this.page,
        size: this.size
      })
    },

    // 表单验证方法
    validate() {
      this.$refs['formContent'].validate(valid => {
        if (valid) {
          // ...
        } else {
          return false
        }
      })
    },

    // 获取护理单元ID
    selectDeptInfo() {
      return selectDeptInfo()
    },
  }
}
