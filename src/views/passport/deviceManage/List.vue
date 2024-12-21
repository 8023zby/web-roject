<template>
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true" class="typt-list-search">
      <el-form-item label="登录应用名称：">
        <el-input v-model="formSearchData.landingEndName" placeholder="请输入" size="small" clearable></el-input>
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
      <el-button type="warning" size="small" @click="handleAdd" icon="el-icon-plus">添加</el-button>
    </div>
    <!--列表-->
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      height="80%"
      ref="multipleTable"
      >
      <el-table-column prop="landingEndName" label="登录应用名称" align="center">
      </el-table-column>
      <el-table-column prop="landingEndCode" label="登录应用标识" align="center">
      </el-table-column>
      <el-table-column prop="deviceType" :formatter="formatterData" label="关联终端类型" align="center">
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center">
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
    <page-info :pageInfo="pageInfo"></page-info>
    <!--end-->
  </div>
</template>

<script>
import PageInfo from '../../../components/passport/PageInfo'
import BaseManage from '../../../assets/passport/mixins/BaseManage'
import { PatientDictionary } from '../../../assets/passport/js/Dictionary'
export default {
  components: {
    PageInfo
  },
  mixins: [BaseManage],
  data () {
    return {
      modelName: '登录应用',
      formSearchData: {
        landingEndName: ''
      },
      url: '/devops/web-devops/landingEnd'
    }
  },
  created () {
    PatientDictionary['WEB'] = 'PC端'
    this.onSearchSubmit()
  },
  methods: {
    // 对照
    formatterData (row) {
      let str = ''
      if (row.deviceType === null || row.deviceType === '') {
        row.deviceType = '[]'
      }
      let deviceType = JSON.parse(row.deviceType)
      deviceType.forEach((item) => {
        if (!PatientDictionary[item]) return
        str += PatientDictionary[item] + '、'
      })
      return `${str.substr(0, str.length - 1)}`
    },
    // 修改登录应用
    handleEdit (row) {
      this.$emit('option-changed', 'add', { id: row.landingEndId })
    },
    // 添加登录应用
    handleAdd () {
      this.$emit('option-changed', 'add')
    },
    // 删除登录应用
    handleDelete (row) {
      this.del(`${this.url}/${row.landingEndId}`)
    }
  }
}
</script>
