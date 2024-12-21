<template>
  <!--护士排班-层级管理-->
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true" :model="formSearchData" class="demo-form-inline" ref="formSearch">
      <el-form-item label="层级名称：">
        <el-input v-model="formSearchData.hierarchyName" placeholder="请输入" clearable size="small"/>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary" style="width: 80px;"
                     class="el-button-radius" icon="el-icon-search"
                     @click="onSearchSubmit" size="small">搜索
          </el-button>
          <el-button type="text" @click="reload">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!--end-->
    <hr/>
    <!--@click="$emit('option-changed', 'add', { businessType: formSearchData.businessType })"-->
    <div class="typt-list-add-div">
      <el-button type="warning" size="small"
                 @click="addItem"
                 icon="el-icon-plus">添加
      </el-button>
    </div>
    <!--列表-->
    <el-table
      :data="tableData"
      :stripe="CONFIG.table.stripe"
      v-loading="loading"
      height="60%"
    >
      <el-table-column
        align="center"
        prop="hierarchyName"
        label="层级名称"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="hierarchyDescribe"
        label="层级描述"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="200">
        <!--@click="$emit('option-changed', 'add', { businessType: formSearchData.businessType }, scope.row)">编辑-->
        <template slot-scope="scope">
          <el-button type="text"
                     @click="editItem(scope.row)">编辑
          </el-button>
          <el-button type="text" style="color:red" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->

    <div v-show="true"
         slot="footer" style="margin: 25px 0;"></div>

    <!--分页-->
    <div class="paginationDiv"
         v-show="false">
      <!--组件页码显示-->
      <page-info :pageInfo="pageInfo"/>
    </div>
    <!--end-->
    <el-dialog append-to-body
               :title="title"
               :visible.sync="visible"
               :show-close="false"
               width="540px"
               :close-on-click-modal="false">
      <level-add :modifyData="modifyData"
                 @close-item="closeItem"
                 :params="{ businessType: formSearchData.businessType }"/>
    </el-dialog>
  </div>
</template>

<script>
import BaseManage from '../../../assets/hsms/mixins/BaseManage'
import PageInfo from '../../../components/hsms/PageInfoCommon'
import LevelAdd from './LevelAdd'
import config from '../../../assets/hsms/mixins/config'

export default {
  name: 'NurseLevel',
  components: { PageInfo, LevelAdd },
  mixins: [BaseManage, config],
  props: ['params'],
  data () {
    return {
      title: '添加',
      modifyData: {},
      visible: false,
      modelName: '层级',
      formSearchData: {
        hierarchyName: '',
        businessType: 'NURSE'
      },
      url: '/hsms/web-hs/hierarchy'
    }
  },
  created () {
    this.formSearchData.businessType = this.params.businessType
    this.isPage = false
    this.getData()
  },
  methods: {
    addItem () {
      this.visible = true
      this.title = '添加'
      this.modifyData = {}
    },
    editItem (row) {
      this.modifyData = row
      this.$nextTick(function () {
        this.visible = true
        this.title = '编辑'
      })
    },
    closeItem () {
      this.visible = false
      this.modifyData = {}
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/hsms/css/self_common";

  .el-button--small {
    padding: 6px 16px !important;
    border-radius: 2px !important;
  }

  /deep/ .el-input--small .el-input__inner {
    height: 34px;
  }

  /deep/ .el-form-item__label {
    line-height: 32px;
  }

  /deep/ .demo-form-inline .el-form-item {
    margin-bottom: 0 !important;
  }

  /deep/ .el-form-item__label {
    line-height: 32px !important;
  }
</style>
