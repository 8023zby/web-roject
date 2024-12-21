<template>
  <layout>
    <div slot="title">设置字段展示列宽</div>
    <div slot="main" class="add-from" >
      <el-form
        :model="{ruleForm}"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="form-main-center"
        label-suffix=":"
      >
        <el-divider content-position="left">web端展示列宽设置</el-divider>
        <el-form-item label="web短列宽" prop="webMinWidth">
          <el-input
            type="number"
            v-model="ruleForm[0].value"
            placeholder="请输入"
          ></el-input>
          <span style="color:#606266;padding-left: 10px;">px</span>
        </el-form-item>
        <el-form-item label="web中列宽" prop="webMedWidth">
          <el-input
            v-model="ruleForm[1].value"
            placeholder="请输入"
          ></el-input>
          <span style="color:#606266;padding-left: 10px;">px</span>
        </el-form-item>
        <el-form-item label="web长列宽" prop="webMaxWidth">
          <el-input
            v-model="ruleForm[2].value"
            placeholder="请输入"
          ></el-input>
          <span style="color:#606266;padding-left: 10px;">px</span>
        </el-form-item>

        <el-divider content-position="left">pad端展示列宽设置</el-divider>
        <el-form-item label="pad短列宽" prop="padMinWidth">
          <el-input
            v-model="ruleForm[3].value"
            placeholder="请输入"
          ></el-input>
          <span style="color:#606266;padding-left: 10px;">px</span>
        </el-form-item>
        <el-form-item label="pad中列宽" prop="padMedWidth">
          <el-input
            v-model="ruleForm[4].value"
            placeholder="请输入"
          ></el-input>
          <span style="color:#606266;padding-left: 10px;">px</span>
        </el-form-item>
        <el-form-item label="pad长列宽" prop="padMaxWidth">
          <el-input
            v-model="ruleForm[5].value"
            placeholder="请输入"
          ></el-input>
          <span style="color:#606266;padding-left: 10px;">px</span>
        </el-form-item>

        <el-divider content-position="left">看板展示列宽设置</el-divider>
        <el-form-item label="看板短列宽" prop="ntvMinWidth">
          <el-input
            v-model="ruleForm[6].value"
            placeholder="请输入"
          ></el-input>
          <span style="color:#606266;padding-left: 10px;">px</span>
        </el-form-item>
        <el-form-item label="看板中列宽" prop="ntvMedWidth">
          <el-input
            v-model="ruleForm[7].value"
            placeholder="请输入"
          ></el-input>
          <span style="color:#606266;padding-left: 10px;">px</span>
        </el-form-item>
        <el-form-item label="看板长列宽" prop="ntvMaxWidth">
          <el-input
            v-model="ruleForm[8].value"
            placeholder="请输入"
          ></el-input>
          <span style="color:#606266;padding-left: 10px;">px</span>
        </el-form-item>

        <el-divider content-position="left">床头展示列宽设置</el-divider>
        <el-form-item label="床头短列宽" prop="bedHeadMinWidth">
          <el-input
            v-model="ruleForm[9].value"
            placeholder="请输入"
          ></el-input>
          <span style="color:#606266;padding-left: 10px;">px</span>
        </el-form-item>
        <el-form-item label="床头中列宽" prop="bedHeadMedWidth">
          <el-input
            v-model="ruleForm[10].value"
            placeholder="请输入"
          ></el-input>
          <span style="color:#606266;padding-left: 10px;">px</span>
        </el-form-item>
        <el-form-item label="床头长列宽" prop="bedHeadMaxWidth">
          <el-input
            v-model="ruleForm[11].value"
            placeholder="请输入"
          ></el-input>
          <span style="color:#606266;padding-left: 10px;">px</span>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer_btn">
      <el-button size="small" @click="close" v-uni="'yizhuziduan_shezhiliekuan_cancel'">取消</el-button>
      <el-button type="primary" size="small" @click="submitForm" v-uni="'yizhuziduan_shezhiliekuan_save'">保存</el-button>
    </div>
  </layout>
</template>

