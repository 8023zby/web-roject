<template>
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true" class="typt-list-search">
      <el-form-item label="岗位名称：">
        <el-input v-model="formSearchData.jobTypeName" placeholder="请输入岗位名称" size="small"></el-input>
      </el-form-item>
      <el-form-item label="岗位编码：">
        <el-input v-model="formSearchData.jobTypeCode" placeholder="请输入岗位编码" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary"  icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!--end-->
    <hr />
    <div class="typt-list-add-div">
      <el-button type="warning" size="small" @click="handleAdd" icon="el-icon-plus">添加</el-button>
      <div class="action_div">
        <!--<el-button type="danger" size="small">批量删除</el-button>-->
      </div>
    </div>
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      height="80%"
      >
      <el-table-column prop="jobTypeName" label="岗位名称" align="center">
      </el-table-column>
      <el-table-column prop="jobTypeCode" label="岗位类型编码" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column  fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button  type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button  type="text" @click="handleDelete(scope.row)" style="color: #f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
    <!--分页-->
    <div class="paginationDiv">
      <!--组件页码显示-->
      <page-info :pageInfo="pageInfo"></page-info>
    </div>
    <!--end-->
  </div>
</template>

<script>
import PageInfo from '../../../../components/passport/PageInfo'
import BaseManage from '../../../../assets/passport/mixins/BaseManage'

export default {
  components: {
    PageInfo
  },
  mixins: [BaseManage],
  data () {
    return {
      modelName: '岗位类型',
      formSearchData: {
        jobTypeName: '',
        jobTypeCode: ''
      },
      url: '/ifms/web-org/jobType'
    }
  },
  created () {
    this.onSearchSubmit()
  },
  methods: {
    // 修改岗位类型
    handleEdit (row) {
      this.$emit('option-changed', 'add', { id: row.jobTypeId })
    },
    // 添加岗位类型
    handleAdd () {
      this.$emit('option-changed', 'add')
    },
    // 删除岗位类型
    handleDelete (row) {
      this.del(`${this.url}/${row.jobTypeId}`)
    }
  }
}
</script>

<style scoped></style>
