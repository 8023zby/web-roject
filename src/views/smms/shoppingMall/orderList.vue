<!--
  文件描述：订单查看列表页
    主样式class：list-page-new
  创建时间：2020/4/16 13:19
  创建人：Administrator

  关于表格多选时，选中行背景色改变说明：
    选中相关行后，记录选中数据的id，在row-class-name回调方法中，设置选中行的背景色：table-SelectedRow-bgcolor
  关于主体查询方法，方法名为：executeQueryPage
  表格数据变量为：pagination.list

  基本逻辑：
   挂载完成，调用查询数据的方法：executeQueryPage()
   在公共js文件BaseQueryPageForm中，查询出数据会处理，放到变量 pagination 里面，数据显示处理都是基于这个变量进行
-->
<template>
  <el-container class="list-page-new">
    <el-header height="auto">
      <!--有标题的话，header的class = header-hastitle-->
      <!--查询条件模块 === START-->
      <div class="query-items-container" ref="query_form">
        <slot name="query">
          <el-form :inline="true" class="demo-form-inline query-area">
            <el-form-item label="订单编号：">
              <el-input v-model="id" placeholder="请输入订单号" size="mini" />
            </el-form-item>
            <el-form-item label="下单时间：">
              <el-date-picker @change="changeDate()" v-model="createTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="请选择" end-placeholder="请选择">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select v-model="orderState" placeholder="请选择" size="mini">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="typt-search-btn">
                <el-button type="primary" @click="query" class="el-button-radius" icon="el-icon-search" size="mini">搜索</el-button>
                <el-button type="text" @click="reList" size="mini">重置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </slot>
      </div>
      <!--查询条件模块 === END-->
      <div class="tool-container">
        <div class="left">
          <!--左边按钮-->
          <slot name="left_btn"></slot>
        </div>
        <div class="right">
          <!--右边按钮-->
          <slot name="right_btn">
            <el-button @click="orderQp" size="mini" style="background-color: #01c3a3; color: #fff">导出送餐表</el-button>
          </slot>
        </div>
      </div>
    </el-header>
    <el-main class="orderlist-main">
      <!--主体列表-->
      <slot name="main">
        <template v-if="orderData.length > 0">
          <div class="main-list" style="height: 100%" v-loading="yh_loading" v-if="showListVisible">
            <ul class="infinite-list" v-infinite-scroll="loadList" style="overflow: auto">
              <li v-for="(item, index) in orderData" :key="index" class="infinite-list-item">
                <div class="order-main-collapse">
                  <div class="collapse-title">
                    <span>订单号：{{ item.id }}</span>
                    <span class="span-time">
                      {{
                      dealShowTIme(item.startTime)
                      }}
                    </span>
                    <span class="right-span">
                      {{
                      optionsSwitch[item.orderState]
                      }}
                    </span>
                  </div>
                  <div class="collapse-paintName">
                    {{ item.patientName }}
                    <span class="span-address">{{ item.address }}</span>
                    <span class="span-phone">{{ item.telephone }}</span>
                  </div>
                  <div class="collapse-goods">
                    <div class="title">商品</div>
                    <div class="goods-content">
                      <el-row v-for="(item2, index2) in item.orderWareList" :key="index + index2">
                        <el-col :span="21">
                          {{ item2.wareTitle }}
                          <span v-if="
                              item2.specification !== '' &&
                              item2.specification !== null
                            ">&nbsp; （{{ item2.specification }}）</span>
                          <span v-if="
                              item2.attribute !== '' && item2.attribute !== null
                            ">[{{ item2.attribute }}]</span>
                        </el-col>
                        <el-col :span="1">{{ item2.count }}份</el-col>
                        <el-col :span="2">￥{{ item2.price }}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="21">&nbsp;</el-col>
                        <el-col :span="1">包装费</el-col>
                        <el-col :span="2">￥{{ item.packingFee }}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="21">&nbsp;</el-col>
                        <el-col :span="1">配送费</el-col>
                        <el-col :span="2">￥{{ item.deliveryFee }}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="21">&nbsp;</el-col>
                        <el-col :span="1">总价</el-col>
                        <el-col :span="2" class="total-price">￥{{ item.totalAmount }}</el-col>
                      </el-row>
                    </div>
                    <div class="goods-remark">备注：{{ item.remark }}</div>
                  </div>

                  <div class="foot-btn">
                    <el-button size="mini" plain :disabled="item.orderState !== 2 && item.orderState !== 1" @click="updateState(item, 3, index)">取消订单</el-button>
                    <el-button size="mini" type="primary" :disabled="item.orderState !== 1" @click="updateState(item, 2, index)">接单</el-button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </template>
        <template v-else>
          <div style="color: #999999;display: flex;align-items: center;justify-content: center;">暂无数据</div>
        </template>

      </slot>
    </el-main>

    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot></slot>
  </el-container>
