<template>
  <div class="typt-list-container">
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      height="90%"
      >
      <el-table-column prop="serviceCode" label="服务标识" align="center"></el-table-column>
      <el-table-column prop="serviceName" label="服务名称" align="center"></el-table-column>
      <el-table-column prop="serverVersion" label="期望服务端版号" align="center"></el-table-column>
      <el-table-column prop="frontVersion" label="期望前端版号" align="center"></el-table-column>
      <el-table-column prop="nowServerVersion" label="当前服务端版号" align="center"></el-table-column>
      <el-table-column prop="nowFrontVersion" label="当前前端版号" align="center"></el-table-column>
      <el-table-column prop="checked" label="版本比对结果" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.checked === 'true'" class="el-icon-circle-check right-cls"></i>
          <i v-else class="el-icon-circle-close error-cls"></i>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
  </div>
</template>

<script>
import { AxiosApi } from '../../../../api/passport/http'
export default {
  data () {
    return {
      url: '/passport/web-rbac/versionsService/all',
      loading: false,
      tableData: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 请求列表
    getData () {
      AxiosApi(this.url, {}, 'GET').then(res => {
        this.loading = false
        if (res.status === 200) {
          let { data } = res
          this.tableData = data
        }
      })
    }
  }
}
</script>
<style>
.right-cls{
  font-size: 24px;
  color: #67C23A;
}
.error-cls{
  font-size: 24px;
  color: #f56f6c;
}
</style>
