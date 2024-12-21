<template>
  <div v-loading="loading" class="container">
    <div class="toolbar">
      <!-- 查询条件 -->
      <div class="search_form">
        <el-form :inline="true" :model="search_from" ref="search_form">
          <el-form-item label="体征项名称" :prop="'conditionParameters.signItemName'">
            <el-input
              clearable
              v-model="search_from.conditionParameters.signItemName"
              placeholder=""
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="出入项" :prop="'conditionParameters.signInOutType'">
            <el-select
              v-model="search_from.conditionParameters.signInOutType"
              placeholder="全部"
              clearable
              autocomplete="off"
            >
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(value, key) in sign_config.inout_item"
                :label="value"
                :value="key"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="汇总项" :prop="'conditionParameters.signSummaryType'">
            <el-select
              v-model="search_from.conditionParameters.signSummaryType"
              placeholder="全部"
              clearable
              autocomplete="off"
            >
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(value, key) in sign_config.gather_item"
                :label="value"
                :value="key"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="存储方式" :prop="'conditionParameters.signStorageType'">
            <el-select
              v-model="search_from.conditionParameters.signStorageType"
              placeholder="全部"
              autocomplete="off"
              clearable
            >
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(value, key) in sign_config.storage_type"
                :label="value"
                :value="key"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="searchForm()"
            >搜索
            </el-button>
            <el-button type="gray" icon="el-icon-refresh" @click="resetForm()"
            >重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 操作按钮 -->
      <div class="operation">
        <div class="left">
          <el-button type="primary" icon="el-icon-plus" @click="itemAdd(null)"
          >添加
          </el-button>
        </div>
        <div class="left">
          <el-button type="yellow" @click="itemMultiUse(null)"
          >批量应用
          </el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table
        :data="item_data"
        :row-key="getRowKeys"
        highlight-current-row
        @selection-change="handleTableSelectionChange"
        style="width: 100%"
        height="100%"
        ref="table"
      >
        <el-table-column
          type="selection"
          reserve-selection
          align="center"
          width="50"
        ></el-table-column>
        <!-- <el-table-column type="index" label="序号" width="50"></el-table-column> -->
        <el-table-column
          prop="signItemName"
          label="体征项名称"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="signItemShowName"
          label="显示名称"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="signItemUnit"
          label="单位"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="signInOutType"
          label="出入项"
          min-width="80"
        >
          <template slot-scope="scope">
            {{sign_config.inout_item[scope.row.signInOutType] || ""}}
          </template>
        </el-table-column>
        <el-table-column
          prop="signSummaryType"
          label="汇总项"
          min-width="80"
        >
          <template slot-scope="scope">
            {{sign_config.gather_item[scope.row.signSummaryType] || ""}}
          </template>
        </el-table-column>
        <el-table-column
          prop="signStorageType"
          label="存储方式"
          min-width="80"
        >
          <template slot-scope="scope">
            {{sign_config.storage_type[scope.row.signStorageType] || ""}}
          </template>
        </el-table-column>
        <el-table-column
          prop="patientAgeType"
          label="适用类别"
          min-width="80"
        >
          <template slot-scope="scope">
            {{sign_config.suit_type[scope.row.patientAgeType] || ""}}
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          show-overflow-tooltip
          min-width="80"
        >
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="itemUse(scope.row)" type="text"
            >应用
            </el-button>

            <template v-if="scope.row.canUpdate === true">
              <el-button @click="itemAdd(scope.row)" type="text"
              >编辑
              </el-button>
              <el-button type="textred" @click="itemDelete(scope.row)"
              >删除
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="nrms_page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page_current"
        :page-size="search_from.pageParameters.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_total"
      >
      </el-pagination>
    </div>
    <!-- 标签应用到科室 -->
    <SignItem2Nurse
      ref="item2nurse"
      :visible="item2nurse_visible"
      :init_checked="item2nurse_data"
      :nurse_data="nurse_data"
      :sign_ids="current_itemcode"
    ></SignItem2Nurse>
  </div>
</template>

<script>
  import SignItem2Nurse from "./SignItem2Nurse";
  import { sign as sign_config } from "../../../assets/nrms/common/item_config";
  import { ApiSignItem, ApiDept } from "../../../api/nrms/index";

  export default {
    name: "sign_item_list",
    data() {
      return {
        sign_config,
        loading: false,
        page_current: 1,
        page_total: 0,
        item_data: [],
        //标签应用
        item2nurse_visible: false,
        item2nurse_data: [],
        current_itemcode: [],
        nurse_data: [],
        //查询表单
        search_from: {
          conditionParameters: {
            signItemName: "",
            signInOutType: "",
            signSummaryType: "",
            signStorageType: ""
          },
          pageParameters: {
            size: 10,
            page: 1
          }
        },
        //table多选结果
        multipleSelection: []
      };
    },
    created() {
      // 获取护理单元
      this.getDeptData();
    },
    activated() {
      // 获取数据
      this.getSignItemData();
    },
    updated (){
      this.$nextTick(function () {
        this.$refs.table.doLayout();
      })
    },
    methods: {
      getSignItemData() {
        this.loading = true;
        ApiSignItem.select(this.search_from)
          .then(res => {
            res.data = res.data || { list: [], total: 0 };
            this.item_data = res.data.list;
            this.page_total = res.data.total;
            this.loading = false;
          })
          .catch(res => {
            this.loading = false;
            this.$message.error(res.message);
          });
      },
      getDeptData() {
        ApiDept.select().then(res => {
          this.nurse_data = res.data.list;
        });
      },
      searchForm() {
        this.handleCurrentChange(1);
      },
      resetForm() {
        this.$refs.search_form.resetFields();
        this.handleCurrentChange(1);
      },
      itemMultiUse() {
        if (this.multipleSelection.length === 0) {
          this.$message.warning("请先选择体征项！");
          return false;
        }
        this.item2nurse_data = [];
        this.$confirm("批量应用需要更多的时间！需要您耐心等待~", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.current_itemcode = [];
          this.multipleSelection.forEach(v => {
            this.current_itemcode.push(v.signId);
          });
          this.item2nurse_visible = true;
        });
      },
      itemUse(row) {
        this.item2nurse_visible = true;
        ApiSignItem.selectApplyDept({ signId: row.signId }).then(res => {
          this.item2nurse_data = res.data;
          this.current_itemcode = [row.signId];
          this.item2nurse_visible = true;
        });
      },
      itemAdd(row) {
        this.$emit("option-changed", "add", row);
      },
      itemDelete(row) {
        this.$confirm("是否确认删除？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          ApiSignItem.delete({ signId: row.signId })
            .then(() => {
              this.$message.success("删除成功！");
              this.getSignItemData();
            })
            .catch(res => {
              this.$message.error(res.message);
            });
        });
      },
      getRowKeys(row) {
        return row.signId;
      },
      handleSizeChange(val) {
        this.search_from.pageParameters.size = val;
        this.getSignItemData();
      },
      handleCurrentChange(val) {
        this.page_current = this.search_from.pageParameters.page = val;
        this.getSignItemData();
      },
      handleTableSelectionChange(val) {
        this.multipleSelection = val;
      }
    },
    components: {
      SignItem2Nurse
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  .container {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
  }
  .toolbar {
    padding: 10px 20px 10px;
    .operation {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        justify-content: flex-start;
      }

      .right {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .table {
    flex: 1;
    height: 0;
    overflow: hidden;
  }
</style>
