<template>
  <div class="typt-list-main">
    <div class="typt-list-container tdms-container">
      <!--查询-->
      <el-form class="demo-form-inline" :inline="true">
        <!--运维端-->
        <el-form-item label="科室：" v-if="landingEndCode === 'OPEX'" class="deptAddCls">
          <treeselect placeholder="请选择" v-model="formSearchData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :options="deptData" noChildrenText="无子节点"/>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select style="width: 182px" size="small" placeholder="请选择" v-model="formSearchData.onLineStatus" clearable>
            <el-option v-for="item in queryOnlineList" :label="item.label" :value="item.key"
                       :key="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最后升级状态：">
          <el-select size="small" placeholder="请选择" v-model="formSearchData.lastUpStatus" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最后升级时间：" class="tdms-time-search">
          <el-date-picker
            @change="changeDate"
            v-model="searchTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="请选择"
            end-placeholder="请选择">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="typt-search-btn">
            <el-button type="primary" class="el-button-tdms-search" icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
            <el-button type="text" @click="reload">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <div class="action_div">
          <sort-type @query="queryByOrder" style="float: left"/>
          <el-button v-if="deviceSetObj[formSearchData.deviceType] && authorityObj[`set801_${formSearchData.deviceType}`]" type="primary" size="small" @click="showDeviceSet('')">批量配置</el-button>
          <el-button v-if="authorityObj[upStr]" type="primary" size="small" @click="showDeviceUpdate">终端升级</el-button>
        </div>
      </div>
      <!--列表-->
      <el-table
        :data="tableData"
        v-loading="loading"
        height="80%"
        stripe
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <!--<el-table-column label="序号" width="55" type="index" align="center" :index="indexMethod"></el-table-column>-->
        <el-table-column prop="deptName" label="护理单元" align="center" :formatter="formatDept"></el-table-column>
        <el-table-column v-if="roomShow.join(',').indexOf(formSearchData.deviceType)>-1" prop="roomName" label="房间" align="center"></el-table-column>
        <el-table-column v-if="bedShow.join(',').indexOf(formSearchData.deviceType)>-1" prop="bedName" label="床位" align="center"></el-table-column>
        <el-table-column prop="deviceModel" label="终端型号" align="center"></el-table-column>
        <el-table-column prop="deviceNum" label="终端号" align="center"></el-table-column>
        <el-table-column width="130" v-if="formSearchData.deviceType !== 'wnToiletExtension'" prop="ip" label="IP地址" align="center"></el-table-column>
        <el-table-column width="100" v-if="formSearchData.deviceType !== 'wnToiletExtension'" prop="status" align="center" :formatter="formatStatus">
          <template slot="header">
            <div style="display: flex; justify-content: center; align-items: center;">
              <div style="margin-right: 5px">状态</div>
              <el-tooltip class="item" effect="dark" content="设备更新状态为3分钟一次" placement="bottom">
                <img ref="statusImg" @mouseenter="changeImgEnter" @mouseleave="changeImgLeave" class="img-cls" src="/static/tdms/img/icon_explain_default.png"/>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="版本信息" prop="versions" width="260">
          <template slot-scope="scope">
            <div v-if="typeof scope.row.versions === 'string'">
              <div v-if="formSearchData.deviceType === 'wnVoiceGateway'">
                <div>主程序：{{JSON.parse(scope.row.versions).appVersion}}</div>
                <div>终端硬件：{{JSON.parse(scope.row.versions).hardwareVersion}}</div>
                <div>操作系统：{{JSON.parse(scope.row.versions).systemVersion}}</div>
              </div>
              <div v-else-if="formSearchData.deviceType === 'wnToiletExtension' || formSearchData.deviceType === 'wnCorridorLatticeScreen'">
                <div>主程序：{{JSON.parse(scope.row.versions).appVersion}}</div>
              </div>
              <div v-else>
                <div>主程序：{{JSON.parse(scope.row.versions).appVersion}}</div>
                <div>安卓中台：{{JSON.parse(scope.row.versions).upbsVersion}}</div>
                <div>呼叫程序：{{JSON.parse(scope.row.versions).callVersion}}</div>
                <div>权限程序：{{JSON.parse(scope.row.versions).authVersion}}</div>
                <div>终端硬件：{{JSON.parse(scope.row.versions).hardwareVersion}}</div>
                <div>操作系统：{{JSON.parse(scope.row.versions).systemVersion}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="120" v-if="delFun.join(',').indexOf(formSearchData.deviceType) == -1" prop="lastUpTime" label="最后升级时间" align="center"></el-table-column>
        <el-table-column width="120" v-if="delFun.join(',').indexOf(formSearchData.deviceType) == -1" prop="lastUpStatus" label="最后升级状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.lastUpStatus === null || (scope.row.lastUpStatus !== 0 && scope.row.lastUpStatus !== 1)"></span>
            <el-tag v-else
                    :type="scope.row.lastUpStatus === 0 ? 'danger' : 'success'"
                    disable-transitions
            >{{scope.row.lastUpStatus === 0?'失败':'成功'}}</el-tag>
          </template>
        </el-table-column>
<!--        <el-table-column width="90" v-if="deviceSetObj[formSearchData.deviceType] && authorityObj[`one801_${formSearchData.deviceType}`]" prop="singleStatus" label="单个配置" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="changeSet(scope.row.singleStatus, scope.row.deviceId)"
              v-model="scope.row.singleStatus"
              :active-value="1"
              :inactive-value="0"
              active-color="#1D86EF"
              inactive-color="#EDEDED">
            </el-switch>
          </template>
        </el-table-column>-->
        <el-table-column v-if="delFun.join(',').indexOf(formSearchData.deviceType) > -1 && authorityObj[`del801_${formSearchData.deviceType}`]" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <span class="el-text-danger" style="margin: 0 10px" @click="delDo(scope.row)">删除</span>
          </template>
        </el-table-column>
        <el-table-column v-else-if="czHidden.join(',').indexOf(formSearchData.deviceType)===-1
        && (authorityObj[`mod801_${formSearchData.deviceType}`] || authorityObj[`del801_${formSearchData.deviceType}`]
        || (noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[conStr])
        || (noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[`log801_${formSearchData.deviceType}`]))" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <span v-if="authorityObj[`mod801_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 5px" @click="editInfo(scope.row)">编辑</span>
            <span v-if="authorityObj[`del801_${formSearchData.deviceType}`]" class="el-text-danger" style="margin: 0 5px" @click="delDo(scope.row)">删除</span>
            <span v-if="noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[conStr]" class="el-button-text-color" style="margin: 0 5px" @click="watchTer(scope.row)">终端监控</span>
            <span v-if="noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[`log801_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 5px" @click="downloadLog(scope.row)">下载日志</span>
            <span v-if="deviceSetObj[formSearchData.deviceType] && authorityObj[`one801_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 5px" @click="showDeviceSet(scope.row.deviceId)">终端配置</span>
          </template>
        </el-table-column>
      </el-table>
      <!--end-->
      <!--分页-->
      <page-info :pageInfo="pageInfo"></page-info>
      <!--end-->
    </div>
    <!--设备升级-->
    <el-dialog title="终端升级" :visible.sync="deviceParam.deviceFormVisible" :show-close="false" width="780px" :close-on-click-modal="false">
      <device-update :deviceModel="formSearchData.deviceType" @cancelDeviceUpdate="cancelDeviceUpdate" @deviceUpdate="deviceUpdate" :deptId="formSearchData.deptId" :deptData="deptData" :deptList="deptList"  ref="device_update" v-if="deviceParam.deviceFormVisible"></device-update>
    </el-dialog>
    <!--end-->
    <!--设备升级-->
    <el-dialog title="下载日志" :visible.sync="logParam.logFormVisible" :show-close="false" width="580px" :close-on-click-modal="false">
      <log-down-load @cancelLogDown="cancelLogDown" @logDown="logDown" :deviceId="deviceId" ref="log801_down" v-if="logParam.logFormVisible"></log-down-load>
    </el-dialog>
    <!--end-->
    <!--终端监控-->
    <el-dialog custom-class="zdjk" center title="终端监控" :visible.sync="terminal.visible" width="490px" :close-on-click-modal="false">
      <el-form label-width="130px">
        <el-form-item label="信息获取时间：">
          <span class="spanColor">{{terminal.dataInfo.localTime}}</span>
        </el-form-item>
        <el-form-item label="网络延迟监测：">
          <span class="spanColor">{{terminal.dataInfo.netTime}}</span>
        </el-form-item>
        <el-form-item label="设备内存：">
          <span class="spanColor">{{terminal.dataInfo.totalMemorySize}}</span>
        </el-form-item>
        <el-form-item label="已使用内存：">
          <span class="spanColor">{{terminal.dataInfo.usedMemorySize}}</span>
        </el-form-item>
        <el-form-item label="终端截图：">
          <img :src="terminal.dataInfo.screenShot" style="width: 200px;height: 100px;">
        </el-form-item>
        <el-form-item label="版本信息：">
          <div v-if="formSearchData.deviceType === 'wnVoiceGateway'">
            <div class="versionDiv">主程序：{{terminal.dataInfo.appVersion}}</div>
            <div class="versionDiv">终端硬件：{{terminal.dataInfo.hardwareVersion}}</div>
            <div class="versionDiv">操作系统：{{terminal.dataInfo.systemVersion}}</div>
          </div>
          <div v-else-if="formSearchData.deviceType === 'wnToiletExtension' || formSearchData.deviceType === 'wnCorridorLatticeScreen'">
            <div class="versionDiv">主程序：{{terminal.dataInfo.appVersion}}</div>
          </div>
          <div v-else>
            <div class="versionDiv">主程序：{{terminal.dataInfo.appVersion}}</div>
            <div class="versionDiv">安卓中台：{{terminal.dataInfo.upbsVersion}}</div>
            <div class="versionDiv">呼叫程序：{{terminal.dataInfo.callVersion}}</div>
            <div class="versionDiv">权限程序：{{terminal.dataInfo.authVersion}}</div>
            <div class="versionDiv">终端硬件：{{terminal.dataInfo.hardwareVersion}}</div>
            <div class="versionDiv">操作系统：{{terminal.dataInfo.systemVersion}}</div>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--end-->
    <!--终端重启-->
    <el-dialog center title="重启终端" :visible.sync="rebootDevice.visible" width="490px" :close-on-click-modal="false">
      <el-form ref="rebootDevice" label-width="130px" :rules="rules" :model="rebootDevice.form">
        <el-form-item label="重启类型：" prop="rebootType">
          <el-radio-group v-model="rebootDevice.form.rebootType">
            <el-radio :label=1>立刻重启</el-radio>
            <el-radio :label=2>定时重启</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="rebootDevice.form.rebootType===2" label="选择时间：" prop="time">
          <el-date-picker
            v-model="rebootDevice.form.time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择重启时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btnDiv">
        <el-button type="primary" @click="reloadDevice">确 认</el-button>
      </div>
    </el-dialog>
    <!--end-->
    <!--loading-->
    <el-dialog top="15%" center title="提示" :visible.sync="watchLoading" width="400px" :show-close="watchClose" :close-on-click-modal="false">
      <div style="height: 60px; text-align: center">{{msgContent}}</div>
    </el-dialog>
  </div>
</template>

<script>
import { $getDepartTree, GetBed, GetRoom } from '../../../api/tdms/departmentApi'
import PageInfo from '../../../components/tdms/PageInfoA10'
import DeviceUpdate from '../../../components/tdms/DeviceUpdateA10'
import SortType from '../../../components/tdms/SortType'
import LogDownLoad from '../../../components/tdms/LogDownLoadA10'
import WWebSocket from '../../../assets/tdms/js/websocket.js'
import BaseManage from '../../../assets/tdms/mixins/BaseManage'
import { PatientDictionary } from '../../../assets/tdms/js/Dictionary801.js'
import { AxiosApi, AxiosJsonApi } from '../../../api/tdms/http'
import { ResultMsg, MsgShow } from '../../../assets/tdms/js/Message'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  mixins: [BaseManage],
  props: ['params'],
  components: {
    PageInfo, DeviceUpdate, LogDownLoad, Treeselect, SortType
  },
  inject: ['checkMoreAuthority'],
  data () {
    return {
      loading: false,
      searchTime: '',
      deceiveFun: false,
      deceiveSet: false,
      orgLevel: '',
      typeObj: {},
      orgId: '',
      branchVis: false,
      branchData: {
        appVersion: '',
        systemVersion: ''
      },
      terminal: {
        visible: false,
        dataInfo: {}
      },
      rebootDevice: {
        visible: false,
        form: {
          time: '',
          rebootType: 1
        }
      },
      statusOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 0,
          label: '失败'
        },
        {
          value: 1,
          label: '成功'
        }
      ],
      regionObj: {},
      deptObj: {},
      deviceParam: {
        deviceFormVisible: false
      },
      logParam: {
        logFormVisible: false
      },
      formSearchData: {
        startTime: '',
        endTime: '',
        deviceType: '',
        deptId: null,
        onLineStatus: '',
        contain: 1,
        lastUpStatus: ''
      },
      delFun: [],
      noneFun: [],
      roomShow: ['orDoorWayExtension', 'orExtension', 'orCoordinationExtension', 'orTalkRoomExtension'],
      bedShow: [],
      czHidden: [],
      deviceSetObj: {
        'orDoorWayExtension': '/zdpzConfig_fakeRouter',
        'orPortableTerminal': '/zdpzConfig_fakeRouter',
        'orNurseStationMainframe': '/zdpzConfig_fakeRouter',
        'orExtension': '/zdpzConfig_fakeRouter',
        'orCoordinationExtension': '/zdpzConfig_fakeRouter',
        'orTalkRoomExtension': '/zdpzConfig_fakeRouter',
        'orEntranceGuardExtension': '/zdpzConfig_fakeRouter',
        'orStatusScreen': '/zdpzConfig_fakeRouter',
        'orInfoPromptScreen': '/zdpzConfig_fakeRouter',
        'orBulletinScreen': '/zdpzConfig_fakeRouter'
      },
      deviceId: '',
      modelName: '',
      queryOnlineList: [{ key: '1', label: '在线' }, { key: '0', label: '离线' }],
      deptList: [],
      rules: {
        time: [
          { required: true, trigger: 'blur', message: '请选择重启时间' }
        ]
      },
      gWebSocket: null,
      url: '/tdms/web-td/device/list',
      multipleSelection: [],
      roomObj: {},
      bedObj: {},
      setUrl: '',
      authorityObj: {},
      authorityArr: [],
      upStr: '',
      conStr: '',
      watchLoading: false,
      msgContent: '正在收集终端数据，请稍后...',
      watchClose: false,
      firstFlag: true
    }
  },
  created () {
    this.formSearchData.deviceType = this.params.deviceType
    // 判断登录端
    this.getLandingEndCode()
  },
  activated () {
    this.primaryId = 'deviceId'
    let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || {}
    let orgId = orgInfo.orgId || ''
    this.orgId = orgId
    this.orgLevel = orgInfo.orgLevel
    this.formSearchData.deviceType = this.params.deviceType
    this.modelName = PatientDictionary[this.params.deviceType]
    this.typeObj = PatientDictionary
    this.upStr = 'update801_' + this.formSearchData.deviceType
    this.conStr = 'control801_' + this.formSearchData.deviceType
    // 手术协同分机标识过长 兼容一下
    if (this.formSearchData.deviceType === 'orCoordinationExtension' || this.formSearchData.deviceType === 'orNurseStationMainframe'
      || this.formSearchData.deviceType === 'orEntranceGuardExtension') {
      this.upStr = 'up801_' + this.formSearchData.deviceType
      this.conStr = 'con801_' + this.formSearchData.deviceType
    }
    this.authorityArr = [this.upStr, 'mod801_' + this.formSearchData.deviceType,
      'del801_' + this.formSearchData.deviceType, 'set801_' + this.formSearchData.deviceType,
      this.conStr, 'log801_' + this.formSearchData.deviceType,
      'reload801_' + this.formSearchData.deviceType,
      'one801_' + this.formSearchData.deviceType] // 终端升级 编辑 删除 批量配置 终端监控 下载日志 终端重启 终端配置
    if (this.firstFlag) {
      this.queryDeptList()
    } else {
      this.onSearchSubmit('page')
    }

    /* if (this.roomShow.join(',').indexOf(this.formSearchData.deviceType) > -1 || this.bedShow.join(',').indexOf(this.formSearchData.deviceType) > -1) {
      this.getRooms()
    } else {
      this.onSearchSubmit('page')
    } */
    // 延迟加载
    this.$nextTick(() => {
      // 判断是否有动作权限
      this.getListAuthority()
    })
  },
  methods: {
    // 配置更改
    changeSet (status, deviceId) {
      AxiosApi('/tdms/web-td/device/updateSingleStatus', {}, 'PUT', {
        deviceId: deviceId,
        singleStatus: status
      }).then(res => {
        ResultMsg(res, '设置', () => {
          this.onSearchSubmit('page')
        })
      })
    },
    // 处理房间数据
    formatRoom (row) {
      if (row.positions !== null) {
        let data = JSON.parse(row.positions)
        return this.roomObj[data.roomId] || data.roomName
      }
      return ''
    },
    // 改变时间
    changeDate () {
      if (this.searchTime === null) {
        this.formSearchData.startTime = ''
        this.formSearchData.endTime = ''
      } else {
        this.formSearchData.startTime = this.searchTime[0]
        this.formSearchData.endTime = this.searchTime[1]
      }
    },
    // 请求房间
    getRooms (deptId) {
      GetRoom({
        page: 1,
        size: 1000,
        deptId: deptId
      }).then(res => {
        if (res.status === 200) {
          let d = res.data.list === null ? [] : res.data.list
          d.forEach((item) => {
            this.roomObj[item.roomId] = item.roomName
          })
        }
        this.getBeds()
      })
    },
    // 请求床位
    getBeds () {
      GetBed({
        page: 1,
        size: 1000
      }).then(res => {
        if (res.status === 200) {
          let d = res.data.list === null ? [] : res.data.list
          d.forEach((item) => {
            this.bedObj[item.bedId] = item.bedName
          })
        }
        this.onSearchSubmit('page')
      })
    },
    // 终端功能
    showDeviceFun () {
      if (this.multipleSelection.length < 1) {
        MsgShow('warning', '请选择至少一条终端信息！')
        return false
      }
      this.deceiveFun = true
    },
    // 终端配置
    showDeviceSet (deviceId) {
      /* if (this.multipleSelection.length < 1) {
       MsgShow('warning', '请选择至少一条终端信息！')
       return false
     }
      let str = ''
      this.multipleSelection.forEach((item) => {
        str += item.deviceId + ','
      })
      str = str.substr(0, str.length - 1)
      localStorage.setItem('deviceId', str) */
      this.setUrl = this.deviceSetObj[this.formSearchData.deviceType]
      this.$router.push({ path: this.setUrl, query: { deviceType: this.formSearchData.deviceType, deviceId: deviceId, deptId: this.formSearchData.deptId } })
      // this.deceiveSet = true
    },
    showDeviceUpdate () {
      if (this.multipleSelection.length < 1) {
        MsgShow('warning', '请选择至少一条终端信息！')
        return false
      }
      this.deviceParam.deviceFormVisible = true
    },
    // 处理床位数据
    formatBed (row) {
      if (row.positions !== null) {
        let data = JSON.parse(row.positions)
        return this.bedObj[data.bedId] || data.bedName
      }
      return ''
    },
    // 切换图片
    changeImgLeave () {
      this.$refs.statusImg.src = '/static/tdms/img/icon_explain_default.png'
    },
    // 切换图片
    changeImgEnter () {
      this.$refs.statusImg.src = '/static/tdms/img/icon_explain_slip.png'
    },
    formatDept (row) {
      return row.deptName === null ? '' : row.deptName
    },
    // 状态
    formatStatus (row) {
      if (row.status === null) {
        return ''
      } else {
        let obj = JSON.parse(row.status)
        let status = obj.onLineStatus
        if (status === '0' || status === 0) {
          return '离线'
        }
        if (status === '1' || status === 1) {
          return '在线'
        }
      }
    },
    // 设备升级
    deviceUpdate () {
      let data = this.$refs.device_update.form
      // data.deptId = data.deptId.join(',')
      let str = ''
      this.multipleSelection.forEach((item) => {
        str += item.deviceId + ','
      })
      data.deviceId = str.substring(0, str.length - 1)
      data.deviceType = this.formSearchData.deviceType
      data.orgId = this.orgId
      AxiosJsonApi('/tdms/web-td/device/promote', data).then(res => {
        if (res.status === 200) {
          ResultMsg(res, '设备升级请求已经发送', this.cancelDeviceUpdate)
        } else {
          MsgShow('error', res.desc, 3000)
        }
      })
    },
    cancelDeviceUpdate () {
      this.deviceParam.deviceFormVisible = false
    },
    // 日志下载
    logDown () {
      let data = this.$refs.log801_down.form
      data.deviceType = this.formSearchData.deviceType
      let type = location.protocol
      let _linkUrl = `ws://${window.location.host}/tdmsWs/web-td/websocket`
      if (type === 'https:') {
        _linkUrl = `wss://${window.location.host}/wss/web-td/websocket`
      }
      // let _linkUrl = `ws://192.168.18.114:8182/web-td/logWebsocket/${data.startTime}/${data.endTime}/${data.logType}/${data.deviceId}`
      let para = {
        linkUrl: _linkUrl,
        deviceId: this.deviceId,
        startTime: data.startTime,
        endTime: data.endTime,
        logType: data.logType,
        reqType: 2,
        orgId: this.orgId,
        deviceType: this.params.deviceType
      }
      WWebSocket.conn(para, this.gWebSocket, this)
    },
    cancelLogDown () {
      this.logParam.logFormVisible = false
    },
    // 获取科室列表
    queryDeptList () {
      $getDepartTree({
        size: '999999',
        page: '1'
      }).then(res => {
        if (res.status === 200) {
          this.firstFlag = false
          let t = res.data.list || []
          t.unshift({
            id: 'default',
            label: '无科室'
          })
          let temp = JSON.stringify(t)
          temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '')
          this.deptList = JSON.parse(temp)
          if (this.landingEndCode === 'OPEX') {
            this.deptData = JSON.parse(temp)
            this.formSearchData.deptId = this.deptData[0].id
          }
          this.onSearchSubmit('page')
        }
      })
    },
    reload () {
      this.searchTime = ''
      this.formSearchData.lastUpStatus = ''
      this.formSearchData.startTime = ''
      this.formSearchData.endTime = ''
      this.pageInfo.currentPage = 1
      // 兼容运维端
      if (this.landingEndCode === 'OPEX') {
        this.formSearchData.deptId = this.deptData[0].id
      } else {
        this.formSearchData.deptId = null
      }
      this.formSearchData.onLineStatus = ''
      this.getData()
    },
    // 删除
    delDo (row) {
      this.del(`/tdms/web-td/device/${row.deviceId}`)
    },
    // 修改
    editInfo (rowData) {
      this.$emit('option-changed', 'add', { deviceType: this.formSearchData.deviceType }, rowData)
    },
    // 下载日志
    downloadLog (rowData) {
      this.logParam.logFormVisible = true
      this.deviceId = rowData.deviceId
    },
    // 下载日志
    showDevice (rowData) {
      this.rebootDevice.visible = true
      this.deviceId = rowData.deviceId
    },
    // 终端监控
    watchTer (rowData) {
      this.watchLoading = true
      this.watchClose = false
      this.msgContent = '正在收集终端数据，请稍后...'
      let _linkUrl = `ws://${window.location.host}/tdmsWs/web-td/websocket`
      let type = location.protocol
      if (type === 'https:') {
        _linkUrl = `wss://${window.location.host}/wss/web-td/websocket`
      }
      let para = {
        linkUrl: _linkUrl,
        deviceId: rowData.deviceId,
        reqType: 1,
        orgId: this.orgId,
        deviceType: this.params.deviceType
      }
      WWebSocket.conn(para, this.gWebSocket, this)
      setTimeout(() => {
        if (this.watchLoading) {
          this.watchClose = true
          let status = rowData.status
          if (status === null) {
            status = 0
          } else {
            let obj = JSON.parse(status)
            status = obj.onLineStatus
          }
          if (status === '0' || status === 0) {
            this.msgContent = '终端已经离线，无法收集终端数据，请检查设备状态'
          } else {
            this.msgContent = '终端监控失败，请重新尝试'
          }
        }
      }, 20 * 1000)
    },
    // 重启终端
    reloadDevice () {
      let _linkUrl = `ws://${window.location.host}/tdmsWs/web-td/websocket`
      let type = location.protocol
      if (type === 'https:') {
        _linkUrl = `wss://${window.location.host}/wss/web-td/websocket`
      }
      let para = {
        linkUrl: _linkUrl,
        deviceId: this.deviceId,
        reqType: 3,
        orgId: this.orgId,
        rebootType: this.rebootDevice.form.rebootType,
        time: this.rebootDevice.form.time,
        deviceType: this.params.deviceType
      }
      WWebSocket.conn(para, this.gWebSocket, this)
      MsgShow('success', '系统已发送重启请求，请等待设备重启', 3000)
    }
  }
}
</script>

<style scoped>
.versionDiv{
  min-height: 20px;
  line-height: 20px;
}
</style>
<style lang="scss">
.zdjk{
  .el-dialog__body{
    height: 500px;
    overflow: auto;
  }
}
.zdpz{
  .el-dialog__body{
    height: 600px;
    overflow: auto;
  }
}
</style>
