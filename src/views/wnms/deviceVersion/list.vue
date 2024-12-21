<template>
  <div class="typt-list-container">
    <!-- 查询条件 -->
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="科室:">
          <treeselect v-model="selectDeptId" :multiple="false" @input="resetTree" :options="dataTree" @select="onSelect" :default-expand-level="2" :clearable="true" placeholder="请选择科室" />
        </el-form-item>

        <el-form-item label="终端类型:">
          <el-select v-model="search.deviceType" placeholder="全部">
            <el-option value>全部</el-option>
            <el-option v-for="item in deviceTypes.terminalType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="终端型号: ">
          <el-select v-model="search.deviceModel" placeholder="全部" @change="chagneTerminalNum">
            <el-option value>全部</el-option>
            <el-option v-for="item in deviceTypes.terminalNum" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select v-model="search.versionType" placeholder="全部">
            <el-option value>全部</el-option>
            <el-option v-for="item in deviceTypes.type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <!-- 查询按钮 -->
          <div class="typt-search-btn">
            <el-button type="primary" @click="queryHandlers" class="el-button-radius" icon="el-icon-search">搜索</el-button>
            <el-button type="text" class="el-button-radius" @click="clsHandler">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <hr />
      <div class="typt-list-add-div">
        <div class="action_div">
          <el-button type="primary" @click="exportExcel()">全院终端信息导出</el-button>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="pagination.list" style="width: 100%" height="80%" select-all stripe>
      <el-table-column prop="sortIndex" align="center" label="序号" width="150">
        <template slot-scope="scope">
          <span>{{ (pagination.page - 1) * pagination.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室" prop="deptName" align="center" />
      <el-table-column label="终端类型" prop="deviceTypeName" align="center" />
      <el-table-column label="终端型号" prop="deviceModel" align="center">
      </el-table-column>
      <el-table-column label="类型" prop="versionTypeName" align="center">
      </el-table-column>
      <el-table-column label="版本号" :show-overflow-tooltip="true" prop="version" align="center">
      </el-table-column>
      <el-table-column label="终端号" prop="deviceNums" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="el-button-text-color" @click="handlerSetVersion(scope.row)">设为主版本</span>
          <span class="el-button-text-color" @click="handlerUp(scope.$index, scope.row)">升级</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationDiv">
      <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
    </div>

    <el-dialog title="提示" :visible.sync="dialogShowVisible" :show-close="false" width="780px" :close-on-click-modal="false">
      <DeviceUpdateA10 v-if="this.$data.dialogShowVisible" @cancelDeviceUpdate="cancelDeviceUpdate" @deviceUpdate="deviceUpdate" ref="device_update"></DeviceUpdateA10>
    </el-dialog>
  </div>
</template>

<script>
import { deepMerge, getRouterQuery } from "@/assets/wnms/utils";
import BaseQueryPageForm from "../common/BaseQueryPageForm";
import * as Api from "../../../api/wnms/deviceVersion/deviceVersionApi";
import Pagination from "@/components/wnms/paginations/pagination";
import mixins from "./mixins";
import { formatter, newGetSelectData } from "../../../assets/wnms/utils/common";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import DeviceUpdateA10 from "./DeviceUpdateA10.vue";

export default {
  components: { Pagination, Treeselect, DeviceUpdateA10 },
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
      Category: [],
      dialogShowVisible: false,
      DeptInfo: {}, //护理单元信息
      dataTree: [],
      deviceTypes: {
        terminalType: [], //终端类型
        terminalNum: [], //终端号
        type: [], //类型
      },
      updateDevice: {},
    };
  },
  created() {
    this.getDataTypes();
  },
  watch: {
    "search.deviceType": {
      handler(newVal, oldVal) {
        this.changeTerminalType();
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    queryHandlers() {
      localStorage.setItem("tdms_searchDept", this.$data.selectDeptId);
      this.queryHandler();
    },
    resetTree() {
      this.search = this.initQueryCriteria();
    },
    //更新终端型号数据
    chagneTerminalNum() {
      this.$forceUpdate();
    },
    //联动终端型号
    changeTerminalType() {
      this.$data.search.terminalNum = [];
      if (this.$data.search.deviceType == "") {
        this.$data.deviceTypes.terminalNum = "";
        this.chagneTerminalNum();
        return;
      }
      this.getTerminalNum(this.$data.search.deviceType);
    },
    async getTerminalNum(value) {
      let res = await Api.getdeviceModelType({ deviceType: value });
      if (this.stateDetect(res)) {
        this.$data.deviceTypes.terminalNum = res.data.map((item, index) => {
          return {
            value: item,
            label: item,
          };
        });
      }
    },
    // 查询终端类型、类型
    async getDataTypes() {
      this.$data.deviceTypes.terminalType = [];
      this.$data.deviceTypes.type = [];
      let dtype = await Api.getDeviceType();
      let dvtype = await Api.getDeviceVersionType();
      if (this.stateDetect(dtype)) {
        this.$data.deviceTypes.terminalType = newGetSelectData({
          data: dtype.data,
          params: {
            value: "deviceType",
            label: "deviceTypeName",
          },
        });
      }
      // let getHeadType = dtype.data.find(
      //   (item) => item.deviceType == "wnBedHeadExtension"
      // );
      // this.search.deviceType =
      //   getHeadType == undefined ? "" : getHeadType.deviceType;
      if (this.stateDetect(dvtype)) {
        this.$data.deviceTypes.type = newGetSelectData({
          data: dvtype.data,
          params: {
            value: "versionType",
            label: "versionTypeName",
          },
        });
      }
    },
    exportExcel() {
      Api.exportExcel().then((res) => {
        this.excelDownload(res.data.filePath, res.data.fileName);
        this.$message({ message: "导出成功", type: "success" });
      });
    },
    excelDownload(url, fileName) {
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    },
    // 设置为主版本
    handlerSetVersion(row) {
      let _this = this;
      this.$confirm(
        `是否将(${row.deviceTypeName}/${row.deviceModel}/${row.versionTypeName})设置为主版本?`,
        "提示",
        {
          confirmButtonText: "确 认",
          cancelButtonText: "取消",
          showClose: false,
          type: "warning",
        }
      ).then(() => {
        if (_this.search[row.versionType]) {
          if (_this.search[row.versionType] != row.version) {
            _this.search[row.versionType] += "," + row.version;
          }

          console.log(
            "设置了多个类型:" + _this.search[row.versionType],
            "类型是:" + row.versionType
          );
        } else {
          _this.search[row.versionType] = row.version;
        }
        Api.getInfo(this.createQueryParams()).then((data) => {
          this.queryResultHandler(data);
          this.$message({
            type: "success",
            message: "设置成功",
          });
          console.log(this.search, "设置成功哦！");
        });
      });
    },
    //升级
    deviceUpdate() {
      let data = this.$refs.device_update.form;
      let params = {
        deptId: this.selectDeptId,
        deviceModel: this.$data.updateDevice.deviceModel,
        deviceType: this.$data.updateDevice.deviceType,
        deviceNums: this.$data.updateDevice.deviceNums,
        upgradeTime: data.updateTime || "",
        fileUrl: data.fileUrl,
      };
      Api.UPdatePromote(params).then((res) => {
        console.log(res);
        this.$message({ message: "设备升级请求已经发送成功", type: "success" });
        this.cancelDeviceUpdate();
      });
    },
    // 设备升级
    handlerUp(index, row) {
      console.log(index, row);
      this.$data.dialogShowVisible = true;
      this.$data.updateDevice = {
        deviceModel: row.deviceModel,
        deviceType: row.deviceType,
        deviceNums: row.deviceNums,
      };
    },
    cancelDeviceUpdate() {
      this.$data.updateDevice = {};
      this.$data.dialogShowVisible = false;
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
        deviceType: "wnBedHeadExtension", //  终端类型
        deviceModel: "", //终端型号
        versionType: "", //版本类型
      });
    },

    /* 获取列表 */
    executeQueryPage() {
      Api.getInfo(this.createQueryParams()).then((data) => {
        this.queryResultHandler(data);
      });
    },

    /* 列表删除 */
    customDelHandler(index, row) {
      Api.Delete(row.screenId).then((res) => {
        this.IsSuccess(res);
        this.executeQueryPage();
      });
    },

    /* 清楚查询条件 */
    clsHandler() {
      this.search = this.initQueryCriteria();
      this.executeQueryPage();
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
