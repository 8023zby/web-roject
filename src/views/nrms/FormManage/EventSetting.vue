<template>
  <layout v-loading="loading">
    <div slot="title">临床事件配置</div>

    <div slot="main" class="add-from">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="form-main-center"
        label-suffix=":"
      >
        <el-form-item label="字段类型" prop="fieldType">
          <el-row>
            <el-col :span="15">
              <el-select
                v-model="ruleForm.fieldType"
                placeholder="请选择"
                clearable
              >
                <el-option
                  label="下拉选项"
                  :value="0"
                ></el-option>
                <el-option
                  label="下拉选项可手输(文本)"
                  :value="1"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="9">
              <div
                class="config_btn"
                @click="addConfigItem"
              >
                <i class="el-icon-circle-plus-outline"/>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="手输项字段长度" prop="handWriteLength" v-if="ruleForm.fieldType === 1">
          <el-input
            v-model="ruleForm.handWriteLength"
            placeholder="请输入"
          ></el-input>
        </el-form-item>

        <el-form-item label="手输项是否显示时间" prop="handWriteShowTime"  v-if="ruleForm.fieldType === 1">
          <el-checkbox v-model="ruleForm.handWriteShowTime" :true-label="1" :false-label="0"></el-checkbox>
        </el-form-item>
        <!-- 配置项区域 -->
        <template v-for="(item,index) in ruleForm.extendSetting">
          <el-form-item
            :key="index"
            :label="'配置项' + (index + 1)"
            :prop="'extendSetting.' + index + '.name'"
            :rules="[{
                    required: true, message: '配置项不能为空!', trigger: 'blur'
                  },{
                    min: 1,
                    max: 100,
                    message: '长度在 1 到 10 个字符！',
                    trigger: 'blur'
                  }]"
          >
            <el-row>
              <el-col :span="15">
                <el-input v-model="item.name" placeholder="请输入"></el-input>
              </el-col>
              <el-col :span="4">
                <el-checkbox v-model="item.showTime" true-label="1" false-label="0">显示时间</el-checkbox>
              </el-col>
              <el-col :span="3" :offset="1">
                <div
                  class="config_btn"
                  @click="removeConfigItem(index)"
                  v-if="index != 0"
                >
                  <i class="el-icon-remove-outline "/>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
      </el-form>
    </div>

    <div slot="footer_btn">
      <el-button size="small"  @click="() => { $emit('changed', 'list') }"
      >取消
      </el-button>
      <el-button type="primary" size="small" @click="submitForm"
      >保存
      </el-button>

    </div>
  </layout>
</template>

<script>
import layout from '../../../components/nrms/layout/edit'
import { ApiEventManage } from '../../../api/nrms/index'
export default {
  name: 'EventSetting',
  components: {
    layout
  },
  props: ['detail'],
  data () {
    const validate = (rule, value, callback) => {
      if (value && !/^\d{0,2}$/.test(value)) {
        callback(new Error('请输入最多2位数字！'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      eventItem: [{}, {}],
      ruleForm: {
        formId: this.detail.formId,
        fieldType: 1,
        handWriteLength: '',
        handWriteShowTime: '',
        extendSetting: [{
          name: '',
          showTime: '0'
        }, {
          name: '',
          showTime: '0'
        }, {
          name: '',
          showTime: '0'
        }]
      },
      rules: {
        handWriteLength: [
          { validator: validate, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      ApiEventManage.select({ formId: this.ruleForm.formId })
        .then(res => {
          Object.assign(this.ruleForm, res.data || {})
        })
        .catch(res => {
          this.$message.error(res.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    addConfigItem () {
      if (this.ruleForm.extendSetting.length > 10) {
        this.$message.warn('最多10个配置项！')
      }
      this.ruleForm.extendSetting.push({
        name: '',
        showTime: '0'
      })
    },
    removeConfigItem (index) {
      this.ruleForm.extendSetting.splice(index, 1)
    },
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ApiEventManage.save(this.ruleForm)
            .then(async () => {
              this.$message.success('保存正确！')
              await this.getData()
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
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  .form-main-center {
    max-width: 665px
  }

  .config_btn {
    display: inline-block;
    font-size: 25px;
    color: #409eff;

    i {
      vertical-align: baseline;

      &.el-icon-remove-outline {
        color: #f56c6c;
      }
    }
  }
</style>
