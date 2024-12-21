<!-- 预约情况 -->
<template>
  <div class="typt-list-container">
    <!-- 条件 -->
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="床号：">
        <el-input v-model="formData.bedno"></el-input>
      </el-form-item>
      <el-form-item label="预约状态：">
        <el-select v-model="formData.state">
          <el-option label="全部" :value="''"></el-option>
          <el-option label="预约成功" :value="1"></el-option>
          <el-option label="未预约" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预约时间：">
        <el-date-picker v-model="formData.beginTime" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width:182px;margin-left: 12px" />
        <span style="padding: 0 11px">至</span>
        <el-date-picker v-model="formData.endTime" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width:182px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">搜索</el-button>
        <el-button type="text" @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 条件 -->

    <!-- 表格 -->
    <el-table :data="list" :header-cell-style="{ background: '#f9f9f9' }" height="100%" stripe v-loading="theLoading">
      <el-table-column prop="bedName" label="床位" width="70" align="center">
      </el-table-column>
      <el-table-column prop="patientName" label="姓名" width="120" align="center">
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="70" align="center">
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="70" align="center">
      </el-table-column>
      <el-table-column label="预约时间" width="120" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.appointsDateTime.split(" ")[0] }}</p>
          <p>{{ scope.row.appointsDateTime.split(" ")[1] }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="itemName" label="项目" width="110" align="center">
      </el-table-column>
      <el-table-column prop="appointsDeptName" label="预约执行科室" width="120" align="center">
      </el-table-column>
      <el-table-column label="预约状态" width="90" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isAppointment == 1" style="color: #67c23a">已预约</span>
          <span v-else style="color: #e6a23c">未预约</span>
        </template>
      </el-table-column>
      <el-table-column label="预约队列顺序" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" :content="scope.row.appointsQueueName + scope.row.appointsQueue" placement="top">
            <div class="appoint-text">
              {{ scope.row.appointsQueueName + scope.row.appointsQueue }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="前往地址" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" :content="scope.row.appointAddress" placement="top">
            <div class="appoint-text">
              {{ scope.row.appointAddress }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="注意事项">
        <template slot-scope="scope">
          <el-tooltip class="item" :content="scope.row.appointAttention" placement="top">
            <div class="appoint-text">
              {{ scope.row.appointAttention }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 -->
    <div class="pa-view">
      <el-pagination background @size-change="onSizeChange" @current-change="onNumberChange" :current-page="pageNumber" :page-sizes="[10, 15, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import * as API from '@/api/wnms/qiniu'
export default {
  data () {
    return {
      formData: {
        bedno: '',
        state: '',
        beginTime: '',
        endTime: ''
      },
      total: 100,
      pageSize: 10,
      pageNumber: 1,
      theLoading: false,
      list: []
    }
  },
  components: {},
  computed: {},
  watch: {},
  methods: {
    onStomachAndUrine (stomach, urine) {
      let res = ''
      if (stomach == 0) res += '需要空腹'
      if (stomach == 0 && urine == 0) res += '，'
      if (urine == 0) res += '需要憋尿'
      res += '。'
      return res
    },
    onSubmit () {
      this.pageNumber = 1
      this.getList()
    },
    onSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    onNumberChange (val) {
      this.pageNumber = val
      this.getList()
    },
    onReset () {
      this.formData = {
        bedno: '',
        state: '',
        beginTime: '',
        endTime: ''
      }

      // 设置为当天时间
      let _date = new Date()
      let _date_year = _date.getFullYear()
      let _date_month = _date.getMonth() + 1
      let _date_day = _date.getDate()
      if (_date_month < 10) _date_month = '0' + _date_month
      if (_date_day < 10) _date_day = '0' + _date_day

      this.formData.beginTime =
        _date_year + '-' + _date_month + '-' + _date_day + ' 00:00:00'
      this.formData.endTime =
        _date_year + '-' + _date_month + '-' + _date_day + ' 00:00:00'

      this.pageNumber = 1
      this.getList()
    },
    async getList () {
      this.theLoading = true
      let deptInfo = JSON.parse(window.localStorage.getItem('selectDeptInfo'))

      // 时间验证，开始时间与结束时间必须同时填写
      if (
        (this.formData.beginTime && !this.formData.endTime) ||
        (!this.formData.beginTime && this.formData.endTime)
      ) {
        this.$message('“开始时间”与“结束时间”必须同时选中 ')
        this.theLoading = false
        return
      }

      // 处理结束时间为当天的最后时间
      this.formData.endTime = this.formData.endTime.replace(
        '00:00:00',
        '23:59:59'
      )

      let res = await API.getAppointList({
        deptId: deptInfo.deptId,
        orgId: deptInfo.orgId,
        startTime: this.formData.beginTime,
        endTime: this.formData.endTime,
        bedName: this.formData.bedno,
        page: this.pageNumber,
        size: this.pageSize,
        isAppointment: this.formData.state
      })
      if (res.status == 200) {
        this.total = res.data.total
        this.list = res.data.list
      }
      this.theLoading = false
    }
  },
  created () { },
  mounted () {
    // 时间处理，如果没有时间填写，则默认查看当天数据
    let _date = new Date()
    let _date_year = _date.getFullYear()
    let _date_month = _date.getMonth() + 1
    let _date_day = _date.getDate()
    if (_date_month < 10) _date_month = '0' + _date_month
    if (_date_day < 10) _date_day = '0' + _date_day

    this.formData.beginTime =
      _date_year + '-' + _date_month + '-' + _date_day + ' 00:00:00'
    this.formData.endTime =
      _date_year + '-' + _date_month + '-' + _date_day + ' 00:00:00'

    this.getList()
  },
  beforeCreate () { }, // 生命周期 - 创建之前
  beforeMount () { }, // 生命周期 - 挂载之前
  beforeUpdate () { }, // 生命周期 - 更新之前
  updated () { }, // 生命周期 - 更新之后
  beforeDestroy () { }, // 生命周期 - 销毁之前
  destroyed () { }, // 生命周期 - 销毁完成
  activated () { } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
.typt-list-container {
  height: 99% !important;
}
.pa-view {
  text-align: center;
  padding: 10px 0;
  box-sizing: border-box;
}
.appoint-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
