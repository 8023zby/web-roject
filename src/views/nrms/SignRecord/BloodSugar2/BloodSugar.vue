<template>
  <div class="nrms-main-div">
    <layout class="nrms-blood-list">
      <div slot="right_btn" class="tool-bar" v-if="!isPreview">
        <el-button
                v-uni="'tizhengjiluxuetangdan_qushitu'"
          type="primary"
          size="small"
          @click="
            $emit('option-changed', 'blood_sugar_chart2', { formObj: formObj })
          "
          >血糖单趋势图
        </el-button>
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
          height="100%"
          :span-method="objectSpanMethod"
        >
          <el-table-column
            prop="recordDate"
            align="center"
            label="日期"
            width="120"
          >
          </el-table-column>
          <el-table-column prop="proj" align="center" label="项目" width="120">
            <template slot-scope="scope">
              <span v-html="scope.row.proj"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="早餐">
            <el-table-column prop="zaocanqian" align="center" label="前">
            </el-table-column>
            <el-table-column prop="zaocanhou" align="center" label="后">
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="午餐">
            <el-table-column prop="wucanqian" align="center" label="前">
            </el-table-column>
            <el-table-column prop="wucanhou" align="center" label="后">
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="晚餐">
            <el-table-column prop="wancanqian" align="center" label="前">
            </el-table-column>
            <el-table-column prop="wancanhou" align="center" label="后">
            </el-table-column>
          </el-table-column>
          <template v-for="(item, index) in formDictExtendDoList">
            <el-table-column
              :prop="item.fieldName"
              align="center"
              :label="item.projectName"
              :key="index"
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
                <el-button v-uni:[scope.row.recordId]="'tizhengjiluxuetangdan_edit'" type="text" @click="modify(scope.row)"
                  >编辑</el-button
                >
                <el-button v-uni:[scope.row.recordId]="'tizhengjiluxuetangdan_delete'" type="textred" @click="del(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
      <page-info v-if="!isPreview"
        :pageInfo="searchForm"
        @onSearchSubmit="getList"
        slot="footer"
        class="page-bar"
      ></page-info>

      <!--打印区域-->
      <div style="display: none">
        <print
          ref="print"
          :formDictExtendDoList="formDictExtendDoList"
          :patientId="searchForm.patientId"
          :printSet="printSet"
          :autoHead="autoHead"
          :formCode="searchForm.formCode"
        ></print>
      </div>

      <!--组件页码显示-->
      <!--打印区域-->
    </layout>
    <!-- 出院&&非出院召回 || 转科的患者不显示-->
    <template v-if="!isPreview">
      <div
        class="el-col-add absolute"
        :style="{right:form_show_hide ? '-437px': 0}"
        id="add_form"
      >
        <el-button v-uni="'tizhengjilutiwendan_tizhengxiangluru_expend'" size="small" class="form_show_btn" @click="formShowHide">
          <i
            :class="
              form_show_hide ? 'el-icon-arrow-left' : 'el-icon-arrow-right'
            "
          ></i>
        </el-button>
        <el-form
                v-uni="'tizhengjiluxuetangdan_form'"
          class="nrms-blood-add"
          :model="addFormData"
          :rules="rules"
          ref="addForm"
          label-width="98px"
        >
          <el-form-item label="时间:" prop="recordDate">
            <el-date-picker
                    v-uni="'tizhengjiluxuetangdan_time'"
              v-model="addFormData.recordDate"
              type="date"
              :clearable="false"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="请选择时间"
              @keydown.native="nextFocus"
            >
            </el-date-picker>
          </el-form-item>
          <template v-for="(item, index) in addFormData.signList">
            <el-form-item
              :label="item.signName + ':'"
              :prop="item.signId"
              :key="'sign' + index"
            >
              <el-input
                      v-uni:[item.signId]="'tizhengjiluxuetangdan_signName'"
                v-model="item.signValue"
                placeholder="请输入"
                style="margin-right: 7px"
                clearable
                :maxlength="item.length || 5"
                @change="onSignChange(item.signValue, index)"
                @keydown.native="nextFocus"
              ></el-input>
              mmol/L
            </el-form-item>
            <el-form-item
              label="测量者:"
              :prop="addFormData.extend[index].extendName"
              :key="'extend' + index"
            >
              <el-input
                      v-uni:[item.signId]="'tizhengjiluxuetangdan_extendName'"
                v-model="addFormData.extend[index].extendValue"
                clearable
                disabled
              ></el-input>
            </el-form-item>
          </template>
        </el-form>
        <div class="typt-add-footer btn_footer" v-if="!isPreview">
          <el-button v-uni="'tizhengjiluxuetangdan_cancel'" @click="resetForm">取消</el-button>
          <el-button v-uni="'tizhengjiluxuetangdan_save'" type="primary" @click="saveData">保存</el-button>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import layout from '../../../../components/nrms/layout/list'
