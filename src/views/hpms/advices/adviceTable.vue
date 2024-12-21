<template>
  <el-container>
    <el-aside style="background: #fff;overflow: visible;width: auto">
     <patient-list @initPatient="getPatInfo" :initRowIndex="0"></patient-list>
    </el-aside>
    <div class="typt-list-container" style="width: 85%">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="form.timeVal"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button type="primary" class="el-button-radius" icon="el-icon-search" @click="onSubmit" size="small">搜索</el-button>
            <el-button type="text" @click="reSearch">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <hr />
      <div class="typt-list-add-div">

        <div class="action_div">
          <el-button type="primary" @click="execute" >执行医嘱</el-button>
        </div>
      </div>
        <el-table
          :data="tableData"
          height="80%"
          style="width: 100%"
          @selection-change="changeFun"
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="isExecute">
          </el-table-column>
          <el-table-column
            type="index"
            width="55"
            label="序号"
          >
            <template slot-scope="scope">
              <span>{{ scope.$index+( page - 1) *size  + 1 }} </span>
            </template>
          </el-table-column>
          <el-table-column
            label="医嘱内容"
            width=""
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>医嘱编号: {{ scope.row.adviceID }}</p>
                <p>医嘱类型: {{ scope.row.adviceType }}</p>
                <p>开始时间: {{ scope.row.adviceStartTime }}</p>
                <p>开嘱医生: {{ scope.row.adviceAuthor }}</p>
                <p>复核时间: {{ scope.row.adviceCheckTime }}</p>
                <p>复核护士: {{ scope.row.adviceCheckAuthor }}</p>
                <p>停嘱时间: {{ scope.row.adviceStopTime }}</p>
                <p>停嘱医生: {{ scope.row.adviceStopAuthor }}</p>
                <p>停嘱复核时间: {{ scope.row.adviceStopCheckTime }}</p>
                <p>停嘱复核护士: {{ scope.row.adviceStopCheckAuthor }}</p>
                <p>执行时间: {{ scope.row.adviceExecuteTime }}</p>
                <p>执行护士: {{ scope.row.adviceExecutor }}</p>
                <p style="width: 200px;overflow: auto">备注: {{ scope.row.remark }}<p/>
                <div slot="reference" class="name-wrapper">
                  <p class="smsm-tag-p">{{ scope.row.adviceContent }}</p>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="医嘱类型"
            width=""
            prop="adviceType"
          />
          <el-table-column
            label="开始时间"
            width=""
            prop="adviceStartTime"
          />
          <el-table-column
            label="停嘱时间"
            width=""
            prop="adviceStopTime"
          />
          <el-table-column
            label="医嘱状态"
            width=""
            prop="adviceStatus"
          />
          <el-table-column
            label="备注"
            width=""
            prop="remark"
          />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">修改备注</el-button>
            </template>
          </el-table-column>
        </el-table>
      <div class="paginationDiv">
          <el-pagination
            :current-page="page"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="100"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
    </div>
    <!-- 新增dialog-->
    <el-dialog title="修改备注" :visible.sync="dialogFormVisible" width="30%"
               :close-on-click-modal=false
               :close-on-press-escape=false
    >
      <el-form :model="formRemark" :rules="rules" ref="formRemark">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="formRemark.remark" class="textarea-remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitEdit('formRemark')">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import { queryList, executeTestament, editRemark } from '@/api/hpms/advices/advice'