</template>

<script>
import { queryList, updateState } from '../../../api/smms/shopingMall/orderList'
// import dateFormat from '../../../assets/smms/utils/dateFormat'
import { exportExecl } from '../../../assets/smms/utils/exportExcel'
import BaseQueryPageForm from '../common/BaseQueryPageForm'

export default {
  name: 'OrderList',
  mixins: [BaseQueryPageForm],
  components: {},
  data () {
    return {
      createTime: [],
      yh_loading: false,
      search: {
        endTime: getNowFormatDate() + ' 23:59:59',
        beginTime: getNowFormatDate() + ' 00:00:00'
      },
      showListVisible: false,
      firstLoad: true,
      activeName: 1,
      orderData: [],
      wareData: [],
      id: '',
      orderState: '',
      currentPage: 1,
      sizeNum: 10,
      dataTotal: 0,
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '已支付'
        },
        {
          value: '2',
          label: '已接单'
        },
        {
          value: '4',
          label: '已完成'
        }
      ],
      // 0：待支付；1：已支付；2：已接单；3：已取消；4：已完成；5：未确认
      optionsSwitch: {
        0: '待支付',
        1: '已支付',
        2: '已接单',
        3: '已取消',
        4: '已完成',
        5: '未确认'
      }
    }
  },
  inject: ['routerTo'],
  mounted: function () {
    this.createTime.push(this.search.beginTime)
    this.createTime.push(this.search.endTime)
    // 判断店铺具备完整信息是否
    this.isCompleteInfo(true)
  },
  created () {
    this.query()
  },
  methods: {
    changeDate () {
      if (this.createTime) {
        this.search.beginTime = this.createTime[0]
        this.search.endTime = this.createTime[1]
      } else {
        this.search.beginTime = ''
        this.search.endTime = ''
      }
    },
    // 判断是否需要完善店铺信息
    isCompleteInfo (t) {
      const _this = this
      let shopImg = localStorage.getItem('shopInfo.img')
      if (
        shopImg === '' ||
        shopImg === null ||
        shopImg === undefined ||
        shopImg === 'null'
      ) {
        if (t) {
          _this.isWholeInfo(res => {
            _this.isCompleteInfo(false)
          })
        } else {
          this.$alert('店铺信息缺失，请点击左侧店铺信息菜单，完善信息。', '', {
            confirmButtonText: '确定',
            callback: action => {
              this.routerTo('/shop')
            }
          })
        }
      } else {
        _this.showListVisible = true
      }
    },
    loadList () {
      let p = this.pagination.page + 1
      if (this.firstLoad) {
        this.orderData = []
        p = this.pagination.page
        this.firstLoad = false
      } else if (p > this.pagination.pages) {
        //  this.$message({
        //   message: '订单已加载完毕',
        //   type: 'success'
        // })
        return
      }

      this.pageChangeHandler(p)
    },
    query () {
      this.firstLoad = true
      this.sizeNum = 10
      this.currentPage = 1
      this.pagination.page = 1
      this.loadList()
    },
    executeQueryPage () {
      this.yh_loading = true
      let y = this.CompareBeginEndTime(
        this.search.beginTime,
        this.search.endTime
      )
      if (y === 'n') {
        this.yh_loading = false
        return
      }

      queryList({
        id: this.id,
        beginTime: this.search.beginTime === null ? '' : this.search.beginTime,
        endTime: this.search.endTime === null ? '' : this.search.endTime,
        orderState: this.orderState,
        size: this.pagination.size,
        page: this.pagination.page,
        pageHelper: '1',
        states: '1,2,4' // 0：待支付；1：已支付；2：已接单；3：已取消；4：已完成；5：未确认
      })
        .then(res => {
          this.IsSuccess(
            res,
            () => {
              this.orderData.push(...res.data.list)
              this.queryResultHandler(res)
            },
            false
          )
        })
        .catch(error => {
          this.$message.error(JSON.stringify(error) + '数据获取失败')
        })
        .finally(() => {
          this.yh_loading = false
        })
    },
    reList () {
      this.id = ''
      this.search.beginTime = getNowFormatDate() + ' 00:00:00'
      this.search.endTime = getNowFormatDate() + ' 23:59:59'
      this.createTime = []
      this.createTime.push(this.search.beginTime)
      this.createTime.push(this.search.endTime)
      this.orderState = ''
      this.sizeNum = 10
      this.currentPage = 1
      this.firstLoad = true
      this.loadList()
    },
    dealShowTIme (t) {
      let t1 = t.split(' ')
      let tt = t1[0]

      if (t1[1]) {
        let t2 = t1[1].split(':')
        tt += ' ' + t2[0] + ':' + t2[1]
      }
      return tt
    },
    // 接单/取消订单
    updateState (row, state, index) {
      let promptingMessage = ''
      if (state === 2) {
        promptingMessage = '接单成功'
      } else {
        promptingMessage = '取消订单成功'
      }
      updateState({
        id: row.id,
        orderState: state
      })
        .then(res => {
          if (res.status === 200) {
            if (state === 2) {
              this.orderData[index].orderState = 2
            } else {
              this.orderData[index].orderState = 3
            }
            this.$message({
              message: promptingMessage,
              type: 'success'
            })
          } else if (res.status === 500) {
            this.$message({
              message: '' + res.data,
              type: 'error'
            })
          } else {
            this.$message({
              message: '' + res.desc,
              type: 'error'
            })
          }
        })
        .catch(error => {
          this.$message.error(JSON.stringify(error) + '操作失败')
        })
    },
    orderQp (form) {
      const param = {
        id: this.id,
        beginTime:
          this.search.beginTime === null ? '' : this.search.beginTime + ':00',
        endTime:
          this.search.endTime === null ? '' : this.search.endTime + ':00',
        orderState: this.orderState,
        pageHelper: 0,
        states: '1,2,4'
      }
      exportExecl('/smms/web-sm/order/exportOrder', param, '订单')
    },
    handleSizeChange (size) {
      this.sizeNum = size
      this.executeQueryPage()
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.executeQueryPage()
    }
  }
}
function getNowFormatDate () {
  let date = new Date()
  let seperator1 = '-'
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  let currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}
</script>

