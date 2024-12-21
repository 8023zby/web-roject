<template>
  <div style="position: relative; height: 100%; background-color: #fff" class="eduRecord-patientlist">
    <input type="checkbox" id="nrms_patient_list_checked" style="display: none">
    <label for="nrms_patient_list_checked">
      <span class="show_btn">
        <i class="el-icon-arrow-right"></i>
      </span>
    </label>
    <div class="nrms_patient_list">
      <div class="header">
        <div>患者一览</div>
        <div class="btn">
          <label for="nrms_patient_list_checked">
            <span class="hide_btn">
              <i class="el-icon-arrow-left"></i>
            </span>
          </label>
        </div>
      </div>
      <div class="list">
        <el-tabs v-model="activeName" style="height: 100%">
          <el-tab-pane label="在院" name="in">
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
                show-overflow-tooltip
                width="79px"
              ></el-table-column>
              <el-table-column
                prop="patientInViewDTO.patientName"
                label="姓名"
                show-overflow-tooltip
                width="100px"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="转科" name="trans">
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
                show-overflow-tooltip
                width="79px"
              ></el-table-column>
              <el-table-column
                prop="patientName"
                label="姓名"
                show-overflow-tooltip
                width="100px"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="出院" name="out">
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
                show-overflow-tooltip
                width="79px"
              ></el-table-column>
              <el-table-column
                prop="patientName"
                label="姓名"
                show-overflow-tooltip
                width="100px"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.outHospitalFlag === 1" class="isRecall"></span>
                  {{scope.row.patientName}}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
// import { ApiPatient } from "../../api/nrms";
import { patientIn, patientOut, patientTransfer } from '@/api/hpms/advices/advice'

export default {
  name: 'cps_patient_list',
  props: ['initRowType', 'initRowIndex'],
  data () {
    return {
      // header 50 footer 42 self-header 33 tabs 36
      table_height: window.innerHeight - 50 - 42 - 33 - 36 - (this.$route.meta.isFullScreen ? 0 : 40),
      activeName: 'in',
      inList: [
        {
          'patientInViewDTO': {
            'bedName': '1',
            'patientName': '1',
            'patientId': 'id123456'
          }
        }
      ],
      outList: [],
      transList: [],
      loading_in: false,
      loading_trans: false,
      loading_out: false
    }
  },
  watch: {
    activeName (newval, oldval) {
      console.log('树标签更改：',newval, oldval)
      this.$emit('activeNameChange',newval)
      if(newval === 'in'){
        if(this.inList && this.inList.length > 0){
          this.$refs.inTable.setCurrentRow(this.inList[0])
          this.getInPatientInfo(this.inList[0])
        }
      }else if(newval === 'out'){
        if(this.outList && this.outList.length > 0){
          this.getOutPatientInfo(this.outList[0])
          this.$refs.outTable.setCurrentRow(this.outList[0])
        }
      }else if(newval === 'trans'){
        if(this.transList && this.transList.length > 0){
          this.$refs.transTable.setCurrentRow(this.transList[0])
          this.getTransPatientInfo(this.transList[0])
        }
      }
    }
  },
  created () {
    this.selectPatientData()
  },
  methods: {
    selectPatientData () {
      patientIn().then(res => {
        this.inList = (res.data && res.data.patientSelectDtos) ? res.data.patientSelectDtos : []
        this.$nextTick(function () {
          if (this.$refs.inTable && this.initRowType === 'in' && this.inList[this.initRowIndex]) {
            this.activeName = 'in'
            this.$refs.inTable.setCurrentRow(this.inList[this.initRowIndex])
            this.getInPatientInfo(this.inList[this.initRowIndex])
          }
        })
      })
      patientOut().then(res => {
        this.outList = res.data || []
        this.$nextTick(function () {
          if (this.$refs.outTable && this.initRowType === 'out' && this.outList[this.initRowIndex]) {
            this.activeName = 'out'
            this.$refs.outTable.setCurrentRow(this.outList[this.initRowIndex])
            this.getOutPatientInfo(this.outList[this.initRowIndex])
          }
        })
      })
      patientTransfer().then(res => {
        this.transList = res.data || []
        this.$nextTick(function () {
          if (this.$refs.transTable && this.initRowType === 'trans' && this.transList[this.initRowIndex]) {
            this.activeName = 'trans'
            this.$refs.transTable.setCurrentRow(this.transList[this.initRowIndex])
            this.getTransPatientInfo(this.transList[this.initRowIndex])
          }
        })
      })
    },
    getInPatientInfo (row) {
     this.$emit('initPatient', row.patientInViewDTO, 0)
    },
    getTransPatientInfo (row) {
      this.$emit('initPatient', row, 1)
    },
    getOutPatientInfo (row) {
      this.$emit('initPatient', row, 2)
    }
  },
  components: {}
}
</script>
<style lang="scss" >
  .eduRecord-patientlist{
    .nrms_patient_list{
      .el-tabs__item{
        padding: 0 14px!important;
      }
    }
    .el-table{
      font-size: 14px !important;
    }
  }
</style>
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
  /deep/ .cell {
    cursor: default !important;
  }
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
    top: 6px;
    left: -1px;
    border: 1px solid;
    line-height: 13px;
    border-left: none;
    padding: 6px 3px;
    text-align: center;
    background-color: #fff;
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
        padding: 0 8px;
        text-align: center;
        line-height: 2;
        cursor: pointer;
        border-left: 1px solid #e6e6e6;
      }
      .show_btn, hide_btn {

      }
    }
    .list {
      box-sizing: border-box;
    }
  }
</style>
