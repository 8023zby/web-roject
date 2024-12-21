<template>
  <div class="nrms-main-div">
    <layout class="nrms-blood-list">
      <div slot="right_btn" class="tool-bar" v-if="!isPreview">
        <el-button type="primary" size="small" @click="someIn">批量录入</el-button>
        <el-button type="success" size="small" @click="printDo">打印预览</el-button>
      </div>
      <div slot="main" class="main-list">
        <formHeader :autoHead="autoHead" v-if="showHead"></formHeader>
        <!--列表-->
        <el-table
          ref="table"
          :data="tableData"
          stripe
          border
          highlight-current-row
          v-loading="loading"
          height="100%"
        >
          <!-- <el-table-column type="index" label="序号" width="60" align="center">
            <template slot-scope="scope">
              <span>
                {{(search_from.page - 1) * search_from.size + scope.$index + 1}}
                <el-tooltip class="item" effect="dark" content="换页" placement="bottom">
                  <span class="isPage" v-if="scope.row.skipPage"></span>
                </el-tooltip>
              </span>
            </template>
          </el-table-column> -->

          <el-table-column
            prop="recordDate"
            align="center"
            width="130"
            label="日期"
          >
            <template slot-scope="scope">
              <span>{{scope.row.recordDate.substr(0,10)}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="recordDate"
            align="center"
            width="100"
            label="时间"
          >
            <template slot-scope="scope">
              <span>{{scope.row.recordDate.substring(11,16)}}</span>
            </template>
          </el-table-column>

          <!-- 递归列 -->
          <template v-for="item in titData">
            <column :signItem="item" :formCode="formCode" :key="item.id"></column>
          </template>

          <el-table-column
            label="护士签名"
            prop="patientName"
            width="116"
            align="center"
            class-name="autograph"
          >
            <template slot-scope="scope">
              <span class="sign_name" v-if="scope.row.nursingAutograph">
                <span class="text">
                  <template v-if="scope.row.nursingAutographImage">
                    <span><img :src="scope.row.nursingAutographImage" style="width: 100%; height: 100%"></span>
                  </template>
                  <template v-else>
                    <span style="text-align: left; padding-left: 2px">{{scope.row.nursingAutograph}}</span>
                  </template>

                  <template v-if="scope.row.userNameImage">
                    <span><img :src="scope.row.userNameImage" style="width: 100%; height: 100%"></span>
                  </template>
                  <template v-else>
                    <span style="text-align: right; padding-right: 2px">{{scope.row.userName}}</span>
                  </template>
                </span>
                <img class="line" src="../../../../assets/nrms/images/line.png">
              </span>
              <span v-else>
                <template v-if="scope.row.userNameImage">
                  <img :src="scope.row.userNameImage" style="width: 100%; height: 30px">
                </template>
                <template v-else>
                  {{scope.row.userName}}
                </template>
              </span>
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
                <el-button type="text" @click="modify(scope.row)">编辑</el-button>
                <el-button type="textred" @click="deleteNote(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>

      <!-- 分页 -->
      <div slot="footer" class="page-bar"  v-if="!isPreview">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="search_from.page"
          :page-size="search_from.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page_total"
        >
        </el-pagination>
      </div>
      <!--打印区域-->
      <div style="display: none" v-if="!isPreview">
        <print ref="print" :titData="titData" :formCode="search_from.formId" :patientId="search_from.patientId" :printSet="printSet" :autoHead="autoHead"></print>
      </div>
    </layout>
    <!-- 出院&&非出院召回 || 转科的患者不显示-->
    <template v-if="!btn_disable">
      <div class="el-col-add" style="padding-left: 0px;height: auto;" :style="{width: form_show_hide ? '437px' : 0, 'padding': form_show_hide ? '0 15px' : 0}" id="add_form">
        <el-button size="small" class="form_show_btn" @click="formShowHide">
          <i :class="form_show_hide ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
        </el-button>

        <el-form class="nrms-blood-add" :model="addFormData" :rules="rules" ref="addForm" label-width="98px" label-suffix="：">
          <el-form-item label="日期" prop="time">
            <el-date-picker
              v-model="addFormData.time"
              type="date"
              :clearable="false"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="请选择时间"
              style="width: 237px"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="时间" prop="hour">
            <el-time-picker
              v-model="addFormData.hour"
              :clearable="false"
              value-format="HH:mm"
              format="HH:mm"
              placeholder="请选择时间"
              style="width: 237px"
            >
            </el-time-picker>
          </el-form-item>

          <el-form-item v-for="(item,index) in titData" :key="item.signId" :label="item.signItemShowName">
            <el-input v-model="addFormData.extendList[item.signId]" :ref="'input' + index" @keyup.enter.native="handelTab(index,$event)" placeholder="请输入" style="width: 237px;margin-right: 7px;" :maxlength="item.signItemFieldLength" clearable></el-input>
            {{ item.signItemUnit }}
          </el-form-item>
        </el-form>

        <div class="typt-add-footer btn_footer" v-if="!isPreview">
          <el-button @click="reloadUrl">取消</el-button>
          <el-button type="primary" @click="submitForm">保存</el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>

import layout from '../../../../components/nrms/layout/list'
import { ApiAutoForm, ApiNurseNotes } from '../../../../api/nrms/index'
import formHeader from '../../../../components/nrms/autoForm/header' // 表单头样式
import print from './Print'
import moment from 'moment'
import column from '../column'

export default {
  name: 'MaiyangList',
  components: { layout, formHeader, print, column },
  mixins: [],
  props: ['patient', 'patientType', 'formCode', 'formId', 'isPreview'],
  watch: {
    patient: {
      handler (newValue, oldValue) {
        this.patientData = this.patient

        this.addFormData.patientId = this.patient.patientId
        this.search_from.patientId = this.patient.patientId
        this.search_from.page = 1

        this.reloadUrl()

        this.getFormInfo('update')
      }
    },
    'formId': {
      handler: function (val) {
        this.search_from.formId = val
        this.getFormInfo()
        this.getFixedItem()
      },
      immediate: true
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
      userName: '',
      titData: [],
      tableData: [],
      loading: false,
      search_from: {
        deptId: '',
        patientId: '',
        formId: '',
        size: 10,
        page: 1
      },
      page_total: 0,
      patientData: {},
      actFlag: 'add',
      form_show_hide: true,
      // 添加数据
      addFormData: {
        recordId: '',
        time: moment().format('YYYY-MM-DD'),
        hour: moment().format('HH:mm'),
        recordDate: moment().format('YYYY-MM-DD HH:mm'),
        conditionTxt: {},
        extendList: {},
        patientId: '',
        deptId: '',
        orgId: ''
      },
      rules: {
        time: [
          { required: true, message: '请选择日期！', trigger: 'change' }
        ],
        hour: [
          { required: true, message: '请选择时间！', trigger: 'change' }
        ]
      },
      url: '/nrms/web-nr/circumference',
      // 自动表头所用
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      },
      showHead: false,
      printSet: '' // 打印样式 横版或者竖版
    }
  },
  created () {
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.addFormData.deptId = deptInfo.deptId || ''

    let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || {}
    this.addFormData.orgId = orgInfo.orgId || ''

    this.search_from.deptId = deptInfo.deptId

    this.addFormData.userName = empInfo.empId
    this.userName = empInfo.empId
    this.search_from.patientId = this.patient.patientId

    this.addFormData.patientId = this.patient.patientId

    this.patientData = this.patient

    this.getFormInfo()
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
    getFixedItem () {
      ApiNurseNotes.getFixedListItem({ formId: this.formId }).then(res => {
        let items = res.data

        this.titData = items

        for (let v of this.titData) {
          this.$set(this.addFormData.extendList, v.signId, '')
        }
      })
    },
    deleteNote (row) {
      this.$confirm('确认要进行删除吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiNurseNotes.delete({ recordId: row.recordId })
          .then(() => {
            this.$message.success('删除成功！')
            this.getData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    handleSizeChange (val) {
      this.search_from.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.search_from.page = val
      this.getData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getData () {
      if (this.isPreview) return
      this.loading = true
      ApiNurseNotes.select(this.search_from).then((res) => {
        let list = res.data.list || []
        let newList = []

        list.forEach((v, index) => {
          let ob = {}

          let maxLen = 1
          let isArrItem = {}

          v.extendList.forEach(e => {
            if (e.itemValueArr) e.itemValue = e.itemValueArr[0]

            ob[e.itemId] = e
            if (e.itemValueArr && e.itemValueArr.length > 1) {
              if (e.itemValueArr.length > maxLen) maxLen = e.itemValueArr.length
              isArrItem[e.itemId] = e
            }
          })

          v.extendList = ob
          newList.push(v)
        })
        this.tableData = newList

        this.page_total = res.data.total
        this.loading = false
      })
    },
    submitForm () {
      this.loading = true
      this.addFormData.recordDate = this.addFormData.time + ' ' + this.addFormData.hour
      let _addFormData = JSON.parse(JSON.stringify(this.addFormData))

      _addFormData.userName = this.userName
      let _arr = []
      this.titData.forEach(v => {
        let obj = {}

        obj['itemId'] = v.signId
        obj['itemValue'] = _addFormData.extendList[v.signId]
        _arr.push(obj)
      })
      _addFormData['extendList'] = _arr

      ApiNurseNotes.save(_addFormData)
        .then(() => {
          this.$message.success('保存正确！')
          this.loading = false
          this.reloadUrl()
          this.getData()
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    someIn () {
      this.$emit('option-changed', 'addSign', {}, {}, this.titData)
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
    getFormInfo () { // 获取配置的字段（不是体征配置的）
      ApiAutoForm.getFormDict({ formId: this.formId }).then((res) => {
        if (res.data == null || res.data.length === 0) {
          this.$message.error('请先配置表单样式')
        } else {
          this.autoHead.tplData = this.patient || null
          this.autoHead.tplId = res.data.formCode || ''
          this.autoHead.formName = res.data.formName || ''
          this.autoHead.tplHtml = res.data.formStyle || ''

          this.search_from.formId = res.data.formCode || ''

          this.addFormData.formId = res.data.formId || ''
          this.printSet = this.formatPrintSet(res.data.printSet ? res.data.printSet : 1)// 默认纵向打印

          this.showHead = true

          this.getData()
        }
      })
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
      // 处理编辑数据
      row.time = row.recordDate.substr(0, 10)
      row.hour = row.recordDate.substr(11, 16)
      let data = JSON.parse(JSON.stringify(row))

      let _j = {}
      for (let item in data.extendList) {
        if (data.extendList[item].extendId) {
          _j[data.extendList[item]['itemId']] = data.extendList[item]['itemValue']
        }
      }
      data.extendList = _j

      this.addFormData = { ...data }
    },
    // 刷新页面
    reloadUrl () {
      this.actFlag = 'add'
      let obj = {
        recordId: '',
        recordDate: moment().format('YYYY-MM-DD HH:mm'),
        time: moment().format('YYYY-MM-DD'),
        hour: moment().format('HH:mm')
      }

      this.titData.map((v) => {
        this.$set(this.addFormData.extendList, v.signId, '')
      })

      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
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
    border-right: 1px solid #e6e6e6;
    height: 100%;
    width: 0;
    flex: 1;
  }

  .el-col-add {
    width: 350px;
    box-sizing: border-box;
    position: relative;
    transition: width 0.25s;
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

  .import-item-dialog {
    /deep/ .el-dialog__body {
      padding: 0;
      height: 900px;
    }

    /deep/ .el-form {
      .el-input {
        width: 200px !important;
      }

      .el-input__inner {
        width: 100%
      }
    }

    /deep/ .el-select {
      width: 100px;
    }
  }
  /deep/ .el-dialog {
    .el-input__inner {
      height: 30px;
    }
  }
</style>
