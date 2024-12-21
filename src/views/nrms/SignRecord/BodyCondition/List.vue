<template>
  <div class="nrms-main-div">
    <layout class="nrms-blood-list">
      <div slot="right_btn" class="tool-bar" v-if="!isPreview">
        <el-button  v-uni="'tizhengjilutiweidan_print'" type="success" size="small" @click="printDo">打印</el-button>
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
            width="100"
            label="序号"
          >
            <template slot-scope="scope">
              <span>{{(pageInfo.currentPage - 1) * pageInfo.size + scope.$index + 1}}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="recordTime"
            align="center"
            width="130"
            label="时间"
          >
            <template slot-scope="scope">
              <span>{{scope.row.recordTime && scope.row.recordTime.substr(0,16)}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-for="item in titData"
            :prop="item.prop"
            align="center"
            :show-overflow-tooltip="true"
            :key="item.id"
            :label="item.name"
          >
          </el-table-column>

          <el-table-column
            prop="userName"
            align="center"
            min-width="130"
            label="记录人"
          >
          </el-table-column>

          <template v-if="!btn_disable">
            <el-table-column
              fixed="right"
              align="center"
              label="操作"
              width="150"
            >
              <template slot-scope="scope">
                <el-button v-uni:[scope.row.recordId]="'tizhengjilutiweidan_edit'" type="text" @click="modify(scope.row)">编辑</el-button>
                <el-button v-uni:[scope.row.recordId]="'tizhengjilutiweidan_delete'" type="textred" @click="del(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>

      <!--组件页码显示-->
      <page-info v-if="!isPreview" :pageInfo="pageInfo" @onSearchSubmit="onSearchSubmit" slot="footer" class="page-bar"></page-info>
      <!--打印区域-->
      <div style="position: fixed;top: 10000px;z-index: -1000;">
        <print ref="print" :titData="titData" :formCode="formSearchDataStatic.formCode" :patientId="formSearchDataStatic.patientId" :printSet="printSet" :autoHead="autoHead"></print>
      </div>
    </layout>
    <!-- 出院&&非出院召回 || 转科的患者不显示-->
    <template v-if="!btn_disable && !isPreview">
      <div class="el-col-add absolute" :style="{right:form_show_hide ? '-437px': 0}" id="add_form">
        <el-button v-uni="'tizhengjilutiweidan_expand'" size="small" class="form_show_btn" @click="formShowHide">
          <i :class="form_show_hide ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
        </el-button>

        <el-form v-uni="'tizhengjilutiweidan_form'" class="nrms-blood-add" :model="addFormData" :rules="rules" ref="addForm" label-width="98px" label-suffix=":">
          <el-form-item label="时间" prop="recordTime">
            <el-date-picker
                    v-uni="'tizhengjilutiweidan_time'"
              v-model="addFormData.recordTime"
              type="datetime"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              placeholder="请选择时间"
            >
            </el-date-picker>
          </el-form-item>

          <!-- 循环生成体围单表单 -->
          <el-form-item v-for="(item,index) in titData" :key="item.id" :label="item.name">
            <el-input  v-uni:[index]="'tizhengjilutiweidan_tiwei'" v-model="addFormData[item.prop]" :ref="'input' + index" @keyup.enter.native="handelTab(index,$event)" placeholder="请输入" style="margin-right: 7px;" :maxlength="item.signItemFieldLength" show-word-limit clearable></el-input>
          </el-form-item>
        </el-form>

        <div class="typt-add-footer btn_footer" v-if="!isPreview">
          <el-button v-uni="'tizhengjilutiweidan_cancel'" @click="reloadUrl">取消</el-button>
          <el-button v-uni="'tizhengjilutiweidan_save'" type="primary" @click="saveData" :loading="addVis">保存</el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import BaseManage from '../../../../assets/nrms/mixins/BaseManage'
import PageInfo from '../../../../components/nrms/PageInfo'
import layout from '../../../../components/nrms/layout/list'
import { ApiAutoForm, ApiSignBodyItem } from '../../../../api/nrms/index'
import formHeader from '../../../../components/nrms/autoForm/header' // 表单头样式
import print from './Print'
import moment from 'moment'

export default {
  name: 'BloodSugarList',
  components: { PageInfo, layout, formHeader, print },
  mixins: [BaseManage],
  props: ['patient', 'patientType', 'isPreview'],
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
      doneFlag: false,
      actFlag: 'add',
      form_show_hide: true,
      // 添加数据
      addFormData: {
        recordId: '',
        recordTime: moment().format('YYYY-MM-DD HH:mm'),
        patientId: '',
        deptId: '',
        orgId: ''
      },
      rules: {
        recordTime: [
          { required: true, message: '请选择时间！' }
        ]
      },
      titData: [],
      modelName: '体围记录',
      formSearchDataStatic: {
        patientId: '',
        formCode: ''
      },
      url: '/nrms/web-nr/circumference',
      // 自动表头所用
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {},
        hospitalLogo: ''
      },
      formObj: {
        formType: 9,
        formId: ''
      },
      showHead: false,
      printSet: '' // 打印样式 横版或者竖版
    }
  },
  created () {
    this.getFieldsData()

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
    this.checkDo()
  },
  methods: {
    checkDo () {
      if (this.doneFlag) {
        this.getData()
      } else {
        setTimeout(() => {
          this.checkDo()
        }, 100)
      }
    },
    handelTab (i, e) { // 增加enter切换到下一个input
      let that = this
      if (that.$refs['input' + i]) {
        that.$nextTick(() => {
          e.target.blur()
          let index = i + 1

          if (that.$refs['input' + index] && that.$refs['input' + index][0]) {
            that.$refs['input' + index][0].focus()
          } else if (that.$refs['input' + index]) {
            that.$refs['input' + index].focus()
          }
        })
      }
    },
    getFieldsData () { // 获取字段数据
      let searchForm = {
        signClassifyId: 5
      }
      ApiSignBodyItem.selectTh(searchForm).then((res) => {
        if (res.data && res.data[0] && res.data[0].childrenSignItem) {
          this.titData = res.data[0].childrenSignItem.map((v) => {
            this.$set(this.addFormData, v.signItemFieldName, '')

            return {
              id: v.signId,
              name: v.signItemShowName,
              prop: v.signItemFieldName,
              signItemFieldLength: v.signItemFieldLength
            }
          })
        }
      })
        .catch((res) => {
          this.$message.error(res.message)
        })
    },
    getFormInfo (_type) {
      if (_type === 'update') {
        this.autoHead.tplData = this.patient || null
      } else {
        ApiAutoForm.getFormDictByType({ formType: this.formObj.formType }).then((res) => {
          if (res.data == null) {
            this.$message.error('请先配置表单样式')
          } else {
            this.autoHead.tplData = this.patient || null
            this.autoHead.tplId = res.data.formCode || ''
            this.autoHead.formName = res.data.formName || ''
            this.autoHead.tplHtml = res.data.formStyle || ''
            this.autoHead.hospitalLogo = res.data.logoUrl || '' // 传logo图
            this.formSearchDataStatic.formCode = res.data.formCode || ''
            this.formObj.formId = res.data.formId || ''
            this.addFormData.formId = res.data.formId || ''
            this.printSet = this.formatPrintSet(res.data.printSet ? res.data.printSet : 1)// 默认纵向打印

            this.showHead = true
            this.doneFlag = true
          }
        })
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
      this.addFormData = { ...data }
    },
    // 刷新页面
    reloadUrl () {
      this.addVis = false
      this.actFlag = 'add'
      let obj = {
        recordId: '',
        recordTime: moment().format('YYYY-MM-DD HH:mm')
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
