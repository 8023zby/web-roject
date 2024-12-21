<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">编辑设备</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="130px">
          <el-form-item label="终端id：">
            <el-input v-model="addForm.deviceAppId" disabled></el-input>
          </el-form-item>
          <el-form-item label="终端型号：">
            <el-input v-model="addForm.deviceModel" disabled></el-input>
          </el-form-item>
          <el-form-item label="终端IP：">
            <el-input v-model="addForm.ip" disabled></el-input>
          </el-form-item>
          <el-form-item label="终端号：">
            <el-input v-model="addForm.deviceNum"></el-input>
          </el-form-item>
          <el-form-item label="终端名称：" prop="deviceName">
            <el-input v-model="addForm.deviceName" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="科室：" prop="deptId" class="deptCls">
            <treeselect @change="changeData" placeholder="请选择" v-model="deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptList" noChildrenText="无子节点"/>
          </el-form-item>
          <el-form-item label="房间：" prop="roomId" v-if="deviceType==='wnDoorWayExtension'||deviceType==='irWardTV'">
            <el-select @change="changeRoom" placeholder="请选择" v-model="addForm.positions.roomId" filterable clearable>
              <el-option v-for="item in roomData" :label="item.roomName" :value="item.roomId"
                         :key="item.roomId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="床位：" prop="bedId" v-if="deviceType==='wnBedSideExtension'||deviceType==='wnBedHeadExtension' || deviceType==='rvVisitExtension'">
            <el-select @change="changeBed" placeholder="请选择" v-model="addForm.positions.bedId" filterable clearable>
              <el-option v-for="item in bedData" :label="item.bedName" :value="item.bedId"
                         :key="item.bedId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="位置：" prop="positionStr" class="deptCls">
            <treeselect :disable-branch-nodes="true" :default-expand-level="10" placeholder="请选择" v-model="addForm.positions.positionStr" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="positionList" noChildrenText="无子节点">
              <div slot="value-label" slot-scope="{ node }">{{ node.raw.allName }}</div>
            </treeselect>
          </el-form-item>
          <div v-show="A10.join(',').indexOf(deviceType) === -1">
            <el-form-item label="开关机规则：">
              <el-button size="small" type="primary" round @click="logFormVisible=true">点击设置开关机规则</el-button>
            </el-form-item>
            <el-form-item label="分辨率：">
              <el-input v-model="addForm.params.resolution" disabled></el-input>
            </el-form-item>
            <el-form-item label="安装角度：">
              <el-select placeholder="请选择" v-model="addForm.params.rotate" clearable>
                <el-option v-for="item in rotateData" :label="item.label" :value="item.id"
                           :key="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="屏幕亮度：">
              <el-slider v-model="addForm.params.brighter" :min="50" :max="100" :format-tooltip="formatTooltip"></el-slider>
            </el-form-item>
            <el-form-item label="终端音量：">
              <el-slider v-model="addForm.params.volume" :min="1" :max="15"></el-slider>
            </el-form-item>
          </div>
          <el-form-item label="备注：" prop="remark">
            <el-input maxlength="20" show-word-limit placeholder="请输入" type="textarea" :rows="4" v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--开关机规则-->
      <el-dialog title="设置开关机规则" :visible.sync="logFormVisible" width="800px" :close-on-click-modal="false">
        <on-off-rule @cancelDialog="cancelDialog" @onOff="onOff" :onOffRule="addForm.onOffRule" ref="onOff" v-if="logFormVisible"></on-off-rule>
      </el-dialog>
      <!--end-->
    </div>
    <div class="typt-add-footer">
      <el-button @click="reloadUrl">取 消</el-button>
      <el-button type="primary" @click="submitForm">保 存</el-button>
    </div>
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { $getDepartTree, $getLocationsTree, GetBed, GetRoom } from '../../../api/tdms/departmentApi'
import BaseManage from '../../../assets/tdms/mixins/BaseManage'
import { AxiosApi } from '../../../api/tdms/http'
import OnOffRule from '../../../components/tdms/OnOffRule'
export default {
  props: ['modifyData', 'params'],
  mixins: [BaseManage],
  components: {
    Treeselect, OnOffRule
  },
  watch: {
    deptId (val) {
      this.addForm.deptId = val
      this.addForm.positions.bedId = ''
      this.addForm.positions.roomId = ''
      this.getRooms()
      this.getBeds()
    }
  },
  data () {
    return {
      logFormVisible: false,
      roomData: [],
      bedData: [],
      bedRoomObj: {},
      rotateData: [{
        id: 0,
        label: '0度'
      },
      {
        id: 90,
        label: '90度'
      },
      {
        id: 180,
        label: '180度'
      }, {
        id: 270,
        label: '270度'
      }],
      deptId: null,
      bedObj: {},
      roomObj: {},
      deptObj: {},
      addForm: {
        deviceAppId: '',
        onOffRule: [],
        deptId: null,
        ip: '',
        deviceNum: '',
        deviceModel: '',
        deviceId: '',
        deviceName: '',
        positions: {
          positionStr: null,
          bedId: '',
          roomId: ''
        },
        params: {
          resolution: null,
          volume: null,
          brighter: null,
          rotate: ''
        },
        remark: ''
      },
      A10: ['wnCorridorLatticeScreen', 'rvVisitExtension', 'wnMedicalMainframe', 'wnBedHeadExtension', 'wnBedSideExtension', 'wnDoorWayExtension', 'wnDutyMainframe', 'wnEntranceGuard', 'wnToiletExtension', 'wnCorridorScreen', 'wnMedicalAudioAssistant', 'wnVoiceGateway'],
      positionObj: {},
      deviceType: '',
      positionList: [],
      deptList: [],
      modelName: '设备',
      url: '/tdms/web-td/device/',
      rules: {
        deptId: [
          { required: true, message: '请选择科室', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请填写终端名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.deviceType = this.params.deviceType
    this.url = `${this.url + this.modifyData.deviceId}`
    this.deptId = this.modifyData.deptId
    this.queryDeptList()
    this.queryPositionList()
  },
  methods: {
    // 切换部门后切换房间和床位数据
    changeData () {
      if (this.deviceType === 'wnBedSideExtension' || this.deviceType === 'wnBedHeadExtension' || this.deviceType === 'rvVisitExtension') {
        this.addForm.bedId = ''
        this.getBeds()
      }
      if (this.deviceType === 'wnDoorWayExtension' || this.deviceType === 'irWardTV') {
        this.addForm.roomId = ''
        this.getRooms()
      }
    },
    // 床位切换
    changeBed () {
      if (this.addForm.positions.bedId === '') {
        this.addForm.positions.positionStr = ''
      } else {
        let t = this.bedData.find(item => {
          return item.bedId === this.addForm.positions.bedId
        })
        this.addForm.positions.positionStr = t.area
      }
    },
    // 床位切换
    changeRoom () {
      if (this.addForm.positions.roomId === '') {
        this.addForm.positions.positionStr = ''
      } else {
        let t = this.roomData.find(item => {
          return item.roomId === this.addForm.positions.roomId
        })
        this.addForm.positions.positionStr = t.area
      }
    },
    // 请求房间
    getRooms (deptId) {
      if (!deptId) {
        deptId = this.addForm.deptId
      }
      if (deptId === '' || deptId === null) {
        return false
      }
      this.roomData = []
      GetRoom({
        page: 1,
        size: 1000,
        deptId: deptId
      }).then(res => {
        if (res.status === 200) {
          let d = res.data.list === null ? [] : res.data.list
          this.roomData = d
          d.forEach((item) => {
            this.roomObj[item.roomId] = item.roomName
          })
        }
      })
    },
    // 请求床位
    getBeds (deptId) {
      if (!deptId) {
        deptId = this.addForm.deptId
      }
      if (deptId === '' || deptId === null) {
        return false
      }
      this.bedData = []
      GetBed({
        page: 1,
        size: 1000,
        deptId: this.addForm.deptId
      }).then(res => {
        if (res.status === 200) {
          let d = res.data.list === null ? [] : res.data.list
          this.bedData = d
          d.forEach((item) => {
            this.bedObj[item.bedId] = item.bedName
            this.bedRoomObj[item.bedId] = item.roomId
          })
        }
      })
    },
    // 取消弹窗
    cancelDialog () {
      this.logFormVisible = false
    },
    // 保存数据
    onOff (data) {
      this.logFormVisible = false
      this.addForm.onOffRule = data
    },
    // 请求数据
    getDetailData () {
      AxiosApi('/tdms/web-td/device/' + this.modifyData.deviceId, {}, 'GET').then(res => {
        this.initModifyData(res.data)
      })
    },
    // 格式化
    formatTooltip (value) {
      if (value === null) {
        value = 0
      }
      return `${value}%`
    },
    // 获取部门
    queryDeptList () {
      $getDepartTree({
        size: '999999',
        page: '1'
      }).then(res => {
        if (res.status === 200) {
          let temp = JSON.stringify(res.data.list || [])
          temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '')
          this.deptList = JSON.parse(temp)
          this.getDeptChild(this.deptList)
        }
      })
    },
    // 查找子集
    getDeptChild (data) {
      data.forEach((item) => {
        this.deptObj[item.id] = item.label
        if (item.children && item.children.length > 0) {
          this.getDeptChild(item.children)
        }
      })
    },
    // 获取位置
    queryPositionList () {
      $getLocationsTree({}).then(res => {
        if (res.status === 200) {
          let temp = JSON.stringify(res.data.list || [])
          temp = temp.replace(/locationId/g, 'id').replace(/locationName/g, 'label').replace(/,"children":null/g, '')
          this.positionList = JSON.parse(temp)
          this.getChild(this.positionList)
          this.getDetailData()
        }
      })
    },
    // 查找子集
    getChild (data, name = '') {
      data.forEach((item) => {
        item.allName = name + item.label
        this.positionObj[item.id] = item.allName
        if (item.children && item.children.length > 0) {
          this.getChild(item.children, item.allName)
        }
      })
    },
    // 编辑修改信息
    initModifyData (data) {
      let obj = { ...data }
      let positions = obj.positions === null ? '{}' : obj.positions
      let params = obj.params === null ? '{}' : obj.params
      let onOffRule = obj.onOffRule === null ? '[]' : (obj.onOffRule === undefined ? '[]' : obj.onOffRule)
      if (positions !== '') {
        obj.positions = JSON.parse(positions)
        if (!obj.positions.positionStr) {
          obj.positions.positionStr = null
        }
        if (!obj.positions.bedId) {
          obj.positions.bedId = ''
          obj.positions.roomId = obj.positions.roomId || ''
          obj.positions.bedName = ''
        }
        if (!obj.positions.roomId) {
          obj.positions.roomId = ''
          obj.positions.roomName = ''
        }
      }
      if (params !== '') {
        obj.params = JSON.parse(params)
        if (obj.params.brighter !== null && obj.params.brighter !== '') {
          obj.params.brighter = parseFloat(obj.params.brighter)
        }
        if (obj.params.volume !== null && obj.params.volume !== '') {
          obj.params.volume = parseFloat(obj.params.volume)
        }
        if (obj.params.rotate !== null && obj.params.rotate !== '') {
          obj.params.rotate = parseFloat(obj.params.rotate)
        }
      }
      if (onOffRule !== '') {
        obj.onOffRule = JSON.parse(onOffRule)
      }
      this.addForm = obj
      this.getBeds()
      this.getRooms()
    },
    // 提交修改
    submitForm () {
      this.$refs['addForm'].validate((valid) => {
        let obj = { ...this.addForm }
        obj.deptName = this.deptObj[obj.deptId]
        if (typeof obj.positions.bedId !== 'undefined' && obj.positions.bedId !== null && obj.positions.bedId !== '') {
          obj.positions.roomId = this.bedRoomObj[obj.positions.bedId]
          obj.positions.roomName = this.roomObj[obj.positions.roomId]
          obj.positions.bedName = this.bedObj[obj.positions.bedId]
        }
        if (typeof obj.positions.roomId !== 'undefined' && obj.positions.roomId !== null && obj.positions.roomId !== '') {
          obj.positions.roomName = this.roomObj[obj.positions.roomId]
        }
        obj.positions = JSON.stringify(obj.positions)
        obj.params = JSON.stringify(obj.params)
        obj.onOffRule = JSON.stringify(obj.onOffRule)
        obj.origin = 'web'
        if (valid) {
          this.saveDataDo(obj, 'modify')
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style>
  .vue-treeselect__menu-container{
    z-index: 999999 !important;
  }
</style>
