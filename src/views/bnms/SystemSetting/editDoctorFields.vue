<template>
  <layout>
    <div slot="title">编辑字段信息</div>
    <div slot="main" class="add-from" >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="form-main-center"
        label-suffix="："
      >
        <el-form-item label="页面字段名称" prop="fieldName">
          <el-input v-model="ruleForm.fieldName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="展示列宽度" prop="columnId">
          <el-select v-model="ruleForm.columnId" autocomplete="off">
            <el-option label="短列宽" value="short"></el-option>
            <el-option label="中列宽" value="medium"></el-option>
            <el-option label="长列宽" value="long"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer_btn">
      <el-button size="small" @click="close">取消</el-button>
      <el-button type="primary" size="small" @click="submitForm">保存</el-button>
    </div>
  </layout>
</template>

<script>
import { doctorFieldsSet } from '../../../api/bnms'
import layout from '../../../components/bnms/layout/edit'
export default {
  name: 'editDoctorFields',
  components: { layout },
  data () {
    return {
      loading: false,
      ruleForm: {
        fieldName: '',
        columnId: '',
        userId: ''
      },
      rules: {
        fieldName: [
          { required: true, message: '请输入页面字段名称！', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符！', trigger: 'blur' }
        ],
        columnId: [
          { required: true, message: '请选择展示列宽度！', trigger: 'change' }
        ]
      }
    }
  },
  props: ['detail'],
  created () {
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    this.ruleForm.userId = empInfo.empId || ''

    let params = this.detail || {}

    Object.assign(this.ruleForm, { id: params.id, columnId: params.columnId, fieldName: params.fieldName })
  },
  methods: {
    submitForm () {
      console.log(this.ruleForm)

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          doctorFieldsSet.update([this.ruleForm])
            .then(() => {
              this.$message.success('保存正确！')
              this.close()
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    close () { // 关闭窗体
      this.$emit('changed', 'list', '', 'fourth')
    }
  },
  watch: {

  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";
</style>
