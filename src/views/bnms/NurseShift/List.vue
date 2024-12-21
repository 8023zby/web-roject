<template>
  <layout v-loading="loading">
    <div slot="aside" style="border-right: 1px solid #E4E7ED">

      <div class="tool-bar">
        <el-button
          type="primary"
          v-uni="'hushijiaoban_add'"
          @click="addShiftWin">添加交班
        </el-button>

        <el-button
          type="success"
          v-uni="'hushijiaoban_print'"
          @click="printView">打印
        </el-button>

        <el-button
          type="danger"
          v-uni="'hushijiaoban_delete'"
          @click="shiftDelete">删除
        </el-button>

      </div>

      <div class="search-bar">
        <el-form :inline="true">
          <el-form-item label="交班日期:">
            <el-date-picker
              class="search-shift"
              v-model="shiftDate"
              type="date"
              value-format="yyyy-MM-dd"
              @change="searchShift"
              v-uni="'hushijiaoban_changeDate'"
              placeholder="请选择">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>

      <div class="main-list">
        <el-table
          :stripe="true"
          :data="nurse_shift_data"
          highlight-current-row
          @row-click="changeShift"
          height="100%"
          v-uni="'hushijiaoban_selectRow'"
        >
          <el-table-column label="交班日期" prop="shiftTime" min-width="95" align="center"/>
          <el-table-column label="班次" prop="shiftName" min-width="75" align="center"/>
          <el-table-column label="交班者" prop="shiftNurseName" width="100" align="center"
                           show-overflow-tooltip/>
          <el-table-column label="交班时间" prop="createTime" width="95" align="center"/>
        </el-table>
      </div>

    </div>

    <div slot="main"
         v-loading="loading_child">

      <div class="statistics-container">

        <div class="shift-info" v-show="false">
          <!--<div>交班日期:{{curClickShift.shiftTime}}</div>-->
          <div>班次:{{curClickShift.shiftName}}</div>
          <div>班次时间:{{curClickShift.dutyTime}}</div>
        </div>

        <!--div class="statistics">

          <div v-for="label in statistics_label"
               @click="editStatisticCount(label.code)">
              <div class="border1" style="width: 90px;text-align: right;float: left">{{label.name}}:</div>
              <div class="border1" style="width: 90px;float: right;text-align: left">
                <span class="statistics-label" style="text-decoration: underline;">{{statistics_data[label.code] || 0}}人</span>
              </div>
              <div class="clear-both"></div>
          </div>

        </div-->

        <div style="" class="shift-info-main">
          <div class="shift-info-item" style="">

            <div class="shift-info-item-shift-name-label" style="">班次:</div>
            <div class="shift-info-item-shift-name-value" style="">
              <span class="">{{curClickShift.shiftName}}</span>
            </div>

            <div class="clear-both"></div>

          </div>

          <div class="shift-info-item-time" style="">

            <div class="shift-info-item-shift-name-label" style="">班次时间:</div>
            <div class="shift-info-item-shift-name-value" style="">
              <span class="">{{curClickShift.dutyTime}}</span>
            </div>

          </div>

          <div class="clear-both"></div>

        </div>

        <div style="" class="statistics-main">
          <div v-for="(label,index) in statistics_label"
               class="statistics-item"
               :key="index"
               style="">
            <div class="statistics-item-label" style="">{{label.name}}:</div>
            <div class="statistics-item-value">
              <span class="statistics-item-value-item" style="" @click="statisticCountShow(label.name)" v-uni:[index]="'hushijiaoban_changeNum'">{{statistics_data[label.name] || 0}}人</span>
            </div>
            <div class="clear-both"></div>

          </div>
          <div class="clear-both"></div>
        </div>

      </div>

      <div style="text-align: left; border-top: 1px solid #E4E7ED"
           class="tool-bar">
        <el-button
          type="primary"
          @click="shiftPatientAdd"
          v-uni="'hushijiaoban_addHuanzhe'"
        >添加患者
        </el-button>
      </div>

      <!-- 表格 -->
      <div class="main-list">
        <el-table
          :stripe="true"
          ref="table"
          :data="patient_data"
          highlight-current-row
          height="100%"
        >
          <!-- <el-table-column type="index" label="序号" align="center" width="70">
            <template slot-scope="scope">
              {{(page_current - 1) * size + scope.$index + 1}}
            </template>
          </el-table-column> -->
          <el-table-column prop="bedNo" label="床号" align="center" min-width="80">
          </el-table-column>
          <el-table-column prop="patientName" label="姓名" align="center" min-width="80" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="shiftReason" label="交班原因" align="center" min-width="80">
          </el-table-column>
          <el-table-column prop="shiftText" label="详细描述" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="shiftRecordStatus" label="交班记录" align="center" min-width="80">
            <template slot-scope="scope">
              <el-button
                @click="shiftHandoverRecord(scope.row)"
                type="text"
                size="medium"
                v-uni:[scope.row.recordId]="'hushijiaoban_detail'"
                :key="'hushijiaoban_detail' + scope.row.recordId"
              >
                <span v-if="scope.row.shiftRecordStatus === 0 ">未交班</span>
                <span v-if="scope.row.shiftRecordStatus === 1 ">已交班</span>
                <span v-if="scope.row.shiftRecordStatus === 2 ">已接班</span>
              </el-button>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button
                @click="shiftPatientEdit(scope.row)"
                type="text"
                size="medium"
                 v-uni:[scope.row.recordId]="'hushijiaoban_edit'"
                :key="'hushijiaoban_edit' + scope.row.recordId"
              >编辑
              </el-button>
              <el-button
                type="textred"
                size="medium"
                @click="shiftPatientDelete(scope.row)"
                 v-uni:[scope.row.recordId]="'hushijiaoban_delete'"
                :key="'hushijiaoban_delete' + scope.row.recordId"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="page-bar" style="text-align: center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page_current"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page_total"
        >
        </el-pagination>
      </div>

      <!-- 添加班次 -->
      <el-dialog
        title="添加交班"
        width="490px"
        :showClose="false"
        :visible.sync="addShiftVisible">
        <el-form
          :model="addShiftForm"
          label-width="100px"
          ref="ruleForm">
          <el-form-item
            label="交班日期:"
            prop="shiftTime"
            :clearable="false"
            :rules="[
            { required: true, message: '请选择交班日期！', trigger: 'blur' }
          ]"
          >
            <el-date-picker
              style="width: 300px;"
              prefix-icon="el-icon-time"
              v-model="addShiftForm.shiftTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择">
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="班次:"
            prop="index"
            :rules="[
            { required: true, message: '请选择班次！', trigger: 'blur' }
          ]"
          >
            <el-select
              v-model="addShiftForm.index"
              style="width: 300px;"
              placeholder="请选择"
              @change="shiftsChange">
              <el-option
                v-for="(s,index) in shifts"
                :label="s.shiftName"
                :value="index"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-uni="'hushijiaoban_add_cancel'" @click="addShiftVisible = false">取消</el-button>
          <el-button v-uni="'hushijiaoban_add_save'" type="primary" @click="addShiftSubmit">确认</el-button>
        </div>
      </el-dialog>

      <!-- 修改数量 -->
      <el-dialog title="修改"
                 width="490px"
                 :showClose="false"
                 :visible.sync="statisticCount.visble">
        <div class="statisticCount-main">
          <div class="statisticCount-label">人数:</div>
          <div class="statisticCount-value">
            <el-input
              type="text"
              maxlength="3"
              placeholder="请输入"
              v-model="statisticCount.count"/>
          </div>
          <div class="clear-both"></div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button v-uni="'hushijiaoban_changeAmount_cancel'" @click="statisticCountCancel">取消</el-button>
          <el-button v-uni="'hushijiaoban_changeAmount_save'" type="primary" @click="statisticCountSubmit">确认</el-button>
        </div>
      </el-dialog>

      <!-- 打印组件 -->
      <div style="display: none;">
        <print_page
          ref="print"
          v-if="curClickShift.shiftRecordId"
          :shift="curClickShift"
          :autoHead="autoHead"
        />
      </div>

    </div>

  </layout>
