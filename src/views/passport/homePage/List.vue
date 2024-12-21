<template>
  <div class="typt-list-container passport-home-page">
    <div class="passport-home-more">
      <!-- <el-button type="primary" @click="showMore" size="small">查看更多</el-button> -->
    </div>
    <div class="passport-home-row">
      <div class="passport-home-item">
        <div class="passport-home-item-tit">
          <div class="passport-home-item-label"></div>
          <div class="passport-home-item-content">系统授权</div>
        </div>
        <div class="passport-home-content">
          <table class="passport-home-table" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td class="passport-home-table-tr">授权类型</td>
              <td class="passport-home-table-tr2">已用数量/授权数量</td>
              <td></td>
            </tr>
            <tr v-for="(item, index) in authData" :key="index">
              <td class="passport-home-table-tr">
                {{item.deviceName}}
              </td>
              <td class="passport-home-table-tr2">
                <el-progress class="passport-home-sqlx" :percentage="item.percentage" :show-text="false"></el-progress>
              </td>
              <td width="50">
                <div class="passport-home-label-percent">
                  <span class="passport-home-text-bold">{{item.usedNum}}</span>
                  <span>/</span>
                  <span>{{item.countNum}}</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="passport-home-center"></div>
      <div class="passport-home-item passport-home-left">
        <div class="passport-home-item-tit">
          <div class="passport-home-item-label"></div>
          <div class="passport-home-item-content">服务器运行</div>
          <div class="passport-home-time">
            <span class="passport-home-time-tit">数据获取时间：</span>
            <span class="passport-home-time-date">{{curDate.serviceDate}}</span>
            <span class="passport-home-time-img" @click="goFresh('serviceDate')"><img src="/static/passport/img/icon_fresh.png"></span>
          </div>
        </div>
        <div class="passport-home-content">
          <table class="passport-home-table" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="25%">服务器ip</td>
              <td width="25%">CPU占用(%)</td>
              <td width="25%">内存占用(%)</td>
              <td width="25%">存储占用(G)</td>
            </tr>
            <tr v-for="(item, index) in serveData" :key="index">
              <td width="25%">{{host}}</td>
              <td width="25%">
                <el-progress class="passport-home-cpu" :text-inside="true" :percentage="item.cpuPercent"></el-progress>
              </td>
              <td width="25%">
                <el-progress class="passport-home-ram" :text-inside="true" :percentage="item.memoryPercent"></el-progress>
              </td>
              <td width="25%">
                <el-progress class="passport-home-residue" :percentage="item.storagePercent" :show-text="false"></el-progress>
              </td>
              <td width="20">
                <div class="passport-home-label-percent">
                  <span class="passport-home-text-bold">{{item.nowStorage}}</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="passport-home-center"></div>
    <div class="passport-home-row">
      <div class="passport-home-item">
        <div class="passport-home-item-tit">
          <div class="passport-home-item-label"></div>
          <div class="passport-home-item-content">科室统计</div>
          <div class="passport-home-time">
            <div class="passport-home-dept-div">科室：</div>
            <div class="passport-deptCls">
              <treeselect placeholder="请选择" @input="getDeviceStatus" v-model="deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptData" noChildrenText="无子节点"/>
            </div>
            <span class="passport-home-time-tit">数据获取时间：</span>
            <span class="passport-home-time-date">{{curDate.onLineDate}}</span>
            <span class="passport-home-time-img" @click="goFresh('onLineDate')"><img src="/static/passport/img/icon_fresh.png"></span>
          </div>
        </div>
        <div class="passport-home-content">
          <table class="passport-home-table" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td class="passport-home-table-tr">终端类型</td>
              <td class="passport-home-table-tr2">离线数量/总数</td>
              <td></td>
            </tr>
            <tr v-for="(item, index) in deviceData" :key="index">
              <td class="passport-home-table-tr">
                {{item.deviceName}}
              </td>
              <td class="passport-home-table-tr2">
                <el-progress class="passport-home-sqlx dept-process" :percentage="item.percentage" :show-text="false"></el-progress>
              </td>
              <td width="50">
                <div class="passport-home-label-percent">
                  <span class="passport-home-text-bold">{{item.onlineNum}}</span>
                  <span>/</span>
                  <span>{{item.countNum}}</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="passport-home-center"></div>
      <div class="passport-home-item passport-home-left">
        <div class="passport-home-item-tit">
          <div class="passport-home-item-label"></div>
          <div class="passport-home-item-content">环境运行</div>
          <div class="passport-home-time">
            <!--<div class="passport-home-dept-div">服务器：</div>
            <el-select v-model="serviceId"  placeholder="请选择" clearable style="margin-right: 10px">
              <el-option v-for="item in serviceData" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-select>-->
            <span class="passport-home-time-tit">数据获取时间：</span>
            <span class="passport-home-time-date">{{curDate.deviceDate}}</span>
            <span class="passport-home-time-img" @click="goFresh('deviceDate')"><img src="/static/passport/img/icon_fresh.png"></span>
          </div>
        </div>
        <div class="passport-home-content">
          <el-table
            :data="tableData"
            border
            v-loading="tableLoading"
            height="100%"
            style="width: 100%">
            <el-table-column
              prop="name"
              align="center"
              label="项目名称">
            </el-table-column>
            <el-table-column
              prop="status"
              align="center"
              label="状态">
              <template slot-scope="scope">
                <div class="passport-home-circle-div" v-if="scope.row.status === 1">
                  <div class="passport-home-circle green-cls"></div>
                  <div>正常</div>
                </div>
                <div class="passport-home-circle-div" v-else-if="scope.row.status === 0">
                  <div class="passport-home-circle red-cls"></div>
                  <div>异常</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="passport-home-center"></div>
    <div class="passport-home-row">
      <div class="passport-home-item passport-home-all">
        <div class="passport-home-item-tit">
          <div class="passport-home-item-label"></div>
          <div class="passport-home-item-content">服务版本</div>
        </div>
        <div class="passport-home-content">
          <el-table
            :data="serviceVersionData"
            border
            height="100%"
            style="width: 100%;border-top: none;">
            <el-table-column
              prop="serviceName"
              align="center"
              label="服务名称">
            </el-table-column>
            <el-table-column
              prop="serviceCode"
              align="center"
              label="服务标识">
            </el-table-column>
            <el-table-column
              prop="serverBigVersion"
              align="center"
              label="服务端大版本号">
            </el-table-column>
            <el-table-column
              prop="frontBigVersion"
              align="center"
              label="前端大版本号">
            </el-table-column>
            <el-table-column
              prop="serverVersion"
              align="center"
              label="服务端版本">
            </el-table-column>
            <el-table-column
              prop="frontVersion"
              align="center"
              label="前端版本">
            </el-table-column>
            <el-table-column
              prop="serverCreateTime"
              align="center"
              label="服务端打包时间">
            </el-table-column>
            <el-table-column
              prop="frontCreateTime"
              align="center"
              label="前端打包时间">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { AxiosApi } from '../../../api/passport/http'
