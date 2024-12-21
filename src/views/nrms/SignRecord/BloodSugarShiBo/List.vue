<template>
  <div class="nrms-main-div">
    <layout class="nrms-blood-list">
      <div slot="right_btn" class="tool-bar" v-if="!isPreview">
        <el-button v-uni="'tizhengjiluxuetangdan_qushitu'" type="primary" size="small" @click="$emit('option-changed', 'bloodSugarChartShibo',formObj)">血糖单趋势图</el-button>
        <el-button v-uni="'tizhengjiluxuetangdan_print'" type="success" size="small" @click="printDo">打印</el-button>
      </div>
      <div slot="main" class="main-list">
        <formHeader :autoHead="autoHead" v-if="showHead"></formHeader>
        <!--列表-->
        <el-table
          ref="table"
          :data="tableData"
          stripe
          highlight-current-row
          v-loading="loading"
          height="100%"
        >
          <el-table-column
            prop="recordDate"
            align="center"
            width="140"
            label="日期"
          >
            <template slot-scope="scope">
              <span>{{ getDate(tableData[scope.$index - 1] ? tableData[scope.$index - 1].recordDate.substr(0,10) : '' ,scope.row.recordDate.substr(0,10)) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="recordDate"
            align="center"
            width="120"
            label="时间"
          >
            <template slot-scope="scope">
              <span>{{scope.row.recordDate && scope.row.recordDate.substr(11,5)}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-for="item in titData"
            :prop="item.prop"
            align="center"
            min-width="120"
            :show-overflow-tooltip="true"
            :key="item.id"
          >
            <template slot="header">
              <div v-if="item.unit">{{item.name}} <br /> ({{item.unit}})</div>
              <div v-else>{{item.name}}</div>
            </template>
          </el-table-column>

          <template v-if="!btn_disable">
            <el-table-column
              fixed="right"
              align="center"
              label="操作"
              width="150"
            >
              <template slot-scope="scope">
                <el-button type="text" v-uni:[scope.row.recordId]="'tizhengjiluxuetangdan_edit'" @click="modify(scope.row)">编辑</el-button>
                <el-button type="textred" v-uni:[scope.row.recordId]="'tizhengjiluxuetangdan_delete'" @click="del(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>

      <!--组件页码显示-->
      <page-info v-if="!isPreview" :pageInfo="pageInfo" @onSearchSubmit="onSearchSubmit" slot="footer" class="page-bar"></page-info>
      <!--打印区域-->
      <div style="display: none">
        <print ref="print" :titData="titData" :formCode="this.formSearchDataStatic.formCode" :patientId="formSearchDataStatic.patientId" :printSet="printSet" :autoHead="autoHead"></print>
      </div>
    </layout>
    <!-- 出院&&非出院召回 || 转科的患者不显示-->
    <template v-if="!btn_disable && !isPreview">
      <div class="el-col-add absolute" :style="{right:form_show_hide ? '-437px': 0}" id="add_form">
        <el-button v-uni="'tizhengjilutiwendan_tizhengxiangluru_expend'" size="small" class="form_show_btn" @click="formShowHide">
          <i :class="form_show_hide ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
        </el-button>

        <el-form v-uni="'tizhengjiluxuetangdan_form'" class="nrms-blood-add" :model="addFormData" :rules="rules" ref="addForm" label-width="98px" label-suffix=":">
          <el-form-item label="日期" prop="time">
            <el-date-picker
                    v-uni="'tizhengjiluxuetangdan_date'"
              v-model="addFormData.time"
              type="date"
              :clearable="false"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="请选择时间"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="时间" prop="hour">
            <el-time-picker
                    v-uni="'tizhengjiluxuetangdan_time'"
              v-model="addFormData.hour"
              :clearable="false"
              value-format="HH:mm"
              format="HH:mm"
              placeholder="请选择时间"
            >
            </el-time-picker>
          </el-form-item>

          <el-form-item label="测量结果" prop="bloodVal">
            <el-input v-uni="'tizhengjiluxuetangdan_celiangjieguo'" v-model="addFormData.bloodVal" placeholder="请输入" style="margin-right: 7px;" maxlength="10"></el-input>
            <span>mmol/L</span>
          </el-form-item>

          <el-form-item label="备注">
            <el-input v-uni="'tizhengjiluxuetangdan_remark'" type="textarea" rows="3" v-model="addFormData.remark" placeholder="请输入" style="margin-right: 7px;" maxlength="20" show-word-limit></el-input>
          </el-form-item>
        </el-form>

        <div class="typt-add-footer btn_footer" v-if="!isPreview">
          <el-button v-uni="'tizhengjiluxuetangdan_cancel'" @click="reloadUrl">取消</el-button>
          <el-button v-uni="'tizhengjiluxuetangdan_save'" type="primary" @click="beforeSaveData" :loading="addVis">保存</el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import BaseManage from '../../../../assets/nrms/mixins/BaseManage'
import PageInfo from '../../../../components/nrms/PageInfo'
import layout from '../../../../components/nrms/layout/list'
import { ApiAutoForm } from '../../../../api/nrms/index'
import formHeader from '../../../../components/nrms/autoForm/header' // 表单头样式
import print from './Print'
import moment from 'moment'

export default {
  name: 'BloodSugarList',
  components: { PageInfo, layout, formHeader, print },
  mixins: [BaseManage],
  props: ['patient', 'patientType', 'formObj', 'isPreview'],
  watch: {
    patient: {
      handler (newValue, oldValue) {
        this.formSearchDataStatic.patientId = this.patient.patientId
        this.addFormData.patientId = this.patient.patientId
        this.pageInfo.currentPage = 1
        this.reloadUrl()

        this.getFormInfo('update')
      }
    }
  },
  computed: {
    btn_disable: function () {
      // 出院&&非出院召回 || 转科
      if ((this.patientType === 2 && this.patient.outHospitalFlag !== 1) || this.patientType === 1) {
        return true
      }
      return false
    }
  },
  data () {
    return {
      actFlag: 'add',
      form_show_hide: true,
      // 添加数据
      addFormData: {
        time: moment().format('YYYY-MM-DD'),
        hour: moment().format('HH:mm'),
        recordId: '',
        recordTime: moment().format('YYYY-MM-DD HH:mm'),
        patientId: '',
        deptId: '',
        orgId: '',
        bloodVal: '',
        remark: ''
      },
      rules: {
        time: [
          { required: true, message: '请选择日期！' }
        ],
        hour: [
          { required: true, message: '请选择时间！' }
        ],
        bloodVal: [
          { required: true, message: '请填写测量结果！' }
        ]
      },
      titData: [
        {
          id: '1',
          name: '血糖值',
          prop: 'bloodVal',
          unit: 'mmol/L'
        },
        {
          id: '2',
          name: '测量者',
          prop: 'userName',
          extend: true
        },
        {
          id: '3',
          name: '备注',
          prop: 'remark',
          extend: true
        }
      ],
      modelName: '血糖记录',
      formSearchDataStatic: {
        patientId: '',
        formCode: ''
      },
      url: '/nrms/web-nr/glucose',
      // 自动表头所用
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      },
      showHead: false,
      printSet: '', // 打印样式 横版或者竖版
      empInfo: '',
      printList: '',
      printColumnNum: 0
    }
  },
  created () {
    this.empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}

    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.addFormData.deptId = deptInfo.deptId || ''

    let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || {}
    this.addFormData.orgId = orgInfo.orgId || ''

    this.addFormData.patientId = this.patient.patientId
    this.formSearchDataStatic.patientId = this.patient.patientId

    this.getFormInfo()
  },
  updated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })
  },
  activated () {
    // this.getData()
  },
  methods: {
    beforeSaveData () { // 处理 recordTime
      this.addFormData.recordTime = this.addFormData.time + ' ' + this.addFormData.hour
      this.addFormData.userName = this.empInfo.empName
      this.saveData()
    },
    getFormInfo (_type) {
      let _patient = JSON.parse(JSON.stringify(this.patient))
      if (_patient.inTime) {
        _patient.inTime = _patient.inTime.substr(0, 10)
      }
      this.autoHead.tplData = _patient

      if (_type !== 'update') {
        ApiAutoForm.getFormDictByType({ formType: this.formObj.formType }).then((res) => {
          if (res.data == null) {
            this.$message.error('请先配置表单样式')
          } else {
            res.data.map((v) => {
              if (v.formId === this.formObj.formId) {
                this.autoHead.tplId = v.formCode || ''
                this.formSearchDataStatic.formCode = v.formCode || ''
                this.autoHead.formName = v.formName || ''
                this.autoHead.tplHtml = v.formStyle || ''

                this.formObj.formId = v.formId || ''
                this.addFormData.formId = v.formId || ''
                this.printSet = this.formatPrintSet(v.printSet ? v.printSet : 1)// 默认纵向打印
                this.getData()
              }
            })

            this.showHead = true
          }
        })
      }
    },
    getDate (lastDate, nowDate) { // 如果当前日期换月了，体现全部，否则只显示日
      if (!nowDate) {
        return ''
      }
      if (!lastDate) {
        return nowDate
      }
      let lastDateMonth = moment(lastDate).month()
      let nowDateMonth = moment(nowDate).month()
      let lastDateYear = moment(lastDate).year()
      let nowDateYear = moment(nowDate).year()
      if ((lastDateMonth === nowDateMonth) && (lastDateYear === nowDateYear)) {
        return moment(nowDate).date() < 10 ? '0' + moment(nowDate).date() : moment(nowDate).date()
      } else {
        return nowDate
      }
    },
    // 格式化打印方式
    formatPrintSet (_printSet) {
      let a = ''
      switch (_printSet) {
        case 1:
          a = 'portrait'
          break
        case 2:
          a = 'landscape'
          break
        default:
          a = 'portrait'
          break
      }
      return a
    },
    formShowHide () {
      this.form_show_hide = !this.form_show_hide
    },
    // 修改
    modify (row) {
      this.actFlag = 'modify'
      let data = JSON.parse(JSON.stringify(row))
      data.time = data.recordTime.substr(0, 10)
      data.hour = data.recordTime.substr(11, 5)
      this.addFormData = { ...data }
    },
    // 刷新页面
    reloadUrl () {
      this.addVis = false
      this.actFlag = 'add'
      let obj = {
        recordId: '',
        recordTime: moment().format('YYYY-MM-DD HH:mm'),
        time: moment().format('YYYY-MM-DD'),
        hour: moment().format('HH:mm')
      }

      this.titData.map((v) => {
        this.$set(obj, v.prop, '')
      })

      this.$nextTick(() => {
        this.$refs.addForm && this.$refs.addForm.resetFields()
        this.addFormData = Object.assign(this.addFormData, obj)
        this.getData()
      })
    },
    // 打印
    printDo () {
      this.$refs.print.print()
    }
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/nrms/css/self_common";

  @media screen and (max-width: 1550px) {
    .form_show_btn {
      display: inline-block !important;
    }
    .el-col-add.absolute {
      position: absolute;
      right: 0;
      z-index: 100;
      background-color: #fff;

      .form_show_btn {
        display: inline-block;
      }
    }
  }

  .form_show_btn {
    display: none;
    position: absolute;
    top: 80px;
    left: -22px;
    padding: 7px 3px !important;
    background-color: #fff;
    z-index: 9;
    color: #1E87F0;
    border-color: #1E87F0;
    border-radius: 0 !important;
    border-right: none;
  }

  .nrms-main-div {
    width: 100%;
    height: 100%;
    display: flex;
  }

  /deep/ .main-list {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;

    .el-table {
      flex: 1;
    }
  }

  /deep/ .el-pagination.is-background .btn-next.disabled,
  /deep/ .el-pagination.is-background .btn-next:disabled,
  /deep/ .el-pagination.is-background .btn-prev.disabled,
  /deep/ .el-pagination.is-background .btn-prev:disabled,
  /deep/ .el-pagination.is-background .el-pager li.disabled {
    color: #fff;
  }

  .nrms-blood-add {
    margin-top: 30px;

    /deep/ .el-form-item__label {
      padding-right: 8px;
    }

    /deep/ .el-form-item {
      margin-bottom: 30px;
    }
  }

  .nrms-blood-list {
    height: 100%;
    width: 0;
    flex: 1;
  }

  .el-col-add {
    width: 437px;
    height:100%;
    transition: all .25s;
    padding: 0 0 0 15px;
    border-left: 1px solid #e6e6e6;
    /deep/ .el-input,
    /deep/ .el-select,
    /deep/ .el-textarea {
      width: 235px;
    }
  }

  /*打印内容样式*/
  .nrms-blood-print {
    width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .nrms-blood-print-table {
    width: 100%;

    th {
      font-size: 14px;
      height: 20px;
      text-align: center;
      font-weight: normal;
    }

    td {
      font-size: 12px;
      text-align: center;
      height: 30px;
      font-weight: normal;
    }
  }

  .nrms-table-td {
    border-top: 1px solid #525252;
    border-left: 1px solid #525252;
  }

  .nrms-table-td-bottom {
    border-bottom: 1px solid #525252;
  }

  .nrms-table-td-right {
    border-right: 1px solid #525252;
  }

  .btn_footer {
    margin-top: 30px;
  }

  @media print {
    .page {
      td {
        border: 1px solid #FFFFFF;
      }
    }
    INPUT {
      display: none
    }
    table {
      page-break-after: always;
    }
    thead {
      display: table-header-group;
    }
    body {
      -webkit-print-color-adjust: exact;
    }
  }
</style>
