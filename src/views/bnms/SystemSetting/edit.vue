<template>
  <layout>
    <div slot="title">
      {{form_type_text}}护理级别
    </div>
    <div slot="main" class="add-from" >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        label-suffix="："
      >
        <el-form-item label="护理级别名称" prop="nurseLevelName">
          <el-input
            v-model="ruleForm.nurseLevelName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="护理级别简称" prop="nurseLevelShort">
          <el-input
            v-model="ruleForm.nurseLevelShort"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="字体颜色" prop="fontColor">
          <el-row>
            <el-col style="width:300px;">
              <el-input
                style="width: 100%"
                readonly
                v-model="ruleForm.fontColor"
                placeholder="请选择"
              ></el-input>
            </el-col>
            <el-col :span="3" :offset="1">
              <el-color-picker
                v-model="fontColorPicker"
                :predefine="predefineColors"
              >
              </el-color-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="背景颜色" prop="backgroundColor">
          <el-row>
            <el-col style="width:300px;">
              <el-input
                style="width: 100%"
                v-model="ruleForm.backgroundColor"
                placeholder="请选择"
                readonly
              ></el-input>
            </el-col>
            <el-col :span="3" :offset="1">
              <el-color-picker
                v-model="backgroundColorPicker"
                :predefine="predefineColors"
              >
              </el-color-picker>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer_btn">
      <el-button size="small" @click="close" v-uni="'hulijibie_cancel'">
        取消
      </el-button>
      <el-button type="primary" size="small" @click="submitForm" v-uni="'hulijibie_save'">
        保存
      </el-button>
    </div>
  </layout>
</template>

<script>
import { ApiNurseLevel } from '../../../api/bnms'
import layout from '../../../components/bnms/layout/edit'
export default {
  name: 'nursing_add',
  components: { layout },
  data () {
    return {
      loading: false,
      form_type_text: '',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        '#FC0303'
      ],
      fontColorPicker: '',
      backgroundColorPicker: '',
      ruleForm: {
        nurseLevelName: '',
        nurseLevelShort: '',
        fontColor: '',
        backgroundColor: '',
        userId: ''
      },
      rules: {
        nurseLevelName: [
          { required: true, message: '请输入护理级别名称！', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符！',
            trigger: 'blur'
          }
        ],
        nurseLevelShort: [
          { required: true, message: '请输入护理级别简称！', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符！',
            trigger: 'blur'
          }
        ],
        fontColor: [
          { required: true, message: '请选择字体颜色！', trigger: 'blur' }
        ],
        backgroundColor: [
          { required: true, message: '请选择背景颜色！', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['detail'],
  created () {
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    this.ruleForm.userId = empInfo.empId || ''

    let params = this.detail || {}
    this.form_type_text = params['nurseLevelId'] ? '编辑' : '添加'
    params['fontColor'] && (this.fontColorPicker = params['fontColor'])
    params['backgroundColor'] &&
      (this.backgroundColorPicker = params['backgroundColor'])
    Object.assign(this.ruleForm, params)
  },
  methods: {
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ApiNurseLevel.save(this.ruleForm)
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
      this.$emit('changed', 'list')
    }
  },
  watch: {
    fontColorPicker (v) {
      this.ruleForm.fontColor = v
    },
    backgroundColorPicker (v) {
      this.ruleForm.backgroundColor = v
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";
</style>
