<template>
  <div class="typt-list-main">
    <div class="typt-list-container">
      <!--查询-->
      <el-form class="demo-form-inline" :inline="true">
        <!--运维端-->
        <el-form-item label="科室：" v-if="landingEndCode === 'OPEX'" class="deptAddCls">
          <treeselect placeholder="请选择" v-model="formSearchData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :options="deptList" noChildrenText="无子节点"/>
        </el-form-item>
        <el-form-item label="护理单元：" class="deptCls" v-else-if="orgLevel!==2">
          <treeselect placeholder="请选择" v-model="formSearchData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptList" noChildrenText="无子节点"/>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select size="small" placeholder="请选择" v-model="formSearchData.onLineStatus" clearable>
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
            <el-button type="primary"  icon="el-icon-search" @click="onSearchSubmit" size="small">搜索</el-button>
            <el-button type="text" @click="reload">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!--end-->
      <hr />
      <div class="typt-list-add-div">
        <div class="action_div">
          <sort-type :orderBy="orderBy" @query="queryByOrder" style="float: left"/>
          <el-button v-if="authorityObj[`update_${formSearchData.deviceType}`]" type="primary" size="small" @click="deviceParam.deviceFormVisible = true">设备升级</el-button>
        </div>
      </div>
      <!--列表-->
      <el-table
        :data="tableData"
        stripe
        v-loading="loading"
        height="80%"
      >
    <!--<el-table-column label="序号" width="100" type="index" align="center" :index="indexMethod"></el-table-column>-->
        <el-table-column prop="deviceNum" label="设备号" align="center"></el-table-column>
        <el-table-column prop="deviceName" label="终端名称" align="center"></el-table-column>
        <el-table-column prop="deptName" label="护理单元" align="center" :formatter="formatDept"></el-table-column>
        <el-table-column prop="ip" label="IP地址" align="center"></el-table-column>
        <el-table-column width="150" prop="status" align="center" :formatter="formatStatus">
          <template slot="header">
            <div style="display: flex; justify-content: center; align-items: center;">
              <div style="margin-right: 5px">状态</div>
              <el-tooltip class="item" effect="dark" content="设备更新状态为3分钟一次" placement="bottom">
                <img ref="statusImg" @mouseenter="changeImgEnter" @mouseleave="changeImgLeave" class="img-cls" src="/static/tdms/img/icon_explain_default.png"/>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="positionStr" label="位置" align="center" :formatter="formatPosition"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        <el-table-column prop="lastUpTime" label="最后升级时间" align="center"></el-table-column>
        <el-table-column prop="lastUpStatus" label="最后升级状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.lastUpStatus === null || (scope.row.lastUpStatus !== 0 && scope.row.lastUpStatus !== 1)"></span>
            <el-tag v-else
              :type="scope.row.lastUpStatus === 0 ? 'danger' : 'success'"
              disable-transitions
            >{{scope.row.lastUpStatus === 0?'失败':'成功'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="authorityObj[`mod_${formSearchData.deviceType}`] ||
                               authorityObj[`del_${formSearchData.deviceType}`] ||
                               (noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[`detail_${formSearchData.deviceType}`]) ||
                               (noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[`log_${formSearchData.deviceType}`]) ||
                               (noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[`reload_${formSearchData.deviceType}`]) ||
                               (noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[`control_${formSearchData.deviceType}`])" label="操作" width="420" align="center">
          <template slot-scope="scope">
            <span v-if="authorityObj[`mod_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 10px" @click="editInfo(scope.row)">编辑</span>
            <span v-if="authorityObj[`del_${formSearchData.deviceType}`]" class="el-text-danger" style="margin: 0 10px" @click="delDo(scope.row)">删除</span>
            <span v-if="noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[`detail_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 10px" @click="watchVersion(scope.row)">查看版本</span>
            <span v-if="noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[`log_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 10px" @click="downloadLog(scope.row)">下载日志</span>
            <span v-if="noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[`control_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 10px" @click="watchTer(scope.row)">终端监控</span>
            <span v-if="noneFun.join(',').indexOf(formSearchData.deviceType) == -1 && authorityObj[`reload_${formSearchData.deviceType}`]" class="el-button-text-color" style="margin: 0 10px" @click="showDevice(scope.row)">重启终端</span>
          </template>
        </el-table-column>
      </el-table>
      <!--end-->
      <!--分页-->
      <div class="paginationDiv">
        <!--组件页码显示-->
        <page-info :pageInfo="pageInfo"></page-info>
      </div>
      <!--end-->
    </div>
    <!--设备升级-->
    <el-dialog title="设备升级" :visible.sync="deviceParam.deviceFormVisible" :show-close="false" width="780px" :close-on-click-modal="false">
      <device-update :deviceModel="formSearchData.deviceType" @cancelDeviceUpdate="cancelDeviceUpdate" @deviceUpdate="deviceUpdate" :deptId="formSearchData.deptId" :deptList="deptList"  ref="device_update" v-if="deviceParam.deviceFormVisible"></device-update>
    </el-dialog>
    <!--end-->
    <!--设备升级-->
    <el-dialog title="下载日志" :visible.sync="logParam.logFormVisible" width="680px" :show-close="false" :close-on-click-modal="false">
      <log-down-load @cancelLogDown="cancelLogDown" @logDown="logDown" :deviceId="deviceId" ref="log_down" v-if="logParam.logFormVisible"></log-down-load>
    </el-dialog>
    <!--end-->
    <!--终端监控-->
    <el-dialog custom-class="zdjk" center title="终端监控" :visible.sync="terminal.visible" width="490px" :show-close="false" :close-on-click-modal="false">
      <el-form label-width="130px">
        <el-form-item label="终端IP：">
          <span class="spanColor">{{terminal.dataInfo.ip}}</span>
        </el-form-item>
        <el-form-item label="终端类型：">
          <span class="spanColor">{{typeObj[terminal.dataInfo.deviceType] || terminal.dataInfo.deviceType}}</span>
        </el-form-item>
        <el-form-item label="网络延迟监测：">
          <span class="spanColor">{{terminal.dataInfo.netTime}}</span>
        </el-form-item>
        <el-form-item label="系统版本号：">
          <span class="spanColor">{{terminal.dataInfo.osVersion}}</span>
        </el-form-item>
        <el-form-item label="应用软件版本号：">
          <span class="spanColor">{{terminal.dataInfo.appVersion}}</span>
        </el-form-item>
        <el-form-item label="终端截图：">
          <img :src="terminal.dataInfo.screenShot" style="width: 200px;height: 100px;">
        </el-form-item>
        <el-form-item label="设备内存：">
          <span class="spanColor">{{terminal.dataInfo.totalMemorySize}}</span>
        </el-form-item>
        <el-form-item label="已使用内存：">
          <span class="spanColor">{{terminal.dataInfo.usedMemorySize}}</span>
        </el-form-item>
        <el-form-item label="信息获取时间：">
          <span class="spanColor">{{terminal.dataInfo.localTime}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btnDiv">
        <el-button type="primary" @click="terminal.visible = false">确 认</el-button>
      </div>
    </el-dialog>
    <!--end-->
    <!--终端重启-->
    <el-dialog center title="重启终端" :visible.sync="rebootDevice.visible" width="490px" :show-close="false" :close-on-click-modal="false">
      <el-form ref="rebootDevice" class="typt-add-dialog" label-width="130px" :rules="rules" :model="rebootDevice.form">
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
        <el-button @click="rebootDevice.visible=false">取 消</el-button>
        <el-button type="primary" @click="reloadDevice">确 认</el-button>
      </div>
    </el-dialog>
    <!--end-->
    <!--查看版本-->
    <el-dialog center title="查看版本" :visible.sync="branchVis" width="490px" :show-close="false" :close-on-click-modal="false">
      <el-form label-width="130px">
        <el-form-item label="软件版本：">
          {{branchData.appVersion}}
        </el-form-item>
        <el-form-item label="系统版本：">
          {{branchData.systemVersion}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btnDiv">
        <el-button type="primary" @click="branchVis = false">确 认</el-button>
      </div>
    </el-dialog>
    <!--loading-->
    <el-dialog top="15%" center title="提示" :visible.sync="watchLoading" width="400px" :show-close="watchClose" :close-on-click-modal="false">
      <div style="height: 60px; text-align: center">{{msgContent}}</div>
    </el-dialog>
  </div>
</template>

<script>
import { $getDepartTree, $getLocationsTree } from '../../../api/tdms/departmentApi'
import PageInfo from '../../../components/tdms/PageInfo'
import DeviceUpdate from '../../../components/tdms/DeviceUpdate'
import LogDownLoad from '../../../components/tdms/LogDownLoad'
import WWebSocket from '../../../assets/tdms/js/websocket.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import BaseManage from '../../../assets/tdms/mixins/BaseManage'
import SortType from '../../../components/tdms/SortType'
import { PatientDictionary } from '../../../assets/tdms/js/Dictionary.js'
import { AxiosJsonApi } from '../../../api/tdms/http'
import { ResultMsg, MsgShow } from '../../../assets/tdms/js/Message'
export default {
  mixins: [BaseManage],
  props: ['params'],
  components: {
    PageInfo, Treeselect, DeviceUpdate, LogDownLoad, SortType
  },
  inject: ['checkMoreAuthority'],
  data () {
    return {
       // 分页需要参数
      pageInfo: {
        currentPage: 1,
        size: 100,
        total: 0,
        pageSizes: [100, 500, 1000]
      },
      searchTime: '',
      orgLevel: '',
      orderBy: [
        /* {
          id: 'createTime desc',
          label: '创建时间降序'
        },
        {
          id: 'createTime asc',
          label: '创建时间升序'
        },
        {
          id: 'deviceName desc',
          label: '终端名称降序'
        }, {
          id: 'deviceName asc',
          label: '终端名称升序'
        }, */
        {
          id: 'ip desc',
          label: 'ip降序'
        },
        {
          id: 'ip asc',
          label: 'ip升序'
        },
        {
          id: 'length( ip ) desc',
          label: 'ip数字降序'
        },
        {
          id: 'length( ip ) asc',
          label: 'ip数字升序'
        }],
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
        lastUpStatus: '',
        deviceType: '',
        deptId: null,
        onLineStatus: '',
        orderBy: '',
        contain: 1
      },
      noneFun: ['bnPDA', 'wnToiletExtension', 'wnCorridorLatticeScreen'],
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
      authorityArr: [],
      loading: false,
      watchLoading: false,
      msgContent: '正在收集终端数据，请稍后...',
      watchClose: false,
      firstFlag: true
    }
  },
  created () {
    // 判断登录端
    this.getLandingEndCode()
    this.formSearchData.deviceType = this.params.deviceType
  },
  activated () {
    let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || {}
    let orgId = orgInfo.orgId || ''
    this.orgId = orgId
    this.orgLevel = orgInfo.orgLevel
    this.formSearchData.deviceType = this.params.deviceType
    this.modelName = PatientDictionary[this.params.deviceType]
    this.typeObj = PatientDictionary
    this.authorityArr = ['update_' + this.formSearchData.deviceType, 'mod_' + this.formSearchData.deviceType,
      'del_' + this.formSearchData.deviceType, 'set_' + this.formSearchData.deviceType,
      'control_' + this.formSearchData.deviceType, 'log_' + this.formSearchData.deviceType,
      'reload_' + this.formSearchData.deviceType, 'detail_' + this.formSearchData.deviceType] // 终端升级 编辑 删除 终端配置 终端监控 下载日志 终端重启 查看版本
    if (this.firstFlag) {
      this.queryDeptList()
    } else {
      this.onSearchSubmit('page')
    }
    // 延迟加载
    this.$nextTick(() => {
      // 判断是否有动作权限
      this.getListAuthority()
    })
  },
  methods: {
    // 切换图片
    changeImgLeave () {
      this.$refs.statusImg.src = '/static/tdms/img/icon_explain_default.png'
    },
    // 查询
    onSearchSubmit (act = '') {
      if (act !== 'page') {
        this.pageInfo.currentPage = 1
      }
      localStorage.setItem('tdms_searchDept', this.formSearchData.deptId)
      this.getData()
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
    // 切换图片
    changeImgEnter () {
      this.$refs.statusImg.src = '/static/tdms/img/icon_explain_slip.png'
    },
    queryRegion () {
      $getLocationsTree({}).then(res => {
        this.firstFlag = false
        let temp = JSON.stringify(res.data.list || [])
        temp = temp.replace(/locationId/g, 'id').replace(/locationName/g, 'label').replace(/,"children":null/g, '')
        this.getChild(JSON.parse(temp))
        this.onSearchSubmit('page')
      })
    },
    // 查找子集
    getChild (data, name = '') {
      data.forEach((item) => {
        item.allName = name + item.label
        this.regionObj[item.id] = item.allName
        if (item.children && item.children.length > 0) {
          this.getChild(item.children, item.allName)
        }
      })
    },
    formatPosition (row) {
      let positions = row.positions
      let str = ''
      if (positions !== null && positions !== '') {
        positions = JSON.parse(positions)
        str = this.regionObj[positions.positionStr] || positions.positionStr
      }
      return str
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
      let data = { ...this.$refs.device_update.form }
      data.deptId = data.deptId.join(',')
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
          let t = res.data.list || []
          t.unshift({
            id: 'default',
            label: '无科室'
          })
          let temp = JSON.stringify(t)
          temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '')
          this.deptList = JSON.parse(temp)
          if (this.landingEndCode === 'OPEX') {
            let oldDept = localStorage.getItem('tdms_searchDept')
            if (oldDept !== 'undefined' && oldDept !== null && oldDept !== 'null' && oldDept !== '') {
              this.formSearchData.deptId = oldDept
            } else {
              let deptId = localStorage.getItem('selectDeptId')
              if (deptId === 'null') {
                deptId = ''
              }
              this.formSearchData.deptId = deptId
            }
          }
          this.queryRegion()
        }
      })
    },
    reload () {
      this.searchTime = ''
      this.formSearchData.lastUpStatus = ''
      this.formSearchData.startTime = ''
      this.formSearchData.endTime = ''
      // 兼容运维端
      if (this.landingEndCode === 'OPEX') {
        let deptId = localStorage.getItem('selectDeptId')
        if (deptId === 'null') {
          deptId = ''
        }
        this.formSearchData.deptId = deptId
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
    // 查看版本
    watchVersion (rowData) {
      this.branchData = {
        appVersion: '',
        systemVersion: ''
      }
      if (typeof rowData.versions === 'string') {
        rowData.versions = JSON.parse(rowData.versions)
      } else if (rowData.versions === null) {
        rowData.versions = {}
      }
      // 软件版本
      let _appVersion = rowData.versions.appVersion === undefined ? '无' : rowData.versions.appVersion
      // 系统版本
      let _systemVersion = rowData.versions.systemVersion === undefined ? '无' : rowData.versions.systemVersion

      this.branchData = {
        appVersion: _appVersion,
        systemVersion: _systemVersion
      }
      this.branchVis = true
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
      MsgShow('success', '系统已发送重启请求，请等待设备重启', 300)
    }
  }
}
</script>

<style lang="scss">
  .zdjk{
    .el-dialog__body{
      height: 500px;
      overflow: auto;
    }
  }
</style>
