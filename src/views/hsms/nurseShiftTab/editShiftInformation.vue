<template>
  <!--护士医生-排班流水-本周排班-->
  <div class="typt-list-container" v-loading="loading">
    <!-------- 表顶部复选框 start -------->
    <div class="header">
      <el-button class="exprotRule-button" type="primary" v-uni="'daorupaibanguize_export2'" size="small" @click="exportRule()">导入排班规则</el-button>

      <el-checkbox v-model="showLastWeek" v-uni="'hushibaipan_edit_cankaoshangzhou'" @change="showLastWeekChange">参考上周排班</el-checkbox>
    </div>
    <!-------- 表顶部复选框 end -------->
    <el-table style="border-top: 1px solid #ebeef5" :data="tableData" :stripe="CONFIG.table.stripe" v-loading="loading" height="70%" v-if="tableVis" class="editShiftTable" :class="{'showLastWeek': showLastWeek}">
      <!-- <el-table-column
        align="center"
        type="index"
        show-overflow-tooltip
        width="75"
        label="序号"
      /> -->
      <el-table-column align="center" prop="accountName" show-overflow-tooltip label="姓名" width="80" />
      <el-table-column align="center" prop="level" show-overflow-tooltip label="护士层级" />
      <el-table-column v-for="(item, index) in lastWeekData" :key="item.id" :render-header="renderHeaderLast" :width="screenWidth > 1440 ? (showLastWeek? '110' :  '150') : 90" align="center" v-if="showLastWeek" :prop="item.id" :label="item.name" class-name="duty-column">
        <template slot-scope="scope">
          <shift-manage :srcData="scope.row" :col="index" :row="scope.$index" :dutyColor="dutyColor" :dataId="item.id" :flag="false" :dutyData="dutyData" />
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in weekData" :key="item.id" :render-header="renderHeader" :width="screenWidth > 1440 ? (showLastWeek? '110' :  '150') : 90" align="center" :prop="item.id" :label="item.name" class-name="duty-column">
        <template slot-scope="scope">
          <shift-manage :srcData="scope.row" :col="index" :row="scope.$index" :dutyColor="dutyColor" :dataId="item.id" :flag="false" :dutyData="dutyData" v-if="isLastLastWeek(item.id)" />
          <shift-manage @dealSelData="dealSelData" @dealSelFocus="dealSelFocus" @clickShiftItem="clickShiftItem" @dutyDataChange="dutyDataChange" @changeCompose="changeCompose" :dialogOpen="isShowDialog" :ref="index + '-' + scope.$index" :id="index + '-' + scope.$index" :srcData="scope.row" :col="index" :row="scope.$index" :dataId="item.id" :isNotAllowEdit="scope.row.notAllowEdit.indexOf(item.id) >= 0" :notAllowEdit="scope.row.notAllowEdit" :flag="selectShow" :dutyData="dutyData" :dutyColor="dutyColor" :color="colorCal(scope.row, scope, index, scope.$index)" :showDialog="
              shiftDialogItem.row == scope.$index &&
              shiftDialogItem.col == index
                ? true
                : false
            " v-else />
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" show-overflow-tooltip label="本周工时">
        <template slot-scope="scope">
          {{weekHours(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="arrearsHour" show-overflow-tooltip label="欠休" />
      <el-table-column label="年休" align="center">
        <el-table-column align="center" prop="annualLeave" show-overflow-tooltip label="天数" />
        <el-table-column align="center" prop="annualCount" show-overflow-tooltip label="未休" />
      </el-table-column>
    </el-table>
    <div style="height: 10px"></div>
    <div v-show="selectShow" slot="footer" class="dialog-footer btnDiv" style="height: 50px">
      <el-button @click="refresh" v-uni="'hushipaiban_edit_cancel'" style="width: 70px; height: 40px">取消</el-button>
      <el-button type="primary" @click="saveData" :loading="addVis" style="width: 70px; height: 40px" v-uni="'hushipaiban_edit_save'">保存</el-button>
    </div>
  </div>
</template>

<script>
import ShiftInformation from "../../../assets/hsms/mixins/NurseShiftInformation";
import ShiftManage from "../../../components/hsms/NurseShiftManager";
import SetConfig from "../../../components/hsms/SetConfig";
import UserSort from "../../../components/hsms/UserSort";
import DutyTypeSet from "../../../assets/hsms/mixins/DutyTypeSet";
import { DateFormate, filterData } from "../../../assets/hsms/unitils/unitils";
import {
  GetDuty,
  GetComposeDuty,
  GetNurseUser,
  GetRemark,
  GetBed,
  GetRoom,
  GetModelType,
  AxiosJsonApi,
  AxiosApi,
  GetRelation,
  ApiStorgeHolidays,
  ApiAnnualHolidays,
} from "../../../api/hsms";
import { ResultMsg } from "../../../assets/hsms/js/Message";
import config from "../../../assets/hsms/mixins/config";
import $ from "jquery";
const moment = require("moment");

export default {
  name: "NurseShiftInformation",
  components: {
    "shift-manage": ShiftManage,
    "user-sort": UserSort,
    "set-config": SetConfig,
  },
  // inject: ['tabRefresh', 'getBusinessType'],
  mixins: [ShiftInformation, DutyTypeSet, config],
  data() {
    return {
      businessType: "",
      userVisible: false,
      exportData: {
        exportFlag: false,
        exportType: "export",
        exportSelect: "SHIFT_NOTE",
        exportTypeObj: {},
        typeStr: "",
        export_tit: "床位号",
      },
      bedObj: {},
      roomObj: {},
      searchType: "week",
      curTime: "",
      searchDate: "",
      dutyColor: {},
      remarkData: [],
      weekVal: new Date().getTime(),
      modelName: "排班",
      weekData: [],
      modelType: "BED",
      formSearchData: {
        beginDate: "",
        endDate: "",
        businessType: "NURSE",
        type: 2, //1是排版流水，2是排版规则
        ttt: 1,
      },
      url: "/hsms/web-hs/schedule",
      select: {
        id: "",
      },
      /**
       * ------------------------------------------------------------------
       * 班次设置修改
       * ------------------------------------------------------------------
       */
      isShowDialog: false,
      shiftDialogItem: {},
      composeId: "", // 组合班次记录值，composeId
      /**
       * ------------------------------------------------------------------
       * 显示上周数据
       * ------------------------------------------------------------------
       */
      lastWeekData: [],
      lastWeekSearchData: {
        ttt: 111123,
        beginDate: "",
        endDate: "",
        businessType: "NURSE",
        type: 1, //1是排版流水，2是排版规则
      },
      showLastWeek: false,
      lastWeekTableData: [],
      /**
       * ------------------------------------------------------------------
       * 获取全部员工的年假，层级，存假
       * ------------------------------------------------------------------
       */
      otherColumn: {
        annual: [],
        level: [],
        holiday: [],
      },
      screenWidth: window.outerWidth,
    };
  },
  props: ["detail"],
  // 初始化
  created() {
    this.formSearchData = this.detail.formSearchData;

    console.log(this.formSearchData);
    this.searchType = this.detail.searchType;
    this.searchDate = this.detail.searchDate;
    this.weekVal = this.detail.weekVal;
    this.businessType = this.$route.params.businessType || "NURSE";
    this.formSearchData.businessType =
      this.getBusinessType() || this.businessType;
    this.getNurseUser();
    this.getDuty();
    this.getModel();
    // this.onSearchSubmit();
    this.selectShow = true;
    setTimeout(function () {
      this.selectShow = true;
    }, 0);
  },
  mounted() {
    let that = this;
  },
  beforeDestroy() {},
  destroyed() {},
  methods: {
    // add 新增导入排版规则
    exportRule() {
      // this.lastWeekSearchData.type =2
      this.formSearchData.type = 2;
      this.tableData = [];
      this.getData();
    },
    getBusinessType() {
      return this.businessType;
    },
    colorCal(row, scope, _col, _row, _id) {
      let columnIndex = _col;
      if (columnIndex === 0 || columnIndex === 1) {
      }
      let rowIndex = _row; // row.rowIndex
      let date = this.weekData[columnIndex].id;
      let shiftId = _id || this.tableData[rowIndex][`${date}__shiftId`];
      if (shiftId === "" || !this.dutyColor[shiftId]) {
        return {
          background: "",
          color: "",
        };
      } else {
        // return `background: ${this.dutyColor[shiftId].backgroundColor}; color:${this.dutyColor[shiftId].foregroundColor};`
        return {
          background: this.dutyColor[shiftId].backgroundColor,
          color: this.dutyColor[shiftId].foregroundColor,
        };
      }
    },
    cellStyle(row) {
      let columnIndex = row.columnIndex;
      if (columnIndex === 0 || columnIndex === 1) {
        return "";
      }
      let rowIndex = row.rowIndex;
      // let date = this.weekData[columnIndex - 1].id
      let date = this.weekData[columnIndex - 2].id;
      let shiftId = this.tableData[rowIndex][`${date}__shiftId`];
      if (shiftId === "" || !this.dutyColor[shiftId]) {
        return "";
      } else {
        // return `background: ${this.dutyColor[shiftId].backgroundColor}; color:${this.dutyColor[shiftId].foregroundColor};`
        return "";
      }
    },
    // 请求备注信息
    getRemark() {
      let week = "";
      let month = "";
      if (this.searchType === "day") {
        week = "";
        month = parseInt(this.curTime.substr(5, 2));
      } else {
        week = DateFormate.getWeekOfYear(this.curTime);
        month = "";
      }
      let param = {
        businessType: this.formSearchData.businessType,
        year: this.curTime.substr(0, 4),
        month: month,
        week: week,
      };
      GetRemark(param, this.formSearchData.businessType).then((res) => {
        this.remarkData = res;
      });
    },
    // 护士排序
    sortData() {
      this.userVisible = true;
    },
    // 刷新页面
    refresh() {
      // this.tabRefresh('second', this.setParam.setFormData.scheduleMode)
      this.reloadUrl1();
    },
    // 返回
    reloadUrl1() {
      // let businessType = this.businessType || this.formSearchData.businessType
      // this.$emit('option-changed', 'list', { businessType: businessType })
      let detail = {
        activeName: "second",
        formSearchData: this.formSearchData,
      };
      this.$emit("changed", "list", detail);
    },
    // 标题头样式
    renderHeader(h, { column }) {
      let v = column.label;
      let arr = v.split("<br/>");
      return h("div", { style: "line-height:20px;" }, [
        h("span", arr[0]),
        h("br"),
        h("span", arr[1]),
      ]);
    },
    renderHeaderLast(h, { column }) {
      let v = column.label;
      let arr = v.split("<br/>");
      return h("div", { style: "line-height:20px;color: #999" }, [
        h("span", arr[0]),
        h("br"),
        h("span", arr[1]),
      ]);
    },
    // 返回周一到周日
    getCurWeek(time) {
      let d = DateFormate.getMonDate(time);
      let arr = [];
      for (let i = 0; i < 7; i++) {
        let Y = d.getFullYear();
        let M =
          d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
        let D = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();
        arr.push({
          id: Y + "-" + M + "-" + D,
          // name: Y + '年' + M + '月' + D + '日 <br/>（' + DateFormate.getDayName(d.getDay()) + '）',
          name:
            M + "-" + D + " <br/>" + DateFormate.getDayName(d.getDay()) + "",
          date: d.getDate() + "/" + (d.getMonth() + 1),
          week: DateFormate.getDayName(d.getDay()),
        });
        d.setDate(d.getDate() + 1);
      }
      return arr;
    },
    // 形成日期数据
    initWeekData() {
      let curTime = "";
      if (this.searchType === "day") {
        curTime = this.searchDate;
      } else {
        curTime = DateFormate.getNowFormatDate(new Date(this.weekVal));
      }
      this.curTime = curTime;
      let lastWeekTime = moment(curTime)
        .subtract(7, "days")
        .format("YYYY-MM-DD");
      this.formSearchData.beginDate = DateFormate.getSunDay(0, curTime);
      this.formSearchData.endDate = DateFormate.getSunDay(6, curTime);
      this.weekData = this.getCurWeek(curTime);
      this.lastWeekData = this.getCurWeek(lastWeekTime);
      this.lastWeekSearchData.beginDate = DateFormate.getSunDay(
        0,
        lastWeekTime
      );
      this.lastWeekSearchData.endDate = DateFormate.getSunDay(6, lastWeekTime);
    },
    // 取消打印
    cancelPrintAdd() {
      this.exportData.exportFlag = false;
    },
    // 按周查询
    weekSearch(type) {
      switch (type) {
        case "last":
          this.weekVal = this.weekVal - 7 * 24 * 60 * 60 * 1000;
          break;
        case "cur":
          this.weekVal = new Date().getTime();
          break;
        case "next":
          this.weekVal = this.weekVal + 7 * 24 * 60 * 60 * 1000;
          break;
      }
      this.onSearchSubmit();
    },
    // 保存
    saveData() {
      let params = {};
      // 获取开始日期是周几
      const weekOfday = moment(this.formSearchData.beginDate).format("E");
      params = {
        beginDate: this.formSearchData.beginDate, // 开始日期
        // endDate: this.formSearchData.endDate
        endDate: moment(this.formSearchData.beginDate)
          .add(7 - weekOfday, "days")
          .format("YYYY-MM-DD"), // 截止本周周天
      };
      this.saveDataDo1({ data: this.selectedData }, "add", params, false);
    },
    // 保存数据
    saveDataDo1(data, act, params = {}, isOne = true) {
      let methodType = "POST";
      let actMsg = "添加";
      let addData;
      if (!act) {
        act = "add";
      }
      if (act === "add") {
        addData = filterData(data);
      } else if (act === "modify") {
        methodType = "PUT";
        actMsg = "修改";
        addData = data;
      }
      this.addVis = true;
      AxiosJsonApi(
        this.url + "/" + this.formSearchData.businessType,
        addData,
        methodType,
        params
      ).then((res) => {
        if (isOne) {
          ResultMsg(res, actMsg + this.modelName, this.reloadUrl1);
        } else {
          // ResultMsg(res, actMsg + this.modelName, this.refresh)
          ResultMsg(res, actMsg + this.modelName, this.reloadUrl1);
        }
        if (res.status !== 200) {
          this.addVis = false;
        }
      });
    },
    // 获取床位
    getBed() {
      GetBed().then((res) => {
        res.forEach((item, index) => {
          this.bedObj[item.bedId] = item.bedName;
        });
      });
    },
    // 获取房间
    getRoom() {
      GetRoom().then((res) => {
        res.forEach((item, index) => {
          this.roomObj[item.roomId] = item.roomName;
        });
      });
    },
    // 获取模式
    getModel() {
      GetModelType(this.formSearchData.businessType).then((res) => {
        let type = "BED";
        if (res) {
          type = res.nurseMode;
        }
        this.modelType = type;
        if (type === "ROOM") {
          this.exportData.export_tit = "房间号";
          this.getRoom();
        } else {
          this.getBed();
        }
      });
    },
    // 打印
    printData() {
      this.exportData.exportFlag = true;
      this.exportData.exportSelect = "SHIFT_NOTE";
      this.exportData.typeStr = "print";
    },
    // 处理打印数据
    printDo() {
      if (this.exportData.typeStr === "export") {
        this.exportDo();
        return;
      }
      let obj = {};
      let thead = [
        {
          name: "序号",
        },
        {
          name: "姓名",
        },
      ];
      let tbody = [];
      let temp = [];
      let bedList = [];
      let bedStr = "";
      this.weekData.forEach((item, index) => {
        thead.push({
          name: item.date,
          week: item.week.replace("星期", ""),
        });
      });
      this.tableData.forEach((val, key) => {
        temp.push({
          name: key + 1,
        });
        temp.push({
          name: val.accountName,
          remark: "",
          level: "",
        });
        this.weekData.forEach((item, index) => {
          bedList = val[item.id + "__bedList"] || [];
          bedStr = "";
          if (this.modelType === "BED") {
            bedList.forEach((v, i) => {
              if (this.bedObj[v.objId]) {
                bedStr += this.bedObj[v.objId] + ",";
              }
            });
          } else {
            bedList.forEach((v, i) => {
              if (this.roomObj[v.objId]) {
                bedStr += this.roomObj[v.objId] + ",";
              }
            });
          }
          temp.push({
            name: val[item.id],
            bedNoList: bedStr.substr(0, bedStr.length - 1),
          });
        });
        tbody.push(temp);
        temp = [];
      });
      obj["thead"] = thead;
      obj["tbody"] = tbody;
      obj["remarkData"] = this.remarkData;
      localStorage.setItem("printType", this.exportData.exportSelect);
      localStorage.setItem("tableData", JSON.stringify(obj));
      window.open(`${window.location.origin}/#/shiftInformationPrint`);
    },
    // 导出
    exportShow() {
      this.exportData.exportFlag = true;
      this.exportData.exportSelect = "SHIFT_NOTE";
      this.exportData.typeStr = "export";
    },
    // 导出
    exportDo() {
      this.cancelPrintAdd();
      let week = "";
      let month;
      if (this.searchType === "day") {
        week = "";
        month = parseInt(this.curTime.substr(5, 2));
      } else {
        week = DateFormate.getWeekOfYear(this.curTime);
        month = "";
      }
      window.open(
        `http://${window.location.host}/hsms/web-hs/schedule/${
          this.formSearchData.businessType
        }/export?businessType=${this.formSearchData.businessType}&exportKey=${
          this.exportData.exportSelect
        }&year=${this.curTime.substr(0, 4)}&week=${week}&month=${month}`
      );
    },
    // 查询
    async onSearchSubmit() {
      // this.selectShow = false
      this.selectShow = true;
      this.initWeekData();
      this.tableData = [];
      this.selectedData = [];
      await this.getOtherData();
      await this.getLastWeekData();
      this.getData();
      this.getRemark();
    },
    // 获取班次
    async getDuty() {
      try {
        let res1 = await GetDuty(); // 获取普通排班
        let res2 = await GetComposeDuty(); // 获取组合排班
        const resArr = [
          {
            shiftType: "DAY",
            shiftTypeName: "白班:",
            list: [],
            checked: [],
          },
          {
            shiftType: "NIGHT",
            shiftTypeName: "夜班:",
            list: [],
            checked: [],
          },
          {
            shiftType: "REST",
            shiftTypeName: "休息:",
            list: [],
            checked: [],
          },
          {
            shiftType: "LEAVE",
            shiftTypeName: "请假:",
            list: [],
            checked: [],
          },
          {
            shiftType: "compose",
            shiftTypeName: "组合班次:",
            list: [],
            checked: [],
          },
        ];
        res1.map((item) => {
          resArr.map((v) => {
            if (item.shiftType == v.shiftType) {
              v.list.push(item);
            }
          });
        });
        resArr.map((v) => {
          if (v.shiftType == "compose") {
            // 如果是组合班次的话把班次重新排序一下
            v.list = res2.data;
            for (let itemSort of v.list) {
              itemSort.composeInfo.sort(function (x, y) {
                return x["sort"] - y["sort"];
              });
            }
          }
        });
        this.dutyData = resArr;
      } catch (error) {}
    },
    // 获取用户
    getNurseUser() {
      GetNurseUser(this.formSearchData.businessType).then((res) => {
        this.userData = res;
        this.onSearchSubmit();
      });
    },
    // 处理选择数据
    dealSelData(item, index) {
      this.selectedData[index] = item;
    },
    dealSelFocus(id) {
      this.select.id = id;
    },
    /**
     * ------------------------------------------------------------------
     * 打开班次库设置
     * ------------------------------------------------------------------
     */
    /**
     * @description: 点击单元格，打开班次库设置
     * @param {*} shiftDialogItem row,col获取定位
     * @return {*}
     */
    clickShiftItem(shiftDialogItem) {
      this.isShowDialog = false;
      this.shiftDialogItem = shiftDialogItem;
      setTimeout(() => {
        let dialog = $(".duty-dialog");
        let td = dialog.closest("td");
        let table = $(".el-table__body-wrapper");
        let tableBody = $(".el-table__body");
        if (tableBody[0].offsetWidth != table[0].scrollWidth) {
          let left = table[0].scrollWidth - tableBody[0].offsetWidth;
          $(".duty-dialog").css({ left: `-${left}px` });
          $(".duty-dialog .arrow").css({ left: `${20 + left}px` });
        }
        let top = td[0].offsetTop;
        let left = td[0].offsetLeft;
        const tdHeight = td.height(); // 格子本身的高度
        let height = top + dialog.innerHeight() + tdHeight;
        let width = left + dialog.innerWidth();
        if (height > table.innerHeight() && width > table.innerWidth()) {
          table.animate(
            {
              scrollTop: top + "px",
              scrollLeft: left + "px",
            },
            500
          );
          return;
        }
        if (height > table.innerHeight()) {
          table.animate(
            {
              scrollTop: top + "px",
            },
            500
          );
        }
        if (width > table.innerWidth()) {
          table.animate(
            {
              scrollLeft: left + "px",
            },
            500
          );
        }
      });
    },
    /**
     * @description: 点击班次设置的checkbox（普通）
     * @param {*} shiftList 将要保存的数据
     * @param {*} position 定位到当前的位置
     * @return {*}
     */
    dutyDataChange(shiftList, position) {
      let selectedData = this.selectedData.filter((item) => {
        if (
          item.sort == position.sort &&
          item.accountId == position.accountId &&
          item.dutyDate == position.dutyDate
        ) {
          item.shiftId = "";
        }
        return true;
      });
      this.selectedData = selectedData.concat(shiftList);
    },
    changeCompose(composeId, position) {
      debugger;
      let flag = "add";
      if (!composeId) {
        if (!this.composeId) {
          return;
        }
        composeId = this.composeId;
        flag = "del";
      }
      this.composeId = composeId;
      let compose = null;
      this.dutyData.map((item) => {
        if (item.shiftType == "compose") {
          item.list.map((v) => {
            if (v.composeId == composeId) {
              compose = v;
            }
          });
        }
      });
      // 如果点击组合班次并且延续到下一周了,则停止时间要加上天数
      let diffDay = compose.composeInfo.length + position.sort - 1 - 7;
      if (diffDay >= 1) {
        this.formSearchData.endDate = moment(this.formSearchData.endDate)
          .add(diffDay, "days")
          .format("YYYY-MM-DD");
      }
      if (flag == "del") {
        this.formSearchData.endDate = moment(this.formSearchData.beginDate)
          .add(6, "days")
          .format("YYYY-MM-DD");
      }
      // 组合班次每一项匹配
      compose.composeInfo
        .filter((x) => x.status)
        .map((shiftItem, shiftIndex) => {
          let sort =
            (position.sort + shiftIndex) % 7 == 0
              ? 7
              : (position.sort + shiftIndex) % 7;
          let dutyDate = moment(this.formSearchData.beginDate)
            .add(position.sort + shiftIndex - 1, "days")
            .format("YYYY-MM-DD");
          if (position.notAllowEdit.indexOf(dutyDate) >= 0) {
            return;
          }
          // 将所有的表格展示

          // 是否当前项是否在本周内
          let isInThisWeek = false;
          if (position.sort + shiftIndex <= 7) {
            isInThisWeek = true;
          }

          let shiftItemDetail = null;
          this.dutyData.map((item) => {
            if (item.shiftType != "compose") {
              if (flag == "del") {
                if (shiftIndex == 0) {
                  item.checked = item.checked.filter(
                    (v) => v != shiftItem.shiftId
                  );
                }
                return;
              }
              if (shiftIndex == 0) {
                item.checked = [];
              }
              item.list.map((v) => {
                if (v.shiftId == shiftItem.shiftId) {
                  shiftItemDetail = v;
                  if (shiftIndex == 0) {
                    item.checked.push(v.shiftId);
                  }
                }
              });
            }
          });
          let shiftList = [];
          if (flag == "add") {
            shiftList = [{ shiftSort: 1, shiftDetail: shiftItemDetail }];
            if (isInThisWeek) {
              this.$refs[
                `${position.col + shiftIndex}-${position.row}`
              ][0].shiftList = shiftList;
            }
          } else {
            if (isInThisWeek) {
              let shiftList =
                this.$refs[`${position.col + shiftIndex}-${position.row}`][0]
                  .shiftList;
              shiftList = shiftList
                .filter((item, index) => {
                  if (item.shiftDetail.shiftId == shiftItem.shiftId) {
                    return false;
                  } else {
                    return true;
                  }
                })
                .map((item, index) => {
                  item.shiftSort = index + 1;
                  return item;
                });
              this.$refs[
                `${position.col + shiftIndex}-${position.row}`
              ][0].shiftList = shiftList;
            }
          }
          let shiftDataArr = [];
          shiftList.map((item, index) => {
            if (
              item &&
              item.shiftDetail &&
              item.shiftDetail.shiftId &&
              item.shiftDetail.status
            ) {
              shiftDataArr.push({
                accountId: position.accountId,
                accountName: position.accountName,
                shiftId: item.shiftDetail.shiftId,
                shiftName: item.shiftDetail.shiftName,
                sort,
                shiftSort: item.shiftSort || index + 1,
                dutyDate,
              });
            }
          });
          this.dutyDataChange(shiftDataArr, {
            sort,
            accountId: position.accountId,
            dutyDate,
          });
        });
    },
    /**
     * ------------------------------------------------------------------
     * 展示上周数据
     * ------------------------------------------------------------------
     */
    showLastWeekChange() {
      this.tableVis = false;
      this.$nextTick(() => {
        this.tableVis = true;
      });
    },
    // 获取上周数据
    async getLastWeekData() {
      console.log("1111");
      try {
        let res = await AxiosApi(
          this.url + "/" + this.lastWeekSearchData.businessType,
          {},
          "GET",
          this.lastWeekSearchData
        );
        this.lastWeekTableData = res.data.data;
      } catch (error) {}
    },

    /**
     * ------------------------------------------------------------------
     * 是否是上上个月的数据
     * ------------------------------------------------------------------
     */
    // 是否是上上个月的数据
    isLastLastWeek(date) {
      return moment(date).isBefore(
        moment(moment().subtract(1, "months")).startOf("month")
      );
    },

    /**
     * ------------------------------------------------------------------
     * 计算工时
     * ------------------------------------------------------------------
     */
    weekHours(row) {
      let hours = 0;
      this.weekData.map((item) => {
        row[item.id].map((v) => {
          hours += v.shiftDetail.workHours;
        });
      });
      return hours;
    },

    /**
     * ------------------------------------------------------------------
     * 获取存假，年假，以及层级
     * ------------------------------------------------------------------
     */
    async getOtherData() {
      try {
        let res = await GetRelation();
        let res2 = await ApiStorgeHolidays.selectStorageSum({ accountType: 2 });
        let res3 = await ApiAnnualHolidays.selectAnnualSum({ accountType: 2 });
        this.otherColumn = {
          level: res.data,
          holiday: res2.data,
          annual: res3.data,
        };
      } catch (error) {}
    },
  },
};
</script>

<style scoped lang="scss">
.btnDiv {
  text-align: center;
  margin-top: 10px;
}

.action_div {
  text-align: right;
  position: relative;
  padding-right: 20px;

  .model_cls {
    position: absolute;
    right: 610px;
    font-size: 14px;
    top: 5px;
    width: 150px;
  }
}

.shift-search {
  width: 80px;
  height: 28px;
  text-align: center;
  padding: 6px 0 !important;
  border-radius: 2px !important;
}

.shift-button {
  width: 80px;
  height: 28px;
  text-align: center;
  padding: 6px 0 !important;
  margin-left: 20px !important;
  border-radius: 2px !important;
}

/deep/ .el-dialog__wrapper .el-dialog__footer .el-button--default,
.el-dialog__wrapper .el-dialog__footer .el-button--primary {
  border-radius: 0 !important;
}

.dialog-footer .el-button--small {
  padding: 12px 20px !important;
}

/**
  * ------------------------------------------------------------------
  * 表格样式
  * ------------------------------------------------------------------
  */
.editShiftTable {
  // td边框去掉
  /deep/ tr td {
    padding: 0 !important;
    height: auto;
  }
}
.header {
  height: 54px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 18px;
}

/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #fff;
}
/deep/ .el-table--scrollable-y .el-table__body-wrapper {
  overflow: auto;
}
/deep/ .el-table__body-wrapper {
  height: calc(100% - 62px) !important;
}
/**
  * ------------------------------------------------------------------
  * 班次库设置
  * ------------------------------------------------------------------
  */
.duty-dialog {
  position: fixed;
  background: #fff;
}
/deep/ .editShiftTable tr:hover {
  transform: none;
  box-shadow: none;
}
/deep/ .el-table .duty-column .cell {
  overflow: initial;
  padding-left: 5px;
  padding-right: 4px;
}
/**
* ------------------------------------------------------------------
* 显示上周数据样式
* ------------------------------------------------------------------
*/
/deep/ .showLastWeek {
  .shift-item .active li.shift-item-duty {
    width: 100%;
  }
  .shift-item-duty {
    width: 100%;
  }
}
.exprotRule-button {
  margin-right: 2rem;
}
</style>
