<template>
  <div class="container">
    <div class="left">
      <layout-list>
        <div slot="left_btn" class="tool-bar">
          <!-- <el-button
            type="warning"
            icon="el-icon-plus"
            @click="addNote"
            size="small"
            :disabled="patientType != 0 && patient.outHospitalFlag != 1"
            >添加
          </el-button> -->
        </div>
        <div slot="right_btn" class="tool-bar" v-if="!isPreview">
          <el-button
            type="success"
            size="small"
            @click="printPreview"
          >打印
          </el-button>
          <el-button v-if="!btn_disable" size="small" class="form_show_btn" style="margin-left: 0;min-width: 0" @click="formShowHide">
            <i :class="form_show_hide ? 'el-icon-arrow-right' : 'el-icon-arrow-left'" />
          </el-button>
        </div>
        <div slot="main" class="main-list">
          <formHeader :auto-head="autoHead" />
          <div class="table-list">
            <el-table :data="list" highlight-current-row height="100%">
              <!-- <el-table-column type="index" align="center" label="序号" width="60">
                <template slot-scope="scope">
                  <span>{{ (searchParams.page - 1) * searchParams.size + (scope.$index + 1) }}</span>
                </template>
              </el-table-column> -->
              <el-table-column label="时间" align="center">
                <template slot-scope="scope">
                  {{ formatTime(scope.row.time) }}
                </template>
              </el-table-column>
              <el-table-column prop="options" label="措施选项" align="left" header-align="center" />
              <el-table-column prop="sign" label="护士签名" align="center" />
              <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                  <template>
                    <el-button
                      type="text"
                      :disabled="patientType != 0 && patient.outHospitalFlag != 1"
                      @click="edit(scope.row)"
                    >编辑</el-button>
                    <el-button type="textred" :disabled="patientType != 0 && patient.outHospitalFlag != 1" @click="delRecord(scope.row)">删除</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="height: 0;overflow: hidden;">
            <div :id="'zhongxin' + formCode" style="width: 1050px">
              <div v-for="(item,index) in printList" :key="index" style="page-break-after:always;padding-top: 30px">
                <formHeader :auto-head="autoHead" />
                <div class="table-box">
                  <table border="0" cellspacing="0" cellpadding="0" align="center" style="width: 100%">
                    <colgroup>
                      <col width="80px">
                      <col width="auto">
                      <col width="700px">
                      <col width="120px">
                    </colgroup>
                    <thead>
                      <tr>
                        <th>序号</th>
                        <th>时间</th>
                        <th>措施选项</th>
                        <th>护士签名</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(v,i) in item" :key="i">
                        <td>{{ index * printColumnNum + i + 1 }}</td>
                        <td>{{ v.time ? v.time.substring(0,v.time.length - 3) : '' }}</td>
                        <td>{{ v.options }}</td>
                        <td>{{ v.sign }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer" class="page-bar" v-if="!isPreview">
          <el-pagination
            :current-page.sync="searchParams.page"
            :page-size="searchParams.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </layout-list>
      <div class="table" style="height: 100%" v-if="!isPreview" />
    </div>
    <div id="add_form" class="right" :style="{width: form_show_hide ? '437px' : 0}" style="padding-left: 0px;overflow: auto;" v-if="!isPreview">
      <div style="padding: 10px 20px">
        <span style="font-weight: bold">{{
          assRecordId ? "编辑" : "添加"
        }}</span>
      </div>
      <auto-form v-if="update" ref="formCommon" :data="data" :value-data="valueData" />
      <div v-if="isShowOptionsError" style="margin-left: 110px;padding: 10px 0 0;color: #F56C6C">
        请选择措施选项
      </div>
      <div style="display: flex; justify-content: center; margin-top: 30px" v-if="!isPreview">
        <el-button type="primary" :disabled="patientType != 0 && patient.outHospitalFlag != 1" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import AutoForm from '../../../assets/nrms/mixins/AutoForm'
import { ApiAssManage } from '../../../api/nrms/index'
import printJS from 'print-js'
import { EAssClass } from '../../../assets/nrms/enum/formManage'
const moment = require('moment')
export default {
  components: {
    AutoForm: () => import('../../../components/nrms/autoForm/autoForm'),
    LayoutList: () => import('../../../components/nrms/layout/list.vue'),
    formHeader: () => import('../../../components/nrms/autoForm/header')
  },
  mixins: [AutoForm],
  props: ['patient', 'patientType', 'printSet', 'formStyle', 'formName', 'formCode', 'isPreview'],
  data () {
    return {
      data: [],
      valueData: [],
      row: {},
      assTemp: {},
      searchParams: {
        page: 1,
        size: 10,
        assClass: EAssClass.observeZhongxin,
        patientId: '',
        sort: {
          time: 2
        }
      },
      list: [],
      total: 0,
      assRecordId: '',
      update: true,
      columnPrint: 22,
      rowPrint: 9,
      printColumnNum: 0,
      printList: [],
      printPageList: [],
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      },
      form_show_hide: true,
      isShowOptionsError: false
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
  watch: {
    patient: {
      handler (newValue, oldValue) {
        this.autoHead.tplData = newValue
        this.reset()
      }
    }
  },
  async created () {
    this.autoHead.tplHtml = this.formStyle
    this.autoHead.formName = this.formName
    this.searchParams.condition = [{
      key: 'formCode',
      value: this.formCode
    }]
    if (this.printSet == 1) {
      this.printColumnNum = this.columnPrint
    } else {
      this.printColumnNum = this.rowPrint
    }
    if ((this.patient && this.patient.id) || this.isPreview) {
      this.autoHead.tplData = this.patient
      await this.reset()
    }

    this.autoHead.tplId = this.formCode
  },
  methods: {
    async getTemp () {
      try {
        const res = await ApiAssManage.assMangerList({
          assClass: '11'
        })
        res.data.map((item) => {
          if (item.assCode == this.formCode) {
            this.data = JSON.parse(JSON.stringify(item.moduleJson))
            this.assTemp = item
          }
        })
        this.valueData = []
        await this.operatorFormData()
        this.update = false
        this.$nextTick(() => {
          this.update = true
        })
      } catch (error) {}
    },
    // 格式化打印方式
    formatPrintSet (_printSet) {
      switch (_printSet) {
        case 1:
          return 'portrait'
        case 2:
          return 'landscape'
        default:
          return 'portrait'
      }
    },
    async getList () {
      try {
        this.searchParams.patientId = this.patient.patientId
        // this.searchParams.patientId = '2222'
        const res = await ApiAssManage.getList(this.searchParams)
        this.total = res.data.total
        this.list = res.data.list
      } catch (error) {}
    },
    async reset () {
      await Promise.all([await this.getList(), await this.getTemp()])
      this.assRecordId = ''
      await this.getPrintList()
    },
    edit (row) {
      this.isShowOptionsError = false
      this.assRecordId = row.ass_record_id
      this.valueData = JSON.parse(row.module_value)
      this.update = false
      this.$nextTick(() => {
        this.update = true
      })
    },
    delRecord (row) {
      this.$confirm('是否确认删除？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(async () => {
        try {
          const res = await ApiAssManage.delete(row.ass_record_id)
        } catch (error) {
          this.$message.error(error.message)
          return
        }
        if (this.page_total % 10 == 1 && this.searchObj.page > 1) {
          this.searchObj.page--
        }
        this.$message.success('删除成功！')
        await this.reset()
      })
    },
    // 处理size变化
    handleSizeChange (val) {
      this.searchParams.size = val
      this.getList()
    },
    // 分页当前页码变化
    handleCurrentChange (val) {
      this.searchParams.page = val
      this.getList()
    },
    addNote () {
      this.reset()
    },
    cancel () {
      this.reset()
    },
    async getPrintList () {
      const params = {
        ...this.searchParams,
        page: '',
        size: ''
      }
      try {
        const res = await ApiAssManage.getList(params)
        const list = res.data
        const pageNum = Math.ceil(list.length / this.printColumnNum) || 1
        const printList = [...new Array(pageNum)].map((item) => [])
        list.map((item, index) => {
          const num = Math.floor(index / this.printColumnNum)
          printList[num].push(item)
        })
        if (!list || !list.length) {
          for (let index = 0; index < this.printColumnNum; index++) {
            printList[0].push({})
          }
        }
        this.printList = printList
      } catch (error) {
        console.log(error)
      }
    },
    formShowHide () {
      this.form_show_hide = !this.form_show_hide
    },
    async printPreview () {
      printJS({
        printable: `zhongxin${this.formCode}`,
        type: 'html',
        style: `
        @page { size: ${this.formatPrintSet(this.printSet)};margin:0 auto; }
        li {
          font-size: 12px
        }
        .table-box table{
          border: 1px solid #333;
        }
        .table-box th, .table-box td {
          border: 1px solid #333;
          font-size: 12px
        }
        .table-box th {
          padding: 10px
        }
        .table-box td {
          padding: 10px;
          height: 37px;
          text-align: center;
        }
        `,
        scanStyles: false
      })
    },
    async save () {
      this.isShowOptionsError = false
      const params = {
        assId: this.assTemp.assId, // 评估单ID
        moduleId: this.assTemp.moduleId, // 模板ID
        moduleValue: this.valueData, // 评估值
        haveRecordRate: 0, // 是否多次记录
        patientId: this.patient.patientId // 患者ID
      }
      const columnValue = []
      let options = []
      let time = ''
      this.valueData.map(item => {
        if (item.key == '1618210472000_58178') {
          if (!item.value) {
            item.value = moment().format('YYYY-MM-DD HH:mm:ss')
          }
          time = item.value
          columnValue.push({
            key: 'time',
            value: item.value
          })
        }
        if (item.key == '1618210472000_29118') {
          this.operatorFormData((v) => {
            if (v.key == item.key) {
              item.value.map(id => {
                v.options.map(optItem => {
                  if (optItem.id == id) {
                    options.push(optItem.label)
                  }
                })
              })
            }
          })
        }
      })
      if (!options || !options.length) {
        this.isShowOptionsError = true
        return
      }
      options = options.sort((a, b) => {
        return parseInt(a.slice(0, a.indexOf('.'))) - parseInt(b.slice(b, b.indexOf('.')))
      })
      columnValue.push({
        key: 'options',
        value: options.join(';')
      })
      columnValue.push({
        key: 'formCode',
        value: this.formCode
      })
      const empInfo = JSON.parse(localStorage.getItem('empInfo'))
      columnValue.push({
        key: 'sign',
        value: empInfo.empName
      })
      params.columnValue = columnValue
      params.assDate = time
      try {
        if (this.assRecordId) {
          params.assRecordId = this.assRecordId
          await ApiAssManage.edit(params)
          this.$message.success('编辑成功')
          await this.reset()
        } else {
          await ApiAssManage.add(params)
          this.$message.success('添加成功')
          await this.reset()
        }
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    formatTime (time) {
      return moment(time).format('YYYY-MM-DD HH:mm')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/nrms/css/self_common.scss";
.container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .left {
    width: 0;
    flex: 1;
    /deep/ .main-list {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      height: 100%;

      .table-list {
        flex: 1;
        height: 0;
        overflow: hidden;
        td {
          position: relative !important;
        }
      }
    }
  }
  .right {
    width: 350px;
    box-sizing: border-box;
    position: relative;
    transition: width 0.25s;
    border-left: 1px solid #e6e6e6;
  }
  .form_show_btn {
    position: absolute;
    top: 80px;
    right: 0;
    padding: 7px 3px !important;
    background-color: #fff;
    z-index: 9;
    color: #1E87F0;
    border: 1px solid;
    border-color: #1E87F0;
    border-radius: 0 !important;
    border-right: none;
    display: inline-block !important;
  }
}
/deep/ .form-common {
  // 选择时间按钮弹框挤出页面临时解决
  margin-left: -5px;
}
</style>
