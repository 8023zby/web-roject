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
        this.$confirm('确定要保存吗?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (otherSubmitHandler) {
            otherSubmitHandler()
          } else {
            this.customSubmitHandler()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
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
    optionSuccessHandler (type = 'success', msg = '操作成功') {
      this.$message({
        type: type,
        message: msg
      })
    }

  }
}
