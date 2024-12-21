<template>
<div class="typt-list-container">
  <!--查询-->
  <el-form :inline="true" class="typt-list-search">
    <el-form-item label="角色名称：">
      <el-input v-uni="actFormKey + 'juesemingcheng'" v-model="formSearchData.name" placeholder="请输入" clearable></el-input>
    </el-form-item>
    <el-form-item>
      <div class="typt-search-btn">
        <el-button v-uni="actKey + 'search'" type="primary"  icon="el-icon-search" @click="onSearchSubmit">搜索</el-button>
        <el-button v-uni="actKey + 'reset'" type="text" @click="reload">重置</el-button>
      </div>
    </el-form-item>
  </el-form>
  <!--end-->
  <hr />
  <div class="typt-list-add-div">
    <el-button v-uni="actKey + 'add'" v-if="authorityObj['saveRole']" type="warning" size="small" @click="handleAdd" icon="el-icon-plus">添加</el-button>
    <div class="action_div">
      <sort-type v-uni="actKey + 'sortType'" :orderBy="orderBy" @query="queryByOrder" style="float: left"/>
      <!--<el-button type="danger" @click="delCache()">清除菜单相关缓存</el-button>-->
    </div>
  </div>
  <!--列表-->
  <el-table
    :data="tableData"
    stripe
    v-loading="loading"
    height="80%"
    >
<!--    <el-table-column type="index" width="100" prop="roleid" label="序号" align="center" :index="indexMethod">
    </el-table-column>-->
    <el-table-column prop="name" label="角色名称" align="center">
    </el-table-column>
    <el-table-column prop="roleDesc" label="角色描述" align="center">
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" align="center">
      <template slot-scope="scope">
        <span v-if="scope.row.roleLevel===0">-</span>
        <span v-else>{{scope.row.createTime}}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="authorityObj['updateRole'] || authorityObj['deleteRole']" label="操作" width="200" align="center">
      <template slot-scope="scope">
        <el-button v-uni="actKey + 'edit-' + scope.row.roleId" v-if="authorityObj['updateRole']"  type="text" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button v-uni="actKey + 'delete-' + scope.row.roleId" v-if="scope.row.roleLevel!==0 && authorityObj['deleteRole']"  type="text" @click="handleDelete(scope.row)" style="color: #f56c6c">删除</el-button>
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
import { AxiosApi } from '../../../../api/passport/http'
import { ResultMsg } from '../../../../assets/passport/js/Message'
export default {
  components: {
    PageInfo, SortType
  },
  mixins: [BaseManage],
  inject: ['checkMoreAuthority'],
  data () {
    return {
      checked1: false,
      checked2: true,
      orderBy: [{
        id: 'createTime desc',
        label: '创建时间降序'
      },
      {
        id: 'createTime asc',
        label: '创建时间升序'
      },
      {
        id: 'name desc',
        label: '角色名称降序'
      }, {
        id: 'name asc',
        label: '角色名称升序'
      }],
      modelName: '角色',
      formSearchDataStatic: {
        orderBy: ''
      },
      formSearchData: {
        name: ''
      },
      url: '/passport/web-rbac/roles',
      authorityArr: ['saveRole', 'updateRole', 'deleteRole'],
      actFormKey:  'jueseguanli__',
      actKey: 'jueseguanli_'
    }
  },
  activated () {
    // 判断是否有动作权限
    this.getListAuthority()
    this.onSearchSubmit('page')
  },
  methods: {
    // 清除缓存
    delCache () {
      AxiosApi(`/passport/web-rbac/roles/cache`, {}, 'DELETE').then(res => {
        ResultMsg(res, '清除', () => {})
      })
    },
    // 修改角色
    handleEdit (row) {
      this.$emit('option-changed', 'add', { id: row.roleId })
    },
    // 添加角色
    handleAdd () {
      this.$emit('option-changed', 'add')
    },
    // 删除角色
    handleDelete (item) {
      this.del(this.url, {
        roleIds: item.roleId
      })
    }
  }
}
</script>
<style scoped></style>