import formHeader from '../../../../components/nrms/autoForm/header'
import { ApiBloodMonitoring } from '../../../../api/nrms'
import PageInfo from '../../../../components/nrms/PageInfo'
import print from './Print'

var moment = require('moment')
export default {
  components: {
    layout,
    formHeader,
    PageInfo,
    print
  },
  props: ['patient', 'formObj', 'patientType', 'isPreview'],
  data () {
    return {
      form_show_hide: true, // 是否展开右侧表单
      addFormData: {}, // 表单
      rules: {
        recordDate: [{ required: true, message: '请选择日期！' }]
      },
      // 自动表头所用
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      },
      showHead: false, // 是否显示表头
      printSet: '', // 打印样式 横版或者竖版
      empInfo: {}, // 护士信息
      formDictExtendDoList: {}, // 通过表单配置得到的数据
      searchForm: {
        patientId: '',
        formCode: '',
        currentPage: 1,
        size: 10,
        total: 1
      },
      tableData: []
    }
  },
  created () {
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    this.empInfo = empInfo
    this.getFormInfo()
    this.resetForm()
    this.resetSearchFormParams()
    this.getList()
  },
  watch: {
    patient: {
      handler (newValue, oldValue) {
        this.getFormInfo()
        this.resetForm()
        this.resetSearchFormParams()
        this.getList()
      }
    }
  },
  computed: {
    btn_disable: function () {
      // 出院&&非出院召回 || 转科
      if (
        (this.patientType === 2 && this.patient.outHospitalFlag !== 1) ||
        this.patientType === 1
      ) {
        return true
      }
      return false
    }
  },
  methods: {
    // 回车跳到下一个可获得焦点的元素
    nextFocus (e) {
      const keyCode = e.keyCode || e.which || e.charCode
      let isDate = false

      let root = null
      const classList = e.target.classList
      // 输入框或者下拉
      if (classList.contains('el-input__inner')) {
        const pClassList = e.target.parentNode.classList
        // 日期
        if (pClassList.contains('el-date-editor')) {
          root =
            e.target.parentNode.parentNode.parentNode
          isDate = true
        } else {
          // 输入框
          root =
            e.target.parentNode.parentNode.parentNode
        }
      } else if (classList.contains('el-radio__original')) {
        // 单选
        root =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .parentNode.parentNode
      } else if (classList.contains('el-checkbox__original')) {
        // 复选
        root =
          e.target.parentNode.parentNode.parentNode.parentNode.parentNode
            .parentNode
      }
      let focusParent = null
      // 回车 13 下 40 左 37 右 39 上 38
      if (keyCode === 13 || keyCode === 39 || keyCode === 40) {
        // 回车 右 下
        if (!isDate) {
          focusParent = root.nextElementSibling
        } else {
          if (keyCode === 13) {
            focusParent = root.nextElementSibling
          }
        }
      } else if (keyCode === 37 || keyCode === 38) {
        // 上 左
        focusParent = root.previousElementSibling
      }
      let disabled = focusParent.querySelector('.is-disabled')
      if (disabled) {
        if (keyCode === 13 || keyCode === 39 || keyCode === 40) {
          // 回车 右 下
          focusParent = focusParent.nextElementSibling
        } else if (keyCode === 37 || keyCode === 38) {
          // 上 左
          focusParent = focusParent.previousElementSibling
        }
      }
      let focusE = null
      if (focusParent) {
        if (focusParent.querySelector('input')) {
          focusE = focusParent.querySelector('input')
        } else if (focusParent.querySelector('checkbox')) {
          focusE = focusParent.querySelector('checkbox')
        } else if (focusParent.querySelector('radio')) {
          focusE = focusParent.querySelector('radio')
        } else if (focusParent.querySelector('.el-button--primary')) {
          // 直接触发保存按钮事件去保存数据
          focusE = focusParent.querySelector('.el-button--primary')
        }
        console.log('root --- ', root)
        console.log('focusParent -- ', focusParent, focusE)
        // e.target.blur()
        focusE && focusE.focus()
      }
    },
    /**
     * @description: 获取表单信息
     * @param {*} _type
     * @return {*}
     */
    getFormInfo (_type) {
      this.autoHead.tplData = this.patient || null
      this.autoHead.tplId = this.formObj.formCode || ''
      this.autoHead.formName = this.formObj.formName || ''
      this.autoHead.tplHtml = this.formObj.formStyle || ''
      this.showHead = true
      this.printSet = this.formatPrintSet(
        this.formObj.printSet ? this.formObj.printSet : 1
      ) // 默认纵向打印
      this.formDictExtendDoList = this.formObj.formDictExtendDoList
    },
    /**
     * @description: 表单右侧展开隐藏
     * @param {*}
     * @return {*}
     */
    formShowHide () {
      this.form_show_hide = !this.form_show_hide
    },
    /**
     * @description: 获取列表
     * 需要将一条数据拆成表格的两条记录，上面是体征记录，下面是人名
     * @param {*}
     * @return {*}
     */
    async getList () {
      this.tableData = []
      try {
        this.searchForm.page = this.searchForm.currentPage
        let res = await ApiBloodMonitoring.list(this.searchForm)
        this.searchForm.total = res.data.total
        let list = res.data.list
        list.map((item) => {
          let signObj = {
            recordDate: moment(item.recordDate).format('YYYY-MM-DD'),
            proj: '血糖值<br/>(mmol/L)',
            item
          }
          let extendObj = {
            recordDate: moment(item.recordDate).format('YYYY-MM-DD'),
            proj: '测量者',
            item
          }
          item.signList.map((v) => {
            signObj[v.signId] = v.signValue
          })
          item.extend.map((v) => {
            extendObj[v.extendName] = v.extendValue
          })
          this.tableData.push(signObj)
          this.tableData.push(extendObj)
        })
      } catch (error) {}
    },
    /**
     * @description: 重置搜索参数
     * @param {*}
     * @return {*}
     */
    resetSearchFormParams () {
      this.searchForm = {
        formCode: this.formObj.formCode,
        patientId: this.patient.patientId,
        currentPage: 1,
        size: 10,
        total: 1
      }
    },
    /**
     * @description: 重置表单
     * @param {*}
     * @return {*}
     */
    resetForm () {
      this.addFormData = {
        recordId: '',
        patientId: this.patient.patientId,
        formId: this.formObj.formId,
        recordDate: moment().format('YYYY-MM-DD'),
        extend: [
          {
            extendName: 'zaocanqian',

            extendValue: ''
          },
          {
            extendName: 'zaocanhou',

            extendValue: ''
          },
          {
            extendName: 'wucanqian',

            extendValue: ''
          },
          {
            extendName: 'wucanhou',

            extendValue: ''
          },
          {
            extendName: 'wancanqian',

            extendValue: ''
          },
          {
            extendName: 'wancanhou',

            extendValue: ''
          }
        ],
        signList: [
          {
            signId: 'zaocanqian',

            signName: '早餐前',

            signValue: '',

            signSort: 0
          },
          {
            signId: 'zaocanhou',

            signName: '早餐后',

            signValue: '',

            signSort: 1
          },
          {
            signId: 'wucanqian',

            signName: '午餐前',

            signValue: '',

            signSort: 2
          },
          {
            signId: 'wucanhou',

            signName: '午餐后',

            signValue: '',

            signSort: 3
          },
          {
            signId: 'wancanqian',

            signName: '晚餐前',

            signValue: '',

            signSort: 4
          },
          {
            signId: 'wancanhou',

            signName: '晚餐后',

            signValue: '',

            signSort: 5
          }
        ]
      }
      this.formDictExtendDoList.map((item, index) => {
        this.addFormData.extend.push({
          extendName: item.fieldName,
          extendValue: ''
        })
        this.addFormData.signList.push({
          signId: item.fieldName,
          signName: item.projectName,
          signValue: '',
          length: item.fieldLength,
          signSort: 6 + index
        })
      })
    },
    /**
     * @description: 打印方向
     * @param {*} _printSet
     * @return {*}
     */
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
    /**
     * @description: 当体征项改变，要自动填写测量者
     * @param {*} e
     * @return {*}
     */
    onSignChange (value, index) {
      if (value) {
        this.addFormData.extend[index].extendValue = this.empInfo.empName
      } else {
        this.addFormData.extend[index].extendValue = ''
      }
    },
    // 保存
    async saveData () {
      let isSave = false
      this.addFormData.signList.map((item) => {
        if (item.signValue) {
          isSave = true
        }
      })
      if (!isSave) {
        this.$message.error('未填写内容')
        return
      }
      try {
        this.addFormData.recordDate = moment(
          this.addFormData.recordDate
        ).format('YYYY-MM-DD HH:mm:ss')
        if (this.addFormData.recordId) {
          // 编辑
          await ApiBloodMonitoring.update(this.addFormData)
        } else {
          // 添加
          await ApiBloodMonitoring.add(this.addFormData)
        }
        this.$message.success('提交成功')
        await this.resetForm()
        await this.resetSearchFormParams()
        await this.getList()
      } catch (error) {
        this.$message.error(error.message || error.desc)
      }
    },
    /**
     * @description: 编辑
     * @param {*}
     * @return {*}
     */
    modify (row) {
      Object.keys(this.addFormData).map((key) => {
        switch (key) {
          case 'signList':
            this.addFormData[key].map((item) => {
              row.item.signList.map((v) => {
                if (v.signId == item.signId) {
                  item.signValue = v.signValue
                }
              })
            })
            break
          case 'extend':
            this.addFormData[key].map((item) => {
              row.item.extend.map((v) => {
                if (v.extendName == item.extendName) {
                  item.extendValue = v.extendValue
                }
              })
            })
            break
          default:
            this.addFormData[key] = row.item[key]
            break
        }
      })
    },
    /**
     * @description: 删除
     * @param {*}
     * @return {*}
     */
    async del (row) {
      this.$confirm('是否确认删除？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(async () => {
        try {
          let res = await ApiBloodMonitoring.del({
            recordId: row.item.recordId
          })
          this.$message.success('删除成功')
          this.resetSearchFormParams()
          this.getList()
        } catch (error) {}
      })
    },
    /**
     * @description: 合并日期
     * @param {*} row
     * @param {*} column
     * @param {*} rowIndex
     * @param {*} columnIndex
     * @return {*}
     */
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if (
        columnIndex === 8 + this.formDictExtendDoList.length
          ? this.formDictExtendDoList.length
          : 0
      ) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    /**
     * @description: 打印
     * @param {*}
     * @return {*}
     */
    printDo () {
      this.$refs.print.print()
    }
  }
}
</script>
<style lang="scss" scoped>
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
  border-bottom: 1px solid #e4e7ed;
}

.form_show_btn {
  display: none;
  position: absolute;
  top: 80px;
  left: -22px;
  padding: 7px 3px !important;
  background-color: #fff;
  z-index: 9;
  color: #1e87f0;
  border-color: #1e87f0;
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
  display: flex;
  flex-direction: column;
  .el-form{
    flex: 1;
    overflow-y: auto;
  }
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
      border: 1px solid #ffffff;
    }
  }
  INPUT {
    display: none;
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
