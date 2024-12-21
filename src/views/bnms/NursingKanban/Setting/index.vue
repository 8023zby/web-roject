<template>
  <layout v-loading="loading">
    <div slot="title">
      护理看板电视端设置
    </div>
    <div slot="main" class="add-from form-main-center">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="125px"
      >
        <el-form-item label="是否启用密码验证" prop="isPassword">
          <el-switch
            v-model="ruleForm.isPassword"
            :active-value="1"
            :inactive-value="0"
            @change="openVerifyForm">
          </el-switch>
        </el-form-item>
        <el-form-item label="需要验证页面" prop="pageIds" v-show="ruleForm.isPassword === 1">
          <el-checkbox-group v-model="ruleForm.pageIds">
            <template v-for="v in ruleForm.pages">
              <el-checkbox v-if="v.pageUrl !== '/theme1/home'" :label="v.pageId" :checked="v.setting" :key="v.pageUrl">{{v.pageName}}</el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="密码验证有效时长" prop="duration" v-show="ruleForm.isPassword === 1">
          <el-col :span="10">
            <el-input
              style="width: auto"
              v-model="ruleForm.duration"
              placeholder="请输入"
            ></el-input>
          </el-col>
          <el-col :span="10">
            &nbsp;分钟
          </el-col>
        </el-form-item>
        <el-form-item label="" v-show="ruleForm.isPassword === 1">
          <span style="color: #999" v-show="ruleForm.duration">*密码验证后 {{ruleForm.duration}} 分钟内不需要再次输入密码验证</span>
          <span style="color: #999" v-show="!ruleForm.duration">*不填时间默认每次都需要验证</span>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer_btn" style="margin-top: 30px" v-show="ruleForm.isPassword === 1">
      <el-button type="primary" @click="submitForm">
        保存
      </el-button>
    </div>
  </layout>
</template>

<script>
import { ApiKanbanPasswordSetting } from '../../../../api/bnms/index'
import layout from '../../../../components/bnms/layout/edit'

export default {
  name: 'password-setting',
  data () {
    return {
      loading: false,
      views: [],
      ruleForm: {
        isPassword: 0,
        pages: [],
        duration: 0,
        pageIds: []
      },
      rules: {
        duration: { validator: (rule, value, callback) => {
            if (value !== '' && !/^[1-9]\d*$/.test(value)) {
              callback(new Error('只能输入正整数！'));
            } else {
              callback();
            }
          }, trigger: 'blur' }
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    openVerifyForm (val) {
      if (val === 1) {
        this.getData(1)
      } else {
        this.$refs.ruleForm.resetFields()
        this.submitForm()
      }
    },
    getData (s) {
      this.loading = true
      ApiKanbanPasswordSetting.select()
        .then(res => {
          if (s) {
            res.data.isPassword = 1
            res.data.duration = 10
          }
          res.data.pageIds = [];
          res.data && (this.ruleForm = res.data)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ApiKanbanPasswordSetting.save(this.ruleForm)
            .then(() => {
              this.$message.success('保存正确！')
            })
            .catch(res => {
              this.$message.error(res.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  components: {
    layout
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/bnms/css/self_common";

  .form-main-center {
    max-width: 450px;
  }

  /deep/ .el-checkbox{
    display: block;
  }
</style>
