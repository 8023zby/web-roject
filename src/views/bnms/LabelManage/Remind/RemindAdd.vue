<template>
  <layout v-loading="loading">

    <div slot="title">{{ form_type_text }}提醒标签</div>

    <div slot="main" class="add-from">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="form-main-center"
      >
        <el-form-item label="标签名称" prop="labelName">
          <el-input
            v-model="ruleForm.labelName"
            placeholder="请输入标签名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否手工输入" prop="inputType">
          <el-radio-group v-model="ruleForm.inputType">
            <el-radio :label="2">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标识内容" prop="labelShowType">
          <el-radio-group
            v-model="ruleForm.labelShowType"
            @change="
                      ruleForm.labelShowInfo = ruleForm.labelIdentificationValueA = ruleForm.labelIdentificationValueB =
                        ''
                    "
          >
            <el-radio
              v-for="(value, key) in item_config.labelShowType"
              :label="+key"
              :key="key"
            >{{ value }}
            </el-radio
            >
          </el-radio-group>
        </el-form-item>
        <!-- 简称 -->
        <el-form-item v-if="ruleForm.labelShowType == 2" style="margin: 0">
          <el-col :span="17">
            <el-form-item prop="labelIdentificationValueA" style="margin: 0">
              <el-input
                style="width: 250px"
                v-model="ruleForm.labelIdentificationValueA"
                placeholder="请输入简称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item prop="labelIdentificationValueB" style="margin: 0">
              <el-color-picker
                v-model="ruleForm.labelIdentificationValueB"
                :predefine="predefineColors"
              >
              </el-color-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item  v-if="ruleForm.labelShowType == 2">
          <span style="color:#999999; font-size: 12px">汉字/大写字母显示第一个，小写字母/数字显示第一二个</span>
        </el-form-item>
        <!-- 符号 -->
        <el-form-item v-if="ruleForm.labelShowType == 3" >
          <el-col :span="17">
            <el-form-item prop="labelIdentificationValueA" >
              <el-select
                style="width: 250px"
                v-model="ruleForm.labelIdentificationValueA"
                placeholder="请选择形状"
              >
                <el-option
                  v-for="(value, key) in item_config.shape"
                  :key="key"
                  :label="value"
                  :value="key"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item prop="labelIdentificationValueB" >
              <el-color-picker
                v-model="ruleForm.labelIdentificationValueB"
                :predefine="predefineColors"
              >
              </el-color-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 图片 -->
        <el-form-item v-if="ruleForm.labelShowType == 4" >
          图片库选择
        </el-form-item>
        <el-form-item label="关联内容和脚本" prop="dataSources">
          <el-radio-group v-model="ruleForm.dataSources" @change="handleRelationType">
            <el-radio :label="4">关联消息分类</el-radio>
            <el-radio :label="3">自定义脚本</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消息分类" prop="relationField" v-if="ruleForm.dataSources === 4">
          <el-select v-model="ruleForm.relationField" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in message_type_data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="脚本内容" prop="labelSql" v-if="ruleForm.dataSources === 3">
          <el-input
            type="textarea"
            :rows="5"
            v-model="ruleForm.labelSql"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="跳转页面" prop="labelEvent">
          <div style="border:1px #DADADA solid; border-radius: 2px; width: 300px">
            1
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer_btn">
      <el-button size="small" @click="close()"
      >取消
      </el-button>
      <el-button type="primary" size="small" @click="submitForm"
      >保存
      </el-button>

    </div>
  </layout>
</template>

<script>
import { ApiPatientManage } from '../../../../api/bnms/index'
import item_config from '../../../../assets/bnms/common/item_config'
import layout from '../../../../components/bnms/layout/edit'

export default {
  name: 'patient_remind_add',
  data () {
    return {
      item_config,
      loading: false,
      form_type_text: '',
      message_type_data: [{
        id: 1,
        name: '消息分类1'
      }],
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
        labelType: '401',
        labelName: '',
        inputType: 2,
        labelSql: '',
        labelShowType: 2,
        labelShowInfo: '',
        //
        labelIdentificationValueA: '',
        labelIdentificationValueB: '',
        // labelPositionId  labelShow labelShowArea  labelShowType labelShowInfo
        // ---
        labelIdentificationImage: { path: '' },
        dataSources: 4,
        relationField: '',
        labelEvent: ''
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
        labelIdentificationValueA: [
          {
            required: true,
            message: '请填写标识内容具体值！',
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              if (this.ruleForm.labelShowType === 2 && value.length > 10) {
                callback(new Error('最多10个字符！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        inputType: [
          { required: true, message: '请选择是否手工输入！', trigger: 'change' }
        ],
        labelShowType: [
          { required: true, message: '请选择标识内容！', trigger: 'change' }
        ],
        labelSql: [
          // { required: true, message: "请输入脚本内容！", trigger: "blur" },
        ]
      }
    }
  },
  props: ['detail'],
  created () {
    let params = this.detail || {}
    this.form_type_text = params['labelId'] ? '编辑' : '添加'
    // 处理回显内容
    if (
      params.labelShowInfo &&
        (params.labelShowType == '2' || params.labelShowType == '3')
    ) {
      let info = params.labelShowInfo.split('|')
      params.labelIdentificationValueA = info[0]
      params.labelIdentificationValueB = info[1]
    }
    Object.assign(this.ruleForm, params)
  },
  methods: {
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
    handleRelationType () {
      this.ruleForm.relationField = ''
      this.ruleForm.labelSql = ''
    },
    // 返回
    close () {
      this.$emit('changed')
    }
  },
  watch: {
    'ruleForm.labelIdentificationValueA' (v) {
      this.ruleForm.labelShowInfo =
          v + '|' + this.ruleForm.labelIdentificationValueB
    },
    'ruleForm.labelIdentificationValueB' (v) {
      this.ruleForm.labelShowInfo =
          this.ruleForm.labelIdentificationValueA + '|' + v
    },
    'ruleForm.labelIdentificationImage.path' (v) {
      this.ruleForm.labelShowInfo = v + '|'
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
