<template>
  <div class="typt-list-container statistics-body ">
    <!--查询条件模块 === START-->
    <el-form :rules="rules" ref="search" class="statistics-search" :inline="true" :model="search">
      <el-form-item label="科室:" prop="checkFormKeshi">
        <Treeselect placeholder="请选择" v-model="search.deptId" :multiple="false" :options="deptData" noChildrenText="无子节点" appendToBody :defaultExpandLevel="9" />
      </el-form-item>

      <el-form-item label="日期:" prop="checkFormDate">
        <el-date-picker v-model="search.startTimeDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请选择" :picker-options="pickerOptions" />
      </el-form-item>
      <el-form-item label="呼叫类型:">
        <el-select v-model="search.deviceCallType" placeholder="全部" clearable>
          <el-option v-for="item in callTypeList" :key="item.id" :label="item.label" :value="item.id"></el-option>
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
    // "search.deptId": {
    //   handler (newVal, oldVal) {
    //     this.$refs.search.validate((valid) => { });
    //   },
    //   deep: true,
    // },
  },
  data() {
    var checkKeshi = (rule, value, callback) => {
      if (!this.search.deptId) {
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
        if (!this.search.startTimeDate) {
          return callback(new Error("请选择开始和结束日期"));
        }
      }
      callback();
    };
    return {
      search: {
        startTimeDate: "",
        deviceCallType: "",
        deptId: null,
      },
      rules: {
        checkFormKeshi: [
          { validator: checkKeshi, trigger: ["blur", "changed"] },
        ],
        checkFormDate: [{ validator: checkTime, trigger: "blur" }],
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
      deptData: [],
      x: [],
      today: [],
      deptInfo: "",
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
    this.search.startTimeDate = moment().format("YYYY-MM-DD");
    await this.getDeptList();
    // this.deptInfo = JSON.parse(localStorage.getItem("deptInfo"));
    // this.search.deptId = this.deptInfo.deptId;
    this.queryHandler();
  },
  mounted() {
    const that = this;
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
      var option;
      option = {
        color: ["#1E87F0"],
        title: {
          text: "",
          subtext: "",
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params, ticket, callback) {
            var res = params[0].name;
            for (var i = 0, l = params.length - 1; i < l; i++) {
              res += "<br/>" + params[i].seriesName + " : " + params[i].value;
            }
            return res;
          },
        },
        legend: {
          data: ["呼叫次数"],
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: that.x,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "呼叫次数(次)",
          },
        ],
        grid: {
          x: 50,
          x2: 50,
        },
        series: [
          {
            name: "呼叫次数",
            type: "bar",
            data: that.today,
            barMaxWidth: 20,
          },
          {
            data: that.today,
            name: "呼叫次数",
            type: "line",
            smooth: true,
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
          this.deptData = JSON.parse(temp);
          this.search.deptId = this.getDefaultDeptInfo() || this.deptData[0].id;
        }
      });
    },
    queryHandler() {
      const that = this;
      this.$refs.search.validate((valid) => {
        if (!valid) {
          that.clsHandler("cls");
        } else {
          const search = {
            startTimeDate: this.search.startTimeDate,
            deviceCallType: this.search.deviceCallType,
            deptId: this.search.deptId,
          };

          statisticsApi.getShiQuShiData(search).then((res) => {
            that.x = res.data.x;
            that.today = res.data.today;
            that.createChart();
          });
        }
      });
    },
    clsHandler(type) {
      this.x = [];
      this.today = [];
      // 搜索条件不满足的时候
      if (type === "cls") {
        this.createChart();
      } else {
        this.search = {
          startTimeDate: moment().format("YYYY-MM-DD"),
          deviceCallType: "",
          deptId: this.deptInfo.deptId,
        };
        this.queryHandler();
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
  width: 182px !important;
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
  max-width: 152px;
  min-width: 80px;
  padding-top: 2px;
}
/deep/.vue-treeselect__value-container {
  max-width: 152px;
  min-width: 80px;
}
/deep/.vue-treeselect__multi-value-item {
  padding: unset;
}
/deep/.vue-treeselect__multi-value-label {
  max-width: 120px;
  min-width: 80px;
  display: block;
  word-wrap: break-word;
  min-height: 26px;
}
</style>
