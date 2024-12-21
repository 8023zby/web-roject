<template>
  <layout v-loading="loading">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form v-uni="'biaoqianyingyonghulibiaoqiansousuobiaodan'" :inline="true" :model="search_form" ref="search_form" label-suffix=":">
        <el-form-item label="科室">
          <TreeSelect placeholder="请选择" v-model="search_form.deptId" :multiple="false" :options="tree_nurse_data" :defaultExpandLevel="9" appendToBody noOptionsText="无可选项" noChildrenText="无子节点" noResultsText="无匹配结果" :clearable="false" />
        </el-form-item>
        <el-form-item prop="labelName" label="标签名称">
          <el-input v-model="search_form.labelName" placeholder="标签名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="展示位置" prop="positionList">
          <!--<el-checkbox-group v-model="search_form.positionList">-->
          <!--<el-checkbox :label="identify" v-for="(name, identify) in position_data" :key="identify">-->
          <!--{{name}}-->
          <!--</el-checkbox>-->
          <!--</el-checkbox-group>-->
          <el-select v-model="search_form.positionList" placeholder="请选择" clearable multiple collapse-tags style="width: 230px" v-uni="'biaoqianyingyonghulibiaoqiansousuobiaodanzhanshiweizhi'">
            <el-option v-for="(key, value) in position_data" :label="key" :value="value" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-uni="'biaoqianyingyonghulibiaoqian_search'" icon="el-icon-search" @click="searchForm">搜索
          </el-button>
          <el-button type="text" v-uni="'biaoqianyingyonghulibiaoqian_reset'" @click="resetForm()">重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div slot="left_btn" class="tool-bar">

    </div>
    <div slot="right_btn" class="tool-bar">
      <el-button v-uni="'qiliangshezhi_hulibiaoqian'" type="primary" @click="changeSetNursing">批量应用</el-button>
    </div>
    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table :data="label_data" row-key="usedId" stripe highlight-current-row height="100%" ref="multipleTable" v-uni="'hulibiaoqianliebiao'" @selection-change="handleTableSelectionChange">

        <el-table-column type="selection" reserve-selection align="center" width="54"></el-table-column>
        <el-table-column prop="sort" label="序号" align="center" width="80"></el-table-column>
        <el-table-column prop="labelName" label="标签名称" align="center" min-width="100">
        </el-table-column>
        <el-table-column label="展示位置" align="center" prop="positionNames" min-width="100">
          <!--<el-table-column v-for="(name, identify) in position_data" :key="identify" :label="name" min-width="100" align="center">-->
          <!--<template slot-scope="scope">-->
          <!--<el-switch-->
          <!--v-model="scope.row.positionList[identify]"-->
          <!--active-value="1"-->
          <!--inactive-value="0"-->
          <!--@change="handlePositionSwitch($event, scope.row, identify)"-->
          <!--&gt;-->
          <!--</el-switch>-->
          <!--</template>-->
          <!--</el-table-column>-->
        </el-table-column>
        <el-table-column align="center" label="操作" width="410">
          <template slot-scope="scope">

            <el-button type="text" v-uni:[scope.row.labelId]="'biaoqianyingyonghulibiaoqian_head'" :key="'head' + scope.row.labelId" @click="labelSort(scope.$index, scope.row, 'top')">置顶
            </el-button>
            <el-button type="text" v-uni:[scope.row.labelId]="'biaoqianyingyonghulibiaoqian_up'" :key="'up' + scope.row.labelId" @click="labelSort(scope.$index, scope.row, 'up')">上移
            </el-button>
            <el-button type="text" @click="labelSort(scope.$index, scope.row, 'down')" v-uni:[scope.row.labelId]="'biaoqianyingyonghulibiaoqian_down'" :key="'down' + scope.row.labelId">下移
            </el-button>
            <el-button type="text" @click="labelSort(scope.$index, scope.row, 'bottom')" v-uni:[scope.row.labelId]="'biaoqianyingyonghulibiaoqian_bottom'" :key="'bottom' + scope.row.labelId">置尾
            </el-button>
            <el-button type="text" @click="labelSort(scope.$index, scope.row, 'assign')" v-uni:[scope.row.labelId]="'biaoqianyingyonghulibiaoqian_setposition'" :key="'setposition' + scope.row.labelId">指定位置
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--导入报错弹窗-->
    <template>
      <el-dialog title="标签应用" :visible.sync="nursing.nursingDialogVisible" width="600px" :show-close="false" :close-on-click-modal="false">

        <div>
          <el-checkbox-group v-model="nursing.labelId" @change="handleCheckedDatesChange" class="nursingLable">
            <el-checkbox v-for="(item,index) in nursing.lables" :label="item.positionIdentify" :key="index">{{item.positionName}}
            </el-checkbox>
          </el-checkbox-group>

        </div>
        <span slot="footer" class="dialog-footer">
          <el-button v-uni="'nianjiaguanli_cancel'" @click="nursing.nursingDialogVisible=false">取消</el-button>
          <el-button v-uni="'nianjiaguanli_save'" :loading="nursing.btn_loading" type="primary" @click="addNursingLable">确认</el-button>
        </span>
      </el-dialog>
    </template>
  </layout>
