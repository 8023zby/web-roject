<template>
  <div class="typt-list-container org-cls">
    <!--查询-->
    <el-form :inline="true" class="typt-list-search">
      <el-form-item label="机构名称：">
        <el-input v-model="formSearchData.orgName" placeholder="请输入机构名称" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary"  icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
          <el-button type="text" @click="reload">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!--end-->
    <hr />
    <div class="typt-list-add-div">
      <el-button type="warning" size="small" @click="$emit('option-changed', 'add')" icon="el-icon-plus">添加</el-button>
    </div>
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
      <el-table-column prop="orgLevel" label="机构类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.orgLevel == 2">医疗</span>
          <span v-if="scope.row.orgLevel == 3">养老</span>
        </template>
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
      <el-table-column v-if="orgLevel !== 3" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="$emit('option-changed', 'add', scope.row)">编辑</el-button>
          <el-button v-if="scope.row.orgStatus===1" type="text" @click="verifyRefuse(scope.row)" style="color: #f56c6c">冻结</el-button>
          <el-button v-if="scope.row.orgStatus===3" type="text" @click="verifyRefuse(scope.row)" style="color: #f56c6c">解冻</el-button>
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
import { AxiosJsonApi } from '../../../api/passport/http'
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
      url: '/passport/web-rbac/org',
      orgLevel: 2,
      statusObj: {
        1: '正常',
        3: '冻结'
      }
    }
  },
  activated () {
    let orgInfo = JSON.parse(localStorage.getItem('orgInfo'))
    this.orgLevel = orgInfo.orgLevel
    this.onSearchSubmit('page')
  },
  methods: {
    // 冻结
    verifyRefuse (row) {
      AxiosJsonApi(`${this.url}/orgStatus`, { orgId: row.orgId }, 'PUT').then(res => {
        ResultMsg(res, '操作', () => {
          this.onSearchSubmit('page')
        })
      })
    }
  }
}
</script>