</template>

<script>
import { ApiAutoForm, ApiNurseShift, ApiShiftReason, ApiShifts } from '../../../api/bnms/index'
import { shift_reason } from './config'
import moment from 'moment'
import layout from '../../../components/bnms/layout/aside'
import print_page from './Print'

export default {
  name: 'nurse_shift_list',
  components: { layout, print_page },
  data () {
    return {
      loading: false,
      loading_child: false,
      addShiftVisible: false,
      statisticCount: {
        visble: false,
        code: null,
        count: null
      },
      nurse_shift_data: [],
      statistics_data: [],
      patient_data: [],
      page_current: 1,
      page_total: 0,
      page: 1,
      size: 10,
      statistics_label: [
        ...shift_reason
      ],
      shifts: {}, // 班次
      shiftDate: '', // moment().format("YYYY-MM-DD"),
      curClickShift: {},
      addShiftForm: {
        index: '',
        shiftTime: moment().format('YYYY-MM-DD'),
        dutyTime: '',
        shiftType: 1,
        sort: '',
        deptId: ''
      },
      deptInfo: {},
      // 自动表头所用
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '',
        tplData: {}
      },
      formId: ''
      // shiftRecordStatus  0 未交班 1已交班 2已接班
    }
  },
  created () {
    let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
    this.deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.addShiftForm.nurseName = empInfo.empName
    this.addShiftForm.deptId = this.deptInfo.deptId
    this.getShifts()
    this.getShiftData()
    this.getShiftReason()
  },
  activated () {
    if (this.curClickShift.shiftRecordId) {
      this.getStatistics()
      this.getPatientData()
    }
  },
  updated () {
    this.$nextTick(function () {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    /* 获取交班原因 */
    async getShiftReason () {
      try {
        // 一个科室只有一个交班报告，但不同患者可能会设置多种交班记录 hz
        await this.getFormInfo('12', '交班报告', {})
        let res2 = await ApiShiftReason.get({ formId: this.formId })
        if (!res2.data || !res2.data.length) {
          return this.$message.error('请先配置交班原因')
        }
        let labels = res2.data.map(item => {
          return {
            ...item,
            name: item.shiftReasonName,
            code: item.shiftReasonId
          }
        })

        this.statistics_label = this.statistics_label.concat(labels)
      } catch (error) {
      }
    },
    // 查询班次
    getShifts () {
      ApiShifts.shifts({ deptId: this.deptInfo.deptId }).then(res => {
        this.shifts = res.data || []
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    shiftsChange (val) {
      Object.assign(this.addShiftForm, this.shifts[val] || {})
      this.addShiftForm.dutyTime = this.addShiftForm.beginTime + ' - ' + this.addShiftForm.endTime
    },
    // 查询交班数据
    getShiftData () {
      this.loading = true
      ApiNurseShift.select({
        deptId: this.deptInfo.deptId,
        shiftTime: this.shiftDate,
        shiftType: this.addShiftForm.shiftType
      }).then(res => {
        this.loading = false
        this.nurse_shift_data = res.data || []

        // 清空右侧列表数据
        this.patient_data = []
        this.page_total = 0
      }).catch(res => {
        this.loading = false
        this.$message.warning(res.message)
      })
    },
    // 查询交班
    searchShift () {
      this.getShiftData()
    },
    // 新建交班弹窗
    addShiftWin () {
      this.addShiftVisible = true
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
    },
    // 删除交班
    shiftDelete () {
      if (this.curClickShift.shiftRecordId === undefined ||
          this.curClickShift.shiftRecordId === null ||
          this.curClickShift.shiftRecordId === '') {
        this.$message.warning('请先选择交班！')
        return false
      }
      let shiftTimeArr = this.curClickShift.shiftTime.split('-')
      let msg = '确认要删除' +
          shiftTimeArr[0] + '年' +
          shiftTimeArr[1] + '月' +
          shiftTimeArr[2] + '日' +
          this.curClickShift.shiftName + '交班记录？'
      this.$confirm(
        // `是否确认删除${this.curClickShift.shiftTime}的${this.curClickShift.shiftName}交班记录？`,
        msg,
        '删除',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false
        }).then(() => {
        ApiNurseShift.delete({ shiftRecordId: this.curClickShift.shiftRecordId })
          .then(() => {
            this.$message.success('删除成功！')
            this.curClickShift = {}
            this.patient_data = []
            this.getShiftData()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    // 新建班次
    addShiftSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          ApiNurseShift.insert(this.addShiftForm)
            .then(() => {
              this.$message.success('保存成功！')
              this.addShiftVisible = false
              this.getShiftData()
            })
            .catch(res => {
              // this.$message.error(res.message)

              let shiftTimeArr = this.addShiftForm.shiftTime.split('-')
              let msg = shiftTimeArr[0] + '年' +
                  shiftTimeArr[1] + '月' +
                  shiftTimeArr[2] + '日' +
                  this.addShiftForm.shiftName + '班次信息已存在！'
              this.$message({
                message: msg,
                type: 'error',
                duration: 1500
              })
            })
        } else {
          return false
        }
      })
    },
    // 打印交班
    printView () {
      if (!this.curClickShift.shiftRecordId) {
        this.$message.warning('请先选择交班！')
        return false
      }

      // this.$emit('option-changed', 'print', this.curClickShift);

      ApiNurseShift.selectRecordCount(
        {
          deptId: this.deptInfo.deptId,
          shiftTime: this.curClickShift.shiftTime
        }).then(res => {
        let shifts_count = res.data.length || 0
        let shiftArr = res.data || []

        if (shifts_count === 0 || shifts_count === '' || shifts_count === undefined) {
          this.$message.error('请先添加班次或将班次应用于科室！')
          return false
        }
        // 给打印页面的科室和时间赋值
        let row = {
          deptName: this.deptInfo.deptName || '',
          shiftTime: this.curClickShift.shiftTime || ''
        }
        this.autoHead.tplData = row
        this.$refs.print.getData(res)
        let that = this
        setTimeout(function () {
          that.$refs.print.printView()
        }, 1000)
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    // 交班记录
    async shiftHandoverRecord (row) {
      await this.getFormInfo('13', '交班记录', row)
      this.$emit('option-changed', 'record', this.curClickShift, row, this.autoHead)
    },
    // 获取交班报告、交班记录表头样式
    getFormInfo (type, title, row = {}) {
      let rowInfo = row
      ApiAutoForm.getFormDictByType({ formType: type }).then((res) => {
        if (res.data == null || res.data.length === 0) {
          this.autoHead.tplId = ''
          this.autoHead.tplData = {}
          this.autoHead.formName = ''
          this.autoHead.tplHtml = ''
          this.$message.error(`请先配置${title}表单样式`)
        } else {
          let data = res.data || {}
          this.formId = data.formId
          this.autoHead.tplData = rowInfo || {}
          this.autoHead.tplId = data.formCode || ''
          this.autoHead.formName = data.formName || ''
          this.autoHead.tplHtml = data.formStyle || ''
        }
      })
    },
    // 选择交班
    changeShift (row) {
      this.loading_child = true
      this.curClickShift = row
      for (let i = 0; i < this.shifts.length; i++) {
        if (this.shifts[i].shiftName === this.curClickShift.shiftName) {
          this.curClickShift.sort = this.shifts[i].sort
        }
      }
      if (this.curClickShift.sort === null || this.curClickShift.sort === undefined || this.curClickShift.sort === '') {
        this.curClickShift.sort = 1
      }
      this.getStatistics()
      this.handleCurrentChange(1)
    },
    // 查询交班统计数据
    getStatistics () {
      ApiNurseShift.selectStatistics({ shiftRecordId: this.curClickShift.shiftRecordId }).then(res => {
        const data = {}
        res.data.forEach(item => {
          data[item.shiftReason] = item.shiftPatientCnt
        })
        this.statistics_data = data
      }).catch(res => {
        this.$message.warning(res.message)
      })
    },
    statisticCountShow (code) {
      if (!this.curClickShift.shiftRecordId) {
        this.$message.warning('请先选择交班！')
        return false
      }
      this.statisticCount.visble = true
      this.statisticCount.code = code
    },
    statisticCountSubmit () {
      if (this.statisticCount.count === '' || this.statisticCount.count === null || this.statisticCount.count === undefined) {
        this.$message.warning('请输入数量！')
        return false
      }
      if (isNaN(this.statisticCount.count) || this.statisticCount.count < 0) {
        this.$message.warning('只能输入正整数！')
        return false
      }
      ApiNurseShift.updateStatistics({
        item: this.statisticCount.code.replace(/\B([A-Z])/g, '_$1').toLowerCase(),
        count: this.statisticCount.count,
        shiftRecordId: this.curClickShift.shiftRecordId
      }).then(res => {
        this.$message.success('修改成功')
        this.getStatistics()
        this.statisticCountClear()
      }).catch(res => {
        this.$message.warning(res.message)
      })
    },
    statisticCountCancel () {
      this.statisticCountClear()
    },
    statisticCountClear () {
      this.statisticCount.visble = false
      this.statisticCount.code = null
      this.statisticCount.count = null
    },
    editStatisticCount (code) {
      if (!this.curClickShift.shiftRecordId) {
        this.$message.warning('请先选择交班！')
        return false
      }
      this.$prompt('数量:', '修改人数', {
        customClass: 'statistic-prompt',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /^\d{0,10}$/,
        inputErrorMessage: '只能输入10位数字',
        showClose: false
      }).then(({ value }) => {
        let count = value || 0
        ApiNurseShift.updateStatistics({
          item: code.replace(/\B([A-Z])/g, '_$1').toLowerCase(),
          count: count,
          shiftRecordId: this.curClickShift.shiftRecordId
        }).then(res => {
          this.$message.success('修改成功')
          this.getStatistics()
        }).catch(res => {
          this.$message.warning(res.message)
        })
      })
    },
    // 查询当前交班的患者数据
    getPatientData () {
      ApiNurseShift.selectChildPatient({
        shiftRecordId: this.curClickShift.shiftRecordId,
        pageIndex: this.page,
        pageSize: this.size
      }).then(res => {
        this.loading_child = false
        this.patient_data = res.data.list || []
        this.page_total = res.data.total
      }).catch(res => {
        this.loading_child = false
        this.$message.warning(res.message)
      })
    },
    // 新建交班的患者
    shiftPatientAdd () {
      if (!this.curClickShift.shiftRecordId) {
        this.$message.warning('请先选择交班！')
        return false
      }

      for (let i = 0; i < this.shifts.length; i++) {
        if (this.shifts[i].shiftName === this.curClickShift.shiftName) {
          this.curClickShift.sort = this.shifts[i].sort
        }
      }
      if (this.curClickShift.sort === null || this.curClickShift.sort === undefined || this.curClickShift.sort === '') {
        this.curClickShift.sort = 1
      }

      this.$emit('option-changed', 'add', this.curClickShift)
    },
    // 修改交班的患者
    shiftPatientEdit (row) {
      this.$emit('option-changed', 'add', this.curClickShift, row)
    },
    // 删除交班患者
    shiftPatientDelete (row) {
      this.$confirm('确认要删除该患者？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        ApiNurseShift.deletePatient({ recordId: row.recordId })
          .then(() => {
            this.$message.success('删除成功！')
            this.getPatientData()
            this.getStatistics()
          })
          .catch(res => {
            this.$message.error(res.message)
          })
      })
    },
    getRowKeys (row) {
      return row.labelId
    },
    handleSizeChange (val) {
      this.size = val
      this.getPatientData()
    },
    handleCurrentChange (val) {
      this.page_current = this.page = val
      this.getPatientData()
    }
  }
}
</script>

<style>
  .el-tooltip__popper {
    max-width: 500px !important;
  }
</style>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";

  .border {
    border: 1px solid red;
  }

  .clear-both {
    clear: both;
  }

  /deep/ .el-aside {
    > div {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
    }

    .tool-bar {
      /*overflow: hidden;*/
      border-bottom: 1px solid #E4E7ED;
      /*border: 1px solid red;*/
      height: auto;

      .el-button {
        float: right;

        &:first-child {
          float: left;
        }
      }
    }

    .search-bar {
      padding: 12px 0 0 12px;

      /deep/ .el-form-item {
        margin-bottom: 12px;
        /*border: 1px solid red;*/
      }

      .search-shift {
        .el-input__inner {
          width: 260px;
        }
      }
    }

    .main-list {
      flex: 1;
    }
  }

  /deep/ .el-main {
    > div {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;

      .main-list {
        flex: 1;

        .el-table th, .el-table td {
          padding: 14px 0;
        }
      }
    }
  }

  .statistics-container {

    .shift-info-main {
      width: 100%;
      margin: 10px 0 0 0;

      .shift-info-item {
        width: 20%;
        height: 32px;
        float: left;

        .shift-info-item-shift-name-label {
          width: 50%;
          text-align: right;
          float: left;
        }

        .shift-info-item-shift-name-value {
          width: 44%;
          float: right;
          text-align: left;
          line-height: 20px;
          /*padding: 0 0 0 12px;*/
        }

      }

      .shift-info-item-time {
        /*border: 1px solid red;*/
        width: 40%;
        height: 32px;
        float: left;

        .shift-info-item-shift-name-label {
          /*border: 1px solid red;*/
          width: 25%;
          text-align: right;
          float: left;
        }

        .shift-info-item-shift-name-value {
          /*border: 1px solid red;*/
          width: 50%;
          float: left;
          text-align: left;
          line-height: 20px;
          padding: 0 0 0 2%;
        }

      }

    }

    .statistics-main {
      width: 100%;

      .statistics-item {
        width: 20%;
        height: 32px;
        float: left;

        .statistics-item-label {
          width: 50%;
          text-align: right;
          float: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .statistics-item-value {
          width: 50%;
          float: right;
          text-align: left;

          .statistics-item-value-item {
            text-decoration: underline;
            cursor: pointer;
            padding: 0 0 0 12px;
          }

          .statistics-item-value-item:hover {
            color: #409EFF;
          }
        }

      }

    }

  }

  /*废弃*/
  .shift-info, .statistics {
    font-size: 13px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    /*display: flex;*/
    /*justify-content: center;*/
    /*align-items: center;*/

  }

  /*废弃*/
  .shift-info {
    position: relative;
    padding: 10px 5px;

    div {
      margin-right: 10%;
    }

    button {
      position: absolute;
      right: 10px;
    }
  }

  /*废弃*/
  .statistics {
    margin-bottom: 20px;

    div {
      box-sizing: border-box;
      width: 20%;
      padding: 5px 5px;
    }
  }

  /deep/ .el-date-editor.el-input {
    /*width: 205px;*/
  }

  /deep/ .el-table__empty-text {
    color: #999999;
    font-size: 14px;
  }

  /deep/ .el-message-box__wrapper .el-message-box {
    width: 420px !important;

    /deep/ .el-message-box__content {
      padding: 10px 20px 10px 15px;
    }

    /deep/ .el-message-box__container {
      width: 100px;
      padding: 45px 12px 0 0;
      word-wrap: break-word;
      text-align: right;
    }
  }

  .statisticCount-main {
    padding: 0 40px 20px 0;

    .statisticCount-label {
      width: 95px;
      height: 46px;
      line-height: 46px;
      font-size: 14px;
      color: #606266;
      float: left;
      text-align: right;
      padding: 0;
    }

    .statisticCount-value {
      width: 300px;
      height: 46px;
      float: right;
    }
  }

  /deep/ .el-table th div {
    font-size: 14px;
  }
</style>
