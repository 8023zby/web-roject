<template>
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true" class="typt-list-search">
      <el-form-item label="岗位名称：">
        <el-input v-uni="actFormKey + 'gangweimingcheng'" v-model="formSearchData.jobName" placeholder="请输入" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button v-uni="actKey + 'search'" type="primary"  icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
          <el-button v-uni="actKey + 'reset'" type="text" @click="reload">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!--end-->
    <hr />
    <div class="typt-list-add-div">
      <el-button v-if="authorityObj['saveJob']" type="warning" size="small" @click="handleAdd" icon="el-icon-plus">添加</el-button>
      <div class="action_div">
        <sort-type v-uni="actKey + 'sortType'" :orderBy="orderBy" @query="queryByOrder" />
      </div>
    </div>
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      height="80%"
      ref="multipleTable"
      >
      <el-table-column prop="jobName" label="岗位名称" align="center">
      </el-table-column>
      <el-table-column prop="jobTypeName" label="岗位类型" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column v-if="authorityObj['updateJob'] || authorityObj['deleteJob']" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button v-uni="actKey + 'edit-' + scope.row.jobId" v-if="authorityObj['updateJob']" type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-uni="actKey + 'delete-' + scope.row.jobId" v-if="authorityObj['deleteJob']" type="text" @click="handleDelete(scope.row)" style="color: #f56c6c">删除</el-button>
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
import PageInfo from '../../../../components/passport/PageInfo'
import SortType from '../../../../components/passport/SortType'
import BaseManage from '../../../../assets/passport/mixins/BaseManage'

export default {
  components: {
    PageInfo, SortType
  },
  mixins: [BaseManage],
  inject: ['checkMoreAuthority'],
  data () {
    return {
      orderBy: [{
        id: 'createTime desc',
        label: '创建时间降序'
      },
      {
        id: 'createTime asc',
        label: '创建时间升序'
      },
      {
        id: 'jobName desc',
        label: '岗位名称降序'
      }, {
        id: 'jobName asc',
        label: '岗位名称升序'
      }],
      modelName: '岗位',
      formSearchDataStatic: {
        orderBy: ''
      },
      formSearchData: {
        jobName: ''
      },
      url: '/ifms/web-org/job',
      authorityArr: ['saveJob', 'updateJob', 'deleteJob'],
      actFormKey: 'gangweiliebiao__',
      actKey: 'gangweiliebiao_'
    }
  },
  activated () {
    // 判断是否有动作权限
    this.getListAuthority()
    this.onSearchSubmit('page')
  },
  methods: {
    // 修改岗位
    handleEdit (row) {
      this.$emit('option-changed', 'add', { id: row.jobId })
    },
    // 添加岗位
    handleAdd () {
      this.$emit('option-changed', 'add')
    },
    // 删除岗位
    handleDelete (row) {
      this.del(`${this.url}/${row.jobId}`)
    }
  }
}
</script>
