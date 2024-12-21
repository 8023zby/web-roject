<template>
  <div v-loading="loading" class="container-main">
    <div class="left">
      <div v-if="tabIndex==='first'" class="inspection">
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
      <div v-else class="examine" style="position: relative">
        <table>
          <tr>
            <td>报告日期：</td>
            <td>{{currentExamine.reportTime|formatDateTime}}</td>
          </tr>
          <tr>
            <td>检查项目：</td>
            <td>{{currentExamine.examineContent}}</td>
          </tr>
          <tr>
            <td>标本种类：</td>
            <td>{{currentExamine.sampleType}}</td>
          </tr>
        </table>
        <div class="examine-div" v-loading="loadingPart">
          <el-table
            highlight-current-row
            :data="examineItemsList"
            height="100%"
            width="100%"
            stripe
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
        </div>

      </div>
    </div>
    <div class="right" style="position: relative">
      <div style="width:100%;height: 63px;z-index: 999;position: absolute;top: 103px;background-color: transparent">
        <div style="height: 100%;">
          <img src="../../../../../assets/nrms/images/pad-right.png" style="margin-left: 12px"/>
          <img src="../../../../../assets/nrms/images/pad-right.png" style="float:right;padding-right: 12px"/>

          <!-- <div
             style="position: relative;top: 50%;transform: translateY(-50%);height: 100%;width: 12px;margin-left: 20px;float: left">
             &lt;!&ndash;<div class="wj-dot" style="position: absolute;left: 50%;transform: translateX(-50%);top: 0"></div>&ndash;&gt;
             &lt;!&ndash;<div class="wj-dot" style="position: absolute;left: 50%;transform: translateX(-50%);bottom: 0"></div>&ndash;&gt;
             &lt;!&ndash;<div class="wj-rect"></div>&ndash;&gt;
           </div>
           <div
             style="position: relative;top: 50%;transform: translateY(-50%);height: 100%;width: 12px;margin-right: 20px;float: right">
             <div class="wj-dot" style="position: absolute;left: 50%;transform: translateX(-50%);top: 0"></div>
             <div class="wj-dot" style="position: absolute;left: 50%;transform: translateX(-50%);bottom: 0"></div>
             <div class="wj-rect"></div>
           </div>-->
        </div>
      </div>
      <el-tabs v-model="tabIndex" style="height: 100%;box-shadow: 2px 2px 10px #cccccc;"
               @tab-click="tabClickFirstGetData()">
        <el-tab-pane label="检查报告" name="first">
          <el-card style="margin-top: 10px;padding: 10px 0;text-align: center">
            <div style="display: inline-block;margin: 0 auto">
              <el-date-picker clear-icon type="date" valueFormat="yyyy-MM-dd" placeholder="时间选择"
                              v-model="inspection_condition.doctorAdviceTime"
                              @change="changeInspectionIconShow(),getData()" style="border:none;display: inline-block">
              </el-date-picker>
              <i class="el-icon-circle-close" style="display: inline-block;color: #666666;font-size: 20px"
                 @click="inspectionDateDayClear()" v-show="inspectionIconShow"></i>
            </div>
          </el-card>
          <div class="table-style">
            <el-card style="height:100%">
              <el-table :data="inspectionList" :show-header="false" height="100%">
                <el-table-column align="center">
                  <template slot-scope="scope">
                    <el-card class="box-card">
                      <div slot="header">
                        <span
                          :class="currentInspectionDateDay===scope.row.dateDay?'span-border-radius-on':'span-border-radius-out'">{{scope.row.dateDay}}</span>
                      </div>
                      <div v-for="(item,index) in scope.row.inspectionReportDoList" :key="index">
                        <el-button @click="resetCurrentInspection(scope.row.dateDay,item)" type="button"
                                   :class="{'button-background':index%2===0,'active_clinicalId':activeInspectionId===item.inspectionId}">
                          {{item.inspectionContent}}
                        </el-button>
                      </div>
                    </el-card>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="检验结果" name="second">
          <el-card style="margin-top: 10px;padding: 10px 0;text-align: center">
            <div>
              <el-date-picker clear-icon type="date" valueFormat="yyyy-MM-dd" placeholder="时间选择"
                              v-model="examine_condition.doctorAdviceTime" @change="changeExamineIconShow(),getData()"
                              style="border:none;display: inline-block">
              </el-date-picker>
              <i class="el-icon-circle-close" style="display: inline-block;color: #666666;font-size: 20px"
                 @click="examineDateDayClear()" v-show="examineIconShow"></i>
            </div>

          </el-card>
          <div class="table-style">
            <el-card style="height:100%">
              <el-table :data="examineList" :show-header="false" height="100%" border>
                <el-table-column align="center">
                  <template slot-scope="scope">
                    <el-card class="box-card">
                      <div slot="header">
                        <span
                          :class="currentExamineDateDay===scope.row.dateDay?'span-border-radius-on':'span-border-radius-out'">{{scope.row.dateDay}}</span>
                      </div>
                      <div v-for="(item,index) in scope.row.examineReportDoList" :key="index"
                           :class="{'border-bottom-item':index!=scope.row.examineReportDoList.length-1}">
                        <el-button @click="resetCurrentExamine(scope.row.dateDay,item)" type="button"
                                   :class="{'button-background':index%2===0,'active_clinicalId':examine_item_condition.examineId===item.examineId}">
                          {{item.examineContent}}
                        </el-button>
                      </div>
                    </el-card>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import {ApiClinicalReport} from "../../../../../api/nrms";

  export default {
    name: "clinicalList",
    props: ['patientId'],
    data() {
      return {
        loading: false,
        loadingPart: false,
        activeInspectionId: '',
        tabIndex: "first",
        inspection_condition: {patientId: this.patientId, doctorAdviceTime: null, inspectionContent: null},
        examine_condition: {patientId: this.patientId, doctorAdviceTime: null, examineContent: null},
        examine_item_condition: {examineId: ""},
        inspectionList: [],
        examineList: [],
        examineItemsList: [],
        currentInspection: [],
        currentExamine: [],
        currentInspectionDateDay: "",
        currentExamineDateDay: "",
        secondTabFirstClick: true,
        inspectionIconShow: false,
        examineIconShow: false,
      }
    },
    created() {
      this.getData();
    },
    methods:
      {
        getData() {
          this.loading = true;
          if (this.tabIndex === 'first') {
            ApiClinicalReport.selectInspectionListPAD(this.inspection_condition).then((res) => {
              this.inspectionList = res.data;
              this.loading = false;
            }).catch((err) => {
              this.$message.error("服务器调用失败了，请联系管理员！");
              this.inspectionList = [];
              this.loading = false;
            });
          } else {
            ApiClinicalReport.selectExamineListPAD(this.examine_condition).then((res) => {
              this.examineList = res.data;
              this.loading = false;
            }).catch((err) => {
              this.$message.error("服务器调用失败了，请联系管理员！");
              this.examineList = [];
              this.loading = false;
            });
          }
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
        resetCurrentInspection(currentInspectionDateDay, item) {
          this.currentInspectionDateDay = currentInspectionDateDay;
          this.currentInspection = item;
          this.activeInspectionId = item.inspectionId;
        },
        resetCurrentExamine(currentExamineDateDay, item) {
          this.currentExamineDateDay = currentExamineDateDay;
          this.examine_item_condition.examineId = item.examineId;
          this.currentExamine = item;
          this.getItems();
        },
        tabClickFirstGetData() {
          if (this.secondTabFirstClick) {
            this.secondTabFirstClick = false;
            this.getData();
          }
        },
        changeInspectionIconShow() {
          this.inspectionIconShow = true;
        },
        inspectionDateDayClear() {
          this.inspectionIconShow = false;
          this.currentInspectionDateDay = "";
          this.inspection_condition.doctorAdviceTime = null;
          this.getData();
        },
        changeExamineIconShow() {
          this.examineIconShow = true;
        },
        examineDateDayClear() {
          this.examineIconShow = false;
          this.currentExamineDateDay = "";
          this.examine_condition.doctorAdviceTime = null;
          this.getData();
        }
      }
  }
</script>
<style lang="scss">
  .el-popper .popper__arrow::after {
    border-width: 16px;
    margin-left: -16px !important;
    border-bottom-color: #5281EB !important;
  }

  .el-popper[x-placement^=bottom] .popper__arrow {
    top: -16px;
  }

  .el-popper .popper__arrow {
    border-width: 16px;
  }

  .el-date-table td.today span {
    width: 24px;
    height: 24px;
    -moz-border-radius: 12px;
    -webkit-border-radius: 12px;
    border-radius: 12px;
    color: white;
    background: #ff9700;
    -webkit-box-shadow: 0px 0px 8px #e8e8e8;
    box-shadow: 0px 0px 8px #e8e8e8;
  }

  .el-picker-panel {
    border-radius: 12px !important;

  .el-picker-panel__body {

  .el-date-picker__header {
    margin: 0;
    padding: 12px;
    background-color: #5281EB;
    border-radius: 12px 12px 0 0 !important;
  }

  .el-date-picker__header-label {
    color: white;
    font-size: 18px;
    vertical-align: middle;
  }

  .el-picker-panel__icon-btn {
    color: white;
    font-size: 18px;
    vertical-align: middle;
  }

  }

  }

</style>

<style lang="scss" scoped>
  .container-main {
    display: flex;
    height: 100%;
    justify-content: center;

  .right {
    flex: 0 0 320px;
    position: relative;
  }

  .right /deep/ .el-table td {
    padding: 0;
  }

  .right /deep/ .el-table .cell {
    padding: 0;
  }

  .right /deep/ .el-card__body {
    padding: 0px;
  }

  .right /deep/ .el-card__header {
    padding: 20px 5px;
    border-bottom: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .right /deep/ .el-input__inner {
    border: none;
    color: #5281EB;
    font-size: 16px;
    font-weight: 600;
  }

  /*  .right /deep/ .el-input__suffix-inner .el-input__icon:before
    {
      content: "\E78D";
    }*/
  .right /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 150px;
    margin: 0 auto;
    display: block
  }

  .right /deep/ .el-input__inner::placeholder {
    color: #5281EB;
    font-size: 18px;
    font-weight: 500;
    padding-left: 5px;
  }

  .right /deep/ .el-input__prefix, .el-input__suffix {
    color: #5281EB;
    font-size: 16px;
    font-weight: 600;
  }

  .right .el-card.is-always-shadow {
    -webkit-box-shadow: 2px 2px 6px #e8e8e8;
    box-shadow: 2px 2px 6px #e8e8e8;
  }

  .left {
    flex: 1;
    margin: 20px;
    box-shadow: 2px 2px 10px #cccccc;
    overflow: auto;

  > div {
    margin: 0 auto;
    height: 100%;
  }

  table {
    width: 95%;
    margin: 0 auto;
    padding-top: 20px;
    overflow: hidden;
    font-size: 24px;
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0 10px;
    color: #666666;

  /deep/ .el-button--primary {
    font-size: 20px !important;
    border-radius: 4px 4px !important;
  }

  }

  table tr {
    height: 50px;
  }

  table td:nth-child(1) {
    width: 120px;
    text-align: left;
    vertical-align: top;
  }

  table td:nth-child(2) {
    color: #04af6d;
    line-height: 1.5;
    vertical-align: top;
  }

  .examine-div {
    position: absolute;
    top: 220px;
    bottom: 2px;
    width: 100%;

  /deep/ .el-table {
    font-size: 18px !important;
  }

  /deep/ .el-table th {
    padding: 3px auto;
    background-color: #F3F6FD;
    font-weight: normal;
  }

  /deep/ .el-table td {
   border: none;
  }
  }
  }

  .box-card {
    width: 100%;
  }

  .el-card {
    border: none;
    border-radius: 0;
  }

  .right /deep/ .el-tabs__content {
    position: absolute;
    top: 63px;
    bottom: 0;
    width: 100%;
  }

  .right /deep/ .el-tab-pane {
    position: relative;
    height: 100%;
  }

  .right /deep/ .el-tabs__nav {
    width: 100%;
    height: 63px;
  }

  .right /deep/ .el-tabs__item {
    width: 50%;
    height: 100%;
    text-align: center;
    line-height: 63px;
    font-size: 20px;
    color: #666666;
  }

  .table-style {
    position: absolute;
    top: 68px;
    bottom: 12px;
    width: 100%;

  > div {
    height: 100%;
  }

  }
  }
  .table-style /deep/ .el-card__body {
    height: 100%;
  }

  .border-bottom-item {
    /*border-bottom: 1px solid #EBEEF5;*/
  }

  .button-background {
    background-color: #F9F9FB;
  }

  .right /deep/ .el-button--button {
    width: 100%;
    height: 56px;
    color: #666666;
    border: none;
  }

  .right /deep/ .el-button--small {
    font-size: 22px !important;
  }

  .right /deep/ .el-button--button:hover {
    width: 100%;
    height: 56px;
    color: #606266;;
    border: none;
    background-color: lightgray;
  }

  .active_clinicalId {
    background-color: #ff9700 !important;
    color: #FFFFFF !important;
  }

  .span-border-radius-on {
    border-radius: 17px;
    border: 1px solid #5281EB;
    box-shadow: 0px 0px 3px #c4c6c5;
    background-color: #5281EB;
    width: 162px;
    height: 34px;
    line-height: 34px;
    color: white;
    display: block;
    margin: 0 auto;
    font-size: 18px;
  }

  .span-border-radius-out {
    border-radius: 17px;
    border: 1px solid #c7d3e5;
    background-color: #c7d3e5;
    box-shadow: 0px 0px 3px #c4c6c5;
    width: 162px;
    height: 34px;
    line-height: 34px;
    color: white;
    display: block;
    margin: 0 auto;
    font-size: 18px;
  }

  .right /deep/ .el-tabs__active-bar {
    width: 0 !important;
  }

  .right /deep/ #tab-first.el-tabs__item.is-active {
    background-color: #5281EB;
    border: 1px solid #5281EB;
    color: white;
    border-radius: 0 36px 36px 0;
    box-shadow: 2px 0px 5px #b2b2b2;
  }

  .right /deep/ #tab-second.el-tabs__item.is-active {
    background-color: #5281EB;
    border: 1px solid #5281EB;
    color: white;
    border-radius: 36px 0 0 36px;
    box-shadow: 0px 2px 5px #b2b2b2;
  }

  .wj-dot {
    width: 14px;
    height: 14px;
    border: 1px solid #088;
    border-radius: 8px;
    background-color: #5281EB !important;
    opacity: 1;
    margin: 0 auto;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.5);
  }

  .wj-rect {
    width: 6px;
    height: 30px;
    border: 1px solid whitesmoke;
    z-index: 1000;
    background: #D3DDFF;
    opacity: 0.6;
    margin: 0 auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 10px;
    box-shadow: 0px 0px 4px rgba(10, 10, 10, 0.5);
  }
</style>
