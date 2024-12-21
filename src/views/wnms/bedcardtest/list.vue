<template>
  <div class="typt-list-container">
    <!-- 查询条件 -->
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="科室:">
          <treeselect v-model="search.deptId" :multiple="false" :options="dataTree" @select="onFirstSelect" :default-expand-level="2" :clearable="false" placeholder="请选择" />
        </el-form-item>

        <el-form-item label="床位:">
          <el-select v-model="search.bedName" placeholder="全部" filterable clearable @change="executeQueryPage">
            <el-option value>全部</el-option>
            <el-option v-for="item in bedsFirstData" :key="item.bedName" :label="item.bedName" :value="item.bedName" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <div class="typt-search-btn">
            <el-button type="primary" @click="queryHandler" class="el-button-radius" icon="el-icon-search">搜索</el-button>
            <el-button type="text" class="el-button-radius" @click="clsHandler">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table :data="pagination.list" style="width: 100%" height="80%" select-all stripe v-loading="loading">
      <el-table-column prop="sortIndex" align="center" label="序号" width="100">
        <template slot-scope="scope">
          <span>{{ (pagination.page - 1) * pagination.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="床号" prop="bedName" align="center" width="150" />
      <el-table-column label="设备类型" prop="deviceType" align="center" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.deviceType == 'bedside'">床旁</span>
          <span v-else-if="scope.row.deviceType == 'bedhead'">床头</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="运行次数" prop="totalCount" align="center" width="150" />
      <el-table-column label="运行状态" prop="errorInfo" align="center" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.errorInfo.length > 0">
            <template v-for="(item,index) in scope.row.errorInfo">
              <span :key="index" v-if="index > scope.row.errorInfo.length - 3">
                <span style="margin-left: 10px;">服务：{{ Object.keys(item)[0] }}; </span>
                <span style="margin-left: 10px;">时间：{{ item[Object.keys(item)[0]].time }}; </span>
                <span style="margin-left: 10px;">状态：{{ item[Object.keys(item)[0]].status }}; </span>
              </span>
            </template>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <span class="el-button-text-color" @click="details(scope.row)" v-if="scope.row.errorInfo.length > 0">详情</span>
          <span class="el-button-text" v-else>详情</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationDiv">
      <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
    </div>

    <!--运行详情对话框-->
    <el-dialog title="运行详情" :visible.sync="dialogVisible" width="700px" :show-close="false" :close-on-click-modal="false">
      <el-table :data="detailsRunning" style="width: 100%" height="500px" select-all stripe>
        <el-table-column prop="sortIndex" align="center" label="序号" width="100">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="服务" prop="serve" align="center" />
        <el-table-column label="时间" prop="time" align="center" />
        <el-table-column label="运行状态" prop="status" align="center" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { deepMerge } from "@/assets/wnms/utils";
import Pagination from "@/components/wnms/paginations/pagination";
import BaseQueryPageForm from "../common/BaseQueryPageForm";
import * as testbedcard from "@/api/wnms/testbedcard";

export default {
  components: { Pagination, Treeselect },
  mixins: [BaseQueryPageForm],
  data() {
    const search = this.initQueryCriteria();
    return {
      detailsRunning: [],
      bedsFirstData: [],
      dataTree: [],
      loading: false,
      dialogVisible: false,
      search: search
    };
  },
  mounted() {
    this.getDept();
  },
  methods: {
    cancelDialog() {
      this.dialogVisible = false;
    },
    details(row) {
      // 处理数据
      this.detailsRunning = [];
      for (let item of row.errorInfo) {
        for (let key of Object.keys(item)) {
          this.detailsRunning.push({
            serve: key,
            time: item[key].time,
            status: item[key].status
          });
        }
      }

      this.dialogVisible = true;
    },
    /* 获取列表 */
    executeQueryPage() {
      this.loading = true;
      testbedcard
        .getBedcardRunList(this.createQueryParams())
        .then((data) => {
          this.queryResultHandler(data);
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error(res.desc);
        });
    },
    /* 清除查询条件 */
    clsHandler() {
      this.search = this.initQueryCriteria();
      this.executeQueryPage();
    },
    queryHandler() {
      this.pagination.page = 1;
      this.executeQueryPage();
    },
    normalizer(node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children:
          node.children && node.children.length > 0 ? node.children : undefined
      };
    },
    /* 获取护理单元 */
    getDept() {
      testbedcard.getdepts().then((res) => {
        if (res.status === 200 && res.data !== null) {
          let t = res.data.list || [];
          t.unshift({
            id: "default",
            label: "无科室"
          });
          let temp = JSON.stringify(t);
          temp = temp
            .replace(/deptId/g, "id")
            .replace(/deptName/g, "label")
            .replace(/,"children":null/g, "")
            .replace(/,"children":\[\]/g, "");
          this.dataTree = JSON.parse(temp);
          // 如果其他模块选择了部门 默认带过来
          let oldDept = localStorage.getItem("tdms_searchDept");
          let deptId = localStorage.getItem("selectDeptId");
          if (
            oldDept !== "undefined" &&
            oldDept !== null &&
            oldDept !== "null" &&
            oldDept !== ""
          ) {
            this.search.deptId = oldDept;
          } else if (deptId) {
            this.search.deptId = deptId;
          } else {
            this.search.deptId = this.dataTree[0].deptId;
          }

          this.executeQueryPage();
          this.getFirstBeds();
        }
      });
    },
    onFirstSelect(node, ins) {
      this.search.deptId = node.id;
      this.executeQueryPage();
      this.getFirstBeds();
    },
    getFirstBeds() {
      // 获取床位
      let _bedsSearch = {
        page: 1,
        size: 999
      };

      if (this.search.deptId) {
        _bedsSearch.deptId = this.search.deptId;
      }

      testbedcard
        .getBedsList(_bedsSearch)
        .then((res) => {
          if (res && res.data) {
            this.bedsFirstData = res.data.list;
          } else {
            this.$message.error(res.desc);
          }
        })
        .catch((res) => {
          this.$message.error(res.desc);
        });
    },
    /* 查询条件 */
    initQueryCriteria(form = {}) {
      return deepMerge(form, {
        bedName: ""
      });
    }
  }
};
</script>