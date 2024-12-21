<template>
  <layout>
    <div slot="title">{{ form_type_text }}风险级别</div>

    <div slot="main"
         class="add-from">
      <el-form :model="dataObj"
               class="form-main-center"
               :rules="rules"
               label-width="180px"
               ref="addForm">
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item label="分值区间："
                          label-width="180px"
                          prop="minRecord">
              <el-input v-model="dataObj.minRecord"
                        style="width: 132px;"
                        type="number"
                        :clearable="true"
                        oninput="if(value.length>5)value=value.slice(0,5)"
                        placeholder="最小值"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <label class="el-form-item__label assess-zhi">至</label>
          </el-col>
          <el-col :span="4">
            <el-form-item label=""
                          label-width="0px"
                          prop="maxRecord">
              <el-input v-model="dataObj.maxRecord"
                        type="number"
                        :clearable="true"
                        oninput="if(value.length>5)value=value.slice(0,5)"
                        style="width: 142px;"
                        placeholder="最大值"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <div class="assess-tip">
              <span>说明：分值区间包含“等于”，即：最小值≤X≤最大值</span>
            </div>
          </el-col>
          <el-col :span="24"
                  v-if="error.visible"
                  :offset="0">
            <div class="assess-error">
              <span>{{error.text}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="风险级别："
                          label-width="180px"
                          prop="level">
              <el-input v-model="dataObj.level"
                        style="width: 300px;"
                        maxlength="10"
                        :clearable="true"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="颜色："
                          class="color-item"
                          label-width="180px">
              <el-form-item label="" label-width="1px"
                            style="height: 34px;">
                <el-input v-model="dataObj.levelColor"
                          style="width: 254px;"></el-input>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div style="position: relative;left: -2px;">
              <el-color-picker v-model="dataObj.levelColor"
                               popper-class="safe_color"
                               :predefine="predefineColors">
              </el-color-picker>
            </div>
          </el-col>
        </el-row>
        <!--el-row-- :gutter="0">
          <el-col :span="24">
            <el-form-item label="评估频次：" label-width="180px">
              <el-radio v-model="dataObj.assRateCorrect" label="0">每日评估</el-radio>
              <el-radio v-model="dataObj.assRateCorrect" label="1">每周评估</el-radio>
            </el-form-item>
          </el-col>
        </el-row-->
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="是否需要设置评估频次："
                          prop="isAssessment"
                          label-width="180px">
              <el-radio v-model="dataObj.isAssessment"
                        :label="1">是</el-radio>
              <el-radio v-model="dataObj.isAssessment"
                        :label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0"
                v-if="dataObj.isAssessment === 1">
          <el-col :span="24">
            <el-form-item label="评估频次："
                          prop="assessmentConfigId"
                          label-width="180px">
              <el-select v-model="dataObj.assessmentConfigId"
                         placeholder="请选择"
                         clearable>
                <el-option v-for="item in isAssessmentArr"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="是否提醒："
                          prop="isWarm"
                          label-width="180px">
              <el-radio v-model="dataObj.isWarm"
                        :label="1">是</el-radio>
              <el-radio v-model="dataObj.isWarm"
                        :label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <!--el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="状态：" label-width="100px">
              <el-radio v-model="dataObj.isUsed" :label="1">启用</el-radio>
              <el-radio v-model="dataObj.isUsed" :label="0">停用</el-radio>
            </el-form-item>
          </el-col>
        </el-row-->
      </el-form>
    </div>

    <div slot="footer_btn">
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary"
                 @click="submitForm">
        保存
      </el-button>
    </div>

  </layout>
</template>

<script>
import layout from '../../../components/nams/layout/edit'
import { AxiosJsonApi } from '../../../api/nams/http/index'
import { ApiAssessSetting } from '../../../api/nams/index'

export default {
  name: 'assess_setting_add',
  data () {
    return {
      form_type_text: '',
      color: '#ccc',
      predefineColors: [],
      activeType: 'POST',
      baseUrl: '/nams/web-na/ass-setting/',
      dataObj: {
        assId: this.assessDetail.assId,
        scoreId: '',
        level: '',
        levelColor: '#333333',
        minRecord: '',
        maxRecord: '',
        // assRateCorrect: '0',
        assessmentConfigId: '', // 评估频次
        isAssessment: 1, // 是否设置评估频次
        isWarm: 1, // 提醒
        isUsed: 1 // 启用
      },
      isAssessmentArr: [], // 评估频次数组
      isRepeat: true,
      error: {
        visible: false,
        text: '该分值区间与其他风险级别的分值区间有重合，请检查'
      },
      showError: false,
      rules: {
        minRecord: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value < 0 || value > 999) {
                this.error.visible = false
                callback(new Error('范围0-999'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              let reg = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1})?$/
              if (!reg.test(value)) {
                this.error.visible = false
                callback(new Error('限定小数点后一位'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              let that = this
              let min = that.dataObj.minRecord
              let max = that.dataObj.maxRecord
              if (min === '' || max === '') {
                callback()
                that.error.visible = false
                return false
              }
              if (+min > +max) {
                callback()
                that.error = {
                  visible: true,
                  text: '分值区间须最小值≤最大值，请检查'
                }
              } else {
                callback()
                that.error.visible = false
              }
            },
            trigger: 'blur'
          }
        ],
        maxRecord: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value < 0 || value > 999) {
                this.error.visible = false
                callback(new Error('范围0-999'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              let reg = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1})?$/
              if (!reg.test(value)) {
                this.error.visible = false
                callback(new Error('限定小数点后一位'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          // { pattern: /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1})?$/, message: '限定小数点后一位', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let that = this
              let min = that.dataObj.minRecord
              let max = that.dataObj.maxRecord
              if (min === '' || max === '') {
                callback()
                that.error.visible = false
                return false
              }
              if (+min > +max) {
                callback()
                that.error = {
                  visible: true,
                  text: '分值区间须最小值≤最大值，请检查'
                }
              } else {
                callback()
                that.error.visible = false
              }
            },
            trigger: 'blur'
          }
          // { pattern: /^[0-9][0-9]*$/, message: '请输入正整数！', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        isAssessment: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        assessmentConfigId: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        isWarm: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      }
    }
  },
  components: { layout },
  props: ['assessDetail'],
  mounted () {
    this.init()
    this.getAssessCodes()
  },
  methods: {
    init () {
      console.log(this.assessDetail)
      if (this.assessDetail.scoreId === '') {
        this.activeType = 'POST'
      } else {
        this.activeType = 'PUT'
        this.dataObj.scoreId = this.assessDetail.scoreId
        this.dataObj.minRecord = this.assessDetail.minRecord
        this.dataObj.maxRecord = this.assessDetail.maxRecord
        this.dataObj.level = this.assessDetail.level
        this.dataObj.levelColor = this.assessDetail.levelColor
        this.dataObj.isWarm = this.assessDetail.isWarm
        this.dataObj.isAssessment = this.assessDetail.isAssessment
        this.dataObj.isUsed = 1
        if (this.dataObj.isAssessment === null || this.dataObj.isAssessment === '' || this.dataObj.isAssessment === undefined) {
          this.dataObj.isAssessment = 1
        }
        this.dataObj.assessmentConfigId = this.assessDetail.assessmentConfigId
        let assessmentConfigDo = this.assessDetail.assessmentConfigDo || ''
        let assessmentConfigId = ''
        if (assessmentConfigDo) {
          assessmentConfigId = assessmentConfigDo.assessmentConfigId || ''
        }
        this.dataObj.assessmentConfigId = assessmentConfigId
        // this.dataObj.isUsed = this.assessDetail.isUsed + ''
        // this.dataObj.assRateCorrect = this.assessDetail.assRateCorrect + ''
      }
      this.form_type_text = this.assessDetail.scoreId ? '编辑' : '添加'
      this.getColor()
    },
    // 校验数值
    calNum (type) {
      this.error.visible = false
      let that = this
      let val = ''
      if (type === 'maxRecord') {
        val = this.dataObj.maxRecord
      } else {
        val = this.dataObj.minRecord
      }
      if (val < 0 || val > 999) {
        if (type === 'maxRecord') {
          // this.$message.error('最大值输入范围为0-999')
          this.error.visible = true
          this.error.text = '最大值输入范围为0-999'
          setTimeout(function () {
            that.dataObj.maxRecord = ''
          }, 500)
        } else {
          // this.$message.error('最小值输入范围为0-999')
          this.error.visible = true
          this.error.text = '最小值输入范围为0-999'
          setTimeout(function () {
            that.dataObj.minRecord = ''
          }, 500)
        }
      }
      let reg = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1})?$/
      if (!(reg.test(val))) {
        if (type === 'maxRecord') {
          // this.$message.error('最大值限定小数点后一位')
          this.error.visible = true
          this.error.text = '最大值限定小数点后一位'
          setTimeout(function () {
            that.dataObj.maxRecord = ''
          }, 500)
        } else {
          // this.$message.error('最小值限定小数点后一位')
          this.error.visible = true
          this.error.text = '最小值限定小数点后一位'
          setTimeout(function () {
            that.dataObj.minRecord = ''
          }, 500)
        }
      }
    },
    // 获取全部评估频次编码数据
    getAssessCodes () {
      this.isAssessmentArr = []
      this.loading = true
      ApiAssessSetting.select({ page: null, size: '' })
        .then(res => {
          let list = res.data || []
          for (let i = 0; i < list.length; i++) {
            let item = list[i]
            let frequencyName = item.frequencyName
            let assessmentConfigId = item.assessmentConfigId
            this.isAssessmentArr.push({
              label: frequencyName,
              value: assessmentConfigId
            })
          }
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    // 选择颜色
    getColor () {
      let aColor = ['00', '33', '66', '99', 'CC', 'FF']
      let iLen = aColor.length
      let i = 0
      for (let r = 0; r < iLen; r++) {
        for (let g = 0; g < iLen; g++) {
          for (let b = 0; b < iLen; b++) {
            this.predefineColors.push('#' + aColor[r].toString() + aColor[g].toString() + aColor[b].toString())
            i++
          }
        }
      }
    },
    submitForm () {
      let that = this
      this.error.visible = false
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          that.error.visible = false
          that.dataObj.maxRecord = +that.dataObj.maxRecord
          that.dataObj.minRecord = +that.dataObj.minRecord
          that.dataObj.isUsed = 1
          let url = that.baseUrl + (that.activeType === 'PUT' ? 'update' : 'add')
          AxiosJsonApi(url, that.dataObj, that.activeType, {}).then(res => {
            let status = res.status
            let desc = res.desc
            if (status === 200 || status === '200') {
              that.$message.success('保存正确！')
              that.error.visible = false
              that.close()
            } else if (status === 500 || status === '500') {
              that.error = {
                visible: true,
                text: res.desc
              }
            } else {
              that.error.visible = false
              that.$message.error(desc || '保存异常！')
            }
          }).catch(res => {
            that.error.visible = false
            that.$message.error(res.desc || '保存异常')
          })
        }
      })
    },
    close () {
      this.$emit('option-changed', 'Tab', this.assessDetail)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nams/css/self_common";

  .safe_color {
    min-width: 475px;

    .el-color-dropdown__main-wrapper {
      display: none;
    }

    .el-color-predefine {
      width: 475px;
    }

    .el-color-predefine__color-selector {
      margin: 0 0 4px 4px;
      height: 15px;
      border: 1px solid #e0e0e0;
      border-radius: 2px
    }

    .el-color-predefine__color-selector:nth-child(10n+1) {
      margin-left: 5px;
      border-radius: 2px
    }

    .el-color-predefine__color-selector > div {
      border-radius: 2px
    }
  }

  .form-main-center {
    max-width: 900px;
  }

  .assess-zhi {
    width: 20px;
    color: #666666;
    font-size: 14px;
    padding-left: 16px;
  }

  .assess-tip {
    height: 34px;
    line-height: 34px;

    span {
      color: #9A9A9A;
      font-size: 12px;
    }
  }

  .assess-error {
    position: relative;
    top: -15px;
    left: 180px;

    span {
      color: #F56C6C;
      font-size: 12px;
    }
  }

  /deep/.el-col .color-item {
    height: 34px;
  }
</style>
