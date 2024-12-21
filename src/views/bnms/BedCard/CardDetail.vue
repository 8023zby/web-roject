<template>
  <div v-loading="loading" class="card_detail" >
    <div id="bnms_card_detail" ref="card_detail">
      <div class="tool-bar">
        <el-button
          type="primary"
          size="small"
          @click="leaveHospital"
          v-uni="'huanzhexiangqing_chuyuan'"
          v-if="!enableHis && patient_data.patientIn.patientId"
        >出院
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="showChangingBed"
          v-if="!enableHis && patient_data.patientIn.patientId"
          v-uni="'huanzhexiangqing_tiaochuang'"
        >调床
        </el-button>
      </div>
      <div class="top">
        床号:<span>{{
          patient_data ? patient_data.patientIn.bedName : ""
        }}</span>
        姓名:<span>{{
          patient_data ? patient_data.patientIn.patientName : ""
        }}</span>
        住院号:<span>{{
          patient_data ? patient_data.patientIn.inpNo : ""
        }}</span>
      </div>
      <div class="nurse_label">
        <el-form :model="extend_label_form" ref="extend_label_form">
          <div class="yujing">
            <template v-for="item in nurse_label">
              <el-checkbox
                true-label="true"
                false-label=""
                v-if="item.dataSources === 3"
                v-model="extend_label_form[item.labelSql]"
                :key="item.labelId"
                :label="item.labelName"
                :disabled="item.inputType !== 1"
                :class="enableHis && item.inputType !== 1 ? 'disabled_active' : ''"
              >{{ item.labelName }}
              </el-checkbox>
              <el-checkbox
                v-else
                :key="item.labelId"
                true-label="true"
                false-label=""
                :checked="item.labelValue ? item.labelValue.includes(bedName) : false"
                :disabled="item.inputType !== 1"
                :class="enableHis && item.inputType !== 1 ? 'disabled_active' : ''"
              >{{ item.labelName }}
              </el-checkbox>
            </template>
          </div>
        </el-form>
      </div>
      <!-- 表单组件容器 -->
      <div id="form-create">
        <form-create
          ref="formCreate"
          v-model="formCreateApi"
          :rule="formCreateRule"
          :option="formCreateOption"
        ></form-create>
      </div>

      <!-- 按钮 -->
      <div class="form_btn">
        <el-button size="small" v-uni="'huanzhexiangqing_cancel'" @click="closeDetail">取消</el-button>
        <el-button
                type="primary"
                size="small"
                @click="submitForm"
                :loading="addLoading"
                v-uni="'huanzhexiangqing_save'"
        >保存
        </el-button>
      </div>
    </div>

    <!-- 调床弹窗 -->
    <el-dialog title="调床" :visible.sync="changeBedDialogVisible" width="612px" :show-close="false">
      <div class="changing_bed_container">
        <el-radio-group v-model="changing_bed_name">
          <el-tooltip
            v-for="(item, index) in bed_data"
            :key="item.value + index"
            class="item" effect="dark" :content="item.value" placement="top">
            <el-radio
              :label="item.value"
              :class="
                patient_data && item.value == patient_data.patientIn.bedName
                  ? 'curr_patient'
                  : ''
              "
              :disabled="
                bed_has_patient_data.length > 0 &&
                bed_has_patient_data.indexOf(item.value) != -1
                  ? true
                  : false
              "
            >
              {{ item.value }}
            </el-radio>
          </el-tooltip>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="changeBedDialogVisible = false"
          v-uni="'huanzhexiangqing_bed_cancel'"
          >
          取消
        </el-button>
        <el-button type="primary" size="small" @click="changingBedIdSave" v-uni="'huanzhexiangqing_bed_save'">
          确认
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import formCreate, { maker } from '@form-create/element-ui'

import {
  ApiNurseLevel,
  ApiBedCard,
  ApiBedRoom,
  ApiUsers
} from '../../../api/bnms/index'

