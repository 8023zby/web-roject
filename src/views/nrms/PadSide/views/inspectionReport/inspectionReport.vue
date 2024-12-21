<template>
  <div v-loading="loading" class="inspection-contain">
    <el-table
      :data="inspectionList"
      stripe
      height="100%"
    >
      <el-table-column min-width="35" align="center">
        <template slot="header" slot-scope="scope">报告时间</template>
        <template slot-scope="scope">
          {{scope.row.reportTime|formatDateTime}}
        </template>
      </el-table-column>
      <el-table-column min-width="35" align="center">
        <template slot="header" slot-scope="scope">检查单号</template>
        <template slot-scope="scope">
          {{scope.row.inspectionId}}
        </template>
      </el-table-column>
      <el-table-column min-width="35" align="center">
        <template slot="header" slot-scope="scope">检查项目</template>
        <template slot-scope="scope">
          {{scope.row.inspectionContent}}
        </template>
      </el-table-column>
      <el-table-column min-width="35" align="center">
        <template slot="header" slot-scope="scope">报告</template>
        <template slot-scope="scope">
          <div v-if="scope.row.reportStatus!=null&&scope.row.reportStatus.indexOf('已出')!='-1'">
            <el-button @click="clickDetails(scope.row)">已出</el-button>
          </div>
          <span v-else>未出</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="currentInspection.inspectionContent"
      :visible.sync="dialogVisible"
      width="70%"
      class="wj-dialog"
    >
      <div>
        <table>
          <tr>
            <td>报告日期：</td>
            <td>{{currentInspection.reportTime|formatDateTime}}</td>
          </tr>
          <tr>
            <td>检查项目：</td>
            <td>{{currentInspection.inspectionContent}}</td>
          </tr>
          <tr>
            <td>检查部位：</td>
            <td>{{currentInspection.inspectionBodyPart}}</td>
          </tr>
          <tr>
            <td>检查所见：</td>
            <td>{{currentInspection.inspectionDetails}}</td>
          </tr>
          <tr>
            <td>检查诊断：</td>
            <td>
              {{currentInspection.inspectionResult}}
            </td>
          </tr>
          <tr>
            <td>报告医生：</td>
            <td>{{currentInspection.checkDoctorName}}</td>
          </tr>
          <tr>
            <td>签字有效：</td>
            <td>{{currentInspection.checkDoctorNamePicture}}</td>
          </tr>
          <tr>
            <td>附图：
            </td>
            <td>
              <el-button type="primary">查看图像</el-button>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" style="position: relative;">
    <el-button type="warning" @click="dialogVisible = false"
               style="position: absolute;top: 50px;left: 50%;transform:translateX(-50%)">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {ApiClinicalReport} from "../../../../../api/nrms";

  export default {
    name: "pdaInspection",
    props: ['patientId'],
    data() {
      return {
        inspection_condition: {patientId: this.patientId, doctorAdviceTime: null},
        inspectionList: [],
        dialogVisible: false,
        currentInspection: []
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.loading = true;
        ApiClinicalReport.selectInspectionPAD(this.inspection_condition).then((res) => {
          this.inspectionList = res.data;
          this.loading = false;
        }).catch((err) => {
          this.$message.error("服务器调用失败了，请联系管理员！");
          this.inspectionList = [];
          this.loading = false;
        })
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      clickDetails(item) {
        this.dialogVisible = true;
        this.currentInspection = item;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .inspection-contain /deep/ {
    width: 100%;
    height: 100%;

  .el-button--small {
    border-radius: 4px 4px !important;
  }

  .el-table__header th {
    background-color: #f3f6fb;
    padding: 3px 0 !important;
    height: 48px;
    font-size: 20px;
    color: #666666;
    font-weight: normal;
  }
  .el-table th>.cell {
    height: 48px;
    line-height: 48px;
  }
  .el-table td {
    padding: 3px 0 !important;
    height: 48px;
    font-size: 18px !important;
    border: none;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #EDF8FD !important;
  }

  }
  .wj-dialog {

  table {
    width: 95%;
    height: 100%;
    margin: 0 auto;
    font-size: 24px;
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0 10px;
    color: #666666;

  tr {
    height: 50px;
  }

  td:nth-child(1) {
    width: 120px;
    text-align: left;
  }

  td:nth-child(2) {
    color: #04af6d;
    line-height: 1.5;
  }

  }
  /deep/ .el-dialog__body {
    max-height: 100%;
  }

  /deep/ .el-dialog__header {
    padding: 0;
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #f2f2f2;
    text-align: center;
    font-size: 30px;
  }

  /deep/ .el-dialog__title {
    display: block;
    font-size: 28px;
    height: 70px;
    line-height: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /deep/ .el-dialog__close {
    display: none;
  }

  .el-button--primary {
    font-size: 20px !important;
  }

  /deep/ .el-dialog__footer {
    padding: 0;
    text-align: center;

  /deep/ .el-button--warning {
    border-radius: 0 !important;
    background-color: #ff9700 !important;
    border-color: #ff9700 !important;
    padding: 10px 60px !important;
    font-size: 24px !important;
  }

  /deep/ .el-button--warning:hover {
    background: #ffc466 !important;
    border-color: #ffc466 !important;
  }

  }

  }
</style>
