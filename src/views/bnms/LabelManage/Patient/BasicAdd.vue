<template>
  <layout v-loading="loading">

    <div slot="title">{{ form_type_text }}患者标签</div>

    <div slot="main" class="add-from">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
        label-suffix=":"
        v-uni="'huanzhebiaoqiantianjiabiaodan'"
      >
        <el-form-item label="标签名称" prop="labelName">
          <el-input
            v-model.trim="ruleForm.labelName"
            placeholder="请输入"
            oninput="if(value.length>16)value=value.slice(0,16)"
          ></el-input>
        </el-form-item>

        <el-form-item label="是否手工输入" prop="inputType">
          <el-radio-group v-model="ruleForm.inputType">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="字段名称" prop="labelSql">
          <el-input
            v-model="ruleForm.labelSql"
            placeholder="请输入"
            :disabled="ruleForm.isInitialize === 1 ? true : false"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="21">
            <el-form-item label="字段类型" prop="labelDisplayType">
              <el-select
                v-if="ruleForm.labelSql === 'birthday'"
                v-model="ruleForm.labelDisplayType"
                placeholder="请选择"
                @change="handleLabelDisplayType"
                clearable
                v-uni="'huanzhebiaoqiantianjiaziduanleixingyi'"
              >
                <template v-for="(key, value) in item_config.labelDisplayType">
                  <el-option
                    v-if="value === 'date' || value === 'datetime'"
                    :label="key"
                    :value="value"
                    :key="key"
                  ></el-option>
                </template>
              </el-select>
              <el-select
                v-else
                v-model="ruleForm.labelDisplayType"
                placeholder="请选择"
                @change="handleLabelDisplayType"
                clearable
                :disabled="ruleForm.isInitialize === 1 ? true : false"
                v-uni="'huanzhebiaoqiantianjiaziduanleixinger'"
              >
                <template v-for="(key, value) in item_config.labelDisplayType">
                  <el-option
                    :label="key"
                    :value="value"
                    :key="key"
                  ></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <div
              class="config_btn"
              @click="addConfigItem"
              circle
              v-if="
                      (ruleForm.labelDisplayType == 'radio' ||
                        ruleForm.labelDisplayType == 'checkbox' ||
                        ruleForm.labelDisplayType == 'select') && ruleForm.labelSql !== 'nurseLevel'
                    "
            >
              <i class="el-icon-circle-plus-outline"/>
            </div>
          </el-col>
        </el-row>
        <el-form-item
          v-if="
                  (ruleForm.labelDisplayType == 'input' || ruleForm.labelDisplayType == 'number' ||
                  ruleForm.labelDisplayType == 'date' || ruleForm.labelDisplayType == 'datetime' ||
                  ruleForm.labelDisplayType == 'doctor' || ruleForm.labelDisplayType == 'nurse') && ruleForm.labelSql !== 'nurseLevel'
                 "
          label="字体颜色"
          :prop="ruleForm.labelDisplayTypeValue[0].config.fontColor">
          <el-color-picker
            v-model="ruleForm.labelDisplayTypeValue[0].config.fontColor"
            :predefine="predefineColors"
          ></el-color-picker>
        </el-form-item>
        <el-form-item
          label="背景颜色"
          :prop="ruleForm.labelDisplayTypeValue[0].config.backGroundColor"
          v-if="
                  (ruleForm.labelDisplayType == 'input' || ruleForm.labelDisplayType == 'number' ||
                  ruleForm.labelDisplayType == 'date' || ruleForm.labelDisplayType == 'datetime' ||
                  ruleForm.labelDisplayType == 'doctor' || ruleForm.labelDisplayType == 'nurse') && ruleForm.labelSql !== 'nurseLevel'
                 "
        >
          <el-color-picker
            :predefine="predefineColors"
            v-model="ruleForm.labelDisplayTypeValue[0].config.backGroundColor"
          ></el-color-picker>
        </el-form-item>

        <!-- 配置项区域 -->
        <el-form-item label="">
          <el-row
            v-if="
                  (ruleForm.labelDisplayType == 'radio' ||
                    ruleForm.labelDisplayType == 'checkbox' ||
                    ruleForm.labelDisplayType == 'select') && ruleForm.labelSql !== 'nurseLevel'
                "
            v-for="(item, index) in ruleForm.labelDisplayTypeValue"
            :key="index"
          >
            <el-col :span="19" style="border: 1px solid #EAEAEA; padding: 10px; margin-bottom: 30px">
              <el-form-item
                :label="'配置项' + (index + 1)"
                :prop="'labelDisplayTypeValue.' + index + '.name'"
                label-width="90px"
                :rules="[{
                  required: true, message: '配置项不能为空!', trigger: 'blur'
                },{
                  min: 1,
                  max: 100,
                  message: '长度在 1 到 100 个字符！',
                  trigger: 'blur'
                }]"
              >
                <el-input v-model="item.name" placeholder="请输入" style="width: 100%"></el-input>
              </el-form-item>
              <el-form-item
                label="字体颜色"
                :prop="item.config.fontColor"
                label-width="90px">
                <el-color-picker
                  v-model="item.config.fontColor"
                  :predefine="predefineColors"
                ></el-color-picker>
              </el-form-item>
              <el-form-item
                label="背景颜色"
                :prop="item.config.backGroundColor"
                label-width="90px"
              >
                <el-color-picker
                  :predefine="predefineColors"
                  v-model="item.config.backGroundColor"
                ></el-color-picker>
              </el-form-item>
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
      </el-form>
    </div>

    <div slot="footer_btn">
      <el-button size="small" v-uni="'huanzhebiaoqian_cancel'" @click="close()">取消</el-button>
      <el-button type="primary" v-uni="'huanzhebiaoqian_save'" size="small" @click="submitForm">保存</el-button>
    </div>
  </layout>
