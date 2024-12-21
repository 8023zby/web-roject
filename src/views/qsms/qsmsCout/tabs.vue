<!--问卷统计tab页面-->
<template>
  <el-container class="list-page-new">
    <el-header height="auto" class="header-hastitle">
      <!--有标题的话，header的class = header-hastitle-->
      <div class="title">
        <slot name="title">
          答卷统计
        </slot>
      </div>
      <!--查询条件模块 === START-->
      <div class="">
        <div class="query-items-container" ref="query_form">
          <slot name="query">

          </slot>
        </div>
      </div>
      <!--查询条件模块 === END-->

      <div class="tool-container">
        <div class="left">
          <!--左边按钮-->
          <slot name="left_btn">

          </slot>
        </div>
        <div class="right">
          <!--右边按钮-->
          <slot name="right_btn">
            <el-button type="primary"  @click="$emit('option-changed', 'backQsmsList')" size="mini">返回</el-button>
          </slot>
        </div>
      </div>
    </el-header>
    <el-main class="cout-main">
      <!--主体列表-->
      <slot name="main">
        <el-tabs v-model="activeName" @tab-click="handleClickTab" type="card">
          <el-tab-pane :key="'first'" label="选项统计" name="first">
            <v-list v-if="'first'===activeName" :detail="detail" :shownurseUnitId="pageFrom==='WH'" :pageFrom="detail.pageFrom"/>
          </el-tab-pane>

          <el-tab-pane :key="'second'" label="每月对比" name="second">
            <!-- 查询条件 -->
            <search-list
              :multiple="false"
              :showQuanBu="false"
              tabtype="每月对比"
              @unitSearch="queryHandler"
              :shownurseUnitId="pageFrom==='WH'"
            />
            <div id="ECHART_monthly" class="echarts-line" v-loading="loading"></div>
          </el-tab-pane>

          <el-tab-pane :key="'third'" label="全院对比" name="third" v-if="pageFrom === 'WH'">
            <search-list
              :multiple="true"
              :showQuanBu="false"
              v-if="'third'===activeName"
              @unitSearch="thirdSearch"
              :shownurseUnitId="pageFrom==='WH'"
              tabtype="全院对比"
            />
            <div id="ECHART_wholeHospital" class="echarts-line"></div>
          </el-tab-pane>
        </el-tabs>
      </slot>
    </el-main>

  </el-container>
</template>

<script>
import { getLineChar, getBarChar } from '@/api/qsms/qsmsManage/qsmsCount'
import list from './list.vue'
import SearchList from '../common/components/searchList.vue'
import { selectDeptInfo } from '@/assets/qsms/utils/common'
import { deepMerge } from '@/assets/qsms/utils'
import { doHandleDate } from '@/assets/qsms/utils/dateFormat'
import 'v-charts/lib/style.css'
import eCharts from 'echarts'
import getStorageUser from '@/assets/qsms/utils/storageUser'