export default {
  name: 'card_detail',
  data () {
    return {
      loading: false,
      addLoading: false,
      changeBedDialogVisible: false,
      enableHis: false,
      bedName: '',
      bed_data: [],
      bed_has_patient_data: [],
      changing_bed_name: '',
      col_span: {
        xs: {
          span: 24
        },
        md: {
          span: 24
        },
        lg: {
          span: 12
        },
        xl: {
          span: 8
        }
      },
      patient_data: {},
      nurse_level_data: [],
      patient_label: [],
      nurse_label: [],
      doctor_data: [],
      nurse_data: [],
      deptId: '',
      basicLabelData: {},
      basic_label_form: [], // 患者标签处理后的表单
      extend_label_form: {},
      formCreateApi: {},
      formCreateRule: [],
      formCreateOption: {
        submitBtn: false,
        resetBtn: false,
        form: {
          labelWidth: '205px'
        }
      },
      curSelect: {},
      // 出生日期的字段格式，根据字段格式格式化数据
      birthdayFieldType: ''
    }
  },
  props: ['patientDetail'],
  created () {
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.deptId = deptInfo.deptId || ''
    this.enableHis = this.patientDetail.enableHis
    this.bedName = this.patientDetail.bedName
    this.patient_data = this.patientDetail.patient || { patientIn: {} }
    let params = this.patient_data

    if (params && params.patientInfoDtos) {
      params.patientInfoDtos.forEach(v => {
        // includes 兼容多选
        if (v.labelType === '301') {
          this.$set(this.basicLabelData, v.labelSql, (v.infoValue || '').includes(',')
            ? v.infoValue.split(',')
            : v.infoValue || null)
        }
        if (v.labelType === '201') {
          // 兼容非true的值，只要有内容就可以
          v.labelSql && this.$set(this.extend_label_form, v.labelSql, v.infoValue !== null && v.infoValue !== '' ? true : '')
        }
      })
    }

    this.loading = true
    this.getDataInit()
  },
  mounted () {
    this.$refs.card_detail.addEventListener('scroll', () => {
      if (this.curSelect.dom) {
        let top = this.curSelect.dom.target.getBoundingClientRect().top
        if (top <= (60 + 42 + 20 + 59 - 15)) {
          this.formCreateApi.el(this.curSelect.field).blur()
        }
      }
    })
  },
  methods: {
    getDataInit () {
      Promise.all([this.getNurseLevelData(), this.getDoctorData(), this.getNurseData(), this.getPatient1LabelData(), this.getNurse1LabelData()]).then(res => {
        const nurseLevel = res[0].data || []
        this.parseNurseLevelData(nurseLevel)

        const doctor = res[1].data || []
        this.parseDoctorData(doctor)

        const nurse = res[2].data || []
        this.parseNurseData(nurse)

        const patientLabel = res[3].data || []
        this.parsePatient2LabelData(patientLabel)

        const nurseLabel = res[4].data || []
        this.parseNurse2LabelData(nurseLabel)

        // 创建表单 fApi为表单api 组织表单组件数据
        this.formCreateRule = [
          ...getFixedLabel(this),
          ...this.basic_label_form
        ]

        // 初始化数据
        this.$nextTick(function () {
          this.patient_data.patientIn.bedName = this.bedName
          // 格式化出生日期
          if (this.birthdayFieldType === 'date' && this.patient_data.patientIn.birthday) {
            this.patient_data.patientIn.birthday = this.patient_data.patientIn.birthday.split(' ')[0]
          }

          // 多加一步, 先验证医生、护士id能不能比对到姓名，比对不到显示空字符
          const doctorName = this.getDoctorName(this.patient_data.patientIn.doctorName || '')
          if (!doctorName) {
            this.patient_data.patientIn.doctorName = ''
          }
          const nurseName = this.getNurseName(this.patient_data.patientIn.nurseName || '')
          if (!nurseName) {
            this.patient_data.patientIn.nurseName = ''
          }
          this.formCreateApi.setValue({ ...this.patient_data.patientIn, ...this.basicLabelData })
          this.formCreateApi.setValue('bedName', this.bedName)
        })
        this.$set(this.patient_data.patientIn, 'bedName', this.bedName)
        this.$set(this.patient_data.patientIn, 'nurseNameText', this.getNurseName(this.patient_data.patientIn.nurseName) || this.patient_data.patientIn.nurseName)
        this.$set(this.patient_data.patientIn, 'doctorNameText', this.getDoctorName(this.patient_data.patientIn.doctorName) || this.patient_data.patientIn.doctorName)

        this.loading = false
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    // 获取患者一览详情患者标签
    getPatient1LabelData () {
      return ApiBedCard.patientDetailLabel({
        deptId: this.deptId
      })
    },
    // 解析患者一览详情患者标签
    parsePatient2LabelData (data) {
      let patientLabel = data || []
      this.patient_label = patientLabel
      patientLabel.forEach(v => {
        let rule = this.parseFormLabel(v, this)
        //
        // 如果是nurse或doctor类型 用rule.field + 'Text'代替
        if (v.inputType !== 1 && (rule.style === 'nurse' || rule.style === 'doctor')) {
          // 显示对照文字的
          let textRule = JSON.parse(JSON.stringify(rule))
          textRule.field = textRule.field + 'Text'
          if (rule.style === 'nurse') {
            textRule.value = this.getNurseName(this.patient_data.patientIn[rule.field] || this.basicLabelData[rule.field] || '')
            // console.log(textRule.field, textRule.value, this.basicLabelData)
          } else {
            textRule.value = this.getDoctorName(this.patient_data.patientIn[rule.field] || this.basicLabelData[rule.field] || '')
          }
          this.basic_label_form.push(textRule)

          rule.type = 'hidden'
          this.basic_label_form.push(rule)
        } else {
          this.basic_label_form.push(rule)
        }
      })
    },
    // 获取患者一览详情护理标签
    getNurse1LabelData () {
      return ApiBedCard.detailNrseLabel({
        deptId: this.deptId
      })
    },
    // 解析患者一览护理标护理签
    parseNurse2LabelData (data) {
      let nurseLabel = data || []
      for (let i = 0; i < nurseLabel.length; i++) {
        let _d = nurseLabel[i]
        if (_d['dataSources'] === 1) {
          // 关联患者的不显示
          continue
        } else if (_d['dataSources'] === 2 || _d['dataSources'] === 4) { // 关联评估 关联脚本
          _d['labelValue'] = _d['labelValue'] ? _d['labelValue'].split(',') : []
          this.nurse_label.push(_d)
        } else if (_d['dataSources'] === 3) { // 关联字段
          this.nurse_label.push(_d)
        }
      }
    },
    // 标签解析成表单项
    parseFormLabel (label, self) {
      let info = label.labelShowInfo ? JSON.parse(label.labelShowInfo || '{}') : {}
      let rule = {
        field: label.labelSql,
        type: info.style || 'input',
        title: label.labelName,
        col: this.col_span,
        validate: [],
        value: '',
        props: { placeholder: '请输入', clearable: true },
        style: info.style

      }

      if (info.style === 'radio' || info.style === 'checkbox') {
        rule.value = info.style === 'radio' ? '' : []
        rule.options = info.item
          ? info.item.map(v => {
            return { label: v.name + '', value: v.name + '' }
          })
          : []

        let _col = { md: {}, lg: {}, xl: {} }
        let itemArr = []
        info.item.forEach(v => {
          itemArr.push(v.name)
        })
        // 2021-07-06 需求修改：将复选和单选的修改为整行显示
        _col.md.span = 24
        _col.lg.span = 24
        _col.xl.span = 24
        rule.col = _col
        // if (itemArr.join('').length > 10) {
        //   _col.md.span = this.col_span.md.span * 2
        //   _col.lg.span = this.col_span.lg.span * 2
        //   _col.xl.span = this.col_span.xl.span * 2
        //   rule.col = _col
        // }
      }
      if (rule.type === 'select') {
        rule.props.placeholder = '请选择'
        rule.options = info.item
          ? info.item.map(v => {
            return { label: v.name + '', value: v.name + '' }
          })
          : []
        rule.on = {
          focus (e) {
            self.curSelect = { field: label.labelSql, dom: e }
          },
          change (e) {
            self.inpNoChange('nurseNameText', self.getNurseName(e))
          }
        }
      }
      if (info.style === 'nurse') {
        rule.type = 'select'
        rule.options = this.nurse_data
        rule.props.placeholder = '请选择'
        if (rule.field === 'nurseName') {
          rule.on = {
            change (e) {
              self.inpNoChange('nurseNameText', self.getNurseName(e))
            },
            focus (e) {
              self.curSelect = { field: label.labelSql, dom: e }
            }
          }
        }
      }
      if (info.style === 'doctor') {
        rule.type = 'select'
        rule.options = this.doctor_data
        rule.props.placeholder = '请选择'
        if (rule.field === 'doctorName') {
          rule.on = {
            change (e) {
              self.inpNoChange('doctorNameText', self.getNurseName(e))
            },
            focus (e) {
              self.curSelect = { field: label.labelSql, dom: e }
              // this.formCreateApi.el(labelSql).blur()
            }
          }
        }
      }
      // 时间
      if (info.style === 'date' || info.style === 'datetime') {
        rule.type = 'DatePicker'
        rule.props.type = info.style
      }
      // 数值
      if (info.style === 'number') {
        rule.type = 'input'
        rule.props.type = 'number'
      }

      if (label.labelSql === 'nurseLevel') {
        rule.type = 'select'
        rule.props.placeholder = '请选择'
        rule.options = this.nurse_level_data
          ? this.nurse_level_data
          : []
      }

      // 写死表单验证
      if (label.labelSql === 'patientId') {
        rule.validate = [
          { required: true, message: '请输入患者ID', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^[0-9a-zA-Z]*$/g.test(value) === false || value.length > 32) {
                callback(new Error('患者ID1-32位数字或字母组成'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
      if (label.labelSql === 'inpNo') {
        rule.validate = [
          { required: true, message: '请输入住院号', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^[0-9a-zA-Z]*$/g.test(value) === false || value.length > 32) {
                callback(new Error('住院号1-32位数字或字母组成'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
      if (label.labelSql === 'sex') {
        rule.validate = [{ required: true, message: '请选择性别', trigger: 'changed' }]
      }
      if (label.labelSql === 'bedName') {
        rule.validate = [{ required: true, message: '请输入床位号', trigger: 'blur' }]
      }
      if (label.labelSql === 'nurseLevel') {
        rule.validate = [{ required: true, message: '请选择护理级别', trigger: 'change' }]
      }
      if (label.labelSql === 'patientName') {
        rule.validate = [
          { required: true, message: '请输入患者姓名', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '长度在1-20个字符！',
            trigger: 'blur'
          }
        ]
      }
      if (label.labelSql === 'birthday') {
        const style = JSON.parse(label.labelShowInfo || '{}')
        this.birthdayFieldType = style.style || ''
        rule.validate = [
          { required: true, message: '请输入出生日期', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (moment(value).diff(moment().toString(), 'seconds') > 0) {
                callback(new Error('不能选择未来时间！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
      if (label.labelSql === 'inTime') {
        rule.validate = [
          { required: true, message: '请选择入院时间', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (moment(value).diff(moment().toString(), 'seconds') > 0) {
                callback(new Error('不能选择未来时间！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
      if (label.labelSql === 'inFqcy') {
        rule.validate = [
          { required: true, message: '请输入入院次数', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^\d{0,3}$/.test(value)) {
                callback(new Error('最多3个数字！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
      if (label.labelSql === 'diagnose' || label.lableSql === 'allergy') {
        rule.validate = [
          {
            min: 1,
            max: 20,
            message: '长度在1-20个字符！',
            trigger: 'blur'
          }
        ]
      }

      // 非手输 患者基本信息不能手输， 年龄不能手输
      if (label.inputType !== 1 || label.labelSql === 'patientAge') {
        rule.validate = []
        rule.type = 'input'
        rule.props.type = 'text'
        rule.props.readonly = true
        rule.value = ''
      }

      return rule
    },
    // 获取护理级别
    getNurseLevelData () {
      return ApiNurseLevel.select({ deptId: this.deptId })
    },
    // 解析护理级别
    parseNurseLevelData (data) {
      this.nurse_level_data = data.map(v => {
        let _v = {}
        _v['value'] = v['nurseLevelName']
        _v['label'] = v['nurseLevelName']
        return _v
      })
    },
    // 获取医生信息
    getDoctorData () {
      return ApiUsers.doctor2({ dataDeptId: this.deptId })
    },
    // 解析医生信息
    parseDoctorData (data) {
      let list = data
      let arr = []
      for (let i = 0; i < list.length; i++) {
        let _d = list[i]
        arr.push({ label: _d['empName'], value: _d['empId'] })
      }
      this.doctor_data = arr
    },
    // 获取护士信息
    getNurseData () {
      return ApiUsers.nurse2({ dataDeptId: this.deptId })
    },
    // 解析护士信息
    parseNurseData (data) {
      let list = data
      let arr = []
      for (let i = 0; i < list.length; i++) {
        let _d = list[i]
        arr.push({ label: _d['empName'], value: _d['empId'] })
      }
      this.nurse_data = arr
    },

    // 获取有人和所有床位 【调床用】
    getBedData () {
      // 获取有人的床位
      ApiBedCard.hasPatientBed().then(res => {
        this.bed_has_patient_data = res.data
      })
      // 获取所有床位
      ApiBedRoom.bedList({ deptId: this.deptId, pageHelper: 2, orderBy: 'sort asc' }).then(
        res => {
          let list = res.data || []
          let arr = []
          for (let i = 0; i < list.length; i++) {
            arr.push({ label: list[i].bedName + '床', value: list[i].bedName, roomName: list[i].roomName })
          }
          this.bed_data = arr
          this.$set(this.patient_data.patientIn, 'roomName', this.getRoomName(this.bedName))
        }
      )
    },
    // 关闭详情
    closeDetail () {
      this.$emit('close')
    },
    // 保存/编辑
    submitForm () {
      if (this.addLoading) {
        return false
      }
      this.addLoading = true
      this.formCreateApi.submit(
        formData => {
          // 处理成接口想要的样子！
          let patientIn = { patientIdNo: 'patientIdNo' }
          for (let p in formData) {
            patientIn[p] =
              formData[p] instanceof Array
                ? formData[p].join(',')
                : formData[p]
          }
          // 患者标签
          let patientInfos = []
          this.patient_label.forEach(v => {
            // 非固定字段
            if (!v.isInitialize) { // 非固定字段
              patientInfos.push({
                labelSql: v.labelSql,
                infoValue:
                  formData[v.labelSql] instanceof Array
                    ? formData[v.labelSql].join(',')
                    : formData[v.labelSql],
                inFqcy: formData['inFqcy'] || 0
              })
            } else { // 固定字段，在patientIn中存在的
              patientIn[v.labelSql] =
                formData[v.labelSql] instanceof Array
                  ? formData[v.labelSql].join(',')
                  : formData[v.labelSql]
            }
          })
          // 护理标签
          for (let p in this.extend_label_form) {
            patientInfos.push({
              labelSql: p,
              infoValue: this.extend_label_form[p],
              inFqcy: formData['inFqcy'] || 0
            })
          }
          let http = null
          if (patientIn['id']) {
            http = ApiBedCard.update({
              patientIn: patientIn,
              patientInfoDtos: patientInfos
            })
          } else {
            http = ApiBedCard.insert({
              patientIn: patientIn,
              patientInfoDtos: patientInfos
            })
          }
          http
            .then(() => {
              this.addLoading = false
              this.$message.success({
                message: '保存正确！',
                duration: 1000,
                onClose: () => {
                  this.$emit('close')
                }
              })
            })
            .catch(res => {
              this.addLoading = false
              this.$message.error(res.message)
            })
        },
        api => {
          this.addLoading = false
        }
      )
    },
    // 调床
    showChangingBed () {
      this.getBedData()
      this.changeBedDialogVisible = true
    },
    changingBedIdSave () {
      if (!this.changing_bed_name) {
        this.$message.warning('请选择要调整的床位！')
        return false
      }
      ApiBedCard.change({
        fromBedName: this.patient_data.patientIn.bedName,
        toBedName: this.changing_bed_name
      })
        .then(() => {
          // 更新数据
          this.patient_data.patientIn.bedName = this.changing_bed_name
          this.formCreateApi.setValue({ bedName: this.changing_bed_name })
          this.$message.success('调床成功！')
          this.changeBedDialogVisible = false
        })
        .catch(res => {
          this.$message.error(res.message)
        })
    },
    // 出院
    leaveHospital () {
      this.$confirm('确认对此患者出院？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiBedCard.out({ patientId: this.patient_data.patientIn.patientId, roomName: this.patient_data.patientIn.roomName, nurseName: this.patient_data.patientIn.nurseNameText, doctorName: this.patient_data.patientIn.doctorNameText })
          .then(() => {
            this.$message.success('出院成功！')
            this.closeDetail()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    // 表单中对外的事件
    inpNoChange (field, val) {
      this.$set(this.patient_data.patientIn, field, val)
    },
    getRoomName (bedId) {
      let name = ''
      for (let i = 0; i < this.bed_data.length; i++) {
        if (bedId === this.bed_data[i].value || bedId + '床' === this.bed_data[i].label) {
          name = this.bed_data[i].roomName
          break
        }
      }
      return name
    },
    getDoctorName (id) {
      let name = ''
      for (let i = 0; i < this.doctor_data.length; i++) {
        if (id === this.doctor_data[i].value) {
          name = this.doctor_data[i].label
          break
        }
      }
      return name
    },
    getNurseName (id) {
      let name = ''
      for (let i = 0; i < this.nurse_data.length; i++) {
        if (id === this.nurse_data[i].value) {
          name = this.nurse_data[i].label
          break
        }
      }
      return name
    }
  },
  watch: {
    'patient_data.patientIn.bedName' (val) {
      this.$set(this.patient_data.patientIn, 'roomName', this.getRoomName(val))
    }
  },
  components: {
    formCreate: formCreate.$form()
  },
  destroyed () {
    this.formCreateApi.destroy()
  }
}

function getFixedLabel (self) {
  return [{
    field: 'id',
    type: 'hidden'
  }]
}
</script>

<style lang="scss" type="text/scss" scoped>
.card_detail {
  height: 100%;
  display: flex;
  flex-direction: column;

  > div:first-child {
    flex: 1;
    overflow: auto;
  }
}

.tool-bar {
  padding: 12px;
  text-align: right;
  /deep/ .el-button {
    border-radius: 2px !important;
    font-size: 14px !important;
    padding-top: 6px !important;
    padding-bottom: 6px !important;
    min-width: 78px;
  }
}

.card_detail {
  /deep/ .el-form-item__content {
    line-height: 33px;
  }
  /deep/ .el-select {
    display: block;
  }

  /deep/ .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: auto;
    display: block;
  }

  .nurse_label {
    /deep/ .el-checkbox + .el-checkbox {
      margin-right: 24px;
    }

    /deep/ .el-checkbox__inner {
      display: none;
    }

    /deep/ .el-checkbox__label {
      color: #333;
      border: 1px solid #999999;
      background: #fff;
      max-width: 130px;
      padding: 5px 8px;
      text-align: center;
      margin: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: 2px;
    }

    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #fff !important;
      border-color: transparent;
      background-color: #1e87f0;
      background-image: url("../../../assets/bnms/images/label_changed.svg");
      background-repeat: no-repeat;
      background-position: 102% 15px;
      background-size: 17px;
    }

    .disabled_active {
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: red;
        background: #f8f8f8;
      }
    }
  }
}

.changing_bed_container {
  //当前患者的床号
  .curr_patient {
    /deep/ .el-radio__label {
      color: #fff !important;
      background-color: #409eff !important;
    }
  }

  /deep/ .el-radio {
    margin-right: 14px;
    margin-bottom: 20px;
  }

  /deep/ .el-radio__input.is-checked + .el-radio__label {
    color: #fff;
    background-color: #1E87F0;
    border-color: #1E87F0;
  }

  /deep/ .el-radio__inner {
    display: none;
  }

  /deep/ .el-radio__label {
    font-size: 14px;
    padding-left: 0;
    width: 36px;
    height: 36px;
    border: 1px solid #BFBFBF;
    display: inline-block;
    line-height: 36px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #666;
    text-align: center;
    border-radius: 2px;
  }

  /deep/ .el-radio__input.is-disabled + span.el-radio__label {
    color: #CCCECE;
    background-color: #F4F4F4;
    border-color: #F4F4F4;
  }
}

#form-create {
  margin: 30px 30px 50px;

  /deep/ .el-form-item__label {
    color: #666;
    padding-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /deep/ .el-input,
  /deep/ .el-select {
    width: 300px;
  }
}

.top {
  font-size: 24px;
  text-align: center;
  margin-bottom: 40px;

  span {
    color: #ff7f00;
  }
}

.nurse_label {
  margin: 30px 80px;
}

.self_item {
  display: inline-block;
  width: 33%;
}

.form_btn {
  text-align: center;
  padding: 60px 20px 20px;
}

/deep/.el-dialog__body {
  min-height: 400px;
}
</style>