<style lang='scss' scoped>
@import "@/assets/smms/css/self_common.scss";
.orderlist-main {
  width: 100%;
  overflow-y: hidden !important;
  .main-list {
    height: 100%;
    overflow: hidden;
    .infinite-list {
      height: 100%;
      overflow-y: auto;
    }
  }
  .order-main-collapse {
    width: 96%;
    margin: 10px auto;
    border: 1px solid #f0f0f0;
    height: auto;
    .collapse-title {
      padding: 5px 15px;
      background-color: #f8f8f8;
      span {
        font-size: 14px;
        padding: 0 2px;
        margin-right: 15px;
        color: #5e5e5e;
      }
      .right-span {
        float: right;
      }
      .span-time {
        color: #8f8f8f;
      }
    }
    .collapse-paintName {
      padding: 20px 15px;
      background-color: #fff;
      font-size: 16px;
      font-weight: bolder;
      .span-address {
        padding: 2px 10px;
        font-size: 13px;
        font-weight: normal;
        background-color: #eef5fe;
        border-radius: 20px;
      }
      .span-phone {
        color: #333333;
        font-size: 13px;
        font-weight: normal;
        margin-left: 15px;
      }
    }
    .collapse-goods {
      background-color: #fbfbfb;
      width: 98%;
      margin: 0 auto;
      .title {
        height: 30px;
        line-height: 30px;
        padding-left: 5px;
        border-bottom: 1px solid #f0f0f0;
        font-size: 13px;
        color: #7f7f7f;
        i {
          float: right;
          color: #878787;
          margin: 7px 10px 0 0;
          cursor: pointer;
        }
      }
      .goods-content {
        padding: 5px;
        font-size: 13px;
        color: #636363;
        .el-row {
          padding: 2px 0;
          .el-col:nth-child(2),
          .el-col:nth-child(3) {
            text-align: right;
          }
          .el-col:nth-child(3) {
            padding-right: 10px;
          }
          .total-price {
            font-size: 14.5px;
            font-weight: bold;
            color: red;
          }
        }
      }
      .goods-remark {
        padding: 5px;
        font-size: 13px;
        color: #636363;
        background-color: #fff7ea;
      }
    }
    .foot-btn {
      padding: 10px 15px;
      text-align: right;
    }
  }
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  height: 4px !important;
  width: 4px !important;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 3px rgba(180, 180, 180, 0);
  border-radius: 3px;
  background-color: #f5f5f5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  background: #dfdfdf;
}
</style>
