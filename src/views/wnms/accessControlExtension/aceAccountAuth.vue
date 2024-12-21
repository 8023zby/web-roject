<!--
 * @Author: 范博
 * @Owner: 
 * @Date: 2022-05-12 13:37:58
 * @LastEditTime: 2023-05-24 14:50:26
 * @LastEditors: 翟冲
 * @Description: 
 * @FilePath: \web3.2\src\views\wnms\accessControlExtension\aceAccountAuth.vue
-->
<template>
  <div class="typt-list-container">
    <el-form :inline="true" :model="queryForm" ref="queryForm">
      <el-form-item label="部门">
        <treeselect style="width:150px" v-model="queryForm.deptId" :multiple="false" :options="deptTreeData" :normalizer="normalizer" @select="onSelect" :default-expand-level="2" :clearable="true" placeholder="全部" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="queryForm.empName" :clearable="true" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryForm.status" clearable>
          <el-option value="" label="全部"></el-option>
          <el-option v-for="item in statusInfos" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门禁权限">
        <treeselect style="width:200px" v-model="queryForm.deviceId" :default-expand-level="Infinity" :multiple="false" :options="userRoleAuthTreeData" :normalizer="normalizerDevice" @select="onSelectUserRoleAuth" :clearable="true" placeholder="全部" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="executeQueryPage()" icon="el-icon-search">搜索</el-button>
        <el-button type="text" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <hr>
    <div class="typt-list-add-div" style="text-align:right;margin-right:10px;">
      <el-button type="primary" @click="goAddOrEdit('batchEdit','')">批量权限
      </el-button>
    </div>
    <el-table @selection-change="selectTableInfo" :data="pagination.list" height="100%" stripe highlight-current-row v-loading="yh_loading">
      <el-table-column type="selection" width="55" />
      <el-table-column label="部门" prop="deptName" show-overflow-tooltip />
      <el-table-column label="用户名" prop="userName" show-overflow-tooltip />
      <el-table-column label="姓名" prop="empName" show-overflow-tooltip />
      <el-table-column label="状态" prop="status" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.status==1?'启用' :'停用'}}
        </template>
      </el-table-column>
      <el-table-column label="门禁权限" width="800px" prop="deviceMessage" show-overflow-tooltip />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="goAddOrEdit('singelEdit', scope.row)" size="mini">编辑 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
  </div>
</template>
<script>

import { selectDeptInfo, getUser } from '@/assets/wnms/utils/common';
import BaseQueryPageForm from '../common/BaseQueryPageForm';
import Pagination from '@/components/wnms/paginations/pagination';
import { ListInfo, GetDeptList } from '@/api/wnms/accessControlExtension/aceAccounAuth.js';
import { ListEntranceGuardDeviceInfo } from '@/api/wnms/accessControlExtension/aceRole.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import deptMixins from "@/assets/wnms/js/deptMixins.js";

export default {
  name: "callRNFieldList",
  mixins: [BaseQueryPageForm,deptMixins],
  components: {
    Pagination, Treeselect
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
      isNoDeviceNode: false,
      yh_loading: false,
      deptTreeData: [],
      selectedTableInfos: [],
      userRoleAuthTreeData: [],
      statusInfos: [{ label: '启用', value: '1' }, { label: '停用', value: '2' }],
      queryForm: {
        deptId: null,
        empName: '',
        deviceId: null,
        status: '',
      },
    };
  },
  created () {

  },
  mounted () {
    this.initDeptTree();
    this.initUserRoleAuthTree();
  },
  methods: {
    executeQueryPage (isReset = false) {
      this.yh_loading = true;
      let params = this.createQueryParams();
      if (isReset) params.page = 1;
      params.name = this.queryForm.empName;
      params.deptId = this.queryForm.deptId;
      params.status = this.queryForm.status;
      params.deviceId = this.queryForm.deviceId;
      console.log('isNoDeviceNode-->' + this.isNoDeviceNode);
      if (this.isNoDeviceNode) {
        this.$message({ type: 'warning', message: "请选择门禁分机进行查询" });
        this.yh_loading = false;
      }
      else {
        console.log(params);
        ListInfo(params).then(res => {
          this.queryResultHandler(res);
        }).catch(err => {
          console.log(err);
        }).finally(() => {
          this.yh_loading = false;
        });
      }
    },
    resetForm () {
      this.queryForm.deptId = null;
      this.queryForm.empName = '';
      this.queryForm.status = '';
      this.queryForm.deviceId = null;
      this.search.page = 1;
      this.pagination.page = 1;
      this.executeQueryPage(true);
    },
    goAddOrEdit (t, row) {
      this.editType = t;
      if (this.$refs["addForm"] !== undefined) {
        this.$refs["addForm"].resetFields();
      }
      if (t == 'batchEdit') {
        if (this.selectedTableInfos.length == 0) {
          this.$message({ type: 'warning', message: '请选择至少一条数据' });
        } else {
          this.$router.push({ name: 'editAceAccountAuth', params: { type: t, data: this.selectedTableInfos } });
        }
      }
      else if (t == 'singelEdit') {
        this.editTitle = '修改';
        this.$router.push({ name: 'editAceAccountAuth', params: { type: t, data: row.id } });
      }
    },
    initDeptTree () {
      GetDeptList().then(res => {
        if (res.status == 200) {
          this.deptTreeData = res.data.list;
          // if (this.deptTreeData.length > 0) {
          //   this.queryForm.deptId = selectDeptInfo() || this.deptTreeData[0].deptId;
          // }
          if (this.deptTreeData.length > 0) {
              this.queryForm.deptId =
                this.getDefaultDeptInfo() || this.deptTreeData[0].deptId;
            }
          this.selectDeptId = '';
          this.executeQueryPage();
        } else {
          this.$message(res.desc);
        }
      }).catch(err => {
      });
    },
    async initUserRoleAuthTree () {
      ListEntranceGuardDeviceInfo({
        deviceType: 'wnEntranceGuard'
      }).then(res => {
        if (res.status == 200) {
          this.userRoleAuthTreeData = res.data;
        }
      }).catch(err => {
      });
    },
    selectTableInfo (v) {
      console.log(v);
      this.selectedTableInfos = v;
    },
    normalizer (node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children:
          node.children && node.children.length > 0 ? node.children : undefined
      };
    },
    normalizerDevice (node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children:
          node.child && node.child.length > 0 ? node.child : undefined
      };
    },
    onSelect (node, ins) {
      this.queryForm.deptId = node.deptId;
    },
    onSelectUserRoleAuth (node, ins) {
      if (node.deviceId == -1) {
        this.isNoDeviceNode = true;
      } else {
        this.queryForm.deviceId = node.deviceId;
        this.isNoDeviceNode = false;
      }
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
