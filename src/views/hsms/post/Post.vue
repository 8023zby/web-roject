<template>
  <!--岗位管理-->
  <div class="typt-list-container">
    <!--查询-->
    <el-form :inline="true" :model="formSearchData" class="demo-form-inline" ref="formSearch">
      <el-form-item label="岗位名称：">
        <el-input v-model="formSearchData.postName" placeholder="请输入" clearable size="small"/>
      </el-form-item>
      <el-form-item>
        <div class="typt-search-btn">
          <el-button type="primary" class="el-button-radius"
                     icon="el-icon-search" @click="onSearchSubmit" size="small">搜索
          </el-button>
          <el-button type="text" @click="reload">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!--end-->
    <hr/>
    <div class="typt-list-add-div">
      <!--@click="$emit('option-changed', 'add', { businessType: formSearchData.businessType })"-->
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
        prop="postName"
        label="岗位名称"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="postDescribe"
        show-overflow-tooltip
        label="岗位描述">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <!--@click="$emit('option-changed', 'add', { businessType: formSearchData.businessType }, scope.row)">-->
          <el-button type="text"
                     @click="editItem(scope.row)">编辑
          </el-button>
          <el-button type="text" @click="del(scope.row)" style="color: #f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->

    <div v-show="true"
         slot="footer" style="margin: 25px 0;"></div>

    <!--分页-->
    <div class="paginationDiv" v-show="false">
      <!--组件页码显示-->
      <page-info :pageInfo="pageInfo"/>
    </div>
    <!--end-->
    <el-dialog append-to-body
               :title="title"
               :show-close="false"
               :visible.sync="visible"
               width="540px"
               :close-on-click-modal="false">
      <post-add :modifyData="modifyData"
                @close-item="closeItem"
                :params="{ businessType: formSearchData.businessType }"/>
    </el-dialog>
  </div>
</template>

<script>
import BaseManage from '../../../assets/hsms/mixins/BaseManage'
import PageInfo from '../../../components/hsms/PageInfoCommon'
import PostAdd from './PostAdd'
import config from '../../../assets/hsms/mixins/config'

export default {
  name: 'NursePost',
  components: { PageInfo, PostAdd },
  mixins: [BaseManage, config],
  props: ['params'],
  data () {
    return {
      title: '添加',
      modifyData: {},
      visible: false,
      modelName: '岗位',
      formSearchData: {
        postName: '',
        businessType: 'NURSE'
      },
      url: '/hsms/web-hs/post'
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