</template>

<script>
import { ApiPatientManage } from '../../../../api/bnms'
import item_config from '../../../../assets/bnms/common/item_config'
import layout from '../../../../components/bnms/layout/edit'

export default {
  name: 'patient_basic_add',
  data () {
    return {
      item_config,
      loading: false,
      form_type_text: '',
      config_item: {
        name: '',
        config: {
          fontColor: '#000',
          backGroundColor: '#fff'
        }
      },
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
      ruleForm: {
        labelType: '301',
        labelName: '',
        inputType: 2,
        labelSql: '',
        labelShowType: 1,
        labelShowInfo: '',
        // 字段类型
        labelDisplayType: '',
        // 配置项
        labelDisplayTypeValue: []
      },
      rules: {
        labelName: [
          { required: true, message: '请输入标签名称！', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符！',
            trigger: 'blur'
          }
        ],
        inputType: [
          { required: true, message: '请选择是否手工输入！', trigger: 'change' }
        ],
        labelSql: [
          { required: true, message: '请输入字段名称！', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符！',
            trigger: 'blur'
          }
        ],
        labelDisplayType: [
          { required: true, message: '请选择字段类型！', trigger: 'change' }
        ]
      }
    }
  },
  props: ['detail'],
  created () {
    let params = this.detail || {}
    this.form_type_text = params['labelId'] ? '编辑' : '添加'
    Object.assign(this.ruleForm, params)
    // 处理配置项的回显内容
    if (this.ruleForm.labelShowInfo) {
      let info = JSON.parse(this.ruleForm.labelShowInfo)
      this.ruleForm.labelDisplayTypeValue = info
    }
  },
  methods: {
    handleLabelDisplayType (e) {
      this.ruleForm.labelDisplayTypeValue = [
        JSON.parse(JSON.stringify(this.config_item))
      ]
    },
    addConfigItem () {
      this.ruleForm.labelDisplayTypeValue.push(
        JSON.parse(JSON.stringify(this.config_item))
      )
    },
    removeConfigItem (index) {
      this.ruleForm.labelDisplayTypeValue.splice(index, 1)
    },
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ApiPatientManage.save(this.ruleForm)
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
    // 返回
    close () {
      this.$emit('changed')
    }
  },
  watch: {
    'ruleForm.labelDisplayType' (newVal) {
      this.ruleForm.labelShowInfo = JSON.stringify({
        style: newVal,
        item: this.ruleForm.labelDisplayTypeValue
      })
    },
    'ruleForm.labelDisplayTypeValue': {
      handler (val) {
        this.ruleForm.labelShowInfo = JSON.stringify({
          style: this.ruleForm.labelDisplayType,
          item: val
        })
      },
      deep: true
    }
  },
  components: {
    layout
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/bnms/css/self_common";

  .config_btn {
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
