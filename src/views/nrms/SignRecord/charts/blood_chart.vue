<template>
  <LayoutList>
    <div slot="main" class="main-list">
      <div class="query">
        <el-date-picker
          v-model="search_form.begin_date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          @change="dateChange"
        ></el-date-picker>
        <span class="split">至</span>
        <el-date-picker
          v-model="search_form.end_date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          @change="dateChange"
        ></el-date-picker>
      </div>
      <div ref="chart_container">
        <div id="blood_chart_container" style="margin: 38px auto 0;" :style="chartStyle"></div>
      </div>
    </div>
  </LayoutList>
</template>

<script>
  import moment from 'moment'
  import echarts from 'echarts'
  import LayoutList from '../../../../components/nrms/layout/list'
  import {ApiTemperatureChartData} from "../../../../api/nrms/index"
  export default {
    name: 'blood_chart',
    components: { LayoutList },
    props:['patient', 'patientType'],
    data () {
      return {
        loading:false,
        charts: '',
        chartStyle: {},
        search_form: {
          patientId:'',
          signCode:'xueya',
          begin_date: moment().subtract(6, 'days').format('YYYY-MM-DD'),
          end_date: moment().subtract(0, 'days').format('YYYY-MM-DD')
        },
        xData: [],//x轴数据
        valueData1:[],//收缩压
        valueData2:[],//舒张压
      }
    },
    created () {
      this.search_form.patientId = this.patient.patientId
      this.getData()
    },
    methods: {
      getData () {
        this.xData = []
        this.valueData1 = []
        this.valueData2 = []
        this.loading = true
        ApiTemperatureChartData.select(this.search_form)
          .then(res => {
            let desc= res.data.desc || ''
            let list = res.data.data||{xData:[],yData:[[]]}
            this.xData = list.xData
            //获取数组中的最大最小值
            const yData = res.data.data.yData;
            let yArr = []
            for(let i=0;i<yData.length;i++){
              for(let j=0;j<yData[i].length;j++){
                yArr.push(yData[i][j])
              }
            }
            console.log('yArr',yArr)
            let minData = ''
            let maxData = ''
            maxData = Math.max(...yArr)
            minData = Math.min(...yArr)

            let str = desc.split(',')[0]
            let label = str.split('-')[1]
            console.log(label)
            if(label === 'shousuoya'){
              this.valueData1 = list.yData[0]
              this.valueData2 = list.yData[1]
            }else{
              this.valueData1 = list.yData[1]
              this.valueData2 = list.yData[0]
            }

            this.charts.setOption({
              xAxis: {
                data: this.xData
              },
              yAxis:{
                min: minData,
                max: maxData,
              },
              series: [
                // 根据名字对应到相应的系列
                {
                  name: '舒张压',
                  data: this.valueData2,
              },
                {
                  name: '收缩压',
                  data: this.valueData1,
                }
              ]
            })
            this.loading = false;
          })
          .catch(res => {
            this.loading = false;
            this.$message.error(res.message);
          });
      },
      dateChange() {
        if (!moment(this.search_form.begin_date).isBefore(this.search_form.end_date)) {
          this.$alert('开始时间不能晚于结束时间！');
          return false;
        }
        if (moment(this.search_form.end_date).diff(moment(this.search_form.begin_date), 'days') > 90) {
          this.$alert('最多只能查询90天数据！');
          return false;
        }
        this.getData();
      },
      drawPie(id) {
        this.charts = echarts.init(document.getElementById(id));
        this.charts.setOption({
          legend: {
            data: ['舒张压', '收缩压'],
            x: 'right',
            top: 0,
            bottom: 0,
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
            formatter: '日期: {b}<br />血压: {c}/{c1}mmHg',
            textStyle: {
              fontSize: 14,
            }
          },
          grid: {
            left: '6%',
            right: '80',
            bottom: '100',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            name: '日期',
            nameTextStyle: {
              color: '#333',
              fontSize: 14
            },
            data: [],
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
            name: '血压(mmHg)',
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
                color: '#333333',
                fontSize: '14'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            // min: 35,
            // max: 40,
            // splitNumber: 10
          },
          series: [
            {
              name: '舒张压',
              type: 'line',
              itemStyle: {
                color: 'rgb(255,127,0)'
              },
              data: [],
              areaStyle: {
                normal:{
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(255,127,0,0.6)'
                  },
                    {
                      offset: 1,
                      color: 'rgba(255,127,0,0.1)'
                    }])
                },
                type: 'default',

              },
            },
            {
              name: '收缩压',
              type: 'line',
              itemStyle: {
                color: 'rgb(30,135,240)'
              },
              data: [],
              areaStyle: {
                type: 'default',
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(30,135,240,0.6)'
                },
                  {
                    offset: 1,
                    color: 'rgba(30,135,240,0)'
                  }])
              },
            }
          ],
          dataZoom: [{ //添加X轴滚动条
            type: 'inside',
            show: true,
            start: 0,
            end: 100,
            handleSize: 5
          }]
        });
      }
    },
    //调用
    mounted () {
      let w = this.$refs.chart_container.getBoundingClientRect().width
      let h = this.$refs.chart_container.getBoundingClientRect().height
      this.chartStyle = {
        width: (w - 110) + 'px',
        height: '700px',
      }
      this.$nextTick(function () {
        this.drawPie('blood_chart_container')
      })
    },
    watch: {
      patient: {
        handler() {
          this.search_form.patientId = this.patient.patientId;
          this.getData()
        }
      }
    },
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