import dateFormat from '../../../assets/hpms/utils/dateFormat'
import PatientList from './PatientList'
export default {
  name: 'BillTable',
  components: {
    'patient-list': PatientList
  },
  data () {
    return {
      page: 1,
      size: 10,
      total: 0,
      form: {
        timeVal: ''
      },
      formRemark: {
        adviceCode: '',
        remark: ''
      },
      rules: {
        remark: [
          { min: 0, max: 100, message: '最多不超过100个字符', trigger: 'blur' }
        ]
      },
      tableData: [],
      multipleSelection: [],
      dialogFormVisible: false,
      patientId: ''
    }
  },
  mounted: function () {
    this.timeInit()
  },
  methods: {
    // 查询
    onSubmit () {
      this.page = 1
      this.size = 10
      if (this.patientId === '' || this.patientId === null || this.patientId === undefined || this.patientId === 'null') {
        this.$message({
          message: '请先从左侧患者一览中选择要查看的患者',
          type: 'warning'
        })
      } else {
        this.queryData()
      }
    },
    // 清空筛选条件
    reSearch () {
      this.timeInit()
      this.page = 1
      this.size = 10
      this.queryData()
    },
    // 时间初始化
    timeInit () {
      const endDate = dateFormat(new Date(), 'yyyy-MM-dd')
      const beginDate = this.nDay(0)
      this.form.timeVal = ['' + beginDate + ' 00:00:00', '' + endDate + ' 23:59:59']
    },
    // 查询列表
    queryData () {
      queryList({
        PatientID: this.patientId,
        startTime: this.form.timeVal === null ? '' : this.form.timeVal[0],
        endTime: this.form.timeVal === null ? '' : this.form.timeVal[1],
        page: this.page,
        size: this.size,
        AdviceType: ''
      }).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.tableData = res.data.list
        }
        this.total = res.data.total
      })
        .catch(error => {
          this.$message.error(JSON.stringify(error) + '数据获取失败')
        })
    },
    // 改变checkbox状态
    isExecute (row, index) {
      console.log(row.adviceStatus)
      if (row.adviceStatus === '已执行') {
        return false
      } else {
        return true
      }
    },
    // 分页方法
    handleSizeChange (val) {
      this.size = val
      this.queryData()
    },
    handleCurrentChange (val) {
      this.page = val
      this.queryData()
    },
    // 获取n天之后的日期
    nDay (day) {
      const today = new Date()
      const targetDay_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(targetDay_milliseconds)
      const tYear = today.getFullYear()
      let tMonth = today.getMonth()
      let tDate = today.getDate()
      tMonth = this.doHandleMonth(tMonth + 1)
      tDate = this.doHandleMonth(tDate)
      return tYear + '-' + tMonth + '-' + tDate
    },
    doHandleMonth (month) {
      let m = month
      if (month.toString().length === 1) {
        m = '0' + month
      }
      return m
    },
    // 执行遗嘱
    execute () {
      console.log(this.multipleSelection)
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择要执行的医嘱',
          type: 'warning'
        })
      } else {
        let ids = ''
        for (let i of this.multipleSelection) {
          ids = ids + i.adviceID + `,`
        }
        ids = ids.substring(0, ids.length - 1)
        executeTestament(ids).then(res => {
          if (res.status === 200) {
            console.log(res)
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.queryData()
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error) + '数据获取失败')
        })
      }
    },
    // 获取患者id
    getPatInfo (row, index) {
      // 判断是否为切换tab动作，或者无相关(在院、转科、出院)患者
      if (row === null || row === '' || row === undefined || row === 'null') {
        this.patientId = 'null'
        this.queryData()
      } else {
        // 判断是否切换患者
        if (this.patientId !== row.patientId) {
          this.patientId = row.patientId
          this.queryData()
        }
      }
    },
    // 修改备注
    handleEdit (index, row) {
      this.formRemark.remark = row.remark
      this.formRemark.adviceCode = row.adviceID
      this.dialogFormVisible = true
    },
    // 提交修改备注
    onSubmitEdit (formRemark) {
      this.$refs['formRemark'].validate((valid) => {
        if (valid) {
          editRemark({
            adviceCode: this.formRemark.adviceCode,
            remark: this.formRemark.remark
          }).then(res => {
            console.log(res)
            if (res.status === 200) {
              this.dialogFormVisible = false
              this.$message({
                message: '备注修改成功',
                type: 'success'
              })
              this.queryData()
            }
            this.total = res.data.total
          })
            .catch(error => {
              this.$message.error(JSON.stringify(error) + '数据获取失败')
            })
        } else {
          return false
        }
      })
    },
    changeFun (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .textarea-remark .el-textarea__inner {
    height: 100px;
  }
  .smsm-tag-p{
    background-color:#ecf5ff;
    border-color:#d9ecff;
    color:#409EFF;
    border-width: 1px;
    border-style: solid;
    border-radius:4px;
  }
</style>
