<template>
  <layout v-loading="loading">
    <div slot="aside"
         style="border-right: 1px solid #E4E7ED">
      <div class="tool-bar">
        <el-button
          type="primary"
          @click="addShiftWin"
        >添加
        </el-button>
        <el-button
          type="danger"
          @click="shiftDelete"
        >删除
        </el-button>
      </div>
      <div class="search-bar">
        <el-form :inline="true">
          <el-form-item>
            <el-form-item label="交班日期">
              <el-date-picker
                v-model="shiftDate"
                type="date"
                value-format="yyyy-MM-dd"
                @change="searchShift"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-list">
        <el-table
          :data="nurse_shift_data"
          highlight-current-row
          @row-click="changeShift"
          height="100%"
        >
          <el-table-column label="交班日期" prop="shiftTime" min-width="95"></el-table-column>
          <el-table-column label="班次" prop="shiftName" min-width="75"></el-table-column>
          <el-table-column label="交班者" prop="shiftNurseName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="交班时间" prop="createTime" min-width="95" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <layout_list slot="main" v-loading="loading_child">
      <div slot="main" class="main-list">
        <el-table
          ref="table"
          :data="patient_data"
          stripe
          highlight-current-row
        >
          <!--<el-table-column type="index" label="序号" width="50">-->
          <!--</el-table-column>-->
          <el-table-column prop="bedNo" label="床号" align="center" min-width="100">
          </el-table-column>
          <el-table-column prop="patientName" label="姓名" align="center" min-width="100">
          </el-table-column>
          <el-table-column prop="diagnosis" label="诊断" align="center">
          </el-table-column>
          <el-table-column prop="allergyHistory" label="过敏史" align="center" show-overflow-tooltip>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="shiftPatientEdit(scope.row)" type="text" size="small"
              >编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div slot="footer" class="page-bar">
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
    </layout_list>

    <template slot>
      <!-- 添加班次 -->
      <el-dialog title="新建交班" width="25%" :visible.sync="addShiftVisible">
        <el-form :model="addShiftForm" label-width="80px" ref="ruleForm">
          <el-form-item
            label="报告日期"
            prop="shiftTime"
            :rules="[
            { required: true, message: '请选择报告日期！', trigger: 'blur' }
          ]"
          >
            <el-date-picker
              v-model="addShiftForm.shiftTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="班次"
            prop="index"
            :rules="[
            { required: true, message: '请选择班次！', trigger: 'blur' }
          ]"
          >
            <el-select v-model="addShiftForm.index" placeholder="请选择班次" @change="shiftsChange">
              <el-option v-for="(s,index) in shifts" :label="s.shiftName" :value="index"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addShiftVisible = false">取消</el-button>
          <el-button type="primary" @click="addShiftSubmit">确认</el-button>
        </div>
      </el-dialog>
    </template>
  </layout>
</template>

<script>
  import { ApiNurseShift, ApiShifts } from '../../../api/bnms/index'
  import moment from 'moment'
  import layout from '../../../components/bnms/layout/aside'
  import layout_list from '../../../components/bnms/layout/list'

  export default {
    name: 'nurse_shift_list',
    components: { layout, layout_list },
    data () {
      return {
        loading: false,
        loading_child: false,
        addShiftVisible: false,
        nurse_shift_data: [],
        patient_data: [],
        page_current: 1,
        page_total: 0,
        page: 1,
        size: 10,
        shifts: [], // 班次
        shiftDate: '',
        curClickShift: {},
        addShiftForm: {
          index: '',
          shiftTime: moment().format('YYYY-MM-DD'),
          dutyTime: '',
          shiftType: 2,
          sort: '',
          deptId: ''
        },
        deptInfo: {}
      }
    },
    created () {
      let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {}
      this.deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
      this.addShiftForm.nurseName = empInfo.empName
      this.addShiftForm.deptId = this.deptInfo.deptId
      this.getShifts()
      this.getShiftData()
    },
    activated () {
      if (this.curClickShift.shiftRecordId) {
        this.getPatientData()
      }
    },
    updated () {
      this.$nextTick(function () {
        this.$refs.table.doLayout()
      })
    },
    methods: {
      // 查询交班
      searchShift () {
        this.getShiftData()
      },
      // 删除交班
      shiftDelete () {
        this.$confirm(`确认要删除${this.curClickShift.shiftTime}的${this.curClickShift.shiftName}交班记录？`, '提示', {
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
      // 新建交班弹窗
      addShiftWin () {
        this.addShiftVisible = true
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
                this.$message.error(res.message)
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 选择交班
      changeShift (row) {
        this.curClickShift = row
        this.handleCurrentChange(1)
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
        }).catch(res => {
          this.loading = false
          this.$message.warning(res.message)
        })
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
      // 查询当前交班的患者数据
      getPatientData () {
        // console.log(this.curClickShift)
        this.loading_child = true
        ApiNurseShift.selectSbarPatient({
          shiftRecordId: this.curClickShift.shiftRecordId,
          page: this.page,
          size: this.size
        }).then(res => {
          this.loading_child = false
          res.data = res.data || { list: [], total: 0 }
          this.patient_data = res.data.list
          this.page_total = res.data.total
        }).catch(res => {
          this.loading_child = false
          this.$message.error(res.message)
        })
      },
      // 修改交班的患者
      shiftPatientEdit (row) {
        this.$emit('option-changed', 'edit', this.curClickShift, row)
      },
      getRowKeys (row) {
        return row.shiftRecordId
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

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";

  /deep/ .el-aside {
    > div {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
    }

    .tool-bar {
      overflow: hidden;
      border-bottom: 1px solid #E4E7ED;

      .el-button {
        float: right;

        &:first-child {
          float: left;
        }
      }
    }

    .search-bar {
      padding: 12px;

      /deep/ .el-form-item .el-form-item {
        margin-bottom: 0;
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
      }
    }
  }

  .shift-info, .statistics {
    font-size: 13px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
</style>
