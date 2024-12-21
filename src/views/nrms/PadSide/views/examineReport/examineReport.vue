<template>
  <div v-loading="loading" class="examine-contain">
    <el-table
      :data="examineList"
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
        <template slot="header" slot-scope="scope">检验单号</template>
        <template slot-scope="scope">
          {{scope.row.examineId}}
        </template>
      </el-table-column>
      <el-table-column min-width="35" align="center">
        <template slot="header" slot-scope="scope">检验项目</template>
        <template slot-scope="scope">
          {{scope.row.examineContent}}
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
      :title="currentExamine.examineContent"
      :visible.sync="dialogVisible"
      width="70%"
      class="wj-dialog"
    >
      <el-table
        highlight-current-row
        :data="examineItemsList"
        stripe
        width="100%"
        v-loading="loadingPart"
      >
        <!-- <el-table-column type="index" label="序号" width="60" align="center">
          <template slot-scope="scope">
            {{scope.$index+ 1 }}
          </template>
        </el-table-column> -->
        <el-table-column min-width="35" align="center">
          <template slot="header" slot-scope="scope">项目名称</template>
          <template slot-scope="scope" style="padding: 20px;">
            {{scope.row.examineItemName}}
          </template>
        </el-table-column>
        <el-table-column min-width="35" align="center">
          <template slot="header" slot-scope="scope">检验结果</template>
          <template slot-scope="scope">
            {{scope.row.examineItemResult}}
          </template>
        </el-table-column>
        <el-table-column min-width="35" align="center">
          <template slot="header" slot-scope="scope">单位</template>
          <template slot-scope="scope">
            {{scope.row.examineItemUnit}}
          </template>
        </el-table-column>
        <el-table-column min-width="35" align="center">
          <template slot="header" slot-scope="scope">异常标志</template>
          <template slot-scope="scope">
            {{scope.row.examineItemAbnormal}}
          </template>
        </el-table-column>
        <el-table-column min-width="35" align="center">
          <template slot="header" slot-scope="scope">参考范围</template>
          <template slot-scope="scope">
            {{scope.row.examineItemReferenceRange}}
          </template>
        </el-table-column>
        <el-table-column min-width="35" align="center">
          <template slot="header" slot-scope="scope">危急值</template>
          <template slot-scope="scope">
            {{scope.row.examineItemCrisisValue}}
          </template>
        </el-table-column>
      </el-table>
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
    name: "pdaExamine",
    props: ['patientId'],
    data() {
      return {
        examine_condition: {patientId: this.patientId, doctorAdviceTime: null},
        examineList: [],
        dialogVisible: false,
        currentExamine: [],
        examineItemsList: [],
        examine_item_condition: {examineId: ""},
        loading:false,
        loadingPart:false
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.loading = true;
        ApiClinicalReport.selectExaminePAD(this.examine_condition).then((res) => {
          this.examineList = res.data;
          this.loading = false;
        }).catch((err) => {
          this.$message.error("服务器调用失败了，请联系管理员！");
          this.examineList = [];
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
        this.currentExamine = item;
        this.examine_item_condition.examineId = item.examineId;
        this.getItems();
      },
      getItems() {
        this.loadingPart = true;
        ApiClinicalReport.selectExamineItemsAllPAD(this.examine_item_condition).then((res) => {
          this.examineItemsList = res.data;
          this.loadingPart = false;
        }).catch((err) => {
          this.$message.error("服务器调用失败了，请联系管理员！");
          this.examineItemsList = [];
          this.loadingPart = false;
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .examine-contain /deep/ {
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

  .el-table th > .cell {
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
    max-height: 600px;
    padding: 0;
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
