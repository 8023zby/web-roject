<template>
  <layout v-loading="loading">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form :inline="true" :model="search_from" ref="search_form" label-suffix="：">
        <el-form-item prop="labelName" label="监测时间">
          <el-date-picker
            v-model="search_from.targetDate"
            type="date"
            :clearable="false"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="searchForm()"
          >搜索
          </el-button>
          <el-button type="text" @click="resetForm()"
          >重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table
        ref="table"
        :data="table_data"
        :row-key="getRowKeys"
        stripe
        highlight-current-row
        @selection-change="handleTableSelectionChange"
        height="100%"
      >
        <!-- <el-table-column type="index" label="序号" width="120"></el-table-column> -->
        <el-table-column
          prop="beginTime"
          label="测量时间段"
          align="center"
          min-width="250"
        >
          <template slot-scope="scope">
            {{ scope.row.beginTime }} ~ {{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="relationWarn"
          label="平均心率"
          min-width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.avgValue }}{{ scope.row.unit }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="charts(scope.row)" type="text">
              查看趋势图
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
        :page-size="search_from.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_total"
      >
      </el-pagination>
    </div>
  </layout>
</template>

<script>
import moment from 'moment'
import layout from '../../../components/nrms/layout/list'
import { ApiHeartRateMonitoring } from '../../../api/nrms/index'

export default {
  name: 'heart_rate_monitoring_list',
  props: ['patient', 'patientType'],
  data () {
    return {
      loading: false,
      page_current: 1,
      page_total: 0,
      table_data: [],
      multipleSelection: [],
      deptId: '',
      // 搜索表单
      search_from: {
        patientId: '',
        targetDate: moment().format('YYYY-MM-DD'),
        size: 10,
        page: 1
      }
    }
  },
  watch: {
    patient: {
      handler (val) {
        val && val['id'] && this.getData()
      },
      immediate: true
    }
  },
  created () {
    let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
    this.deptId = deptInfo.deptId || ''
  },
  methods: {
    getData () {
      this.loading = true
      this.search_from.patientId = this.patient.patientId
      ApiHeartRateMonitoring.select(this.search_from)
        .then(res => {
          const data = res.data || []
          const total = res.total || 0
          this.table_data = data
          this.page_total = total
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.message)
        })
    },
    searchForm () {
      this.handleCurrentChange(1)
    },
    resetForm () {
      this.$refs.search_form.resetFields()
      this.handleCurrentChange(1)
    },
    charts (row) {
      this.$emit('changed', 'Charts', row)
    },
    getRowKeys (row) {
      return row.labelId
    },
    handleSizeChange (val) {
      this.search_from.size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.page_current = this.search_from.page = val
      this.getData()
    },
    handleTableSelectionChange (val) {
      this.multipleSelection = val
    }
  },
  components: {
    layout
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";
</style>
