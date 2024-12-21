<template>
  <div class="nrms-main-div">
    <layout class="nrms-blood-list">
      <div slot="right_btn" class="tool-bar" v-if="!isPreview">
        <el-button v-uni="'tizhengjiluxuetangdan_qushitu'" type="primary" size="small" @click="$emit('option-changed', 'blood_sugar_chart')">血糖单趋势图</el-button>
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
          <!-- <el-table-column
            type="index"
            align="center"
            width="120"
            label="序号"
          >
            <template slot-scope="scope">
              <span>{{(pageInfo.currentPage - 1) * pageInfo.size + scope.$index + 1}}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="recordTime"
            align="center"
            width="150"
            label="时间"
          >
            <template slot-scope="scope">
              <span>{{scope.row.recordTime.substr(0,16)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="血糖测量结果（mmol/L）" align="center">
            <el-table-column
              v-for="(item, index) in titData"
              :prop="item.id+'_rs'"
              align="center"
              :show-overflow-tooltip="true"
              :formatter="formatterTit"
              :key="index"
              :label="item.label"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="glucometerNumber"
            v-if="isGlucoseMeter"
            align="center"
            :show-overflow-tooltip="true"
            width="110"
            label="血糖仪编号"
          >
          </el-table-column>
          <el-table-column
            prop="nurseName"
            width="110"
            align="center"
            class-name="autograph"
            :show-overflow-tooltip="true"
            label="护士签名"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.nurseNameImage">
                <img :src="scope.row.nurseNameImage" style="width: 100%; height: 30px">
              </template>
              <template v-else>
                {{scope.row.nurseName}}
              </template>
            </template>
          </el-table-column>
          <!-- 2020-12-25 世博血糖单增加备注字段 -->
          <template v-if="autoHead.tplId === 'H-000010-WXT-0001'">
            <el-table-column
              prop="remark"
              align="center"
              show-overflow-tooltip
              width="100"
              label="备注"
            >
            </el-table-column>
          </template>
          <template v-if="!btn_disable">
            <el-table-column
              fixed="right"
              align="center"
              label="操作"
              width="150"
            >
              <template slot-scope="scope">
                <el-button v-uni:[scope.row.recordId]="'tizhengjiluxuetangdan_edit'" type="text" @click="modify(scope.row)">编辑</el-button>
                <el-button v-uni:[scope.row.recordId]="'tizhengjiluxuetangdan_delete'" type="textred" @click="del(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>

      <!--组件页码显示-->
      <page-info v-if="!isPreview" :pageInfo="pageInfo" @onSearchSubmit="onSearchSubmit" slot="footer" class="page-bar"></page-info>
      <!--打印区域-->
      <div style="display: none" v-if="!isPreview">
        <print ref="print" :isGlucoseMeter="isGlucoseMeter" :titData="titData"
               :patientId="formSearchDataStatic.patientId" :printSet="printSet" :autoHead="autoHead"></print>
      </div>
    </layout>
    <!-- 出院&&非出院召回 || 转科的患者不显示-->
    <template v-if="!btn_disable && !isPreview">
      <div class="el-col-add absolute" :style="{right:form_show_hide ? '-437px': 0}" id="add_form">
        <el-button v-uni="'tizhengjilutiwendan_tizhengxiangluru_expend'" size="small" class="form_show_btn" @click="formShowHide">
          <i :class="form_show_hide ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
        </el-button>
        <el-form v-uni="'tizhengjiluxuetangdan_form'" class="nrms-blood-add" :model="addFormData" :rules="rules" ref="addForm" label-width="98px">
          <el-form-item label="时间:" prop="recordTime">
            <el-date-picker
                    v-uni="'tizhengjiluxuetangdan_time'"
              v-model="addFormData.recordTime"
              type="datetime"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              placeholder="请选择时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="测量时刻:" prop="measurePeriod">
            <el-select v-uni="'tizhengjiluxuetangdan_celiangshike'" v-model="addFormData.measurePeriod" placeholder="请选择" size="small" clearable>
              <el-option v-for="(item, index) in titData" :key="index" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="测量结果:" prop="measureResult">
            <el-input v-uni="'tizhengjiluxuetangdan_celiangjieguo'" v-model="addFormData.measureResult" placeholder="测量结果" style="margin-right: 7px;"
                      clearable></el-input>
            mmol/L
          </el-form-item>
          <el-form-item label="血糖仪编号:" prop="glucometerNumber" v-if="isGlucoseMeter">
            <el-input v-uni="'tizhengjiluxuetangdan_xuetangyibianhao'" v-model="addFormData.glucometerNumber" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <!-- 2020-12-25 世博血糖单增加备注字段 -->
          <template v-if="autoHead.tplId === 'H-000010-WXT-0001'">
            <el-form-item label="备注:" prop="remark">
              <el-input
                      v-uni="'tizhengjiluxuetangdan_remark'"
                      type="textarea"
                        maxlength="50"
                        show-word-limit
                        v-model="addFormData.remark" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </template>
          <!--<el-form-item label="护士签名:" prop="nurseName">-->
          <!--<el-input disabled v-model="addFormData.nurseName" placeholder="请输入护士签名" clearable></el-input>-->
          <!--</el-form-item>-->
        </el-form>
        <div class="typt-add-footer btn_footer" v-if="!isPreview">
          <el-button v-uni="'tizhengjiluxuetangdan_cancel'" @click="reloadUrl">取消</el-button>
          <el-button v-uni="'tizhengjiluxuetangdan_save'" type="primary" @click="saveData" :loading="addVis">保存</el-button>
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
import formHeader from '../../../../components/nrms/autoForm/header'
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
        this.patientData = this.patient
        this.formSearchDataStatic.patientId = this.patient.patientId
        this.addFormData.patientId = this.patient.patientId
        this.pageInfo.currentPage = 1
        this.reloadUrl()
        this.getData()
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
    let checkData = (rule, value, callback) => {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error('血糖仪编号不能含有汉字!'))
        } else {
          callback()
        }
      }
      callback()
    }
    return {
      patientData: {},
      actFlag: 'add',
      form_show_hide: true,
      // 添加数据
      addFormData: {
        recordId: '',
        recordTime: moment().format('YYYY-MM-DD HH:mm'),
        measurePeriod: '',
        measureResult: '',
        glucometerNumber: '',
        nurseName: '',
        patientId: '',
        deptId: '',
        orgId: '',
        // 2020-12-25 世博医院增加备注
        remark: ''
      },
      deptName: '',
      rules: {
        recordTime: [
          { required: true, message: '请选择时间！' }
        ],
        measurePeriod: [
          { required: true, message: '请选择测量时刻！' }
        ],
        nurseName: [
          { required: true, message: '请填写护士签名！' }
        ],
        glucometerNumber: [
          { validator: checkData, trigger: 'blur' },
          { message: '血糖仪编号长度不超过20个字符！', trigger: 'blur', pattern: /^.{0,20}$/ }
        ],
        measureResult: [
          { required: true, message: '请填写正确的血糖测量结果！', trigger: 'blur', pattern: /^\d+(\.\d+)?$/ },
          { message: '血糖测量结果长度不超过5个字符！', trigger: 'blur', pattern: /^.{0,5}$/ }
        ]
      },
      titData: [{
        id: '1',
        label: '临时'
      },
      {
        id: '2',
        label: '空腹'
      },
      {
        id: '3',
        label: '早餐后'
      },
      {
        id: '4',
        label: '午餐前'
      }, {
        id: '5',
        label: '午餐后'
      },
      {
        id: '6',
        label: '晚餐前'
      },
      {
        id: '7',
        label: '晚餐后'
      }, {
        id: '8',
        label: '睡前'
      },
      {
        id: '9',
        label: '夜间'
      }],
      modelName: '血糖记录',
      formSearchDataStatic: {
        patientId: ''
      },
      url: '/nrms/web-nr/glucometer-record',
      // 自动表头所用
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      },
      showHead: false,
      nurseName: '',
      printSet: '', // 打印样式 横版或者竖版
      isGlucoseMeter: null// 是否显示血糖仪编号
    }
  },
  created () {
    let obj = JSON.parse(localStorage.getItem('empInfo')) || {}
    this.addFormData.nurseName = obj.empId || ''
    this.nurseName = obj.empId || ''
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.addFormData.deptId = deptInfo.deptId || ''
    let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || {}
    this.addFormData.orgId = orgInfo.orgId || ''
    this.deptName = deptInfo.deptName || ''
    this.addFormData.patientId = this.patient.patientId
    this.formSearchDataStatic.patientId = this.patient.patientId
    this.patientData = this.patient
    this.getFormInfo()
    this.getData()
  },
  updated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })
  },
  activated () {
    this.getData()
  },
  methods: {
    getFormInfo (_type) {
      console.log('getFormInfo_4')
      if (_type === 'update') {
        this.autoHead.tplData = this.patient || null
      } else {
        this.autoHead.tplData = this.patient || null
        this.autoHead.tplId = this.formObj.formCode || ''
        this.autoHead.formName = this.formObj.formName || ''
        this.autoHead.tplHtml = this.formObj.formStyle || ''
        this.printSet = this.formatPrintSet(this.formObj.printSet ? this.formObj.printSet : 1)// 默认纵向打印
        this.showHead = true
        this.isGlucoseMeter = 0
        if (this.formObj.remarks) {
          if (this.formObj.remarks.glucoseMeter) {
            this.isGlucoseMeter = this.formObj.remarks ? this.formObj.remarks.glucoseMeter : 0
          }
        }
      }
    },
    formShowHide () {
      this.form_show_hide = !this.form_show_hide
    },
    // 格式化数据
    formatterTit (row, column) {
      // 暂时将数据库返回的血糖配置项 临时对应为1  后期走配置项
      let item = row.measurePeriod
      switch (item) {
        case '临时':
          row.measurePeriod = '1'
          break
        case '空腹':
          row.measurePeriod = '2'
          break
        case '早餐后':
          row.measurePeriod = '3'
          break
        case '午餐前':
          row.measurePeriod = '4'
          break
        case '午餐后':
          row.measurePeriod = '5'
          break
        case '晚餐前':
          row.measurePeriod = '6'
          break
        case '晚餐后':
          row.measurePeriod = '7'
          break
        case '睡前':
          row.measurePeriod = '8'
          break
        case '夜间':
          row.measurePeriod = '9'
          break
        default:
          row.measurePeriod = row.measurePeriod
          break
      }
      if (column.property === row.measurePeriod + '_rs') {
        return row.measureResult || ''
      } else {
        return ''
      }
    },
    // 修改
    modify (row) {
      this.actFlag = 'modify'
      let data = JSON.parse(JSON.stringify(row))
      data.nurseName = this.nurseName
      this.addFormData = { ...data }
    },
    // 刷新页面
    reloadUrl () {
      this.addVis = false
      this.actFlag = 'add'
      let obj = {
        recordId: '',
        recordTime: moment().format('YYYY-MM-DD HH:mm'),
        measurePeriod: '',
        measureResult: '',
        glucometerNumber: ''
      }
      this.$nextTick(() => {
        this.$refs.addForm && this.$refs.addForm.resetFields()
        this.addFormData = Object.assign(this.addFormData, obj)
        this.getData()
      })
    },
    // 打印table相关
    // 数据处理
    getResult (item, key) {
      // console.log(item.measurePeriod+','+item.measureResult+','+key)
      if (item.measurePeriod === key) {
        return this.strSub((item.measureResult || ''), 5)
      } else {
        return ''
      }
    },
    // 字符串截取
    strSub (str, len) {
      if (str === null || str === '') {
        return ''
      }
      return ('' + str).substring(0, len)
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
    // 打印
    printDo () {
      this.$refs.print.print()
    }
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/nrms/css/self_common";

  /* 签名 */
  /deep/ .autograph {
    padding: 0 !important;
  }

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

  /deep/ .tool-btn {
    border-bottom: 1px solid #E4E7ED;
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
    margin-top: 40px;

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
    margin: 10px 0;
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
