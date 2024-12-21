<template>
  <div class="typt-list-container">
    <!-- 查询条件 -->
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="科室:">
          <treeselect v-model="search.deptId" :multiple="false" :options="dataTree" @select="onFirstSelect" :default-expand-level="2" :clearable="false" placeholder="请选择" />
        </el-form-item>

        <el-form-item label="设备编号:">
          <el-input v-model="search.deviceNum" placeholder="请输入设备编号" elearable />
        </el-form-item>

        <el-form-item label="关联床位:">
          <el-select v-model="search.bedId" placeholder="全部" filterable>
            <el-option value>全部</el-option>
            <el-option v-for="item in bedsFirstData" :key="item.bedId" :label="item.bedName" :value="item.bedId" />
          </el-select>
        </el-form-item>

        <el-form-item label="设备状态:">
          <el-select v-model="search.onLineStatus" placeholder="全部">
            <el-option value>全部</el-option>
            <el-option v-for="item in deviceStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <div class="typt-search-btn">
            <el-button type="primary" @click="queryHandler" class="el-button-radius" icon="el-icon-search">搜索</el-button>
            <el-button type="text" class="el-button-radius" @click="clsHandler">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!-- <hr />
      <div class="typt-list-add-div">
        <div class="action_div">
          <el-button type="primary" @click="someSetBed" class="el-button-radius">批量绑定床位</el-button>
        </div>
      </div> -->
    </div>

    <!-- 表格 -->
    <el-table :data="pagination.list" style="width: 100%" height="80%" select-all stripe v-loading="loading">
      <el-table-column prop="sortIndex" align="center" label="序号" width="150">
        <template slot-scope="scope">
          <span>{{ (pagination.page - 1) * pagination.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备编号" prop="deviceNum" align="center" min-width="150" />
      <el-table-column label="关联床位" prop="bedName" align="center" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.bedName">{{ scope.row.roomName }}-{{ scope.row.bedName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备状态" prop="onLineStatus" align="center" min-width="100">
        <template slot-scope="pyScope">
          <span v-if="pyScope.row.onLineStatus===1"><img class="statusImg" src="../../../../../src/assets/wnms/img/smartbed/online.png" alt="">在线</span>
          <span v-else><img class="statusImg" src="../../../../../src/assets/wnms/img/smartbed/offline.png" alt="">离线</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <span class="el-button-text-color" @click="setBed(scope.row)">绑定床位</span>
          <span class="el-text-danger" @click="!scope.row.bedName ? '' : cancelBed(scope.row)" :style="{color: !scope.row.bedName ? 'gray' : '',cursor: !scope.row.bedName ? 'default' : 'pointer'}">解除绑定</span>
          <span class="el-text-danger" @click="scope.row.bedName ? '' : delBed(scope.row)" :style="{color: scope.row.bedName ? 'gray' : '',cursor: scope.row.bedName ? 'default' : 'pointer'}">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationDiv">
      <pagination :pagination="pagination" @page-size-changed="pageSizeChangeHandler" @page-changed="pageChangeHandler" />
    </div>

    <!--绑定床位对话框-->
    <el-dialog title="绑定床位" :visible.sync="dialogVisible" width="900px" :show-close="false" :close-on-click-modal="false">
      <div class="selectDept">
        <treeselect v-model="selectDeptId" :multiple="false" :options="dataTree" @select="onSelect" :default-expand-level="2" :clearable="false" placeholder="请选择" />
      </div>
      <div class="beds" v-if="bedsData.length > 0">
        <span class="bedStyle" v-for="item in bedsData" :key="item.bedId" :class="[
        (item.deviceId === '' || item.deviceId === null) ? 'normalBed' : 'disabledStyle',
        (item.bedId === selectedBed || item.bedId === curBedId)? 'checkedStyle' : '']" @click="(item.deviceId === '' || item.deviceId === null || item.bedId === curBedId) ? clickBed(item) : ''">{{ item.bedName }}</span>
      </div>
      <div class="beds emptyBeds" v-else>
        暂无数据
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSetSubmit()">确 定</el-button>
        <el-button @click="cancelDialog">取 消</el-button>
      </div>
    </el-dialog>

    <!--批量绑定床位对话框-->
    <el-dialog title="批量绑定床位" :visible.sync="someDialogVisible" width="750px" :show-close="false" :close-on-click-modal="false">
      <div class="selectDept">
        <treeselect v-model="someSelectDeptId" :multiple="false" :options="dataTree" @select="onSomeSelect" :default-expand-level="2" :clearable="false" placeholder="请选择" />
      </div>
      <div class="beds">
        <el-table :data="allNoBedsDevices" style="width: 100%" height="100%" stripe v-loading="loading" border size="mini">
          <el-table-column label="床垫" prop="deviceNum" align="center" min-width="150" />
          <el-table-column label="关联床位" prop="bedName" align="center" min-width="150">
            <template slot-scope="scope">
              <el-select v-model="jsonSelect[scope.$index].bedId" placeholder="全部" @change="dealBeds(jsonSelect[scope.$index].bedId,scope.$index)" clearable>
                <el-option value>全部</el-option>
                <el-option v-for="item of allNoDevicesBeds" :key="item.bedId" :label="item.bedName" :value="item.bedId" :disabled="hasSelectedBeds.indexOf(item.bedId) > -1" />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onAllSubmit()">确 定</el-button>
        <el-button @click="SomeCancelDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { deepMerge } from "@/assets/wnms/utils";
import Pagination from "@/components/wnms/paginations/pagination";
import BaseQueryPageForm from "../../common/BaseQueryPageForm";
import * as samrtmattress from "@/api/wnms/samrtmattress";
import deptMixins from "@/assets/wnms/js/deptMixins.js";
export default {
  components: { Pagination, Treeselect },
  mixins: [BaseQueryPageForm, deptMixins],
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
      hasSelectedBeds: [],
      allNoBedsDevices: [],
      frontDeptIdCatch: "",
      bedsFirstData: [],
      dataTree: [],
      selectedBeddeviceId: "",
      curBedId: "",
      loading: false,
      selectedBed: "",
      bedsData: [],
      someDialogVisible: false,
      dialogVisible: false,
      selectDeptId: "",
      someSelectDeptId: "",
      search: search,
      deviceStatus: [
        {
          value: 1,
          label: "在线",
        },
        {
          value: 0,
          label: "离线",
        },
      ],
      allNoDevicesBeds: [],
      jsonSelect: [],
    };
  },
  mounted() {
    this.getDept();
  },
  methods: {
    dealBeds(bedId, index) {
      this.hasSelectedBeds[index] = bedId;
    },
    someSetBed() {
      this.getNoBedsSmart();
      this.getNoDevicesBeds();
      this.someDialogVisible = true;
    },
    SomeCancelDialog() {
      this.someDialogVisible = false;
    },
    delBed(row) {
      this.$confirm("确定解除设备？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        samrtmattress
          .delBed({ deviceId: row.deviceId })
          .then((res) => {
            if (res.status === 200) {
              this.$message.success("删除床位成功！");
              this.executeQueryPage();
            } else {
              this.$message.warning(res.desc);
            }
          })
          .catch((res) => {
            this.$message.error(res.message);
          });
      });
    },
    cancelDialog() {
      this.dialogVisible = false;
      this.selectedBed = "";
    },
    clickBed(bed) {
      this.selectedBed = bed.bedId;
      this.curBedId = bed.bedId;
    },
    onSetSubmit() {
      if (!this.selectedBed) {
        this.$message.error("请选择绑定床位!");
        return false;
      }
      samrtmattress
        .setBed({ deviceId: this.selectedBeddeviceId, bedId: this.selectedBed })
        .then((res) => {
          this.dialogVisible = false;
          this.selectedBed = "";
          this.$message.success(res.desc);
          this.executeQueryPage();
        })
        .catch((res) => {
          this.$message.error(res.desc);
        });
    },
    setBed(row) {
      this.getBeds();
      this.selectedBeddeviceId = row.deviceId;
      this.curBedId = row.bedId;
      this.dialogVisible = true;
    },
    getBeds() {
      // 获取床位
      let _bedsSearch = {
        page: 1,
        size: 999,
      };

      if (this.selectDeptId) {
        _bedsSearch.deptId = this.selectDeptId;
      }

      samrtmattress
        .getBedsList(_bedsSearch)
        .then((res) => {
          if (res && res.data) {
            this.bedsData = res.data.list;
          } else {
            this.$message.error(res.desc);
          }
        })
        .catch((res) => {
          this.$message.error(res.desc);
        });
    },
    cancelBed(row) {
      this.$confirm("确定解除绑定？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        samrtmattress
          .cancelBed({ deviceId: row.deviceId })
          .then((res) => {
            if (res.status === 200) {
              this.$message.success("解绑床位成功！");
              this.executeQueryPage();
            } else {
              this.$message.warning(res.desc);
            }
          })
          .catch((res) => {
            this.$message.error(res.message);
          });
      });
    },
    /* 获取列表 */
    executeQueryPage() {
      this.loading = true;
      samrtmattress
        .getSmartList(this.createQueryParams())
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
      localStorage.setItem("tdms_searchDept", this.search.deptId);
      this.executeQueryPage();
    },
    normalizer(node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children:
          node.children && node.children.length > 0 ? node.children : undefined,
      };
    },
    /* 获取护理单元 */
    getDept() {
      samrtmattress.getdepts().then((res) => {
        if (res.status === 200 && res.data !== null) {
          let t = res.data.list || [];
          t.unshift({
            id: "default",
            label: "无科室",
          });
          let temp = JSON.stringify(t);
          temp = temp
            .replace(/deptId/g, "id")
            .replace(/deptName/g, "label")
            .replace(/,"children":null/g, "")
            .replace(/,"children":\[\]/g, "");
          this.dataTree = JSON.parse(temp);

          let deptId =
            this.getDefaultDeptInfo({ follow: true }) || this.dataTree[0].id;
          this.frontDeptIdCatch = deptId;
          this.selectDeptId = deptId;
          this.someSelectDeptId = deptId;
          this.search.deptId = deptId;

          // // 如果其他模块选择了部门 默认带过来
          // let oldDept = localStorage.getItem("tdms_searchDept");
          // let deptId = localStorage.getItem("selectDeptId");
          // if (
          //   oldDept !== "undefined" &&
          //   oldDept !== null &&
          //   oldDept !== "null" &&
          //   oldDept !== ""
          // ) {
          //   this.frontDeptIdCatch = oldDept;
          //   this.selectDeptId = oldDept;
          //   this.someSelectDeptId = oldDept;
          //   this.search.deptId = oldDept;
          // } else if (deptId) {
          //   this.frontDeptIdCatch = deptId;
          //   this.selectDeptId = deptId;
          //   this.someSelectDeptId = deptId;
          //   this.search.deptId = deptId;
          // } else {
          //   this.selectDeptId = this.dataTree[0].deptId;
          //   this.someSelectDeptId = this.dataTree[0].deptId;
          //   this.search.deptId = this.dataTree[0].deptId;
          //   this.frontDeptIdCatch = this.dataTree[0].deptId;
          // }

          this.executeQueryPage();
          this.getFirstBeds();
        }
      });
    },
    onSelect(node, ins) {
      this.selectDeptId = node.id;

      this.getBeds();
    },
    onSomeSelect(node, ins) {
      // 获取当前科室，未绑定床垫的床
      this.someSelectDeptId = node.id;

      this.getNoDevicesBeds();
      this.getNoBedsSmart();
    },
    getNoDevicesBeds() {
      let _bedsSearch = {
        page: 1,
        size: 999,
        deviceId: 0,
      };

      if (this.someSelectDeptId) {
        _bedsSearch.deptId = this.someSelectDeptId;
      }
      this.loading = true;
      samrtmattress
        .getBedsList(_bedsSearch)
        .then((res) => {
          if (res && res.data) {
            this.allNoDevicesBeds = res.data.list;
          } else {
            this.$message.error(res.desc);
          }
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error(res.desc);
        });
    },
    onFirstSelect(node, ins) {
      this.search.deptId = node.id;
      this.getFirstBeds();
    },
    getFirstBeds() {
      // 获取床位
      let _bedsSearch = {
        page: 1,
        size: 999,
      };

      if (this.search.deptId) {
        _bedsSearch.deptId = this.search.deptId;
      }

      samrtmattress
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
    getNoBedsSmart() {
      // 获取没有绑定的床垫
      samrtmattress
        .getSmartList({ page: 1, size: 9999, deptId: "default" })
        .then((data) => {
          this.allNoBedsDevices = data && data.data && data.data.list;
          // 生成json，绑定select数据
          this.jsonSelect = [];
          for (let index in this.allNoBedsDevices) {
            this.jsonSelect.push({
              bedId: "",
              deviceId: this.allNoBedsDevices[index].deviceId,
              deptId: "",
            });
            this.hasSelectedBeds[index] = "";
          }
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error(res.desc);
        });
    },
    onAllSubmit() {
      let _sendParams = [];
      for (let item of this.jsonSelect) {
        if (item.bedId) {
          item.deptId = this.someSelectDeptId;
          _sendParams.push(item);
        }
      }

      samrtmattress
        .someSetBeds(_sendParams)
        .then((res) => {
          this.$message.success(res.desc);
          this.queryHandler();
          this.someDialogVisible = false;
        })
        .catch((res) => {
          this.$message.error(res.desc);
        });
    },
    /* 查询条件 */
    initQueryCriteria(form = {}) {
      return deepMerge(form, {
        deviceNum: "",
        bedId: "",
        onLineStatus: "",
        deptId: this.frontDeptIdCatch,
      });
    },
  },
};
</script>

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

.beds {
  height: 390px;
  overflow: auto;
}

.bedStyle {
  min-width: 80px;
  height: 34px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #dfdfdf;
  text-align: center;
  line-height: 34px;
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 0px 10px;
}

.disabledStyle {
  background: #cccece;
}

.checkedStyle {
  background: #1e87f0;
  cursor: pointer;
  color: #ffffff;
}

.normalBed {
  cursor: pointer;
}

.selectDept {
  width: 250px;
  margin-bottom: 10px;
  margin-top: -10px;
}

.emptyBeds {
  text-align: center;
  line-height: 300px;
}

.statusImg {
  position: relative;
  right: 5px;
  top: -1px;
}
</style>
