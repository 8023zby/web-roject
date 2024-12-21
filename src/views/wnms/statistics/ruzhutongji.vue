<template>
  <div class="typt-list-container statistics-body ">
    <!--查询条件模块 === START-->
    <el-form :rules="rules" ref="search" class="statistics-search" :inline="true" :model="search">
      <el-form-item label="科室:" prop="checkFormKeshi">
        <treeselect class="keshi-treeselect" style="" :flat="true" placeholder="请选择" v-model="search.deptIds" noOptionsText="暂无数据" :multiple="true" noResultsText="无匹配数据" :options="deptData" valueConsistsOf="ALL" noChildrenText="无子节点" />
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
import * as echarts from "echarts";
import { AxiosApi } from "@/api/passport/http";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import * as statisticsApi from "@/api/wnms/statistics";
import mixins from "./mixins";
export default {
  mixins: [mixins],
  components: {
    Treeselect,
  },
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
      if (!this.search.deptIds || this.search.deptIds.length == 0) {
        this.emptyDeptIds = true;
        $(".vue-treeselect__control").css({ border: "1px solid #F56C6C" });
        return callback(new Error("请至少选择一个科室"));
      }
      $(".vue-treeselect__control").css({ border: "1px solid #ddd" });
      this.emptyDeptIds = false;
      callback();
    };
    return {
      search: {
        deptIds: [],
      },
      rules: {
        checkFormKeshi: [
          { validator: checkKeshi, trigger: ["blur", "changed"] },
        ],
      },
      deptData: [],
      allBedSum: [], // 总床位数
      deptNames: [], // 科室
      occRates: [], // 入住率
      notNullBedCounts: [], // 入住床位数
      chartWidth: "", // 存储一开时的div宽度
    };
  },

  async created() {
    await this.getDeptList();
    // this.deptInfo = JSON.parse(localStorage.getItem("deptInfo"));
    // this.search.deptIds = [this.deptInfo.deptId];
    this.queryHandler();
  },
  mounted() {
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
      // 获取最大的床位数
      const maxBedData = Math.max(...this.allBedSum) || 0;
      // 获取最大的入住率
      const maxRuzhuData = Math.max(...this.occRates) || 0;
      // 把maxData除以10然后向上取整
      let chartBedMax = Math.ceil(maxBedData / 10) * 10;
      let chartRuzhuMax = Math.ceil(maxRuzhuData / 10) * 10;
      var option;
      option = {
        color: ["#1E87F0", "#13CE00", "#FF9D00"],
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
          data: ["床位数", "入住数", "入住率"],
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: that.deptNames,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "入住率",
            max: chartRuzhuMax,
            min: 0,
            axisLabel: {
              formatter: "{value} %",
            },
          },
          {
            type: "value",
            name: "床位/入住数",
            max: chartBedMax,
            min: 0,
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        dataZoom: [
          {
            startValue: that.deptNames[0],
            endValue: that.deptNames[14],
          },
          {
            type: "inside",
          },
        ],
        grid: {
          x: 50,
          x2: 50,
        },
        series: [
          {
            name: "床位数",
            type: "bar",
            data: that.allBedSum,
            yAxisIndex: 1,
            barMaxWidth: 20,
          },
          {
            name: "入住数",
            type: "bar",
            data: that.notNullBedCounts,
            yAxisIndex: 1,
            barMaxWidth: 20,
          },
          {
            name: "入住率",
            type: "line",
            data: that.occRates,
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
          this.deptData = JSON.parse(temp);

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
          };
          statisticsApi.getRuzhuData(search).then((res) => {
            that.allBedSum = res.data.allBedSum;
            that.deptNames = res.data.deptNames;
            that.occRates = res.data.occRates;
            that.notNullBedCounts = res.data.notNullBedCounts;
            that.createChart();
          });
        }
      });
    },
    clsHandler(type) {
      this.allBedSum = [];
      this.deptNames = [];
      this.occRates = [];
      this.notNullBedCounts = [];
      if (type === "cls") {
        this.createChart();
      } else {
        this.search = {
          deptIds: [],
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
/deep/ .vue-treeselect__input-container {
  display: none;
}
</style>
