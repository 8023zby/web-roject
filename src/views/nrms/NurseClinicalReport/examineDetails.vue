<template>
  <div class="examine-details">
    <div class="examine-details-container">
      <layout_list>
        <div slot="main" class="main-list examine-details-container-center">
          <div class="examine-details-container-center">
            <div class="examine-details-container-center-top">
              <div class="examine-details-container-center-top-top">
                <span class="top-line" />
                <span class="top-text">检验结果详情</span>
                <el-button type="primary" class="top-button" @click="returnFather()">返回</el-button>
              </div>
            </div>
            <div class="examine-details-container-center-main">
              <div class="clinical-content-inner">
                <el-table
                  v-loading="loading"
                  :data="examineItemsList"
                  :row-style="{height:'44px','font-size': '14px','color':'#333333'}"
                  :header-cell-style="{ 'border-bottom': '1px solid #e0e0e0','height': '50px','background-color': '#f7f7f7','font-size': '16px','color':'#333333','font-weight':'normal'}"
                  height="100%"
                >
                  <!-- <el-table-column label="序号" align="center" width="100">
                    <template slot-scope="scope">
                      {{ (examine_items_search_from.page - 1) * examine_items_search_from.size +
                        scope.$index + 1 }}
                    </template>
                  </el-table-column> -->
                  <el-table-column align="center">
                    <template slot="header">项目名称</template>
                    <template slot-scope="scope">
                      <span class="multiline-ellipsis">
                        {{ scope.row.examineItemName }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center">
                    <template slot="header">
                      <span class="multiline-ellipsis">
                        检验结果
                      </span>
                    </template>
                    <template slot-scope="scope">
                      <span
                        class="multiline-ellipsis"
                        :class="{'red-font-color': parseResult(scope.row)}"
                      >
                        {{ scope.row.examineItemResult }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center">
                    <template slot="header">单位</template>
                    <template slot-scope="scope">
                      <span class="multiline-ellipsis">
                        {{ scope.row.examineItemUnit }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center">
                    <template slot="header">异常标志</template>
                    <template slot-scope="scope">
                      <span class="multiline-ellipsis">
                        {{ scope.row.examineItemAbnormal }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center">
                    <template slot="header">
                      <span class="multiline-ellipsis">参考范围</span></template>
                    <template slot-scope="scope">
                      <span class="multiline-ellipsis">
                        {{ scope.row.examineItemReferenceRange }}
                      </span>
                    </template>
                  </el-table-column>

                  <el-table-column align="center">
                    <template slot="header"><span
                      class="multiline-ellipsis"
                    >危急提示</span></template>
                    <template slot-scope="scope">
                      <span class="multiline-ellipsis">
                        {{ scope.row.examineItemCrisisValue }}
                      </span>
                    </template>
                  </el-table-column>

                  <el-table-column align="center">
                    <template slot="header">操作</template>
                    <template slot-scope="scope">
                      <el-button
                        v-if="scope.row.hasMoreChartData"
                        type="text"
                        @click="seeChart(scope.row)"
                      >查看趋势图
                      </el-button>
                      <span v-else style="color: #999;">查看趋势图</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div slot="footer" class="page-bar">
          <el-pagination
            :current-page.sync="examine_items_search_from.page"
            :page-size="examine_items_search_from.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="examine_items_page_total"
            @size-change="handleSizeChange_examine_items"
            @current-change="handleCurrentChange_examine_items"
          />
        </div>
      </layout_list>
    </div>
    <el-dialog
      title="查看趋势图"
      :visible.sync="dialogVisible"
      width="40%"
      height="64%"
    >
      <div id="myEchart" class="clinical-chart-center" />
    </el-dialog>
  </div>
</template>

<script>
import layout_list from '../../../components/nrms/layout/list'
import { ApiClinicalReport } from '../../../api/nrms'
import './echarts_components.js'
import moment from 'moment'

export default {
  name: 'ExamineDetails',
  components: { layout_list },
  filters: {
    formatDateTimeYMD (time) {
      if (time == null) {
        return
      }
      return moment(time).format('YYYY-MM-DD')
    }
  },
  data () {
    return {
      loading: false,
      examineDetailsItemList: [],
      examineItemsList: [],
      examine_items_search_from: {
        examineId: '',
        size: 10,
        page: 1
      },
      examine_items_page_total: 0,
      dialogVisible: false,
      selectConditions: {
        page: 1,
        size: 10,
        patientId: '',
        examineItemId: '',
        examineItemName: '',
        examineId: ''
      },
      totalPage: 1,
      createChart: true,
      e_echar: null,
      xData: [],
      yData: [],
      baseColor: '#1E87F0',
      lineFormColor: 'rgba(30,135,240,0.8)',
      lineToColor: 'rgba(30,135,240,0.03)',
      examineItem: {},
      examineDetailsItem: {}
    }
  },
  created () {
    this.examineItem = this.$route.query.examineItem || {}
    this.examine_items_search_from.examineId = this.examineItem.examineId
    this.selectConditions.patientId = this.$route.query.patientId
    this.getData()
  },
  methods: {
    parseResult (row) {
      return row.examineItemAbnormal != null && row.examineItemAbnormal !== '' && row.examineItemAbnormal !== '正常'
    },
    getData () {
      if (this.examine_items_search_from.examineId != null && this.examine_items_search_from.examineId.length !== 0) {
        this.loading = true
        ApiClinicalReport.selectExamineItemsPost(this.examine_items_search_from).then((res) => {
          this.examineItemsList = res.data.list
          this.examine_items_page_total = res.data.total
          this.loading = false
        }).catch((err) => {
          this.$message.error('请求接口异常了！' + err)
          this.examineItemsList = []
          this.examine_items_page_total = 0
          this.loading = false
        })
      }
    },
    handleSizeChange_examine_items (val) {
      this.examine_items_search_from.size = val
      this.getData()
    },
    handleCurrentChange_examine_items (val) {
      this.examine_items_search_from.page = val
      this.getData()
    },
    seeChart (item) {
      this.dialogVisible = true
      this.examineDetailsItem = item
      this.selectConditions.examineItemId = item.examineItemId
      this.selectConditions.examineId = item.examineId
      this.selectConditions.examineItemName = item.examineItemName
      this.selectConditions.page = 1
      this.getChartData()
    },
    getChartData () {
      if (this.selectConditions.page > this.totalPage) {
        this.selectConditions.page = this.totalPage
        this.$message.success('没有更多了！')
        return
      }
      if (this.selectConditions.page < 1) {
        this.$message.success('已经是第一页了！')
        this.selectConditions.page = 1
        return
      }
      if (this.createChart === false) {
        this.showLoading()
      }
      ApiClinicalReport.selectExamineItemsChartByPatientIdPost(this.selectConditions).then(res => {
        this.examineDetailsItemList = res.data.list
        this.totalPage = res.data.pages

        const _this = this
        _this.xData = []
        _this.yData = []
        this.examineDetailsItemList.forEach(function (item) {
          _this.xData.unshift(_this.$options.filters['formatDateTimeYMD'](item.reportTime))
          _this.yData.unshift(item.examineItemResult)
        })
        if (this.createChart) {
          this.createEchar()
          this.initEchar()
        } else {
          this.refreshEchar()
        }
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
        this.loading = false
      })
    },
    createEchar () {
      this.createChart = false
      this.e_echar = this.$echarts.init(document.getElementById('myEchart'))
    },
    initEchar () {
      const _this = this
      const promise = new Promise(resolve => {
        const _option = {
          /* title: {
                           left: 'right',
                           text: this.examineDetailsItem.examineItemName,
                           textStyle: {
                             color: '#333333',
                             fontWeight: 'normal',
                             fontSize: '14',
                           }
                         }, */
          color: [this.baseColor],
          legend: {
            right: '10',
            itemWidth: 50,
            itemHeight: 4,
            data: [{ name: this.examineDetailsItem.examineItemName, icon: 'rect' }],
            padding: [34, 0, 0, 0]
          },
          grid: {
            y: 100
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: '#333333',
            formatter: '时间: {b}<br />结果: {c}' + (this.examineDetailsItem.examineItemUnit === null ? '' : this.examineDetailsItem.examineItemUnit),
            /*              axisPointer: {
                                            type: 'cross',
                                            label: {
                                              backgroundColor: '#666',
                                              fontSize: '14'
                                            }
                                          }, */
            textStyle:
                                {
                                  fontSize: '14'
                                }
          },
          xAxis: {
            type: 'category',
            name: '时间',
            nameTextStyle: {
              color: '#333333',
              fontSize: '14',
              padding: [0, 0, 0, 14],
              verticalAlign: 'center'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#eaeaea',
                type: 'solid',
                width: '1'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#333333',
                fontSize: '14',
                lineHeight: '30'
              }
            },
            data: this.xData,
            selectConditions: {}
          },
          yAxis: {
            type: 'value',
            name: this.examineDetailsItem.examineItemUnit,
            nameTextStyle: {
              color: '#333333',
              fontSize: '14',
              align: 'right',
              padding: [0, 10, 15, 0]
            },
            splitNumber: '6',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#333333',
                fontSize: '14',
                lineHeight: '30'
              }
            },
            splitLine: {
              lineStyle: {
                type: 'solid',
                color: '#eaeaea',
                width: 1
              }
            }
          },
          series: [{
            name: this.examineDetailsItem.examineItemName,
            data: this.yData,
            type: 'line',
            symbol: 'none',
            itemStyle: {
              color: this.baseColor
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: this.lineFormColor
              }, {
                offset: 1,
                color: this.lineToColor
              }])
            }
          }]
        }
        _this.e_echar.setOption(_option)
        _this.e_echar.on('finished', () => {
          resolve()
        })
      })

      _this.closeLoading()

      promise.then(() => {
        _this.showDefaultToolTip()
        _this.addTouch()
      })

      window.addEventListener('resize', function () {
        _this.e_echar.resize()
      })
    },
    refreshEchar () {
      const _this = this

      const promise = new Promise((resolve) => {
        var option = {
          legend: {
            data: [{ name: _this.examineDetailsItem.examineItemName, icon: 'rect' }]
          },
          xAxis: {
            data: _this.xData
          },
          series: [{
            name: _this.examineDetailsItem.examineItemName,
            data: _this.yData
          }]
        }
        _this.e_echar.setOption(option)

        _this.e_echar.on('finished', () => {
          resolve()
        })
      })
      _this.closeLoading()
      promise.then(() => {
        _this.showDefaultToolTip()
      })
    },
    showDefaultToolTip () {
      const _this = this
      setTimeout(function () {
        _this.e_echar.dispatchAction({
          type: 'showTip',
          seriesIndex: 0, // 显示第几个series
          dataIndex: _this.xData.length - 1 // 显示第几个数据
        })
      }, 1000)
    },
    addTouch () {
      var canvas = document.getElementsByTagName('canvas')[0]
      canvas.addEventListener('touchstart', touch, false)
      canvas.addEventListener('touchmove', touch, false)
      canvas.addEventListener('touchend', touch, false)
      canvas.addEventListener('mousedown', touch, false)
      canvas.addEventListener('mousemove', touch, false)
      canvas.addEventListener('mouseup', touch, false)
      const _this = this
      var startX

      function touch (event) {
        // event.stopPropagation();
        event = event || window.event
        switch (event.type) {
          case 'touchstart':
            startX = event.touches[0].clientX
            break
          case 'touchend': {
            const x = event.changedTouches[0].clientX - startX // 左滑
            if (x > 10) {
              _this.selectConditions.page++
              _this.getData(false)
            } else if (x < -10) {
              _this.selectConditions.page--
              _this.getData(false)
            }
            break
          }
          case 'touchmove':
            // event.preventDefault();
            break
          case 'mousedown':
            startX = event.clientX
            break
          case 'mouseup': {
            const x = event.clientX - startX // 左滑
            if (x > 10) {
              _this.selectConditions.page++
              _this.getChartData(false)
            } else if (x < -10) {
              _this.selectConditions.page--
              _this.getChartData(false)
            }
            break
          }
          case 'mousemove':
            event.preventDefault()
            break
        }
      }
    },
    showLoading () {
      this.e_echar.showLoading({
        text: '数据加载中...',
        textColor: '#333333',
        maskColor: 'rgba(255,255,255,0.8)',
        zlevel: 0
      })
    },
    closeLoading () {
      this.e_echar.hideLoading()
    },
    returnFather () {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="scss">
    .examine-details {
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
    }

    .clinical-chart-center {
        height: 500px;
    }

    /deep/ .el-dialog__body {
        padding: 0 !important;
    }

    .examine-details-container {
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
        z-index: 2;
        background-color: white;
        display: flex;

        &-center {
            display: flex;
            flex-direction: column;
            flex: 1;

            &-top {
                width: 100%;
                margin-top: 0;
                height: 88px;

                &-top {
                    height: 48px;
                    margin-top: 0;
                    width: 100%;
                    background-color: #f7f7f7;
                    display: flex;
                    align-items: center;

                    .top-line {
                        background-color: #15c690;
                        width: 4px;
                        height: 15px;
                        vertical-align: center;
                        margin-left: 15px;
                        display: inline-block;
                        border-radius: 2px;
                    }

                    .top-text {
                        font-size: 14px;
                        color: #333333;
                        margin-left: 15px;
                    }

                    .top-button {
                        height: 28px;
                        width: 80px;
                        position: absolute;
                        right: 16px;
                        border-radius: 2px !important;
                        font-size: 14px !important;
                        padding-top: 6px !important;
                        padding-bottom: 6px !important;
                    }
                }
            }

            &-main {
                flex: 1;
                position: relative;
                border-top: 1px solid #e0e0e0;

                .clinical-content-inner {
                    position: absolute;
                    top: 1px;
                    left: 1px;
                    right: 1px;
                    bottom: 0;
                }

                .red-font-color {
                    color: #f56c6c;
                }
            }
        }
    }

    .multiline-ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: normal !important;
        word-wrap: break-word;
    }
</style>
