<template>
  <layout v-loading="loading">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form :inline="true" :model="search_form" ref="search_form" label-suffix=":">
        <el-form-item label="科室">
          <TreeSelect placeholder="请选择" v-model="search_form.deptId" :multiple="false" :options="tree_nurse_data" :defaultExpandLevel="9" appendToBody noOptionsText="无可选项" noChildrenText="无子节点" noResultsText="无匹配结果" :clearable="false" />
        </el-form-item>
        <el-form-item prop="labelName" label="标签名称">
          <el-input v-model="search_form.labelName" placeholder="标签名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="展示位置" prop="positionList">
          <el-select v-model="search_form.positionList" placeholder="请选择" clearable multiple collapse-tags style="width: 230px">
            <el-option v-for="(key, value) in position_data" :label="key" :value="value" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchForm" v-uni="'biaoqianyingyongtongjibiaoqian_search'">搜索
          </el-button>
          <el-button type="text" @click="resetForm()" v-uni="'biaoqianyingyongtongjibiaoqian_reset'">重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table :data="label_data" row-key="labelId" stripe highlight-current-row height="100%">
        <el-table-column prop="sort" label="序号" align="center" width="120"></el-table-column>
        <el-table-column prop="labelName" label="标签名称" align="center" min-width="100">
        </el-table-column>
        <el-table-column label="展示位置" align="center">
          <el-table-column v-for="(name, identify) in position_data" :key="identify" :label="name" min-width="100" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.positionList[identify]" active-value="1" inactive-value="0" @change="handlePositionSwitch($event, scope.row, identify)">
              </el-switch>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="操作" width="350">
          <template slot-scope="scope">
            <el-button type="text" @click="labelSort(scope.$index, scope.row, 'top')" v-uni:[scope.row.labelId]="'biaoqianyingyongtongjibiaoqian_head'" :key="'head' + scope.row.labelId">置顶
            </el-button>
            <el-button type="text" v-uni:[scope.row.labelId]="'biaoqianyingyongtongjibiaoqian_up'" :key="'up' + scope.row.labelId" @click="labelSort(scope.$index, scope.row, 'up')">上移
            </el-button>
            <el-button type="text" v-uni:[scope.row.labelId]="'biaoqianyingyongtongjibiaoqian_down'" :key="'down' + scope.row.labelId" @click="labelSort(scope.$index, scope.row, 'down')">下移
            </el-button>
            <el-button type="text" v-uni:[scope.row.labelId]="'biaoqianyingyongtongjibiaoqian_bottom'" :key="'bottom' + scope.row.labelId" @click="labelSort(scope.$index, scope.row, 'bottom')">置尾
            </el-button>
            <el-button type="text" v-uni:[scope.row.labelId]="'biaoqianyingyongtongjibiaoqian_setposition'" :key="'setposition' + scope.row.labelId" @click="labelSort(scope.$index, scope.row, 'assign')">指定位置
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </layout>
</template>

<script>
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { ApiLabelApply, ApiDept } from "../../../../api/bnms";
import layout from "../../../../components/bnms/layout/list";
import deptMixins from "@/assets/bnms/js/deptMixins.js";

