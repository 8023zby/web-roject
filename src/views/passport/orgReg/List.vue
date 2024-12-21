<template>
  <div class="typt-list-container org-cls">
    <!--查询-->
    <el-form :inline="true" class="typt-list-search">
      <el-form-item label="机构名称：">
        <el-input v-model="formSearchData.orgName" placeholder="请输入" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary"  icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!--end-->
    <hr />
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      height="80%"
      >
      <el-table-column prop="orgCode" label="机构编号" align="center">
      </el-table-column>
      <el-table-column prop="orgName" label="机构名称" align="center">
      </el-table-column>
      <el-table-column prop="orgStatus" label="机构状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.orgStatus!==null&&scope.row.orgStatus!==''"
            :type="(scope.row.orgStatus === 2||scope.row.orgStatus === 3) ? 'danger' : scope.row.orgStatus === 0 ? 'primary': 'success'"
            disable-transitions
          >{{statusObj[scope.row.orgStatus]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column  fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button  type="text" @click="verifyPass(scope.row)">审核通过</el-button>
          <el-button  type="text" @click="verifyRefuse(scope.row)" style="color: #f56c6c">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
    <!--分页-->
    <!--组件页码显示-->
    <page-info :pageInfo="pageInfo"></page-info>
    <!--end-->
  </div>
</template>

<script>
import PageInfo from '../../../components/passport/PageInfo'
import BaseManage from '../../../assets/passport/mixins/BaseManage'
import { AxiosApi } from '../../../api/passport/http'
import { ResultMsg } from '../../../assets/passport/js/Message'
export default {
  components: {
    PageInfo
  },
  mixins: [BaseManage],
  data () {
    return {
      modelName: '机构',
      formSearchData: {
        orgName: ''
      },
      url: '/passport/web-rbac/medical',
      statusObj: {
        0: '审核中',
        1: '审核通过',
        2: '拒绝',
        3: '冻结'
      }
    }
  },
  created () {
    this.onSearchSubmit()
  },
  methods: {
    // 审核通过
    verifyPass (row) {
      AxiosApi(`${this.url}/${row.orgId}/1`, { rejectReason: '' }, 'PUT').then(res => {
        ResultMsg(res, '审核', this.reload)
      })
    },
    // 审核拒绝
    verifyRefuse (row) {
      this.$prompt('原因：', '审核', {
        confirmButtonText: '确 认',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputType: 'textarea',
        inputErrorMessage: '请输入拒绝原因'
      }).then(({ value }) => {
        AxiosApi(`${this.url}/${row.orgId}/2`, { rejectReason: value }, 'PUT').then(res => {
          ResultMsg(res, '审核', this.reload)
        })
      }).catch(() => {})
    }
  }
}
</script>
