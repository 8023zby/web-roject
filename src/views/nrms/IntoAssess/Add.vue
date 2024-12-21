<template>
  <div class="intoAssess-add">
    <div class="typt-tit-cls" v-if="!isPreview">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{intoAssessTmp.assName}}</div>
    </div>
    <!-- <el-button type="primary" @click="clickPrint">打印</el-button> -->
    <div class="intoAssess-add-content">
      <div class="print" v-if="!isPreview">
        <el-button class="print-btn" type="success" size="small" @click="clickPrint">打印</el-button>
      </div>
      <div style="width: 1000px;margin: 0 auto;padding-top: 30px" id="printHtml">
        <!-- 表头 -->
        <formHeader :autoHead="autoHead"></formHeader>
        <!-- 自动表单 -->
        <auto-form :data="data" :valueData="valueData" :isEdit="row"></auto-form>
      </div>
    </div>

    <div class="typt-add-footer" v-if="!isPreview">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save" :disabled="!patient || patient.patientType != EPatientType.in">保存</el-button>
    </div>
  </div>
</template>
<script>
// import FormCommon from "../../../components/nrms/autoForm/FormCommon";
import AutoForm from '../../../assets/nrms/mixins/AutoForm'
import { ApiAssManage } from '../../../api/nrms/index'
import { EPatientType } from '../../../assets/nrms/enum/patient'
const moment = require('moment')
export default {
  props: ['modifyData', 'params', 'isPreview', 'previewItem'],
  mixins: [AutoForm],
  components: {
    formHeader: () => import('../../../components/nrms/autoForm/header'),
    AutoForm: () => import('../../../components/nrms/autoForm/autoForm')
  },
  data () {
    return {
      data: {}, // 表单模板
      valueData: [],
      patient: {}, // 患者
      operatorType: '', // 手术评估模板类型
      intoAssessTmp: {}, // 手术评估模板
      row: null, // 编辑
      update: false,
      deptInfo: {},
      empInfo: {},
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      },
      EPatientType
    }
  },
  created () {
    if (this.isPreview) this.params.intoAssess = this.previewItem
    const { intoAssess, patient, row } = this.params
    this.patient = patient
    this.intoAssessTmp = intoAssess
    this.autoHead.tplHtml = this.intoAssessTmp.assStyle
    this.autoHead.formName = this.intoAssessTmp.assName
    if (this.patient && this.patient.id) {
      this.autoHead.tplData = this.patient
    }
    this.empInfo = JSON.parse(localStorage.getItem('empInfo'))
    this.deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo'))
    if (!this.isPreview) localStorage.setItem('formPatientId', this.patient.patientId)
    this.getFormTmp()
    this.row = row
    if (row) {
      this.valueData = JSON.parse(row.module_value)
    } else {
      this.operatorFormData()
      if (this.isPreview) {
        this.assessDiabled()
        return false
      }
      this.getInitInfo()
    }
  },
  mounted () {
  },
  methods: {
    // 初始化，获取初始化信息
    getInitInfo () {
      if (this.row) {
        return
      }
      this.valueData.map(item => {
        if (item.key == '1614756941000_80624' && !item.value) {
          item.value = moment().format('YYYY-MM-DD HH:mm:ss')
        }
        if (item.key == '1614756941000_72926' && !item.value) {
          item.value = this.empInfo.empName
        }
        if (item.key == '1614756941000_10666' && !item.value) {
          item.value = this.deptInfo.deptName
        }
        if (item.key == '1614756941000_67460' && !item.value) {
          item.value = moment().format('YYYY-MM-DD HH:mm:ss')
        }
        if (item.key == '1614756941000_89919' && !item.value) {
          item.value = this.patient.diagnose
        }
      })
    },
    // 获取模板
    getFormTmp () {
      this.data = JSON.parse(JSON.stringify(this.intoAssessTmp.moduleJson))
    },
    // 取消
    cancel () {
      this.$emit('option-changed', 'list', this.patient)
    },
    // 保存
    async save () {
      let params = {
        assId: this.intoAssessTmp.assId, // 评估单ID
        moduleId: this.intoAssessTmp.moduleId, // 模板ID
        moduleValue: this.valueData, // 评估值
        haveRecordRate: 0, // 是否多次记录
        assTimes: 1, // 评估次数
        patientId: this.patient.patientId // 患者ID
      }
      const columnValue = [{
        key: 'formCode',
        value: this.intoAssessTmp.assCode
      }]
      if (this.row) {
        params.assRecordId = this.row.ass_record_id
        delete params.haveRecordRate
      }
      params.columnValue = columnValue
      try {
        if (this.row) {
          let res = await ApiAssManage.edit(params)
          this.$message.success('编辑成功')
          this.$emit('option-changed', 'list', this.patient)
        } else {
          let res = await ApiAssManage.add(params)
          this.$message.success('添加成功')
          this.$emit('option-changed', 'list', this.patient)
        }
      } catch (error) {
        this.$message.error(error.message)
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.intoAssess-add {
  height: 100%;
  .intoAssess-add-content {
    width: 100%;
    height: calc(100% - 75px - 48px);
    overflow: auto;
    .print {
      display: flex;
      justify-content: flex-end;
      padding-right: 20px;
      padding-top: 13px;
      .print-btn {
        min-width: 78px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 2px !important;
        font-size: 14px !important;
        padding: 6px 12px !important;
        border: none;
      }
    }
  }
  .typt-add-footer {
    padding: 8px 0 7px;
    box-shadow: 0px 0px 6px 1px rgba(114, 114, 114, 0.3);
  }
}
</style>
