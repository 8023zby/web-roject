<template>
  <layout v-loading="loading">
    <div slot="title">
      <div class="title">{{form_type_text}}</div>
    </div>
    <div slot="main"
         class="add-from">
      <el-form :model="ruleForm"
               :rules="rules"
               label-suffix="："
               ref="ruleForm"
               label-width="130px">

        <el-form-item label="频次名称"
                      prop="frequencyName">
          <el-input v-model="ruleForm.frequencyName"
                    :clearable="true"
                    placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="频次编码"
                      prop="frequencyCode">
          <el-input v-model="ruleForm.frequencyCode"
                    :clearable="true"
                    placeholder="请输入"></el-input>
        </el-form-item>

        <template v-if="tab.activeName === 'frequency'">
          <el-form-item label="执行规则"
                        prop="frequencyRule">
            <el-radio-group v-model="ruleForm.frequencyRule"
                            @change="handleFrequencyRule">
              <el-radio :label="+value"
                        :key="value"
                        v-for="(name, value) in executeRule">{{name}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>

        <template v-if="tab.activeName === 'assess'">
          <el-form-item label="执行规则"
                        prop="frequencyRule">
            <el-radio-group v-model="ruleForm.frequencyRule"
                            @change="handleFrequencyRule">
              <el-radio :label="+value"
                        :key="value"
                        v-for="(name, value) in executeRuleAssess">{{name}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>

        <el-form-item label="执行时间点"
                      prop="executeIntervalTime"
                      v-if="ruleForm.frequencyRule === 3">
          <span style="color: #606266;">开始执行后 </span>
          <el-input v-model="ruleForm.executeIntervalTime"
                    :clearable="true"
                    style="width: 220px;"></el-input>
          <span style="color: #606266;"> 分钟执行</span>
        </el-form-item>

        <el-form-item label="周几执行"
                      prop="weekDateIndex"
                      v-if="ruleForm.frequencyRule === 2">
          <el-checkbox-group v-model="ruleForm.weekDateIndex">
            <el-checkbox :label="+value"
                         :key="value"
                         v-for="(name, value) in weekConfig">{{name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <template v-if="tab.activeName === 'frequency'">
          <el-form-item label="单日执行次数"
                      prop="frequencyCount"
                      v-if="ruleForm.frequencyRule === 1 || ruleForm.frequencyRule === 2 || ruleForm.frequencyRule === 0">
            <el-select v-model="ruleForm.frequencyCount"
                       placeholder="请选择"
                       :clearable="true"
                       @change="handleChange">
              <el-option v-for="item in countOption24"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
        </template>

        <template v-if="tab.activeName === 'assess'">

          <el-form-item label="每天执行次数"
                        prop="frequencyCount"
                        v-if="ruleForm.frequencyRule === 0">
            <el-select v-model="ruleForm.frequencyCount"
                       placeholder="请选择"
                       :clearable="true"
                       @change="handleChange">
              <el-option v-for="item in countOption24"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>

          <el-form-item label="隔几天执行一次"
                        prop="frequencyCount"
                        v-if="ruleForm.frequencyRule === 1">
            <el-select v-model="ruleForm.frequencyCount"
                       placeholder="请选择"
                       :clearable="true"
                       @change="handleChange">
              <el-option v-for="item in countOption15"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>

        </template>

        <template v-if="tab.activeName === 'frequency'">
          <template v-if="ruleForm.frequencyRule === 0 || ruleForm.frequencyRule === 1 || ruleForm.frequencyRule === 2">
            <template v-for="(executeTime, index) in ruleForm.frequencyConfigExtendDoList">
              <el-form-item :label="'执行时间点' + (index + 1)"
                            :key="index"
                            :prop="'frequencyConfigExtendDoList['+ index +'].frequencyExecuteTime'"
                            :rules="{required: true, message: '请选择', trigger: 'blur'}">
                <el-time-picker v-model="executeTime.frequencyExecuteTime"
                                format="HH:mm"
                                :clearable="true"
                                value-format="HH:mm"
                                placeholder="请选择">
                </el-time-picker>
              </el-form-item>
            </template>
          </template>
        </template>

        <template v-if="tab.activeName === 'assess'">
          <template v-if="ruleForm.frequencyRule === 0 || ruleForm.frequencyRule === 1 || ruleForm.frequencyRule === 2">
            <template v-for="(executeTime, index) in ruleForm.assessmentConfigExtendDoList">
              <el-form-item :label="(ruleForm.frequencyRule === 2 || ruleForm.frequencyRule === 1) ? '执行时间点' : '执行时间点' + (index + 1)"
                            :key="index"
                            :prop="'assessmentConfigExtendDoList['+ index +'].frequencyExecuteTime'"
                            :rules="{required: true, message: '请选择', trigger: 'blur'}">
                <el-time-picker v-model="executeTime.frequencyExecuteTime"
                                format="HH:mm"
                                :clearable="true"
                                value-format="HH:mm"
                                placeholder="请选择">
                </el-time-picker>
              </el-form-item>
            </template>
          </template>
        </template>

        <el-form-item label="备注"
                      prop="remark">
          <el-input type="textarea"
                    :rows="5"
                    v-model="ruleForm.remark"
                    maxlength="200"
                    placeholder="请输入"
                    show-word-limit></el-input>
        </el-form-item>

      </el-form>

    </div>

    <div slot="footer_btn">
      <el-button @click="close" v-uni="'pinggupinci_cancel'">取消</el-button>
      <el-button type="primary" @click="submitForm" v-uni="'pinggupinci_save'">保存</el-button>
    </div>

  </layout>

</template>
<script>
import { ApiFrequencySetting, ApiAssessSetting } from '../../../api/dams'
import { executeRule, weekConfig, executeRuleAssess } from '../../../assets/dams/js/item_config'
import layout from '../../../components/dams/layout/edit'

export default {
  props: ['tab', 'params'],
  components: { layout },
  data () {
    let validateFrequencyCode = (rule, value, callback) => {
      let arr = []
      if (this.tab.activeName === 'frequency') {
        arr = this.frequencyCodeArr
      } else {
        arr = this.assessCodeArr
      }
      if (value === '') {
        callback(new Error('请输入'))
      } else if (arr.indexOf(value) !== -1) {
        callback(new Error('该频次编码已存在!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      form_type_text: '',
      frequencyCodeArr: [], // 医嘱频次编码数组
      assessCodeArr: [], // 评估频次编码数组
      executeRule,
      weekConfig,
      executeRuleAssess,
      ruleForm: {
        frequencyName: '',
        frequencyCode: '',
        frequencyRule: 0,
        weekDateIndex: [],
        frequencyCount: null,
        remark: '',
        executeIntervalTime: 0,
        frequencyConfigExtendDoList: [],
        assessmentConfigExtendDoList: []
      },
      count: '',
      rules: {
        frequencyName: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 1, max: 24, message: '长度不超过24个字符', trigger: 'blur' }
        ],
        frequencyCode: [
          { validator: validateFrequencyCode, trigger: 'blur', required: true },
          { min: 1, max: 24, message: '长度不超过24个字符!', trigger: 'blur' }
        ],
        frequencyRule: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        executeIntervalTime: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!new RegExp('^(\\d|[1-9]\\d|100)$').test(value) || value > 100) {
                callback(new Error('请输入0-100的整数！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        weekDateIndex: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        frequencyCount: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      countOption15: [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
        { label: 5, value: 5 },
        { label: 6, value: 6 },
        { label: 7, value: 7 },
        { label: 8, value: 8 },
        { label: 9, value: 9 },
        { label: 10, value: 10 },
        { label: 11, value: 11 },
        { label: 12, value: 12 },
        { label: 13, value: 13 },
        { label: 14, value: 14 },
        { label: 15, value: 15 }
      ],
      countOption24: [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
        { label: 5, value: 5 },
        { label: 6, value: 6 },
        { label: 7, value: 7 },
        { label: 8, value: 8 },
        { label: 9, value: 9 },
        { label: 10, value: 10 },
        { label: 11, value: 11 },
        { label: 12, value: 12 },
        { label: 13, value: 13 },
        { label: 14, value: 14 },
        { label: 15, value: 15 },
        { label: 16, value: 16 },
        { label: 17, value: 17 },
        { label: 18, value: 18 },
        { label: 19, value: 19 },
        { label: 20, value: 20 },
        { label: 21, value: 21 },
        { label: 22, value: 22 },
        { label: 23, value: 23 },
        { label: 24, value: 24 }
      ]
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      let params = this.params
      if (params) {
        this.ruleForm = JSON.parse(JSON.stringify(params))
      }
      let title = '医嘱频次'
      if (this.tab.activeName === 'frequency') {
        title = '医嘱频次'
        this.form_type_text = (params['frequencyConfigId'] ? '编辑' : '添加') + title
      } else {
        title = '评估频次'
        this.form_type_text = (params['assessmentConfigId'] ? '编辑' : '添加') + title
      }
      // 获取编码数据
      this.getCodes()
      console.log('ruleForm')
      console.log(this.ruleForm)
    },
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.tab.activeName === 'frequency') {
            ApiFrequencySetting.save(this.ruleForm)
              .then(() => {
                this.$message.success('保存正确！')
                this.close()
              })
              .catch(res => {
                this.$message.error(res.message)
              })
          } else {
            // this.ruleForm.assessmentConfigExtendDoList = this.ruleForm.frequencyConfigExtendDoList
            ApiAssessSetting.save(this.ruleForm)
              .then(() => {
                this.$message.success('保存正确！')
                this.close()
              })
              .catch(res => {
                this.$message.error(res.message)
              })
          }
        } else {
          return false
        }
      })
    },
    // 获取编码数据
    getCodes () {
      switch (this.tab.activeName) {
        case 'frequency':
          this.getFrequencyCodes()
          break
        case 'assess':
          this.getAssessCodes()
          break
        default:
          this.getFrequencyCodes()
      }
    },
    // 获取全部医嘱频次编码数据
    getFrequencyCodes () {
      this.loading = true
      ApiFrequencySetting.select({ page: null, size: '' })
        .then(res => {
          let list = res.data
          for (let i = 0; i < list.length; i++) {
            if (list[i]['frequencyCode'] !== this.ruleForm.frequencyCode) {
              this.frequencyCodeArr.push(list[i]['frequencyCode'])
            }
          }
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    // 获取全部评估频次编码数据
    getAssessCodes () {
      this.loading = true
      ApiAssessSetting.select({ page: null, size: '' })
        .then(res => {
          let list = res.data
          for (let i = 0; i < list.length; i++) {
            if (list[i]['frequencyCode'] !== this.ruleForm.frequencyCode) {
              this.assessCodeArr.push(list[i]['frequencyCode'])
            }
          }
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    // 重置表单 & 关闭窗体
    close () {
      this.$emit('option-changed', 'list', '', this.tab)
    },
    // 选择循环几次
    handleChange (val) {
      if (this.tab.activeName === 'frequency') {
        this.ruleForm.frequencyConfigExtendDoList = []
        this.count = val === 1 ? 1 : val
        for (let i = 0; i < this.count; i++) {
          this.ruleForm.frequencyConfigExtendDoList.push({
            frequencyExecuteTime: ''
          })
        }
      } else {
        this.ruleForm.assessmentConfigExtendDoList = []
        this.count = val === 1 ? 1 : val
        if (this.ruleForm.frequencyRule === 1) { // 隔天执行
          this.ruleForm.assessmentConfigExtendDoList.push({
            frequencyExecuteTime: ''
          })
        } else {
          for (let i = 0; i < this.count; i++) {
            this.ruleForm.assessmentConfigExtendDoList.push({
              frequencyExecuteTime: ''
            })
          }
        }
      }
    },
    // 点击执行规则
    handleFrequencyRule (val) {
      // 0: '按天执行',
      // 1: '隔天执行',
      // 2: '按周执行',
      // 3: '按开始执行时间'

      // 0: '每天执行',
      // 1: '隔天执行',
      // 2: '按周执行'
      if (this.tab.activeName === 'frequency') {
        if (val === 0 || val === 1 || val === 2) {
          this.ruleForm.frequencyCount = 1
          this.handleChange(1)
        } else {
          this.ruleForm.frequencyCount = null
          this.ruleForm.frequencyConfigExtendDoList = []
        }
        this.ruleForm.weekDateIndex = []
      } else {
        this.ruleForm.frequencyCount = 1
        this.handleChange(1)
        this.ruleForm.weekDateIndex = []
      }
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/dams/css/self_common";

</style>