</template>

<script>
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { ApiLabelApply, ApiDept } from "../../../api/bnms";
import layout from "../../../components/bnms/layout/list";
import deptMixins from "@/assets/bnms/js/deptMixins.js";

export default {
  name: "nursing_list",
  mixins: [deptMixins],
  components: { layout, TreeSelect },
  data () {
    return {
      loading: false,
      label_data: [],
      tree_nurse_data: [],
      position_data: {},
      // 搜索表单
      search_status: false,
      search_form: {
        labelType: "201",
        positionList: [],
        labelName: "",
        deptId: null,
        special: "", // 特色标签
      },
      nursing: {
        nursingDialogVisible: false,
        labelId: [],
        lables: [],
        btn_loading: false,
      },
      multipleSelection: [],
    };
  },
  created () {
    // Promise.all([this.getDeptData(), this.getPositionList()]);
    this.getDatas();
  },
  mounted () { },
  methods: {
    getDatas () {
      this.getPositionList(() => {
        this.getDeptData();
      });
    },
    handleTableSelectionChange (val) {
      this.multipleSelection = val;
    },
    handleCheckedDatesChange (value) {
      console.log(value);
    },
    //添加护理标签
    addNursingLable () {
      this.nursing.btn_loading = true;
      let obj1 = {};
      Object.keys(this.position_data).forEach((k) => {
        if (this.nursing.labelId.includes(k)) {
          obj1[k] = "1";
        } else {
          obj1[k] = "0";
        }
      });

      let list = this.multipleSelection.map((item, index) => {
        return {
          labelType: item.labelType,
          usedId: item.usedId,
          positionList: JSON.stringify(obj1),
        };
      });
      console.log(list);
      this.handlePositionLables(list);
    },
    // 护理标签弹窗
    changeSetNursing () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请先选择标签！");
        return false;
      }
      this.$data.nursing.labelId = [];
      if (this.multipleSelection.length == 1) {
        let positionList = this.multipleSelection[0].positionList;
        for (var obj in positionList) {
          if (positionList[obj] == 1) {
            this.nursing.labelId.push(obj);
          }
        }
      }
      this.$data.nursing.nursingDialogVisible = true;
    },
    getDeptData () {
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
        // this.tree_nurse_data.length > 0 &&
        //   (this.search_form.deptId = this.tree_nurse_data[0].id);
        // this.tree_nurse_data.length > 0
        //   ? this.search_form.deptId
        //     ? null
        //     : this.search_form.deptId = this.tree_nurse_data[0].id
        //   : null
        if (this.tree_nurse_data.length > 0) {
          this.search_form.deptId =
            this.getDefaultDeptInfo() || this.tree_nurse_data[0].id;
        }
        this.getLabelData();
      });
    },
    getPositionList (callback) {
      ApiLabelApply.position({ labelType: this.search_form.labelType })
        .then((res) => {
          let obj = {};
          this.$data.nursing.lables = [];
          if (res.data.length > 0) {
            this.$data.nursing.lables = res.data;
          }

          for (let i = 0; i < res.data.length; i++) {
            obj[res.data[i].positionIdentify] = res.data[i].positionName;
          }
          this.position_data = obj;
          console.log(this.position_data, this.$data.nursing.lables);
          callback && callback();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    getLabelData () {
      this.loading = true;
      let _search_form = {};
      Object.assign(_search_form, this.search_form);
      _search_form["positionList"] = _search_form["positionList"].join(",");

      ApiLabelApply.select(_search_form)
        .then((res) => {
          res.data = res.data || [];
          this.label_data = res.data.map((item) => {
            if (item.positionList) {
              const positionNames = [];
              item.positionList = JSON.parse(item.positionList);

              Object.keys(item.positionList).forEach((k) => {
                if (item.positionList[k] === "1") {
                  positionNames.push(this.position_data[k]);
                }
              });
              item.positionNames = positionNames.join("，");
            } else {
              item.positionList = {};
              item.positionNames = "";
            }

            item.isDeptCustomLabel = item.isDeptCustomLabel === 1 ? "是" : "否";
            console.log("列表请求结束");
            return item;
          });

          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
          this.$message.error(res.message);
        });
    },
    searchForm () {
      if (
        this.search_form.labelName ||
        (this.search_form.positionList &&
          this.search_form.positionList.length > 0)
      ) {
        this.search_status = true;
      }
      this.getLabelData();
    },
    resetForm () {
      this.search_status = false;
      this.$refs.search_form.resetFields();
      this.getLabelData();
    },
    //批量设置标签
    handlePositionLables (item) {
      ApiLabelApply.batchUpdatePosition(item)
        .then(() => {
          this.getDatas();
          this.$message({
            type: "success",
            message: "设置成功!",
          });
        })
        .catch((res) => {
          this.$message.error(res.message);
        })
        .finally((f) => {
          this.$refs.multipleTable.clearSelection();
          this.$data.nursing.nursingDialogVisible = false;
          this.$data.nursing.btn_loading = false;
          this.$data.multipleSelection = [];
        });
    },
    handlePositionSwitch (val, row, identify) {
      ApiLabelApply.updatePosition({
        usedId: row.usedId,
        labelType: row.labelType,
        positionList: JSON.stringify(row.positionList),
      })
        .then(() => {
          // row.positionList = val;
        })
        .catch((res) => {
          // row.positionList = val === 1 ? 0 : 1;
          this.$message.error(res.message);
        });
    },
    labelEdit (index, row) {
      this.$router.push({
        path: "/label_apply_nursing_edit",
        query: {
          usedId: row.usedId,
        },
      });
    },
    labelSort (current_index, current_data, type) {
      if (this.search_status) {
        this.search_status = false;
        this.resetForm();
        return false;
      }
      let _label_data = JSON.parse(JSON.stringify(this.label_data));
      if (type === "up") {
        if (current_index == 0) {
          this.$message.warning("已经是第一个！");
          return;
        }
        let prev_index = current_index - 1;
        let prev_data = _label_data[prev_index];
        // 交换序号
        prev_data["sort"] = current_data["sort"];
        current_data["sort"] = current_data["sort"] - 1;
        // 交换位置
        _label_data[current_index] = prev_data;
        _label_data[prev_index] = current_data;
        this.updateSort(_label_data);
      } else if (type === "down") {
        if (current_index == _label_data.length - 1) {
          this.$message.warning("已经是最后一个！");
          return;
        }
        let next_index = current_index + 1;
        let next_data = _label_data[next_index];
        // 交换序号
        next_data["sort"] = current_data["sort"];
        current_data["sort"] = current_data["sort"] + 1;
        // 交换位置
        _label_data[current_index] = next_data;
        _label_data[next_index] = current_data;
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
    updateSort (label_data) {
      let sort_data = [];
      label_data.forEach((v) => {
        sort_data.push({ usedId: v.usedId, sort: v.sort });
      });
      ApiLabelApply.sort(sort_data)
        .then(() => {
          this.label_data = JSON.parse(JSON.stringify(label_data))
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../assets/bnms/css/self_common";
.nursingLable {
  width: 100%;
  height: 100%;
  .el-checkbox {
    width: 25%;
    margin: 1rem;
  }
}
</style>
