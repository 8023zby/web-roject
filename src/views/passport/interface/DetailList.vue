<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls" style="position: relative">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">查看详情</div>
      <el-button @click="$emit('option-changed', 'list')" class="el-small-btn" style="position: absolute;right: 20px" type="primary">返回</el-button>
    </div>
    <div class="typt-list-container">
      <!--查询-->
      <el-form :inline="true" class="typt-list-search">
        <el-form-item label="接口状态：">
          <el-input v-model="formSearchData.status" placeholder="请输入" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button type="primary"  icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
            <el-button type="text" @click="reload">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <!--列表-->
      <el-table
        :data="tableData"
        stripe
        v-loading="loading"
        height="90%"
        >
        <el-table-column prop="path" label="接口名称" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center"></el-table-column>
        <el-table-column prop="message" label="失败原因" align="center"></el-table-column>
      </el-table>
      <!--end-->
      <!--分页-->
      <!--组件页码显示-->
      <page-info :pageInfo="pageInfo"></page-info>
      <!--end-->
    </div>
  </div>
</template>

<script>
import PageInfo from '../../../components/passport/PageInfo'
import BaseManage from '../../../assets/passport/mixins/BaseManage'
export default {
  components: {
    PageInfo
  },
  mixins: [BaseManage],
  data () {
    return {
      modelName: '接口',
      url: '/omms/app-apiAnalysis/getLog',
      formSearchData: {
        status: ''
      }
    }
  },
  created () {
    this.onSearchSubmit()
  },
  methods: {

  }
}
</script>
