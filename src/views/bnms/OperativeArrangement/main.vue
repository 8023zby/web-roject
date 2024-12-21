<template>
  <layout_list v-loading="loading">
    <!--      查询条件-->
    <div slot="query" class="query-items">
      <el-form :inline="true" :model="search_form" ref="search_form" class="demo-form-inline">
        <el-form-item label="开始时间:" prop="beginTime">
          <el-col :span="11">
            <el-date-picker
              v-model="search_form.beginTime"
              type="datetime"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间:" prop="endTime">
          <el-col :span="11">
            <el-date-picker
              v-model="search_form.endTime"
              type="datetime"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="床号:" prop="bedName">
          <el-select v-model="search_form.bedName">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(item,index) in bed_data"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-uni="'shoushuanpai_search'" type="primary" @click="searchForm()" icon="el-icon-search">查询</el-button>
          <el-button v-uni="'shoushuanpai_reset'" type="text" @click="resetForm('search_form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--      表格-->
    <div slot="main" class="main-list">
    <el-table
      ref="table"
      class="table"
      :data="table_data"
      highlight-current-row
      height="100%"
    >
      <!-- <el-table-column type="index" fixed="left" label="序号" width="60" align="center">
        <template scope="scope">
          <span>{{(search_form.page - 1) * search_form.size + scope.$index + 1}}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="bedName"
        label="床号"
        align="center"
        width="95"
      ></el-table-column>
      <el-table-column
        prop="patientName"
        label="姓名"
        align="center"
        min-width="160"
      ></el-table-column>
      <el-table-column
        prop="patientSex"
        label="性别"
        align="center"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="patientAge"
        label="年龄"
        align="center"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="operationTime"
        label="手术时间"
        align="center"
        min-width="60"
      ></el-table-column>
      <el-table-column
        prop="preoperativeDiagnosis"
        label="术前诊断"
        align="center"
        min-width="95"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="operationProject"
        label="手术项目"
        align="center"
        min-width="60"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="operationDeptName"
        label="执行科室"
        align="center"
        min-width="60"
      >
      </el-table-column>
      <el-table-column
        prop="operationLevel"
        label="手术等级"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="anesthesiaMode"
        label="麻醉方式"
        align="center"
        min-width="80"
      >
      </el-table-column>
      <el-table-column
        prop="operationSurgeonName"
        label="主刀医师"
        align="center"
        width="95"
      ></el-table-column>
      <el-table-column
        prop="anesthesiaSurgeonName"
        label="麻醉医师"
        align="center"
        min-width="100"
      >
      </el-table-column>
      <el-table-column
        prop="firstMateName"
        label="第一助手"
        align="center"
        width="95"
      ></el-table-column>
      <el-table-column
        prop="operationStatus"
        label="状态"
        align="center"
        min-width="100"
      ></el-table-column>
    </el-table>
    </div>
    <!-- 分页 -->
    <div slot="footer" class="page-bar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page_current"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_total"
      >
      </el-pagination>
    </div>
  </layout_list>
</template>

<script>
import layout_list from '../../../components/bnms/layout/list'
import moment from 'moment'
import { ApiOperativeArrangement, ApiBedRoom } from '../../../api/bnms/index'

export default {
  name: 'main',
  components: { layout_list },
  data () {
    return {
      loading: false,
      page_current: 1,
      page_total: 1,
      search_form: {
        beginTime: moment().format('YYYY-MM-DD 00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59'),
        bedName: '',
        page: 1,
        size: 10
      },
      deptId: '',
      table_data: [],
      bed_data: []
    }
  },
  created () {
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.deptId = deptInfo.deptId || ''
    this.getBedData()
    this.getOperationList()
  },
  methods: {
    searchForm () {
      this.handleCurrentChange(1)
    },
    getBedData () {
      ApiBedRoom.bedList({ deptId: this.deptId, page: 1, size: 9999 }).then(
        res => {
          let list = res.data ? (res.data.list || []) : []
          let arr = []
          for (let i = 0; i < list.length; i++) {
            arr.push({ label: list[i].bedName + '床', value: list[i].bedName, roomName: list[i].roomName })
          }
          this.bed_data = arr
        }
      )
    },
    getOperationList () {
      this.table_data = []
      this.loading = true
      this.search_form.beginTime = moment(this.search_form.beginTime).format('YYYY-MM-DD HH:mm') + ':00'
      this.search_form.endTime = moment(this.search_form.endTime).format('YYYY-MM-DD HH:mm') + ':59'
      ApiOperativeArrangement.select(this.search_form)
        .then(res => {
          console.log(res)
          this.table_data = res.data ? (res.data.list || []) : []
          this.page_total = res.data ? (res.data.total || 0) : []
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getOperationList()
    },
    handleSizeChange (val) {
      this.search_form.size = val
      this.getOperationList()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_form.page = val
      this.getOperationList()
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";
  .container {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    position: relative;
  }

  .right {
    flex: 1;
    width: 0;
    overflow: hidden;
    position: relative;
  }

  /*.dams_toolbar .operation_right{*/
  /*  width: 12%;*/
  /*}*/
  /deep/ .el-dialog__wrapper .el-dialog {
    width: 22%;
  }

  .typt-list-container {
    height: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }

  .table {
    flex: 1;
    height: 0;
    overflow: hidden;
  }
</style>
