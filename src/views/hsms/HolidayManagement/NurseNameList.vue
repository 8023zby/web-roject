<template>
  <div style="position: relative; height: 100%; background-color: #fff">
    <input type="checkbox" id="nurse_name_list_checked" style="display: none">
    <label for="nurse_name_list_checked">
      <span class="show_btn">
        <i class="el-icon-arrow-right"></i>
      </span>
    </label>
    <div class="nurse_name_list">
      <div class="header">
        <div>请假管理</div>
        <div class="btn">
          <label for="nurse_name_list_checked">
            <span class="hide_btn">
              <i class="el-icon-arrow-left"></i>
            </span>
          </label>
        </div>
      </div>
      <div class="export_excel">
        <el-button type="primary" class="el-button-radius excel-button" @click="holidayTypeDialogShow"
                   size="small" v-uni="'qingjiaguanli_show'">请假管理
        </el-button>
        <el-button type="primary" class="el-button-radius excel-button" @click="exportData" size="small" v-uni="'qingjiaguanli_export'">导出
        </el-button>
      </div>
      <div class="list" v-loading="loading">
        <el-table
          ref="nurseNameListTable"
          :data="nurseNameList"
          :height="tableHeight"
          highlight-current-row
          :row-class-name="tableRowClassName"
          @row-click="getHolidayInfo"
          v-uni="'qingjiaguanli_nurse_clicktable'"
        >
          <!-- <el-table-column
            type="index"
            label="序号"
            align="center"
            width="80px"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column
            prop="accountName"
            label="姓名"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="leaveWorkDays"
            label="累计请假天数"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
    </div>

    <div v-if="holidayTypeDialog">
      <el-dialog
        title="请假管理类型"
        :visible.sync="holidayTypeDialog"
        width="490px"
        :close-on-click-modal="false"
        class="focus_window"
      >
        <HolidayType></HolidayType>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import HolidayType from './HolidayType.vue'
import { ApiHolidayNurseList } from '../../../api/hsms'

export default {
  name: 'nurse_patient_list',
  components: { HolidayType },
  data () {
    return {
      // header 50 footer 42 self-header 33 tabs 36 margin-top 16
      tableHeight: window.innerHeight - 50 - 42 - 33 - 36 - (this.$route.meta.isFullScreen ? 0 : 40) - 17,
      nurseNameList: [],
      loading: false,
      initRowIndex: 0,
      holidayTypeDialog: false
    }
  },
  activated () {
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      ApiHolidayNurseList.get({ accountType: 2 }).then(res => {
        this.nurseNameList = res.data || []
        this.resetData()
      }).finally()
      {
        this.loading = false
      }
    },
    holidayTypeDialogShow () {
      this.holidayTypeDialog = true
    },
    getHolidayInfo (row) {
      this.initRowIndex = row.index
      this.$emit('reset-nurse', row)
    },
    resetData () {
      if (this.nurseNameList.length > this.initRowIndex) {
        this.$emit('reset-nurse', this.nurseNameList[this.initRowIndex])
      }
    },
    exportData () {
      window.open(`/hsms/web-hs/leave-work/export?accountType=2`)
    },
    tableRowClassName ({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    }
  },
  watch: {
    nurseNameList: function () {
      this.$nextTick(function () {
        if (this.initRowIndex >= this.nurseNameList.length) {
          this.$refs.nurseNameListTable.setCurrentRow(this.nurseNameList[0])
        } else {
          this.$refs.nurseNameListTable.setCurrentRow(this.nurseNameList[this.initRowIndex])
        }
      })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>

  .isRecall {
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border: 10px solid #67C23A;
    border-bottom-color: transparent;
    border-left-color: transparent;
    color: #fff;
  }

  .export_excel {
    margin-right: 10px;
    margin-bottom: 10px;
    margin-top: 10px;

    display: flex;
    justify-content: flex-end;

    .excel-button {
      height: 28px;
      width: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  /deep/ .cell {
    cursor: default !important;
  }

  /* 覆盖element css */
  .nurse_name_list /deep/ .el-tabs__nav-prev {
    display: none;
  }

  .nurse_name_list /deep/ .el-tabs__nav-next {
    display: none;
  }

  .nurse_name_list /deep/ .el-tabs__nav-wrap {
    padding: 0;
  }

  .nurse_name_list /deep/ .el-tabs__header {
    padding: 0;
    margin: 0;
  }

  .nurse_name_list /deep/ .el-table th > .cell {
    padding-left: 15px;
    font-size: 14px;
    color: initial;
    font-weight: 400;
  }

  .nurse_name_list /deep/ .el-tabs__item {
    padding: 0 14px !important;
    max-width: initial;
    min-width: initial;
    font-size: 14px;
  }

  .nurse_name_list /deep/ .el-tabs__item.is-active {
    max-width: initial;
    min-width: initial;
  }

  .nurse_name_list /deep/ .el-table {
    margin-top: 0;
    font-size: 14px;
  }

  .nurse_name_list /deep/ .el-table td, .el-table th {
    padding: 6px 0;
  }

  .nurse_name_list /deep/ .el-table th {
    background-color: #F4F4F4;
  }

  .nurse_name_list /deep/ .el-table td, .el-table th.is-leaf {
    border: none !important;
  }

  .nurse_name_list /deep/ .el-table--border::after, .el-table--group::after {
    width: 0;
  }

  .nurse_name_list /deep/ .el-table::before {
    height: 0;
  }

  .nurse_name_list .list /deep/ .el-table__body tr.current-row > td {
    color: #409EFF;
  }

  #nurse_name_list_checked:checked ~ .nurse_name_list {
    width: 0;
    border: none;

    > div {
      display: none;
    }
  }

  #nurse_name_list_checked:checked ~ label .show_btn {
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
    color: #409EFF;
    cursor: pointer;
    z-index: 9;
  }

  .nurse_name_list {
    height: 100%;
    width: 420px;
    border-right: 1px solid #e6e6e6;
    transition: width .25s;

    .header {
      color: #409EFF;
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

      .show_btn, hide_btn {

      }
    }

    .list {
      box-sizing: border-box;
    }
  }

  /deep/ .el-dialog__body {
    padding: 30px 0 0 0;
  }

  .focus_window {
    /deep/ .el-textarea__inner {
      padding-bottom: 28px;
      border-radius: 2px;
    }

    /deep/ .el-textarea .el-input__count {
      text-align: right;
      left: 1px;
      right: 1px;
      bottom: 1px;
      padding: 7px 5px;
      font-size: 12px;
      line-height: normal;
    }
  }

</style>