<script>
import { doctorFieldsSet } from '../../../api/bnms'
import layout from '../../../components/bnms/layout/edit'
export default {
  name: 'setColLength',
  components: { layout },
  data () {
    var validateWebMinWidth = (rule, value, callback) => {
      if (this.ruleForm[0].value === '') {
        callback(new Error('请输入web短列宽！'))
      } else if (this.ruleForm[0].value.length > 5) {
        callback(new Error('长度在 1 到 5 个数字！'))
      } else {
        callback()
      }
    }

    var validateWebMedWidth = (rule, value, callback) => {
      if (this.ruleForm[1].value === '') {
        callback(new Error('请输入web中列宽！'))
      } else if (this.ruleForm[2].value.length > 5) {
        callback(new Error('长度在 1 到 5 个数字！'))
      } else {
        callback()
      }
    }

    var validateWebMaxWidth = (rule, value, callback) => {
      if (this.ruleForm[2].value === '') {
        callback(new Error('请输入web长列宽！'))
      } else if (this.ruleForm[4].value.length > 5) {
        callback(new Error('长度在 1 到 5 个数字！'))
      } else {
        callback()
      }
    }

    var validatePadMinWidth = (rule, value, callback) => {
      if (this.ruleForm[3].value === '') {
        callback(new Error('请输入pad短列宽！'))
      } else if (this.ruleForm[1].value.length > 5) {
        callback(new Error('长度在 1 到 5 个数字！'))
      } else {
        callback()
      }
    }

    var validatePadMedWidth = (rule, value, callback) => {
      if (this.ruleForm[4].value === '') {
        callback(new Error('请输入pad中列宽！'))
      } else if (this.ruleForm[3].value.length > 5) {
        callback(new Error('长度在 1 到 5 个数字！'))
      } else {
        callback()
      }
    }

    var validatePadMaxWidth = (rule, value, callback) => {
      if (this.ruleForm[5].value === '') {
        callback(new Error('请输入pad长列宽！'))
      } else if (this.ruleForm[5].value.length > 5) {
        callback(new Error('长度在 1 到 5 个数字！'))
      } else {
        callback()
      }
    }

    var validateNtvMinWidth = (rule, value, callback) => {
      if (this.ruleForm[6].value === '') {
        callback(new Error('请输入看板短列宽！'))
      } else if (this.ruleForm[6].value.length > 5) {
        callback(new Error('长度在 1 到 5 个数字！'))
      } else {
        callback()
      }
    }

    var validateNtvMedWidth = (rule, value, callback) => {
      if (this.ruleForm[7].value === '') {
        callback(new Error('请输入看板中列宽！'))
      } else if (this.ruleForm[7].value.length > 5) {
        callback(new Error('长度在 1 到 5 个数字！'))
      } else {
        callback()
      }
    }

    var validateNtvMaxWidth = (rule, value, callback) => {
      if (this.ruleForm[8].value === '') {
        callback(new Error('请输入看板长列宽！'))
      } else if (this.ruleForm[8].value.length > 5) {
        callback(new Error('长度在 1 到 5 个数字！'))
      } else {
        callback()
      }
    }

    var validateBedHeadMinWidth = (rule, value, callback) => {
      if (this.ruleForm[9].value === '') {
        callback(new Error('请输入床头短列宽！'))
      } else if (this.ruleForm[6].value.length > 5) {
        callback(new Error('长度在 1 到 5 个数字！'))
      } else {
        callback()
      }
    }

    var validateBedHeadMedWidth = (rule, value, callback) => {
      if (this.ruleForm[10].value === '') {
        callback(new Error('请输入床头中列宽！'))
      } else if (this.ruleForm[7].value.length > 5) {
        callback(new Error('长度在 1 到 5 个数字！'))
      } else {
        callback()
      }
    }

    var validateBedHeadMaxWidth = (rule, value, callback) => {
      if (this.ruleForm[11].value === '') {
        callback(new Error('请输入床头长列宽！'))
      } else if (this.ruleForm[8].value.length > 5) {
        callback(new Error('长度在 1 到 5 个数字！'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      ruleForm: [
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' }
      ],
      rules: {
        webMinWidth: [
          { required: true, validator: validateWebMinWidth, trigger: 'blur' }
        ],
        webMedWidth: [
          { required: true, validator: validateWebMedWidth, trigger: 'blur' }
        ],
        webMaxWidth: [
          { required: true, validator: validateWebMaxWidth, trigger: 'blur' }
        ],
        padMinWidth: [
          { required: true, validator: validatePadMinWidth, trigger: 'blur' }
        ],
        padMedWidth: [
          { required: true, validator: validatePadMedWidth, trigger: 'blur' }
        ],
        padMaxWidth: [
          { required: true, validator: validatePadMaxWidth, trigger: 'blur' }
        ],
        ntvMinWidth: [
          { required: true, validator: validateNtvMinWidth, trigger: 'blur' }
        ],
        ntvMedWidth: [
          { required: true, validator: validateNtvMedWidth, trigger: 'blur' }
        ],
        ntvMaxWidth: [
          { required: true, validator: validateNtvMaxWidth, trigger: 'blur' }
        ],
        bedHeadMinWidth: [
          { required: true, validator: validateBedHeadMinWidth, trigger: 'blur' }
        ],
        bedHeadMedWidth: [
          { required: true, validator: validateBedHeadMedWidth, trigger: 'blur' }
        ],
        bedHeadMaxWidth: [
          { required: true, validator: validateBedHeadMaxWidth, trigger: 'blur' }
        ]
      }
    }
  },
  props: ['detail'],
  created () {
    let params = this.detail || {}

    Object.assign(this.ruleForm, params)
    this.getColLength()
  },
  methods: {
    getColLength () { // 获取列宽度数据
      doctorFieldsSet.colLength().then((res) => {
        this.ruleForm = res.data
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    submitForm () {
      console.log(this.ruleForm)

      this.$refs.ruleForm.validate(valid => {
        console.log(valid)
        if (valid) {
          doctorFieldsSet.updateColLength(this.ruleForm)
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
    // 重置表单 & 关闭窗体
    close () {
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
