<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">编辑设备</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="130px">
          <el-form-item label="终端名称：" prop="deviceName">
            <el-input v-model="addForm.deviceName" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="设备id：">
            <el-input v-model="addForm.deviceAppId" disabled></el-input>
          </el-form-item>
          <el-form-item label="设备号：">
            <el-input v-model="addForm.deviceNum"></el-input>
          </el-form-item>
          <el-form-item label="终端型号：">
            <el-input v-model="addForm.deviceModel" disabled></el-input>
          </el-form-item>
          <el-form-item label="终端IP：">
            <el-input v-model="addForm.ip" disabled></el-input>
          </el-form-item>
          <el-form-item label="部门：" prop="deptId" class="deptCls">
            <treeselect placeholder="请选择" v-model="deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptList" noChildrenText="无子节点"/>
          </el-form-item>
          <el-form-item label="区域：" prop="positionStr" class="deptCls">
            <treeselect :disable-branch-nodes="true" :default-expand-level="10" placeholder="请选择" v-model="positionStr" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="positionList" noChildrenText="无子节点">
              <div slot="value-label" slot-scope="{ node }">{{ node.raw.allName }}</div>
            </treeselect>
          </el-form-item>
          <el-form-item label="房间：" prop="roomId">
            <el-select placeholder="请选择" v-model="roomId" filterable clearable>
              <el-option v-for="item in roomData" :label="item.roomName" :value="item.roomId"
                         :key="item.roomId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="床位：" prop="bedId">
            <el-select placeholder="请选择" v-model="addForm.bedId" filterable clearable>
              <el-option v-for="item in bedData" :label="item.bedName" :value="item.bedId"
                         :key="item.bedId">
              </el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="屏幕亮度：">
            <el-slider v-model="addForm.params.brighter" :min="50" :max="100" :format-tooltip="formatTooltip"></el-slider>
          </el-form-item>-->
          <el-form-item label="备注：" prop="remark">
            <el-input maxlength="20" show-word-limit placeholder="请输入" type="textarea" :rows="4" v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
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
export default {
  props: ['modifyData', 'params'],
  mixins: [BaseManage],
  components: {
    Treeselect
  },
  watch: {
    deptId (val) {
      if (!this.isFirst) {
        this.addForm.deptId = val
        this.addForm.bedId = ''
        this.roomId = ''
        this.addForm.roomId = ''
        this.addForm.positions.bedId = ''
        this.addForm.positions.roomId = ''
        this.getRooms()
        this.bedData = []
      }
    },
    positionStr (val) {
      if (!this.isFirst) {
        this.addForm.positionStr = val
        this.addForm.positions.positionStr = val
        this.roomId = ''
        this.addForm.bedId = ''
        this.addForm.roomId = ''
        this.addForm.positions.bedId = ''
        this.addForm.positions.roomId = ''
        this.getRooms()
        this.bedData = []
      }
    },
    roomId (val) {
      if (!this.isFirst) {
        this.addForm.roomId = val
        this.addForm.positions.roomId = val
        this.addForm.bedId = ''
        this.addForm.positions.bedId = ''
        this.getBeds()
      }
    }
  },
  data () {
    return {
      isFirst: true,
      roomData: [],
      bedData: [],
      bedRoomObj: {},
      deptId: null,
      positionStr: null,
      roomId: '',
      bedObj: {},
      roomObj: {},
      deptObj: {},
      addForm: {
        deviceAppId: '',
        deviceNum: '',
        deptId: null,
        ip: '',
        deviceModel: '',
        deviceId: '',
        deviceName: '',
        positionStr: '',
        bedId: '',
        roomId: '',
        positions: {
          positionStr: null,
          bedId: '',
          roomId: ''
        },
        params: {
          resolution: null,
          volume: null,
          brighter: 100,
          rotate: ''
        },
        remark: ''
      },
      positionObj: {},
      deviceType: '',
      positionList: [],
      deptList: [],
      modelName: '设备',
      url: '/tdms/web-td/device/',
      rules: {
        deptId: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        positionStr: [
          { required: true, message: '请选择区域', trigger: 'blur' }
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
    // 暂时改回老的终端类型
    if (this.deviceType === 'piBedSideExtension' || this.deviceType === 'wnBedSideExtension' || this.deviceType === 'wnBedHeadExtension') {
      let obj = {
        roomId: [
          { required: true, message: '请选择房间', trigger: 'blur' }
        ],
        bedId: [
          { required: true, message: '请选择床位', trigger: 'blur' }
        ]
      }
      this.rules = { ...this.rules, ...obj }
    } else if (this.deviceType === 'wnDoorWayExtension' || this.deviceType === 'wnDutyMainframe') {
      let obj = {
        roomId: [
          { required: true, message: '请选择房间', trigger: 'blur' }
        ]
      }
      this.rules = { ...this.rules, ...obj }
    }
  },
  methods: {
    // 格式化
    formatTooltip (value) {
      if (value === null) {
        value = 0
      }
      return `${value}%`
    },
    // 请求房间
    getRooms () {
      this.roomData = []
      GetRoom({
        page: 1,
        size: 1000,
        deptId: this.addForm.deptId,
        area: this.addForm.positions.positionStr
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
    getBeds () {
      this.bedData = []
      GetBed({
        page: 1,
        size: 1000,
        roomId: this.addForm.positions.roomId
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
    // 请求数据
    getDetailData () {
      AxiosApi('/tdms/web-td/device/' + this.modifyData.deviceId, {}, 'GET').then(res => {
        this.initModifyData(res.data)
      })
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
        } else {
          obj.positionStr = obj.positions.positionStr
          this.positionStr = obj.positions.positionStr
        }
        if (!obj.positions.bedId) {
          obj.positions.bedId = ''
          obj.positions.roomId = obj.positions.roomId || ''
          obj.positions.bedName = ''
          obj.bedId = ''
        } else {
          obj.bedId = obj.positions.bedId
        }
        if (!obj.positions.roomId) {
          obj.positions.roomId = ''
          obj.positions.roomName = ''
        } else {
          obj.roomId = obj.positions.roomId
          this.roomId = obj.positions.roomId
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
      console.log(this.addForm.bedId)
      this.getBeds()
      this.getRooms()
      this.$nextTick(() => {
        this.isFirst = false
      })
    },
    // 提交修改
    submitForm () {
      this.$refs['addForm'].validate((valid) => {
        let obj = { ...this.addForm }
        obj.deptName = this.deptObj[obj.deptId]
        obj.positions.bedId = obj.bedId
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
