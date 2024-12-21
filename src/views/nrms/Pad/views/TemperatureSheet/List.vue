<template>
  <div v-loading="loading" class="container">
    <div class="toolbar">
      <!-- 查询条件 -->
      <div class="search_form"></div>
      <!-- 操作按钮 -->
      <div class="operation">
        <div class="left"></div>
        <div class="right">
          <el-button type="primary" @click="showEventWin" v-if="patient.type == 2"
          >临床事件
          </el-button>
          <el-button type="primary" @click="showSheet"
          >体温单
          </el-button>
          <el-button type="warning" icon="el-icon-plus" @click="addSign" v-if="patient.type == 2"
          >新增体征
          </el-button>
        </div>
      </div>
    </div>

    <el-table
      ref="table"
      highlight-current-row
      :row-key="getRowKeys"
      :data="tableList"
      height="auto"
    >
      <el-table-column
        label="日期"
        prop="recordDate"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="时间"
        prop="itemHour"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          {{scope.row.itemHour}}: 00
        </template>
      </el-table-column>
      <template v-for="item in sign_item">
        <el-table-column
          :prop="item.signFieldName"
          align="center"
          min-width="100"
          :label="item.signItemShowName">
        </el-table-column>
        <el-table-column
          v-if="item.signFieldName == 'tiwen'"
          prop="tiwen_itemValueType"
          align="center"
          min-width="100"
          label="测量方式">
          <template slot-scope="scope">
            {{sign_config.tiwen_type[scope.row.tiwen_itemValueType]}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="item.signFieldName == 'tiwen'"
          prop="tiwen_phValue"
          align="center"
          min-width="100"
          label="复测体温">
        </el-table-column>
        <el-table-column
          v-if="item.signFieldName == 'tengtongdengji'"
          prop="tengtongdengji_phValue"
          align="center"
          min-width="100"
          label="复测疼痛">
        </el-table-column>
        <el-table-column
          v-if="item.signFieldName == 'shuzhangya'"
          prop="shuzhangya_phValue"
          align="center"
          min-width="100"
          label="测量位置">
        </el-table-column>
      </template>
    </el-table>

    <!-- 临床事件弹窗 -->
    <el-dialog
      class="focus_window"
      title="临床事件"
      :visible.sync="eventDialogVisible"
      :show-close="false"
      center
      width="540px">
      <div>
        <event-win :patient="patient"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eventDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { ApiSignItemSetting, ApiTemperatureSheet } from "../../../../../api/nrms";
  import { sign as sign_config } from "../../../../../assets/nrms/common/item_config"

  export default {
    name: "temperature_sheet_list",
    props: ['patient', "entryType"], //entry type  组件入口
    data() {
      return {
        sign_config,
        loading: false,
        eventDialogVisible: false,
        page_total: 0,
        tableList: [],
        sign_item: [],
        //查询表单
        search_form: {
          patientId: "",
          deptId: "",
          orgId: ""
        }
      };
    },
    created() {
      this.search_form.patientId = this.patient.patientId;
      this.search_form.deptId = this.patient.deptId;
      this.search_form.orgId = this.patient.orgId
      this.getSignItem();
    },
    updated (){
      this.$nextTick(function () {
        this.$refs.table.doLayout()
      })
    },
    methods: {
      getSignItem() {
        return ApiSignItemSetting.selectItemApp({ orgId: this.patient.orgId, deptId: this.patient.deptId, isTemperatureDisplay: 1 }).then(res => {
          this.sign_item = res.data || [];
          res.data && this.getListData();
        }).catch(res => {
          this.$message.error(res.message)
        });
      },
      getListData() {
        this.loading = true;
        ApiTemperatureSheet.selectAllApp(this.search_form).then((res) => {
          this.tableList = res.data || [];
          this.loading = false;
        });
      },
      showEventWin (){
        this.eventDialogVisible = true;
      },
      showSheet (){
        this.$emit("option-changed", "sheet");
      },
      addSign() {
        this.$emit("option-changed", "add");
      },
      handleSizeChange(val) {
        this.search_form.size = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.search_form.page = val;
        this.getData();
      },
      getRowKeys(row) {
        return row.recordId;
      }
    },
    components: {
      'event-win': () => import("./EventWin")
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;

    @import '../../../../../assets/nrms/pad/css/table';
    @import '../../../../../assets/nrms/pad/css/dialog';
  }
  .toolbar {
    padding: 10px;
    border-bottom: 1px solid #ebeef5;

    /deep/ .el-button {
      border-radius: 5px !important;
    }

    .operation {
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
</style>
