<template>
  <LayoutEdit v-loading="loading">
    <div slot="title">
      心率趋势图
    </div>
    <div slot="right_btn" class="tool-bar">
      <el-button type="primary" size="small" @click="$emit('changed', 'List')">返回</el-button>
    </div>
    <div slot="main" style="height: 100%;">
      <LayoutList>
        <div slot="main" class="main-list">
          <div ref="chart_container">
            <div id="heart_rate_monitoring_chart_container" style="margin: 48px auto 0;" :style="chartStyle"></div>
          </div>
        </div>
      </LayoutList>
    </div>
  </LayoutEdit>
</template>

<script>
import echarts from 'echarts'
import LayoutList from '../../../components/nrms/layout/list'
import LayoutEdit from '../../../components/nrms/layout/edit'

export default {
  name: 'heart_rate_monitoring_chart',
  components: { LayoutList, LayoutEdit },
  props: ['patient', 'patientType', 'detail'],
  data () {
    return {
      loading: false,
      charts: '',
      chartStyle: {},
      xData: [],
      valueData: []
    }
  },
  created () {
  },
  methods: {
    getData () {
      this.valueData = this.detail.signList
      this.xData = new Array(this.valueData.length).fill('')
      let minData = ''
      let maxData = ''
      maxData = Math.max(...this.valueData)
      minData = Math.min(...this.valueData)
      this.charts.setOption({
        xAxis: {
          data: this.xData
        },
        yAxis: {
          min: minData,
          max: maxData
        },
        series: [{
          // 根据名字对应到相应的系列
          name: '心率',
          data: this.valueData
        }]
      })
    },
    drawPie (id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        legend: {
          data: ['心率'],
          x: 'right',
          top: 0,
          textStyle: {
            color: '#333',
            fontSize: 14
          },
          icon: 'rect',
          itemWidth: 50,
          itemHeight: 4,
          itemGap: 40
        },
        tooltip: {
          trigger: 'axis',
          formatter: '心率: {c}',
          textStyle: {
            fontSize: 14
          }
        },
        grid: {
          left: '7%',
          right: '80',
          bottom: '100',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          name: '心率',
          nameGap: 30,
          nameTextStyle: {
            align: 'right',
            fontSize: 14
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#333',
              fontSize: '14'
            },
            formatter: function (value) {
              return value.toFixed(2)
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
          // min: 0,
          // max: 20,
          // splitNumber: 10
        },
        series: [
          {
            name: '心率',
            type: 'line',
            showAllSymbol: true,
            itemStyle: {
              color: '#1e87f0'
            },
            data: [],
            areaStyle: {
              type: 'default',
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(30,135,240,1)'
              },
              {
                offset: 1,
                color: 'rgba(30,135,240,0)'
              }])
            }
          }
        ],
        dataZoom: [{ // 添加X轴滚动条
          type: 'inside',
          show: true,
          start: 0,
          end: 100,
          handleSize: 5
        }]
      })
    }
  },
  // 调用
  mounted () {
    let w = this.$refs.chart_container.getBoundingClientRect().width
    let h = this.$refs.chart_container.getBoundingClientRect().height
    this.chartStyle = {
      width: (w - 110) + 'px',
      height: '700px'
    }
    this.$nextTick(function () {
      this.drawPie('heart_rate_monitoring_chart_container')
      this.getData()
    })
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";

  .nrms-blood-list {
    border-right: 1px solid #e6e6e6;
    height: 100%;
    width: 0;
    flex: 1;
  }

  /deep/ .main-list {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    margin-top: 30px;
    .query {
      width: auto;
      margin: 0 auto;
      /deep/.el-date-editor.el-input, .el-date-editor.el-input__inner{
        width: 182px;
      }
      .split {
        padding: 0 10px;
      }
    }
  }

</style>
