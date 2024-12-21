<template>
  <layout v-loading="loading">
    <!-- 搜索条件 -->
    <div slot="query" class="query-items">
      <el-form :inline="true" :model="search_form" ref="search_form" label-suffix=":">
        <el-form-item label="护理单元">
          <TreeSelect placeholder="请选择" v-model="search_form.deptId" :multiple="false" :options="tree_nurse_data" noOptionsText="无可选项" noChildrenText="无子节点" noResultsText="无匹配结果" appendToBody :defaultExpandLevel="9" />
        </el-form-item>
      </el-form>

    </div>

    <!-- 操作按钮 -->
    <div slot="left_btn" class="tool-bar">
      <el-button type="warning" icon="el-icon-plus" @click="showAdd">添加
      </el-button>
    </div>

    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table :data="label_data" row-key="usedId" stripe highlight-current-row height="100%">
        <el-table-column prop="rollDeptName" label="转科科室名称" align="center" min-width="120">
        </el-table-column>
        <el-table-column align="center" label="排序">
          <template slot-scope="scope">
            <el-button type="text" @click="labelSort(scope.$index, scope.row, 'up')">上移
            </el-button>
            <el-button type="text" @click="labelSort(scope.$index, scope.row, 'down')">下移
            </el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="showEdit(scope.row)">编辑
            </el-button>
            <el-button class="del-text" type="text" @click="remove(scope.row)">删除
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
import { TransDept, ApiDept } from "../../../../api/bnms";
import layout from "../../../../components/bnms/layout/list";
import deptMixins from "@/assets/bnms/js/deptMixins.js";
export default {
  name: "trans_dept",
  mixins: [deptMixins],
  components: { layout, TreeSelect },
  data() {
    return {
      loading: false,
      label_data: [],
      tree_nurse_data: [],
      position_data: {},
      search_form: {
        deptId: null,
      },
    };
  },
  watch: {
    "search_form.deptId": "changeSelect",
  },
  created() {
    this.getDeptData();
    // await this.getLabelData();
    //
  },

  methods: {
    changeSelect(val) {
      if (!val) {
        return;
      }
      this.getLabelData();
    },
    async getDeptData() {
      const res = await ApiDept.select();
      let dept = res.data.list;
      let temp = JSON.stringify(dept);
      temp = temp
        .replace(/deptId/g, "id")
        .replace(/deptName/g, "label")
        .replace(/,"children":null/g, "")
        .replace(/,"children":\[\]/g, "");
      this.tree_nurse_data = JSON.parse(temp);

      // const local = localStorage.getItem('selectDeptInfo') || ''
      // this.search_form.deptId = local ? (JSON.parse(local).deptId || '') : ''
      this.search_form.deptId =
        this.getDefaultDeptInfo() || this.tree_nurse_data[0].id;
    },
    getLabelData() {
      const that = this;
      this.loading = true;
      TransDept.List({
        deptId: this.search_form.deptId,
      })
        .then((res) => {
          this.label_data = res.data || [];
          this.loading = false;
        })
        .catch((e) => {
          that.$message.error(e.desc);
          that.loading = false;
        })
        .finally(() => {
          that.loading = false;
        });
    },
    labelSort(currentIndex, currentData, type) {
      let oldData = this.label_data;
      let _labelData = [];
      Object.assign(_labelData, this.label_data);
      if (type === "up") {
        if (currentIndex === 0) {
          this.$message.warning("已经是第一个！");
          return;
        }
        let prevIndex = currentIndex - 1;
        let prevData = _labelData[prevIndex];
        // 交换序号
        prevData["sort"] = currentData["sort"];
        currentData["sort"] = currentData["sort"] - 1;
        // 交换位置
        _labelData[currentIndex] = prevData;
        _labelData[prevIndex] = currentData;
        this.updateSort(_labelData, oldData);
      } else if (type === "down") {
        if (currentIndex === _labelData.length - 1) {
          this.$message.warning("已经是最后一个！");
          return;
        }
        let nextIndex = currentIndex + 1;
        let nextData = _labelData[nextIndex];
        // 交换序号
        nextData["sort"] = currentData["sort"];
        currentData["sort"] = currentData["sort"] + 1;
        // 交换位置
        _labelData[currentIndex] = nextData;
        _labelData[nextIndex] = currentData;
        this.updateSort(_labelData, oldData);
      } else if (type === "top") {
        if (currentIndex === 0) {
          this.$message.warning("已经是第一个！");
          return;
        }
        let currentData = _labelData.splice(currentIndex, 1);
        _labelData.unshift(currentData[0]);
        // 重新排序
        for (let i = 0; i < _labelData.length; i++) {
          _labelData[i]["sort"] = i + 1;
        }
        this.updateSort(_labelData, oldData);
      } else if (type === "bottom") {
        if (currentIndex === _labelData.length - 1) {
          this.$message.warning("已经是最后一个！");
          return;
        }
        let currentData = _labelData.splice(currentIndex, 1);
        _labelData.push(currentData[0]);
        // 重新排序
        for (let i = 0; i < _labelData.length; i++) {
          _labelData[i]["sort"] = i + 1;
        }
        this.updateSort(_labelData, oldData);
      } else if (type === "assign") {
        this.$prompt("跳转至", "指定位置", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          inputPattern: /^\d+$/,
          inputErrorMessage: `请输入数字序号(1-${_labelData.length})`,
          showClose: false,
        }).then(({ value }) => {
          let currentData = _labelData.splice(currentIndex, 1);
          _labelData.splice(+value ? value - 1 : 0, 0, currentData[0]);
          // 重新排序
          for (let i = 0; i < _labelData.length; i++) {
            _labelData[i]["sort"] = i + 1;
          }
          this.updateSort(_labelData, oldData);
        });
      }
    },
    // 给后台更新数据
    updateSort(labelData, oldData) {
      const that = this;
      that.label_data = labelData;
      TransDept.BatchUpdate(labelData)
        .then((res) => {})
        .catch((e) => {
          that.label_data = oldData;
          that.$message.error("操作失败");
        });
    },
    validInputData() {
      return function (value) {
        if (value.length > 20) {
          return false;
        }
        return true;
      };
    },
    // 添加本级节点
    showAdd() {
      if (!this.$data.search_form.deptId) {
        this.$message.error("请选择科室");
        return;
      }
      const that = this;
      this.$prompt("转科科室名称:", "添加", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputValidator: that.validInputData(),
        showClose: false,
        inputErrorMessage: "请输入20个字符以内的名称",
        inputPlaceholder: "请输入20个字符以内的名称",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            // 获取一下最大的sort
            let sort = 1;
            if (that.label_data.length > 0) {
              for (let item of that.label_data) {
                if (item.sort >= sort) {
                  sort = item.sort + 1;
                }
              }
            }
            let value = instance.inputValue;

            TransDept.Add({
              rollDeptName: value,
              sort: sort,
              deptId: that.$data.search_form.deptId,
            })
              .then((res) => {
                that.getLabelData();
                done();
                that.$message.success("添加成功");
              })
              .catch((e) => {
                done();
                that.$message.error(e.desc);
              });
          } else {
            done();
          }
        },
      })
        .then(({ value }) => {})
        .catch(() => {});
    },
    showEdit(row) {
      const that = this;
      this.$prompt("转科科室名称:", "编辑", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        inputValidator: that.validInputData(),
        showClose: false,
        inputErrorMessage: "请输入20个字符以内的名称",
        inputPlaceholder: "请输入20个字符以内的名称",
        inputValue: row.rollDeptName,
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            let value = instance.inputValue;
            if (!row.id) {
              that.$message.error("数据出错了, 请刷新页面活稍后再试");
            } else {
              TransDept.Edit({
                id: row.id,
                rollDeptName: value,
                deptId: that.$data.search_form.deptId,
              })
                .then((res) => {
                  that.getLabelData();
                  done();
                  that.$message.success("编辑成功");
                })
                .catch((e) => {
                  done();
                  that.$message.error(e.desc);
                });
            }
          } else {
            done();
          }
        },
      })
        .then(({ value }) => {})
        .catch(() => {});
    },
    // 删除节点
    remove(row) {
      const that = this;
      this.$confirm(`是否确认删除该${row.rollDeptName}?`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showClose: false,
        type: "warning",
      })
        .then(() => {
          TransDept.Del({
            id: row.id,
          })
            .then((res) => {
              console.log(res);
              that.getLabelData();
              that.$message.success("删除成功");
            })
            .catch((e) => {
              console.log(e);
              that.$message.error("删除失败");
            });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../../assets/bnms/css/self_common";
.del-text {
  color: red;
}
</style>
