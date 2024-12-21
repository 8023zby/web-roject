<template>
  <div style="position: relative; height: 100%; ">
    <input type="checkbox" id="nrms_patient_list_checked" style="display: none">
    <label for="nrms_patient_list_checked">
      <span class="show_btn" style="z-index:999">></span>
    </label>
    <div class="nrms_patient_list">
      <div class="header">
        <div>患者一览</div>
        <div class="btn">
          <label for="nrms_patient_list_checked">
            <span class="hide_btn"><</span>
          </label>
        </div>
      </div>
      <div class="list">
        <el-tabs value="first" style="height: 100%" @tab-click="handleClick">
          <el-tab-pane label="在院" name="first">
            <el-table
              ref="inTable"
              :data="inList"
              :height="table_height"
              highlight-current-row
              @row-click="getInPatientInfo"
            >
              <el-table-column
                prop="patientInViewDTO.bedName"
                label="床号"
                align="center"
                min-width="60px"
              ></el-table-column>
              <el-table-column
                prop="patientInViewDTO.patientName"
                label="姓名"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="转科" name="second">
            <el-table
              ref="transTable"
              :data="transList"
              :height="table_height"
              highlight-current-row
              @row-click="getTransPatientInfo"
            >
              <el-table-column
                prop="bedName"
                label="床号"
                align="center"
                min-width="60px"
              ></el-table-column>
              <el-table-column
                prop="patientName"
                label="姓名"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="出院" name="three">
            <el-table
              ref="outTable"
              :data="outList"
              :height="table_height"
              highlight-current-row
              @row-click="getOutPatientInfo"
            >
              <el-table-column
                prop="bedName"
                label="床号"
                align="center"
                min-width="60px"
              ></el-table-column>
              <el-table-column
                prop="patientName"
                label="姓名"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { patientIn, patientOut, patientTransfer } from '@/api/hpms/advices/advice'
export default {
  name: 'cps_patient_list',
  props: ['initRowIndex'],
  data () {
    return {
      // header 50 footer 42 main-padding 42 self-header 43 tab 40
      table_height: window.innerHeight - 50 - 42 - 40 - 43 - 40,
      inList: [],
      outList: [],
      transList: [],
      loading_in: false,
      loading_trans: false,
      loading_out: false
    }
  },
  created () {
    this.selectPatientData()
  },
  methods: {
    selectPatientData () {
      patientIn().then(res => {
        this.inList = (res.data && res.data.patientSelectDtos) ? res.data.patientSelectDtos : []
        // this.$nextTick(function () {
        //   if (this.$refs.inTable && this.inList[this.initRowIndex]) {
        //     this.$refs.inTable.setCurrentRow(this.inList[this.initRowIndex])
        //     this.getInPatientInfo(this.inList[this.initRowIndex])
        //   }
        // })
      })
      patientOut().then(res => {
        this.outList = res.data || []
        // this.$nextTick(function () {
        //   if (this.$refs.outTable && this.outList[this.initRowIndex]) {
        //     this.$refs.outTable.setCurrentRow(this.outList[this.initRowIndex])
        //     this.getOutPatientInfo(this.outList[this.initRowIndex])
        //   }
        // })
      })
      patientTransfer().then(res => {
        this.transList = res.data || []
        // this.$nextTick(function () {
        //   if (this.$refs.transTable && this.transList[this.initRowIndex]) {
        //     this.$refs.transTable.setCurrentRow(this.transList[this.initRowIndex])
        //     this.getTransPatientInfo(this.transList[this.initRowIndex])
        //   }
        // })
      })
    },
    getInPatientInfo (row) {
      if (row !== '' && row !== undefined && row !== null) {
        this.$emit('initPatient', row.patientInViewDTO, 0)
      } else {
        this.$emit('initPatient', 'null', 0)
      }
    },
    getTransPatientInfo (row) {
      if (row !== '' && row !== undefined && row !== null) {
        this.$emit('initPatient', row, 1)
      } else {
        this.$emit('initPatient', 'null', 1)
      }
    },
    getOutPatientInfo (row) {
      if (row !== '' && row !== undefined && row !== null) {
        this.$emit('initPatient', row, 2)
      } else {
        this.$emit('initPatient', 'null', 2)
      }
    },
    handleClick (tab, event) {
      if (tab.index === '0') {
        this.$emit('initPatient', 'null', 0)
        this.selectPatientData()
      } else if (tab.index === '1') {
        this.$emit('initPatient', 'null', 1)
        this.selectPatientData()
      } else if (tab.index === '2') {
        this.$emit('initPatient', 'null', 2)
        this.selectPatientData()
      }
    }
  },
  components: {}
}
</script>

<style lang="scss" type="text/scss" scoped>
  /* 覆盖element css */
  .nrms_patient_list /deep/ .el-tabs__nav-prev {
    display: none;
  }
  .nrms_patient_list /deep/ .el-tabs__nav-next {
    display: none;
  }
  .nrms_patient_list /deep/ .el-tabs__nav-wrap {
    padding: 0;
  }
  .nrms_patient_list /deep/ .el-tabs__header {
    padding: 0 5px;
    margin: 0;
  }
  .nrms_patient_list /deep/ .el-table th>.cell {
    padding-left: 15px;
  }
  .nrms_patient_list /deep/ .el-tabs__item {
    padding: 0 16.5px;
  }
  .nrms_patient_list /deep/ .el-table td, .el-table th.is-leaf {
    border: none !important;
  }
  .nrms_patient_list /deep/ .el-table--border::after, .el-table--group::after {
    width: 0;
  }
  .nrms_patient_list /deep/ .el-table::before {
    height: 0;
  }
  .nrms_patient_list .list /deep/ .el-table__body tr.current-row>td {
    color:#409EFF ;
  }

  #nrms_patient_list_checked:checked ~ .nrms_patient_list {
    width: 0;
    border:none;
    > div {
      display: none;
    }
  }

  #nrms_patient_list_checked:checked ~ label .show_btn {
    display: inline-block;
  }

  .show_btn {
    display: none;
    position: absolute;
    top: 50px;
    left: -1px;
    border: 1px solid;
    line-height: 13px;
    border-left: none;
    border-radius: 0 5px 5px 0;
    width: 15px;
    text-align: center;
    color: #409EFF;
    cursor: pointer;
    z-index: 9;
  }

  .nrms_patient_list {
    height: 100%;
    width: 180px;
    border-right: 1px solid #e6e6e6;
    transition: width .25s;
    .header {
      padding: 5px;
      color: #409EFF;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e6e6e6;
      > div:first-child {
        flex: 1;
        font-size: 16px;
      }
    }
    .btn {
      label {
        display: inline-block;
        width: 10px;
        text-align: center;
        line-height: 2;
        cursor: pointer;
      }
      .show_btn, hide_btn {

      }
    }
    .list {
      box-sizing: border-box;
    }
  }
  .el-aside{
    overflow: visible !important;
  }
</style>
