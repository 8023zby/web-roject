<!--
 * @Author: 范博
 * @Owner: 
 * @Date: 2022-05-12 13:37:58
 * @LastEditTime: 2022-06-07 15:55:41
 * @LastEditors: 范博
 * @Description: 
 * @FilePath: \yarward-wnms-frontEnd\src\views\wnms\accessControlExtension\aceRoleAuth.vue
-->
<template>
  <div class="typt-list-container">
    <el-form :inline="true" :model="queryForm" ref="queryForm">
      <el-form-item label="门禁角色名称">
        <el-input placeholder="请输入" v-model="queryForm.name" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="executeQueryPage()" icon="el-icon-search">搜索</el-button>
        <el-button type="text" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <hr>
    <div class="typt-list-add-div">
      <el-button type="warning" icon="el-icon-plus" @click="goAddOrEdit('add','')">添加
      </el-button>
    </div>
    <el-table :data="pagination.list" height="100%" stripe highlight-current-row v-loading="yh_loading">
      <el-table-column label="" prop="" width="20px" />
      <el-table-column label="门禁角色名称" prop="name" show-overflow-tooltip />
      <el-table-column label="门禁权限" width="800px" prop="deviceMessage" show-overflow-tooltip />
      <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="goAddOrEdit('edit', scope.row)" size="mini">编辑 </el-button>
          <el-button type="text" @click="delInfo(scope.row)" size="mini" style="color:#F56C6C">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
  </div>
</template>
<script>

import { selectDeptInfo, getUser } from '@/assets/wnms/utils/common';
import { deepMerge } from '@/assets/wnms/utils';
import BaseQueryPageForm from '../common/BaseQueryPageForm';
import Pagination from '@/components/wnms/paginations/pagination';
import { ListInfo, AddInfo, DetailInfo, DeleteInfo, EditInfo } from '@/api/wnms/accessControlExtension/aceRole.js';

export default {
  name: "callRNFieldList",
  mixins: [BaseQueryPageForm],
  components: {
    Pagination,
  },
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      saveBtnLoading: false,
      editType: 'add',
      editTitle: '添加',
      search: {
        size: 10,
        page: 1
      },
      yh_loading: false,
      queryForm: {
        name: ''
      },
    };
  },
  created () {

  },
  mounted () {
    this.executeQueryPage();
  },
  methods: {
    executeQueryPage () {
      this.yh_loading = true;
      let params = this.createQueryParams();
      params.name = this.queryForm.name;
      ListInfo(params).then(res => {
        this.queryResultHandler(res);
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.yh_loading = false;
      });
    },
    resetForm () {
      this.queryForm.name = '';
      this.executeQueryPage();
    },
    goAddOrEdit (t, row) {
      this.editType = t;
      if (this.$refs["addForm"] !== undefined) {
        this.$refs["addForm"].resetFields();
      }
      if (t == 'add') {
        this.$router.push({ path: '/editAceRoleAuth', query: { type: t } });
      }
      else if (t == 'edit') {
        this.editTitle = '修改';
        this.$router.push({ path: '/editAceRoleAuth', query: { type: t, data: row.id } });
      }
    },
    delInfo (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.yh_loading = true;
        DeleteInfo(row.id).then(res => {
          if (res.status == 200) {
            this.$message("删除成功");
            this.executeQueryPage();
          } else {
            this.$message("删除失败");
          }
        }).catch(err => {
          console.log(err);
        }).finally(() => {
          this.yh_loading = false;
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }

}
</script>

<style scoped>
/deep/.el-dialog__footer{
  padding: 85px 20px 20px 20px;
}
  .typt-list-container .el-form {
    margin-bottom: 20px;
  }

</style>
