<template>
  <div class="typt-list-container">
    <div class="typt-list-add-div">
      <div class="action_div">
        <el-button type="primary" size="small" @click="checkInterface">接口检测</el-button>
      </div>
    </div>
    <!--end-->
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      height="90%"
      >
      <el-table-column prop="success" label="接口成功数" align="center"></el-table-column>
      <el-table-column prop="error" label="接口失败数" align="center">
        <template slot-scope="scope">
          <span class="el-button-text-color" @click="showDetail(scope.row)">{{scope.row.error}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
  </div>
</template>

<script>
import BaseManage from '../../../assets/passport/mixins/BaseManage'
import { AxiosApi } from '../../../api/passport/http'
import { MsgShow } from '../../../assets/passport/js/Message'
export default {
  mixins: [BaseManage],
  data () {
    return {
      modelName: '接口检测',
      url: '/omms/app-apiAnalysis/getStatus'

    }
  },
  created () {

  },
  methods: {
    // 查看详情
    showDetail (row) {
      this.$emit('option-changed', 'detail')
    },
    // 接口检测
    checkInterface () {
      this.loading = true
      AxiosApi(this.url, {}, 'GET', {
        token: localStorage.getItem('token')
      }).then(res => {
        this.loading = false
        if (res.status === 200) {
          this.tableData = [res.data]
        }
      }).catch(err => {
        this.loading = false
        MsgShow('error', '接口长时间无返回，请联系管理员')
      })
    }
  }
}
</script>