export default {
  components: {
    SearchList,
    'v-list': list
  },
  inject: ['routerTo'],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data () {
    let searchs = this.initQueryCriteria()

    return {
      loading: true,
      selectDeptInfo: {},
      dataDeptInfoList: [],
      pageFrom: '',
      nurseUnitData: [],
      activeName: 'first',
      search: {},
      searchs: searchs
    }
  },
  mounted () {
    if (this.detail.pageFrom) this.pageFrom = this.detail.pageFrom
    let h = document.getElementsByClassName('list-page-new')[0].offsetHeight
    document.getElementsByClassName('el-tab-pane')[0].style.height = h * 0.78 + 'px'

    this.selectDeptInfo = getStorageUser('selectDeptInfo')
    this.dataDeptInfoList = getStorageUser('dataDeptInfoList')
  },
  methods: {
    /* 查询 */
    queryHandler (s) {
      this.loading = true
      this.searchs = s
      this.searchs.beginTime = s.beginTime.substr(0, 7)
      this.searchs.endTime = s.endTime.substr(0, 7)
      this.searchs.paperId = this.detail.paperId
      this.lineChartsData()
    },

    /* 组装数据 */
    chartsData (res, demoID) {
      this.creatEcharts_Line(res, demoID)
    },
    // 创建echarts图表
    creatEcharts_Line (res, demoID = 'ECHART_monthly') {
      let type = 'line'
      if (demoID === 'ECHART_wholeHospital')type = 'bar'
      let demo = document.getElementsByClassName('list-page-new')[0]
      let w = demo.offsetWidth
      let h = demo.offsetHeight

      let d2 = document.getElementById(demoID)
      d2.style.width = w * 0.9 + 'px'
      d2.style.height = h * 0.66 + 'px'

      let xdata = []
      let ydata = []
      for (let v of res.series.values()) {
        xdata.push(v.key)
        ydata.push(v.value)
      }
      let etitle = '月平均分对比'
      if (this.pageFrom === 'WH') {
        if (demoID === 'ECHART_monthly') {
          let dI = this.dataDeptInfoList.findIndex((dval, dindex) => {
            return dval.deptId === this.searchs.nurseUnitId
          })
          if (dI && this.dataDeptInfoList[dI])etitle = this.dataDeptInfoList[dI]['deptName'] + '-月平均分对比'
        } else {
          etitle = '护理单元平均分对比'
        }
      } else {
        etitle = this.selectDeptInfo.deptName + '-月平均分对比'
      }
      let ekey = '时间'
      // if (res.xaxis !== null && res.xaxis.value)etitle = res.xaxis.value
      // if (res.xaxis !== null && res.xaxis.key)ekey = res.xaxis.key
      if (demoID === 'ECHART_wholeHospital')ekey = '科室'
      let opChart = eCharts.init(document.getElementById(demoID))

      let dStart = 0
      if (xdata.length > 8) {
        dStart = parseInt(100 - 400 / xdata.length)
      }
      let chartOption = {
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: dStart,
            end: 100
          },
          {
            type: 'inside',
            realtime: true,
            start: dStart,
            end: 100
          }
        ],
        title: {
          text: etitle,
          textStyle: {
            color: '#3d3d3d',
            fontStyle: 'normal',
            fontSize: 15
          },
          textAlign: 'center',
          left: '50%'
        },
        legend: {
          data: [etitle],
          textStyle: {
            color: '#242424'
          },
          top: '30px',
          right: '2vh',
          borderRadius: '15px'
        },
        grid: {
          top: 80,
          right: 50,
          bottom: 20,
          left: 20,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        xAxis: {
          type: 'category',
          name: ekey,
          nameTextStyle: {
            color: '#383838'
          },
          boundaryGap: ['2%', '2%'], // 画图不要从y轴开始
          data: xdata,
          axisLine: {
            lineStyle: {
              color: '#d5d5d5'
            }
          },
          axisLabel: {
            interval: 0,
            margin: 12,
            color: '#1d1d1d',
            fontSize: '1.1rem'
          },
          axisTick: {
            alignWithLabel: false,
            show: false,
            inside: true
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: '#d5d5d5'
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#2c2c2c'
            }
          },
          axisLabel: {
            show: true
          },
          axisTick: {
            alignWithLabel: false,
            show: false,
            inside: true
          }
        },
        series: [
          {
            name: etitle,
            data: ydata,
            type: type,
            barWidth: '60',
            symbol: 'circle',
            symbolSize: 7,
            itemStyle: {
              normal: {
                color: '#177DF1',
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#414141'
                  }
                }
              }
            },
            lineStyle: {
              width: 2
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(23,125,241,0.4)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(23,125,241,0.1)' // 100% 处的颜色
                }]
              }
            },
            smooth: false
          }
        ]
      }
      opChart.setOption(chartOption)
      this.loading = false
    },

    /* 折现图 */
    lineChartsData () {
      getLineChar(this.searchs).then(res => {
        if (res.status === 200) {
          this.chartsData(res.data, 'ECHART_monthly')
        }
      })
    },

    /* 查询条件 */
    initQueryCriteria (form = {}) {
      return deepMerge(form, {
        nurseUnitId: selectDeptInfo(), // 护理单元
        beginTime: doHandleDate(5), // 提交时间
        endTime: doHandleDate(), // 结束时间
        paperId: this.detail.paperId
      })
    },

    /* 柱状图形 */
    thirdSearch (serach) {
      this.searchs.nurseUnitIds = ''
      if (serach.nurseUnitId !== null && serach.nurseUnitId !== '' && serach.nurseUnitId.length !== 0) {
        this.searchs.nurseUnitIds = serach.nurseUnitId.join(',')
      } else {
        // let selectDeptInfo = getStorageUser('selectDeptInfo')
        // if (selectDeptInfo !== null) this.searchs.nurseUnitIds = selectDeptInfo.deptId
        this.searchs.nurseUnitIds = ''
      }
      this.searchs.beginTime = serach.beginTime
      this.searchs.endTime = serach.endTime
      getBarChar(this.searchs).then(res => {
        if (res.status === 200) {
          this.chartsData(res.data, 'ECHART_wholeHospital')
        }
      })
    },
    /* 清空数据 */
    clsHandler () {
      this.searchs = this.initQueryCriteria()
      this.lineChartsData()
    },

    /* 点击tag标签 */
    handleClickTab (tab) {
      switch (tab.name) {
        case 'first':
          break
        case 'second':
          //  this.$refs.secondList.queryHandler()

          /* this.searchs = this.initQueryCriteria()
          this.lineChartsData() */
          break
        case 'third':
          //  this.thirdSearch()
          //  this.$refs.thirdList.queryHandler()
          break
      }
    }
  }
}
</script>
<style lang='scss'>
  @import '@/assets/qsms/css/self_common.scss';
  .cout-main{
    .el-tabs--card>.el-tabs__header .el-tabs__nav{
      margin-left: 25px;
    }
    .el-tabs{
      height: 99%;
      .el-tabs__content{
        padding: 0 15px;
        height: calc(100% - 52px);
        .el-tab-pane{
          height: 100%;
        }
        .echarts-line{
          width: 90%;
          height: 90%;
          margin: 0 auto;
        }
      }
    }
  }
</style>
