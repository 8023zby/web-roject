<template>
  <div class="typt-list-container">
    <!-- 查询条件 -->
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="科室:">
          <treeselect v-model="selectDeptId" :multiple="false" :options="dataTree" :normalizer="normalizer" @select="onSelect" :default-expand-level="2" :clearable="false" placeholder="请选择科室" />
        </el-form-item>

        <el-form-item>
          <!-- 查询按钮 -->
          <div class="typt-search-btn">
            <el-button type="primary" @click="queryHandler" class="el-button-radius" icon="el-icon-search">搜索</el-button>
            <!-- <el-button type="text" class="el-button-radius" @click="clsHandler">重置</el-button> -->
          </div>
        </el-form-item>
      </el-form>
      <hr />
      <div class="typt-list-add-div">
        <div class="action_div"></div>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="pagination.list" style="width: 100%" height="80%" select-all stripe>
      <!-- <el-table-column prop="sortIndex" align="center" label="序号" width="150">
        <template slot-scope="scope">
          <span>{{ (pagination.page - 1) * pagination.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="IP地址" prop="ip" align="center" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="el-button-text-color" @click="$emit('option-changed','addorEdit', {type:'edit',row:scope.row,deptId:selectDeptId})">编辑</span>
          <span class="el-text-danger" @click="delHandler(scope.$index, scope.row)">删除</span>
          <span class="el-button-text-color" @click="uplog(scope.$index, scope.row)">上传日志</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationDiv">
      <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
    </div>
  </div>
</template>

<script>
import { deepMerge } from "@/assets/wnms/utils";
import BaseQueryPageForm from "../../common/BaseQueryPageForm";
import * as deviceApi from "../api/device";

import Pagination from "../../../../components/wnms/paginations/pagination";
import mixins from "./mixins";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { selectDeptInfo, getDeptInfo } from "@/assets/wnms/utils/common";

export default {
  components: { Pagination, Treeselect },
  mixins: [BaseQueryPageForm, mixins],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {},
    },
  },
  data() {
    const search = this.initQueryCriteria();
    return {
      tableSortData: [],
      search: search,
      DeptInfo: {}, // 护理单元信息
      dataTree: [],
    };
  },

  methods: {
    /* 清楚查询条件 */
    clsHandler() {
      this.search = this.initQueryCriteria();
      this.queryHandler();
    },
    onSelect(node, ins) {
      this.selectDeptId = node.deptId;
      this.search.deptId = this.selectDeptId;
    },
    normalizer(node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children:
          node.children && node.children.length > 0 ? node.children : undefined,
      };
    },
    /* 查询条件 */
    initQueryCriteria(form = {}) {
      return deepMerge(form, {
        deptId: this.selectDeptId,
      });
    },

    /* 获取列表 */
    executeQueryPage() {
      deviceApi.getInfo(this.createQueryParams()).then((data) => {
        this.queryResultHandler(data);
      });
    },

    /* 列表删除 */
    customDelHandler(index, row) {
      deviceApi.Delete(row.deviceId).then((res) => {
        this.IsSuccess(res);
        this.executeQueryPage();
      });
    },
    // 上传日志
    uplog(index, row) {
      deviceApi.getLog(row.deviceId).then((res) => {
        this.IsSuccess(res);
      });
    },
  },
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.btn-area {
  padding: 20px 0px 10px 0px;
}
.query-area > div {
  margin-right: 50px;
}

.addbtn {
  float: right;
}
.clsStor {
  height: 85%;
}
.storTitle {
  color: red;
  font-size: 1em;
}
</style>