import { MsgShow } from '../../../assets/passport/js/Message'

export default {
  components: {
    Treeselect
  },
  data () {
    return {
      deptId: null,
      deptData: [],
      serviceId: '',
      tableData: [],
      authData: [],
      deviceData: [],
      curDate: {
        serviceDate: '',
        onLineDate: '',
        deviceDate: ''
      },
      serviceData: [],
      serveData: [],
      tableLoading: false,
      serviceVersionData: [],
      host: ''
    }
  },
  created () {
    this.getDeptList()
    this.getAuth()
    this.getServeStatus()
    this.getDeviceStatus()
    this.getServiceStatus()
    this.getServeVersion()
    // 时间赋值
    this.initDate()
    this.host = window.location.host
  },
  methods: {
    // 查看更多
    showMore () {
      const host = window.location.host
      window.open('http://' + host + '/dev')
    },
    // 请求服务版本
    getServeVersion () {
      AxiosApi(
        '/omms/web-rbac/versionsService',
        {},
        'GET'
      ).then(res => {
        if (res.status === 200) {
          let data = res.data
          this.serviceVersionData = data
        }
      })
    },
    // 请求服务器运行情况
    getServeStatus () {
      AxiosApi(
        '/omms/web-org/dev/os/list',
        {},
        'GET'
      ).then(res => {
        if (res.status === 200) {
          let data = res.data
          let temp = []
          data.forEach(item => {
            temp.push({
              ipAddr: item.ipAddr,
              cpuPercent: this.dealData(item.cpuPercent, '0', 'percent'),
              memoryPercent: this.dealData(item.memoryPercent, '0', 'percent'),
              storagePercent: this.dealData(item.storagePercent, '0', 'percent'),
              nowStorage: this.dealData(item.nowStorage, '')
            })
          })
          this.serveData = temp
        }
      })
    },
    dealData (str, val, act = '') {
      if (str === null || str === '') {
        return val
      } else if (act === 'percent') {
        return parseFloat(str.toString().replace('%', ''))
      }
      return str
    },
    // 刷新
    goFresh (act) {
      let date = this.getCurDate()
      if (act === 'serviceDate') {
        this.curDate.serviceDate = date
        this.getServeStatus()
      } else if (act === 'onLineDate') {
        this.curDate.onLineDate = date
        this.getDeviceStatus()
      } else if (act === 'deviceDate') {
        this.curDate.deviceDate = date
        this.getServiceStatus()
      }
    },
    // 格式化磁盘剩余
    initDate () {
      let date = this.getCurDate()
      this.curDate = {
        serviceDate: date,
        onLineDate: date,
        deviceDate: date
      }
    },
    // 查询部门
    getDeptList () {
      AxiosApi(
        '/ifms/web-org/depts',
        {},
        'GET'
      ).then(res => {
        if (res.status === 200) {
          let temp = JSON.stringify(res.data.list)
          temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '')
          this.deptData = JSON.parse(temp)
        }
      })
    },
    // 请求终端授权
    getAuth () {
      AxiosApi(
        '/omms/web-org/dev/auth',
        {},
        'GET'
      ).then(res => {
        if (res.status === 200) {
          let data = res.data
          let temp = []
          data.forEach(item => {
            temp.push({
              deviceName: item.deviceName,
              percentage: parseInt(item.usedNum) / parseInt(item.countNum) * 100,
              countNum: item.countNum,
              usedNum: item.usedNum
            })
          })
          this.authData = temp
        }
      })
    },
    // 获取当前日期
    getCurDate () {
      let date = new Date()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = date.getHours()
      let min = date.getMinutes()
      if (min < 10) {
        min = '0' + min
      }
      return month + '月' + day + '日 ' + hour + ':' + min
    },
    // 请求科室统计
    getDeviceStatus () {
      AxiosApi(
        '/omms/web-org/dev/device',
        {},
        'GET',
        {
          deptId: this.deptId
        }
      ).then(res => {
        if (res.status === 200) {
          let data = res.data
          let temp = []
          data.forEach(item => {
            temp.push({
              deviceName: item.deviceName,
              percentage: parseInt(item.onlineNum) / parseInt(item.countNum) * 100,
              countNum: item.countNum,
              onlineNum: item.onlineNum
            })
          })
          this.deviceData = temp
        }
      })
    },
    // 请求服务状态
    getServiceStatus () {
      AxiosApi(
        '/omms/web-org/dev/base',
        {},
        'GET',
        {
          // ipAddr: this.serviceId
        }
      ).then(res => {
        if (res.status === 200) {
          let data = res.data
          this.tableData = data
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .passport-home-page{
    padding: 20px;
    overflow: auto;
    .passport-home-more{
      width: 100%;
      flex: 0 0 40px;
      display: flex;
      justify-content: flex-end;
    }
    .passport-home-all{
      width: 100% !important;
    }
    .passport-home-text-bold{
      color: #333333;
    }
    .passport-home-circle-div{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .passport-home-circle{
      height: 10px;
      width: 10px;
      margin-right: 5px;
      border-radius: 50%;
    }
    .green-cls {
      background-color: #6DD400;
    }
    .red-cls {
      background-color: #CE2E2E;
    }
    .passport-home-dept-div{
      float: left;
      font-size: 14px;
      color: #666666;
    }
    .passport-deptCls{
      float: left;
      padding-top: 12px;
      padding-right: 12px;
      line-height: 34px;
      .vue-treeselect{
        width: 182px;
      }
    }
    .passport-home-time{
      margin-left: auto;
      padding-right: 20px;
      .el-select{
        width: 182px;
      }
      /deep/.el-input--small .el-input__inner{
        height: 34px;
        line-height: 34px;
      }
    }
    .passport-home-time-tit{
      color: #999999;
      font-size: 14px;
    }
    .passport-home-time-date{
      color: #333333;
      font-size: 14px;
    }
    .passport-home-time-img{
      margin-left: 5px;
      cursor: pointer;
      img{
        vertical-align: middle;
      }
    }
    .passport-home-row{
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 48%;
      flex: 0 0 48%;
    }
    .passport-home-center{
      flex: 0 0 20px;
    }
    .passport-home-item{
      width: 50%;
      border: 1px solid #cccccc;
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.14);
      display: flex;
      flex-flow: column;
      min-width: 620px;
    }
    .passport-home-item-tit{
      height: 60px;
      background: #FBFBFB;
      display: flex;
      line-height: 60px;
      padding-left: 20px;
      align-items: center;
    }
    .passport-home-item-label {
      width: 4px;
      height: 15px;
      background: #15C690;
      border-radius: 2px;
    }
    .passport-home-item-content{
      margin-left: 10px;
      font-size: 16px;
      font-weight: bold;
      color: #666666;
      width: 90px;
    }
    .passport-home-content{
      padding: 20px;
      height: 100%;
      overflow-y: auto;
      /deep/.el-table__header th, /deep/.el-table td{
        height: 42px;
      }
      /deep/.el-table--border{
        th:not(:last-child){
          border-right: none;
        }
        border-top: none;
      }
      .passport-home-table{
        width: 100%;
        .passport-home-table-tr{
          width: 45%;
        }
        .passport-home-table-tr2{
          width: 55%;
        }
        td{
          color: #999999;
          font-size: 14px;
          text-align: center;
          height: 50px;
          padding-left: 10px;
          padding-right: 10px;
        }
      }
    }
    .passport-home-sqlx {
      margin: 0 auto;
      /deep/.el-progress-bar__outer{
        height: 18px !important;
      }
      /deep/.el-progress-bar__inner{
        background: #1890FF linear-gradient(143deg, #00D6FF 0%, #0055FF 100%);
      }
    }
    .dept-process{
      /deep/.el-progress-bar__inner{
        background: #1890ff linear-gradient(143deg,#f3189f 0%,#e90f0f 100%);
      }
    }
    .passport-home-cpu{
      /deep/.el-progress-bar__outer{
        height: 18px !important;
      }
      /deep/.el-progress-bar__inner{
        background: #1890FF linear-gradient(143deg, #00FF8B 0%, #00CC46 100%);
      }
    }
    .passport-home-ram{
      /deep/.el-progress-bar__outer{
        height: 18px !important;
      }
      /deep/.el-progress-bar__inner{
        background: #1890FF linear-gradient(143deg, #FACC16 0%, #FA9F16 100%);
      }
    }
    .passport-home-residue{
      /deep/.el-progress-bar__outer{
        height: 18px !important;
      }
      /deep/.el-progress-bar__inner{
        background: #1890FF linear-gradient(143deg, #F3189F 0%, #E90F0F 100%);
      }
    }
  }
</style>
