<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">编辑</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form tdms-input-item">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="130px">
          <el-form-item label="护理单元：" prop="deptId" class="deptCls">
            <treeselect style="width: 300px" placeholder="请选择" v-model="deptId"
                        noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false"
                        :options="deptList" noChildrenText="无子节点"/>
          </el-form-item>
          <!-- <el-form-item label="终端id：">
            <el-input v-model="addForm.deviceAppId" disabled></el-input>
          </el-form-item> -->
          <el-form-item label="终端型号：">
            <el-input v-model="addForm.deviceModel" disabled></el-input>
          </el-form-item>
          <el-form-item label="终端IP：">
            <el-input v-model="addForm.ip" disabled></el-input>
          </el-form-item>
          <el-form-item label="终端号：">
            <el-input v-model="addForm.deviceNum" disabled></el-input>
          </el-form-item>
          <el-form-item label="终端名称：" prop="deviceName">
            <el-input v-model="addForm.deviceName" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="房间名：" prop="roomId" v-if="deviceType === 'wnDoorWayExtension'">
            <el-select style="width: 300px" multiple placeholder="请选择" v-model="addForm.roomId" filterable clearable>
              <el-option v-for="item in roomData" :label="item.roomName" :value="item.roomId"
                         :key="item.roomId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房间名：" prop="roomId" v-else-if="roomShow.join(',').indexOf(deviceType)>-1">
            <el-select style="width: 300px" @change="changeRoom" placeholder="请选择" v-model="addForm.roomId" filterable clearable>
              <el-option v-for="item in roomData" :label="item.roomName" :value="item.roomId"
                         :key="item.roomId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="床位名：" prop="bedId" v-if="bedShow.join(',').indexOf(deviceType)>-1">
            <el-select style="width: 300px" placeholder="请选择" v-model="addForm.bedId" filterable clearable>
              <el-option v-for="item in bedData" :label="item.bedName" :value="item.bedId"
                         :key="item.bedId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="areaHidden.join(',').indexOf(deviceType) === -1" label="安装位置："
                        prop="positionStr" class="deptCls">
            <treeselect style="width: 300px" :disable-branch-nodes="true" :default-expand-level="10"
                        placeholder="请选择" v-model="addForm.positions.positionStr" noResultsText="无匹配数据"
                        noOptionsText="暂无数据" :multiple="false" :options="positionList" noChildrenText="无子节点">
              <div slot="value-label" slot-scope="{ node }">{{ node.raw.allName }}</div>
            </treeselect>
          </el-form-item>
          <el-form-item label="广播功能：" prop="remark"
                        v-if="broadCastShow.join(',').indexOf(deviceType)>-1">
            <el-switch v-model="addForm.broadcast"
                       active-color="#1D86EF"
                       inactive-color="#EDEDED"
                       :active-value="1"
                       :inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item label="备注信息：" prop="remark">
            <el-input style="width: 300px" maxlength="100" show-word-limit
                      placeholder="请输入" type="textarea" :rows="4"
                      v-model="addForm.remark"></el-input>
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
      this.addForm.deptId = val
      this.addForm.bedId = ''
      this.addForm.roomId = ''
      this.addForm.positions.bedId = ''
      this.addForm.positions.roomId = ''
      this.getRooms()
      this.getBeds()
    }
  },
  data () {
    return {
      roomData: [],
      bedData: [],
      bedRoomObj: {},
      deptId: null,
      roomObj: {},
      bedObj: {},
      deptObj: {},
      roomShow: ['wnBedHeadExtension', 'wnBedSideExtension', 'wnDoorWayExtension', 'iBedHeadExtension', 'iDoorWayExtension'],
      bedShow: ['wnBedHeadExtension', 'wnBedSideExtension', 'iBedHeadExtension'],
      broadCastShow: ['wnBedHeadExtension', 'wnBedSideExtension', 'wnDoorWayExtension', 'wnCorridorScreen', 'wnEntranceGuard', 'rvVisitExtension', 'wnDutyMainframe', 'iBedHeadExtension', 'iDoorWayExtension'],
      areaHidden: ['wnMedicalAudioAssistant'],
      addForm: {
        deviceAppId: '',
        roomId: '',
        bedId: '',
        broadcast: 0,
        deviceNum: '',
        onOffRule: [],
        deptId: null,
        ip: '',
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
      positionObj: {},
      deviceType: '',
      positionList: [],
      deptList: [],
      modelName: '终端',
      // url: '/tdms/web-td/device/',
      url: '/tdms/mqtt/update',
      rules: {
        deptId: [
          { required: true, message: '请选择护理单元', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请填写终端名称', trigger: 'blur' },
          { min: 1, max: 20, message: '终端名称长度不超过20位', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.deviceType = this.params.deviceType
    // this.url = `${this.url + this.modifyData.deviceId}`
    this.deptId = this.modifyData.deptId
    if (this.bedShow.join(',').indexOf(this.deviceType) > -1) {
      let obj = {
        roomId: [
          { required: true, message: '请选择房间', trigger: 'change' }
        ],
        bedId: [
          { required: true, message: '请选择床位', trigger: 'change' }
        ]
      }
      this.rules = { ...this.rules, ...obj }
    } else if (this.roomShow.join(',').indexOf(this.deviceType) > -1) {
      let obj = {
        roomId: [
          { required: true, message: '请选择房间', trigger: 'change' }
        ]
      }
      this.rules = { ...this.rules, ...obj }
    }
    this.queryDeptList()
    this.queryPositionList()
  },
  methods: {
    // 房间切换
    changeRoom () {
      this.addForm.bedId = ''
      this.addForm.positions.bedId = ''
      this.addForm.positions.positionStr = ''
      if (this.addForm.roomId === '') {
        this.addForm.positions.positionStr = ''
      } else {
        let t = this.roomData.find(item => {
          return item.roomId === this.addForm.roomId
        })
        this.addForm.positions.positionStr = t.area
      }
      this.getBeds()
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
        deptId: this.addForm.deptId,
        roomId: this.addForm.roomId
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
      let url = '/tdms/mqtt/get?deviceId=' + this.modifyData.deviceId
      // let url = '/tdms/web-td/device/' + this.modifyData.deviceId
      AxiosApi(url, {}, 'GET').then(res => {
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
      if (positions !== '') {
        obj.positions = JSON.parse(positions)
        if (!obj.positions.positionStr) {
          obj.positions.positionStr = null
        }
        if (!obj.positions.bedId) {
          obj.positions.bedId = ''
          obj.positions.bedName = ''
        }
        if (!obj.positions.roomId) {
          obj.positions.roomId = ''
          obj.positions.roomName = ''
        }
      }
      if (this.deviceType === 'wnDoorWayExtension') {
        obj.roomId = obj.positions.roomIdList
      } else {
        obj.roomId = obj.positions.roomId
      }
      obj.bedId = obj.positions.bedId
      this.addForm = obj
      this.getRooms()
      this.getBeds()
    },
    // 提交修改
    submitForm () {
      this.$refs['addForm'].validate((valid) => {
        let obj = { ...this.addForm }
        obj.deptName = this.deptObj[obj.deptId]
        if (typeof obj.bedId !== 'undefined' && obj.bedId !== null && obj.bedId !== '') {
          obj.positions.bedId = obj.bedId
          obj.positions.bedName = this.bedObj[obj.positions.bedId]
        }
        if (typeof obj.roomId !== 'undefined' && obj.roomId !== null && obj.roomId !== '') {
          // 门口机房间可以多选
          if (this.deviceType === 'wnDoorWayExtension') {
            let roomName = ''
            obj.positions.roomId = obj.roomId.join(',')
            obj.roomId.forEach(item => {
              roomName += this.roomObj[item] + ','
            })
            obj.positions.roomName = roomName.substr(0, roomName.length - 1)
          } else {
            obj.positions.roomId = obj.roomId
            obj.positions.roomName = this.roomObj[obj.positions.roomId]
          }
        }
        obj.positions = JSON.stringify(obj.positions)
        obj.origin = 'web'
        if (valid) {
          /* obj.status = null
          delete obj.status // 应俊详要求，去掉status字段
          */
          this.saveDataDo(obj, 'modify')
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .vue-treeselect__menu-container{
    z-index: 999999 !important;
  }
  .tdms-input-item{
    padding-top: 40px !important;
    .el-input{
      width: 300px !important;
    }
    .el-form-item__label{
      padding-right: 12px !important;
    }
  }
</style>
