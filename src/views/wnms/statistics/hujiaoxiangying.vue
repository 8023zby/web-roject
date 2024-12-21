<template>
  <div class="typt-list-container statistics-body ">
    <!--查询条件模块 === START-->
    <el-form :rules="rules" ref="search" class="statistics-search" :inline="true" :model="search">
      <el-form-item label="科室:" prop="checkFormKeshi">
        <treeselect class="keshi-treeselect" style="" :flat="true" placeholder="请选择" v-model="search.deptIds" noOptionsText="暂无数据" :multiple="true" noResultsText="无匹配数据" :options="deptData" valueConsistsOf="ALL" noChildrenText="无子节点" />
      </el-form-item>
      <el-form-item label="日期:" prop="checkFormDate">
        <el-date-picker v-model="search.startTimeDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请选择" :picker-options="pickerOptions" />
        <span class="time-to">至</span>
        <el-date-picker v-model="search.endTimeDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请选择" :picker-options="pickerOptions" />
      </el-form-item>
      <el-form-item label="时间段:" prop="checkFormTime">
        <el-time-picker v-model="search.startTimePoint" value-format="HH:mm:ss" format="HH:mm:ss" placeholder="请选择" />
        <span class="time-to">至</span>
        <el-time-picker value-format="HH:mm:ss" format="HH:mm:ss" v-model="search.endTimePoint" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="呼叫类型:">
        <el-select v-model="search.deviceCallType" placeholder="全部" clearable>
          <el-option v-for="item in callTypeList" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="超时时间(分钟):">
        <el-select class="chaoshi-select" v-model="search.responseTime" placeholder="请选择" clearable>
          <el-option v-for="(item, key) in responseTimes" :key="key" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <!-- 查询按钮 -->
        <div class="typt-search-btn">
          <el-button @click="queryHandler" class="s-serach" type="primary" icon="el-icon-search" size="small">搜索</el-button>
          <el-button type="text" @click="clsHandler">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="statistics-main">
      <div id="main">
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import * as echarts from "echarts";
import { AxiosApi } from "@/api/passport/http";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import * as statisticsApi from "@/api/wnms/statistics";
import mixins from "./mixins";
export default {
  components: {
    Treeselect,
  },
  mixins: [mixins],
  watch: {
    // 监听deptId
    // 'search.deptIds': {
    //   handler (newVal, oldVal) {
    //     this.$refs.search.validate((valid) => {
    //     })
    //   },
    //   deep: true
    // }
  },
  data() {
    var checkKeshi = (rule, value, callback) => {
      if (!this.search.deptIds || this.search.deptIds.length === 0) {
        this.emptyDeptIds = true;
        $(".vue-treeselect__control").css({ border: "1px solid #F56C6C" });
        return callback(new Error("请至少选择一个科室"));
      }
      $(".vue-treeselect__control").css({ border: "1px solid #ddd" });
      this.emptyDeptIds = false;
      callback();
    };
    var checkTime = (rule, value, callback) => {
      if (rule.field === "checkFormDate") {
        if (!this.search.startTimeDate || !this.search.endTimeDate) {
          return callback(new Error("请选择开始和结束日期"));
        }
        if (this.search.startTimeDate > this.search.endTimeDate) {
          return callback(new Error("开始日期不能大于结束日期"));
        }
      }
      if (rule.field === "checkFormTime") {
        if (!this.search.startTimePoint || !this.search.endTimePoint) {
          return callback(new Error("请选择开始和结束时间段"));
        }
      }
      callback();
    };
    return {
      search: {
        startTimeDate: "",
        endTimeDate: "",
        startTimePoint: "",
        endTimePoint: "",
        deviceCallType: "",
        deptIds: [],
        responseTime: 1,
      },
      rules: {
        checkFormKeshi: [
          { validator: checkKeshi, trigger: ["blur", "changed"] },
        ],
        checkFormDate: [{ validator: checkTime, trigger: "blur" }],
        checkFormTime: [{ validator: checkTime, trigger: "blur" }],
      },
      hujiaoType: [
        {
          id: "",
          label: "全部",
        },
        {
          id: "TYPE_BEDHEAD_CHANGE_MEDICAL",
          label: "床头换药",
        },
        {
          id: "TYPE_BEDSIDE_CHANGE_MEDICAL",
          label: "床旁换药",
        },
        {
          id: "TYPE_SOS",
          label: "卫生间分机呼叫",
        },
        {
          id: "TYPE_BEDHEAD_REINFORCE",
          label: "床头增援",
        },
        {
          id: "TYPE_BEDSIDE_REINFORCE",
          label: "床旁增援",
        },
        {
          id: "TYPE_INFUSION",
          label: "输液报警器",
        },
        {
          id: "TYPE_BEDHEAD_CALL",
          label: "床头分机呼叫",
        },
        {
          id: "TYPE_BEDSIDE_CALL",
          label: "床旁分机呼叫",
        },
        {
          id: "TYPE_DOORWAY_CALL",
          label: "门口机分机呼叫",
        },
        {
          id: "TYPE_DUTY_CALL",
          label: "值班室分机",
        },
        {
          id: "TYPE_MEDICAL_MAINFRAME_CALL",
          label: "医护主机",
        },
        {
          id: "TYPE_MEDICAL_AUDIO_ASSISTANT",
          label: "医生助手",
        },
        {
          id: "TYPE_OTHERS",
          label: "未知",
        },
      ],
      responseTimes: [], // 超时时间
      deptData: [],
      yAxis1: [], // 呼叫响应次数
      yAxis: [], // 平均响应时长
      xAxis: [], // 科室名称
      timelinessSum: [], // 及时量
      timelinessRatios: [], // 及时率
      callCounts: [], // 呼叫量
      pickerOptions: {
        disabledDate(time) {
          let _now = Date.now();
          return time.getTime() > _now;
          // 大于当前的禁止
        },
      },
    };
  },
  async created() {
    // 设置超时时间1-15分钟
    for (let i = 1; i <= 15; i++) {
      this.responseTimes.push(i);
    }
    // 把默认时间修改为当天
    this.search.startTimeDate = moment().format("YYYY-MM-DD");
    this.search.endTimeDate = moment().format("YYYY-MM-DD");
    this.search.startTimePoint = "00:00:00";
    this.search.endTimePoint = "23:59:59";
    await this.getDeptList();
    // this.deptInfo = JSON.parse(localStorage.getItem("deptInfo"));
    // this.search.deptIds = [this.deptInfo.deptId];
    this.queryHandler();
  },
  mounted() {
    // this.queryHandler()
    const that = this;
    this.createChart();
    window.onresize = function () {
      that.createChart();
    };
  },
  methods: {
    createChart() {
      const that = this;
      var chartDom = document.getElementById("main");
      var myChart = echarts.init(chartDom);
      myChart.resize();
      // 获取最大的响应次数
      const maxXiangYing = Math.max(...this.callCounts);
      // 获取最长的平均响应时长
      const maxXiangYingTime = Math.max(...this.yAxis);
      // 把maxData除以10然后向上取整
      let chartXiangYing = Math.ceil(maxXiangYing / 10) * 10;
      let chartXiangYingTime = Math.ceil(maxXiangYingTime / 10) * 10;
      var option;
      option = {
        color: ["#1E87F0", "#13CE00", "#FF9D00", "#A236FF"],
        title: {
          text: "",
          subtext: "",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          data: ["呼叫量", "及时量", "及时率", "平均响应时长"],
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: that.xAxis,
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              // 重点在这一块，其余可以忽略
              interval: 0, // 这个一定要有，别忘记了
              rotate: 0,
              textStyle: {
                fontSize: 12,
              },
              formatter: function (params) {
                var newParamsName = ""; // 最终拼接成的字符串
                var paramsNameNumber = params.length; // 实际标签的个数
                var provideNumber = 6; // 每行能显示的字的个数
                var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
                /**
                 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                 */
                // 条件等同于rowNumber>1
                if (paramsNameNumber > provideNumber) {
                  /** 循环每一行,p表示行 */
                  for (var p = 0; p < rowNumber; p++) {
                    var tempStr = ""; // 表示每一次截取的字符串
                    var start = p * provideNumber; // 开始截取的位置
                    var end = start + provideNumber; // 结束截取的位置
                    // 此处特殊处理最后一行的索引值
                    if (p == rowNumber - 1) {
                      // 最后一次不换行
                      tempStr = params.substring(start, paramsNameNumber);
                    } else {
                      // 每一次拼接字符串并换行
                      tempStr = params.substring(start, end) + "\n";
                    }
                    newParamsName += tempStr; // 最终拼成的字符串
                  }
                } else {
                  // 将旧标签的值赋给新标签
                  newParamsName = params;
                }
                // 将最终的字符串返回
                return newParamsName;
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "及时率",
            max: 100,
            min: 0,
            position: "left",
            axisLine: {
              show: true,
              lineStyle: {
                // color: colors[2]
              },
            },
            axisLabel: {
              formatter: "{value} %",
            },
          },
          {
            type: "value",
            name: "呼叫响应次数",
            max: chartXiangYing,
            min: 0,
            position: "right",
            axisLine: {
              show: true,
              lineStyle: {
                // color: colors[0]
              },
            },
            axisLabel: {
              formatter: "{value}",
            },
          },
          {
            type: "value",
            name: "平均响应时长(秒)",
            max: chartXiangYingTime,
            min: 0,
            position: "right",
            offset: 90,
            axisLine: {
              show: true,
              lineStyle: {
                // color: colors[1]
              },
            },
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        dataZoom: [
          {
            startValue: that.xAxis[0],
            endValue: that.xAxis[14],
          },
          {
            type: "inside",
          },
        ],
        grid: {
          x: 50,
          x2: 200,
          bottom: 70,
        },
        series: [
          {
            name: "呼叫量",
            type: "bar",
            data: that.callCounts,
            yAxisIndex: 1,
            barMaxWidth: 20,
          },
          {
            name: "及时量",
            type: "bar",
            data: that.timelinessSum,
            yAxisIndex: 1,
            barMaxWidth: 20,
          },
          {
            name: "及时率",
            type: "line",
            data: that.timelinessRatios,
            smooth: true,
            // barMaxWidth: 30
          },
          {
            name: "平均响应时长",
            type: "line",
            data: that.yAxis,
            yAxisIndex: 2,
            smooth: true,
            // barMaxWidth: 30
          },
        ],
      };
      option && myChart.setOption(option);
    },
    // 查询部门
    async getDeptList() {
      await AxiosApi("/ifms/web-org/depts", {}, "GET").then((res) => {
        if (res.status === 200) {
          let temp = JSON.stringify(res.data.list);
          temp = temp
            .replace(/deptId/g, "id")
            .replace(/deptName/g, "label")
            .replace(/,"children":null/g, "");
          this.deptData = JSON.parse(temp) || [];

          if (this.deptData.length > 0) {
            let deptid = this.getDefaultDeptInfo() || this.deptData[0].id;
            this.search.deptIds = [deptid];
          }
        }
      });
    },
    queryHandler(type) {
      const that = this;
      if (type === "reset") {
        this.createChart();
        return;
      }
      this.$refs.search.validate((valid) => {
        if (!valid) {
          that.clsHandler("cls");
        } else {
          const search = {
            deptIds: that.search.deptIds,
            startTimeDate: that.search.startTimeDate,
            endTimeDate: that.search.endTimeDate,
            startTimePoint: that.search.startTimePoint,
            endTimePoint: that.search.endTimePoint,
            deviceCallType: that.search.deviceCallType,
            responseTime: that.search.responseTime,
          };
          if (search.startTimePoint) {
            search.startTimePoint = moment(
              search.startTimeDate + " " + search.startTimePoint
            ).format("HH:mm:ss");
          }
          if (search.endTimePoint) {
            search.endTimePoint = moment(
              search.endTimeDate + " " + search.endTimePoint
            ).format("HH:mm:ss");
          }
          statisticsApi.getHuJiaoXiangYingData(search).then((res) => {
            that.yAxis1 = res.data.yAxis1;
            that.yAxis = res.data.yAxis;
            that.xAxis = res.data.xAxis;
            that.timelinessSum = res.data.timelinessSum;
            that.timelinessRatios = res.data.timelinessRatios;
            that.callCounts = res.data.callCounts;
            that.createChart();
          });
        }
      });
    },
    clsHandler(type) {
      this.yAxis1 = [];
      this.yAxis = [];
      this.xAxis = [];
      this.timelinessSum = [];
      this.timelinessRatios = [];
      this.callCounts = [];
      if (type === "cls") {
        this.createChart();
      } else {
        this.search = {
          startTimeDate: moment().format("YYYY-MM-DD"),
          endTimeDate: moment().format("YYYY-MM-DD"),
          startTimePoint: "",
          endTimePoint: "",
          deviceCallType: "",
          deptIds: [],
          responseTime: 1,
        };
        this.queryHandler("reset");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.statistics-body {
  display: flex;
  flex-direction: column;
  overflow: auto;
  .statistics-search {
    .treeselect-keshi {
      height: auto;
    }
  }

  .statistics-main {
    flex: 1;
    margin: 10px;
    overflow: hidden;
  }
  #main {
    height: 100%;
  }
}
.typt-list-container .el-form {
  margin-left: 12px;
}
.time-to {
  margin: 0 6px;
}
.typt-list-container .typt-search-btn {
  margin-left: 0px;
}
.typt-list-container .typt-search-btn button:nth-child(2) {
  margin-left: 26px;
}
.s-serach {
  width: 80px;
  height: 28px;
  border-radius: 2px;
  margin-left: 14px;
}

/deep/.typt-list-container .el-button--small,
.typt-list-container .el-button--small.is-round {
  width: 80px;
  height: 28px;
  line-height: 28px;
  border-radius: 2px;
}
/deep/.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 182px;
  height: 34px;
}
/deep/.el-input--small .el-input__inner {
  height: 34px;
  width: 182px;
}
/deep/.el-select .el-input.is-focus .el-input__inner {
  width: 182px;
}
/deep/.vue-treeselect__control {
  width: 182px;
  height: 34px;
  overflow: auto;
  display: block;
  padding-right: 0px;
}
/deep/.vue-treeselect__control-arrow-container {
  position: absolute;
  right: 5px;
  top: 13px;
}
/deep/.vue-treeselect__x-container {
  position: absolute;
  right: 20px;
  top: 13px;
}
/deep/.vue-treeselect__multi-value-item-container {
  width: 152px;
  padding-top: 2px;
}
/deep/.vue-treeselect__value-container {
  width: 152px;
}
/deep/.vue-treeselect__multi-value-item {
  padding: unset;
}
/deep/.vue-treeselect__multi-value-label {
  max-width: 120px;
  min-width: 100px;
  display: block;
  word-wrap: break-word;
  min-height: 26px;
}
.chaoshi-select {
  /deep/.el-input__inner {
    width: 100px !important;
  }
}
/deep/ .vue-treeselect__input-container {
  display: none;
}
</style>
