/**
 * newest 记录最新的表单（通常为后端返回结果存储）
 */
export default {
  methods: {
    backHandler (data) {
      this.$emit('option-changed', 'list')
    },
    submitHandler (form, otherSubmitHandler = null) {
      this.newest = null
      this.$refs[form].validate((valid) => {
        if (!valid) return false
        if (otherSubmitHandler) {
          // 可执行回调函数
          otherSubmitHandler()
        } else {
          this.customSubmitHandler()
        }
      })
    },
    submitSuccessHandler (data, backHandler = true) {
      if (data.status === 200) {
        this.optionSuccessHandler()
      } else {
        this.optionSuccessHandler('error', data.desc)
      }
      if (backHandler) {
        this.backHandler()
      }
    },
    optionSuccessHandler (type = 'success', msg = '操作成功', callback) {
      if (callback) {
        callback()
      } else {
        this.$message({
          type: type,
          message: msg
        })
      }
    }

  }
}
