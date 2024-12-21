<template>
  <div style="position: relative; height: 100%; background-color: #fff">
    <input type="checkbox" id="hsms_nurse_list_checked" style="display: none">
    <label for="hsms_nurse_list_checked">
      <span class="show_btn">
        <i class="el-icon-arrow-right"></i>
      </span>
    </label>
    <div class="nrms_nurse_list">
      <div class="header">
        <div>年假管理</div>
        <div class="btn">
          <label for="hsms_nurse_list_checked">
            <span class="hide_btn">
              <i class="el-icon-arrow-left"></i>
            </span>
          </label>
        </div>
      </div>
      <div class="list">
        <div class="right-btn">
          <el-button type="primary" v-uni="'nianjiaguanli_export'" @click="exportExcel">导出</el-button>
        </div>
        <el-table ref="table" highlight-current-row :data="tableData" height="100%" :row-style="{height:'36px'}" stripe :row-class-name="tableRowClassName" v-uni="'nianjiaguanli_nurse_click'" @row-click="getAccountInfo">
          <!-- <el-table-column type="index" label="序号" align="center" width="60">

            </el-table-column> -->
          <el-table-column align="center" prop="accountName" label="姓名" show-overflow-tooltip min-width="90px">

          </el-table-column>
          <el-table-column align="center" prop="workOvertime" label="年假天数" width="130px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="holidayBalance" label="未休天数" width="130px" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ApiAnnualHolidays } from "../../../api/hsms";
export default {
  name: "save_record_list",
  data() {
    return {
      loading: false,
      tableData: [],
      deptName: "",
      rowIndex: 0,
    };
  },
  created() {
    let deptInfo = JSON.parse(localStorage.getItem("deptInfo")) || {};
    this.deptName = deptInfo.deptName || "";
    this.getData();
  },
  methods: {
    getData() {
      ApiAnnualHolidays.selectAnnualSum({ accountType: 2 })
        .then((res) => {
          this.$nextTick(() => {
            this.tableData = res.data || [];
            this.$refs.table &&
              this.$refs.table.setCurrentRow(this.tableData[this.rowIndex]); // 默认到第一行
            this.getAccountInfo(this.tableData[this.rowIndex]);
          });
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },
    exportExcel() {
      window.open(
        "/hsms/web-hs/annual-leave/export?accountType=2&deptName=" +
          this.deptName
      );
    },
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex;
    },
    getAccountInfo(row) {
      this.rowIndex = row.index;
      this.$emit("initAccount", row);
    },
  },
  components: {},
};
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../assets/hsms/css/self_common";
/deep/ .cell {
  cursor: default !important;
}
/* 覆盖element css */
.nrms_nurse_list /deep/ .el-table th > .cell {
  font-size: 14px;
  color: initial;
  font-weight: 400;
}
.nrms_nurse_list /deep/ .el-table td > .cell {
  padding: 0 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nrms_nurse_list /deep/ .el-tabs__item {
  padding: 0 14px !important;
  max-width: initial;
  min-width: initial;
  font-size: 14px;
}
.nrms_nurse_list /deep/ .el-tabs__item.is-active {
  max-width: initial;
  min-width: initial;
}
.nrms_nurse_list /deep/ .el-table {
  font-size: 14px;
}
.nrms_patient_list /deep/ .el-table td,
.el-table th {
  padding: 6px 0;
}
.nrms_nurse_list /deep/ .el-table th {
  background-color: #f4f4f4;
}
.nrms_nurse_list /deep/ .el-table td,
.el-table th.is-leaf {
  border: none !important;
}
.nrms_nurse_list /deep/ .el-table--border::after,
.el-table--group::after {
  width: 0;
}
.nrms_nurse_list /deep/ .el-table::before {
  height: 0;
}
.nrms_nurse_list .list /deep/ .el-table__body tr.current-row > td {
  color: #409eff;
}

#hsms_nurse_list_checked:checked ~ .nrms_nurse_list {
  width: 0;
  border: none;
  > div {
    display: none;
  }
}

#hsms_nurse_list_checked:checked ~ label .show_btn {
  display: inline-block;
}

.show_btn {
  display: none;
  position: absolute;
  top: 6px;
  left: -1px;
  border: 1px solid;
  line-height: 13px;
  border-left: none;
  background-color: #fff;
  padding: 6px 3px;
  text-align: center;
  color: #409eff;
  cursor: pointer;
  z-index: 9;
}

.nrms_nurse_list {
  height: 100%;
  width: 420px;
  border-right: 1px solid #e6e6e6;
  transition: width 0.25s;
  .header {
    color: #409eff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;
    > div:first-child {
      flex: 1;
      font-size: 16px;
      padding: 5px;
    }
  }
  .btn {
    label {
      display: inline-block;
      padding: 3px 8px;
      text-align: center;
      line-height: 2;
      cursor: pointer;
      border-left: 1px solid #e6e6e6;
      box-shadow: 0px 0px 4px 0px rgba(226, 226, 226, 1);
    }
    .show_btn,
    hide_btn {
    }
  }
  .list {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    // 动作按钮
    .right-btn {
      padding: 10px;

      /deep/ .el-button {
        width: 70px;
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        padding: 0;
        text-align: center;
        float: right;
      }
    }
  }
}
</style>