export default {
  name: "statistics_list",
  mixins: [deptMixins],
  components: { layout, TreeSelect },
  data() {
    return {
      loading: false,
      label_data: [],
      tree_nurse_data: [],
      position_data: {},
      // 搜索表单
      search_status: false,
      search_form: {
        labelType: "101",
        positionList: [],
        labelName: "",
        deptId: null,
      },
    };
  },
  created() {
    this.loading = true;
    Promise.all([this.getDeptData(), this.getPositionList()]);
  },
  methods: {
    getDeptData() {
      this.nurse_data = [];
      ApiDept.select().then((res) => {
        this.nurse_data = res.data.list;
        let dept = res.data.list;
        this.nurse_data = dept; // this.getNurseDataDept(dept);
        let temp = JSON.stringify(res.data.list);
        temp = temp
          .replace(/deptId/g, "id")
          .replace(/deptName/g, "label")
          .replace(/,"children":null/g, "")
          .replace(/,"children":\[\]/g, "");
        this.tree_nurse_data = JSON.parse(temp);
        //   this.tree_nurse_data.length > 0 &&
        //               (this.search_form.deptId = this.tree_nurse_data[0].id)
        if (this.tree_nurse_data.length > 0) {
          this.search_form.deptId =
            this.getDefaultDeptInfo() || this.tree_nurse_data[0].id;
        }
        this.getLabelData();
      });
    },
    getPositionList() {
      ApiLabelApply.position({ labelType: this.search_form.labelType })
        .then((res) => {
          let obj = {};
          for (let i = 0; i < res.data.length; i++) {
            obj[res.data[i].positionIdentify] = res.data[i].positionName;
          }
          this.position_data = obj;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    getLabelData() {
      let _search_form = {};
      Object.assign(_search_form, this.search_form);
      _search_form["positionList"] = _search_form["positionList"].join(",");

      ApiLabelApply.select(_search_form)
        .then((res) => {
          res.data = res.data || [];
          this.label_data = res.data.map((item) => {
            if (item.positionList) {
              item.positionList = JSON.parse(item.positionList);
              Object.keys(this.position_data).forEach((k) => {
                if (!item.positionList[k]) {
                  item.positionList[k] = 0;
                }
              });
            } else {
              item.positionList = {};
            }
            return item;
          });
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error(res.message);
        });
    },
    searchForm() {
      if (
        this.search_form.labelName ||
        (this.search_form.positionList &&
          this.search_form.positionList.length > 0)
      ) {
        this.search_status = true;
      }
      this.getLabelData();
    },
    resetForm() {
      this.search_status = false;
      this.$refs.search_form.resetFields();
      this.getLabelData();
    },
    handlePositionSwitch(val, row, identify) {
      ApiLabelApply.updatePosition({
        usedId: row.usedId,
        labelType: row.labelType,
        positionList: JSON.stringify(row.positionList),
      })
        .then(() => {
          // row.positionList = val;
        })
        .catch((res) => {
          row.positionList = val === 1 ? 0 : 1;
          this.$message.error(res.message);
        });
    },
    labelSort(current_index, current_data, type) {
      if (this.search_status) {
        this.search_status = false;
        this.resetForm();
        return false;
      }
      let _label_data = this.label_data;
      if (type === "up") {
        if (current_index == 0) {
          this.$message.warning("已经是第一个！");
          return;
        }
        const prevData = _label_data.splice(current_index, 1);
        _label_data.splice(current_index - 1, 0, prevData[0]);
        // 重新排序
        for (let i = 0; i < _label_data.length; i++) {
          _label_data[i]["sort"] = i + 1;
        }
        this.updateSort(_label_data);
      } else if (type === "down") {
        if (current_index == _label_data.length - 1) {
          this.$message.warning("已经是最后一个！");
          return;
        }
        const nextData = _label_data.splice(current_index, 1);
        _label_data.splice(current_index + 1, 0, nextData[0]);
        // 重新排序
        for (let i = 0; i < _label_data.length; i++) {
          _label_data[i]["sort"] = i + 1;
        }
        this.updateSort(_label_data);
      } else if (type === "top") {
        if (current_index == 0) {
          this.$message.warning("已经是第一个！");
          return;
        }
        let current_data = _label_data.splice(current_index, 1);
        _label_data.unshift(current_data[0]);
        // 重新排序
        for (let i = 0; i < _label_data.length; i++) {
          _label_data[i]["sort"] = i + 1;
        }
        this.updateSort(_label_data);
      } else if (type === "bottom") {
        if (current_index == _label_data.length - 1) {
          this.$message.warning("已经是最后一个！");
          return;
        }
        let current_data = _label_data.splice(current_index, 1);
        _label_data.push(current_data[0]);
        // 重新排序
        for (let i = 0; i < _label_data.length; i++) {
          _label_data[i]["sort"] = i + 1;
        }
        this.updateSort(_label_data);
      } else if (type === "assign") {
        this.$prompt("跳转至", "指定位置", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          inputPattern: /^\d+$/,
          inputErrorMessage: `请输入数字序号(1-${_label_data.length})`,
          showClose: false,
        }).then(({ value }) => {
          let current_data = _label_data.splice(current_index, 1);
          _label_data.splice(+value ? value - 1 : 0, 0, current_data[0]);
          // 重新排序
          for (let i = 0; i < _label_data.length; i++) {
            _label_data[i]["sort"] = i + 1;
          }
          this.updateSort(_label_data);
        });
      }
    },
    // 给后台更新数据
    updateSort(label_data) {
      let sort_data = [];
      label_data.forEach((v) => {
        sort_data.push({ usedId: v.usedId, sort: v.sort });
      });
      ApiLabelApply.sort(sort_data)
        .then(() => {
          this.label_data = label_data;
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../../assets/bnms/css/self_common";
</style>
