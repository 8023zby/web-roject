<template>
  <div class="typt-list-main">
    <div class="typt-list-container tdms-container">
      <!--查询-->
      <el-form class="demo-form-inline" :inline="true">
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
      <hr v-if="(authorityObj[`set_${formSearchData.deviceType}`] || authorityObj[upStr])" />
      <div class="typt-list-add-div" v-if="(authorityObj[`set_${formSearchData.deviceType}`] || authorityObj[upStr])">
        <div class="action_div">
          <el-button v-if="deviceSetObj[formSearchData.deviceType] && authorityObj[`set_${formSearchData.deviceType}`]" type="primary" size="small" @click="showDeviceSet('')">终端配置</el-button>
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
        <el-table-column prop="deviceName" label="终端名称" align="center"></el-table-column>
        <el-table-column prop="deviceModel" label="终端型号" align="center"></el-table-column>
        <el-table-column prop="deviceNum" label="终端号" align="center"></el-table-column>
        <el-table-column prop="ip" label="IP地址" align="center"></el-table-column>
        <el-table-column width="100" prop="status" align="center" :formatter="formatStatus">
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
        <el-table-column width="120" prop="lastUpTime" label="最后升级时间" align="center"></el-table-column>
        <el-table-column width="120" prop="lastUpStatus" label="最后升级状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.lastUpStatus === null || (scope.row.lastUpStatus !== 0 && scope.row.lastUpStatus !== 1)"></span>
            <el-tag v-else
                    :type="scope.row.lastUpStatus === 0 ? 'danger' : 'success'"
                    disable-transitions
            >{{scope.row.lastUpStatus === 0?'失败':'成功'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="authorityObj[`mod_${formSearchData.deviceType}`] || authorityObj[`del_${formSearchData.deviceType}`]" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <span v-if="authorityObj[`mod_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 5px" @click="editInfo(scope.row)">编辑</span>
            <span v-if="authorityObj[`del_${formSearchData.deviceType}`]" class="el-text-danger" style="margin: 0 5px" @click="delDo(scope.row)">删除</span>
            <span v-if="deviceSetOneObj[formSearchData.deviceType] && authorityObj[`set_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 5px" @click="showSet(scope.row.deviceId)">终端配置</span>
            <!--<span v-if="noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[conStr]" class="el-button-text-color" style="margin: 0 5px" @click="watchTer(scope.row)">终端监控</span>
            <span v-if="noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[`log_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 5px" @click="downloadLog(scope.row)">下载日志</span>
            <span v-if="deviceSetObj[formSearchData.deviceType] && authorityObj[`one_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 5px" @click="showDeviceSet(scope.row.deviceId)">终端配置</span>-->
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
      <device-update :deviceModel="formSearchData.deviceType" @cancelDeviceUpdate="cancelDeviceUpdate" @deviceUpdate="deviceUpdate" :deptList="deptList"  ref="device_update" v-if="deviceParam.deviceFormVisible"></device-update>
    </el-dialog>
    <!--end-->
    <!--设备升级-->
    <el-dialog title="下载日志" :visible.sync="logParam.logFormVisible" :show-close="false" width="580px" :close-on-click-modal="false">
      <log-down-load @cancelLogDown="cancelLogDown" @logDown="logDown" :deviceId="deviceId" ref="log_down" v-if="logParam.logFormVisible"></log-down-load>
    </el-dialog>
    <!--end-->
    <!--终端监控-->
    <el-dialog custom-class="zdjk" center title="终端监控" :visible.sync="terminal.visible" width="490px" :close-on-click-modal="false">
      <el-form label-width="130px">
        <el-form-item label="信息获取时间：">
          <span class="spanColor">{{terminal.dataInfo.localTime}}</span>
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
  </div>
</template>

<script>
import { $getDepartTree } from '../../../api/tdms/departmentApi'
import PageInfo from '../../../components/tdms/PageInfo'
import DeviceUpdate from '../../../components/tdms/DeviceUpdateA10'
import LogDownLoad from '../../../components/tdms/LogDownLoadA10'
import WWebSocket from '../../../assets/tdms/js/websocket.js'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import BaseManage from '../../../assets/tdms/mixins/BaseManage'
import { PatientDictionary } from '../../../assets/tdms/js/Dictionary.js'
import { AxiosJsonApi } from '../../../api/tdms/http'
import { ResultMsg, MsgShow } from '../../../assets/tdms/js/Message'
export default {
  mixins: [BaseManage],
  props: ['params'],
  components: {
    PageInfo, DeviceUpdate, LogDownLoad
  },
  inject: ['checkMoreAuthority'],
  data () {
    return {
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
        orderBy: '',
        contain: 1,
        lastUpStatus: ''
      },
      deviceSetObj: {
        acGate: '/smartPass/acGate/deviceSettings_fakeRouter'
      },
      deviceSetOneObj: {
        acEntranceGuard: '/smartPass/acGate/accessControl_fakeRouter',
        acGate: '/smartPass/acGate/deviceSettings_fakeRouter'
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
      conStr: ''
    }
  },
  created () {
    this.formSearchData.deviceType = this.params.deviceType
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
    this.upStr = 'update_' + this.formSearchData.deviceType
    this.conStr = 'control_' + this.formSearchData.deviceType
    this.authorityArr = [this.upStr, 'mod_' + this.formSearchData.deviceType,
      'del_' + this.formSearchData.deviceType, 'set_' + this.formSearchData.deviceType,
      this.conStr, 'log_' + this.formSearchData.deviceType,
      'reload_' + this.formSearchData.deviceType,
      'one_' + this.formSearchData.deviceType] // 终端升级 编辑 删除 批量配置 终端监控 下载日志 终端重启 终端配置
    this.queryDeptList()
    this.onSearchSubmit('page')
    // 延迟加载
    this.$nextTick(() => {
      // 判断是否有动作权限
      this.getListAuthority()
    })
  },
  methods: {
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
      this.$router.push({ path: this.setUrl, query: { deviceType: this.formSearchData.deviceType, deviceId: deviceId } })
      // this.deceiveSet = true
    },
    // 设置
    showSet (deviceId) {
      this.$router.push({ path: this.deviceSetOneObj[this.formSearchData.deviceType], query: { deviceType: this.formSearchData.deviceType, deviceId: deviceId } })
    },
    showDeviceUpdate () {
      if (this.multipleSelection.length < 1) {
        MsgShow('warning', '请选择至少一条终端信息！')
        return false
      }
      this.deviceParam.deviceFormVisible = true
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
      let data = this.$refs.log_down.form
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
          let temp = JSON.stringify(res.data.list || [])
          temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '')
          this.deptList = JSON.parse(temp)
        }
      })
    },
    reload () {
      this.searchTime = ''
      this.formSearchData.lastUpStatus = ''
      this.formSearchData.startTime = ''
      this.formSearchData.endTime = ''
      this.formSearchData.deptId = null
      this.formSearchData.onLineStatus = ''
      this.pageInfo.currentPage = 1
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
