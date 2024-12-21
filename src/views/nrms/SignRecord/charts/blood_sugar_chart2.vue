<template>
  <LayoutEdit v-loading="loading">
    <div slot="title">
      血糖单趋势图
    </div>
    <div slot="right_btn" class="tool-bar">
      <el-button type="primary" size="small" @click="$emit('option-changed', 'list')">返回</el-button>
    </div>
    <div slot="main" style="height: 100%;">
      <LayoutList>
        <div slot="main" class="main-list">
          <div class="query">
        <el-date-picker
          v-model="search_form.beginTime"
          :clearable="false"
          value-format="yyyy-MM-dd"
          @change="dateChange"
        ></el-date-picker>
        <span class="split">至</span>
        <el-date-picker
          v-model="search_form.endTime"
          :clearable="false"
          value-format="yyyy-MM-dd"
          @change="dateChange"
        ></el-date-picker>
      </div>
          <div ref="chart_container">
        <div id="blood_sugar_chart_container" style="margin: 48px auto 0;" :style="chartStyle"></div>
      </div>
        </div>
      </LayoutList>
    </div>
  </LayoutEdit>
</template>

<script>
import moment from 'moment'
import echarts from 'echarts'
import LayoutList from '../../../../components/nrms/layout/list'
import LayoutEdit from '../../../../components/nrms/layout/edit'
import { ApiBloodMonitoring } from '../../../../api/nrms/index'
export default {
  name: 'blood_sugar_chart',
  components: { LayoutList, LayoutEdit },
  props: ['patient', 'patientType', 'params'],
  data () {
    return {
      loading: false,
      charts: '',
      chartStyle: {},
      search_form: {
        patientId: '',
        formCode: '',
        beginTime: moment().subtract(6, 'days').format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD')
      },
      xData: [], // x轴数据
      valueData: []
    }
  },
  created () {
    this.search_form.patientId = this.patient.patientId
    this.search_form.formCode = this.params.formObj.formCode
    this.getData()
  },
  methods: {
    getData () {
      this.xData = []
      this.valueData = []
      this.loading = true
      ApiBloodMonitoring.trend(this.search_form)
        .then(res => {
          console.log('res', res)
          let list = res.data || []
          const zeroList = list.yData.map((y, i) => {
            if (y == 0) {
              return i
            }
          }).filter(y => !!y)
          this.xData = list.xData.filter((x, i) => zeroList.indexOf(i) < 0)
          this.valueData = list.yData.filter(y => y != 0)
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
              name: '血糖',
              data: this.valueData
            }]
          })
          this.loading = false
        })
        .catch(res => {
          this.loading = false
          // this.$message.error(res.message)
        })
    },
    dateChange () {
      if (!moment(this.search_form.beginTime).isBefore(moment(this.search_form.endTime).add(1, 'seconds'))) {
        this.$alert('开始时间不能晚于结束时间！')
        return false
      }
      if (moment(this.search_form.endTime).diff(moment(this.search_form.beginTime), 'days') > 90) {
        this.$alert('最多只能查询90天数据！')
        return false
      }
      this.getData()
    },
    drawPie (id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        legend: {
          data: ['血糖'],
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
          formatter: '血糖: {c}mmol/L',
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
          // boundaryGap: false,//x轴是否从头开始
          name: '时刻',
          nameTextStyle: {
            color: '#333',
            fontSize: 14
          },
          data: this.xData,
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgb(215, 215, 218)'
            }
          },
          axisLabel: {
            rotate: 45, // 旋转角度
            color: '#333',
            fontSize: '14',
            padding: [20, 0, 0, 0]
          }
        },
        yAxis: {
          type: 'value',
          name: '血糖(mmol/L)',
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
            name: '血糖',
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
      this.drawPie('blood_sugar_chart_container')
    })
  },
  watch: {
    patient: {
      handler () {
        this.search_form.patientId = this.patient.patientId
        this.getData()
      }
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../../assets/nrms/css/self_common";

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
