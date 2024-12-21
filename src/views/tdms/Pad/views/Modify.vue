<template>
  <div class="pad-container">
    <el-form :model="addForm" ref="addForm" :rules="rules" label-width="240px">
      <el-form-item label="护理单元：" prop="deptId">
        <span :class="{'pad-span':true,'span-padding':deptName!==''}">{{deptName}}</span>
        <el-button type="warning" class="pad-btn-sel" @click="setDeptVisible = true">选择</el-button>
      </el-form-item>
      <el-form-item label="安装房间：" prop="roomId" v-if="deviceType==='wnDoorWayExtension'||deviceType==='irWardTV'">
        <span :class="{'pad-span':true,'span-padding':roomName!==''}">{{roomName}}</span>
        <el-button type="warning" class="pad-btn-sel" v-if="addForm.deptId===''" disabled>选择</el-button>
        <el-button type="warning" class="pad-btn-sel" @click="checkRooms" v-else>选择</el-button>
      </el-form-item>
      <el-form-item label="安装床位：" prop="bedId" v-if="deviceType==='wnBedSideExtension'||deviceType==='wnBedHeadExtension'">
        <span :class="{'pad-span':true,'span-padding':bedName!==''}">{{bedName}}</span>
        <el-button type="warning" class="pad-btn-sel" v-if="addForm.deptId===''" disabled>选择</el-button>
        <el-button type="warning" class="pad-btn-sel" @click="checkBeds" v-else>选择</el-button>
      </el-form-item>
      <!--<el-form-item label="设为广播机：">
        <el-switch
          v-model="addForm.gbj"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>-->
    </el-form>
    <div class="pad-footer">
      <el-button type="primary" class="pad-btn-primary" @click="saveData" round>保存</el-button>
      <el-button type="danger" class="pad-btn-danger" round>恢复出厂设置</el-button>
    </div>
    <!--选择床位-->
    <el-dialog title="选择安装床位：" :visible.sync="setBedVisible" width="1320px" :close-on-click-modal="false">
      <bed-select ref="checkBed" v-if="setBedVisible" :srcData="bedData" :selectedOldBeds="selectedOldBeds"></bed-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setBedVisible = false" round class="pad-cancel">取 消</el-button>
        <el-button type="primary" @click="saveBedData" round class="pad-primary">确 认</el-button>
      </div>
    </el-dialog>
    <!--end-->
    <!--选择房间-->
    <el-dialog title="选择安装房间：" :visible.sync="setRoomVisible" width="1320px" :close-on-click-modal="false">
      <room-select ref="checkRoom" v-if="setRoomVisible" :srcData="roomData" :selectedOldRooms="selectedOldRooms"></room-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoomVisible = false" round class="pad-cancel">取 消</el-button>
        <el-button type="primary" @click="saveRoomData" round class="pad-primary">确 认</el-button>
      </div>
    </el-dialog>
    <!--end-->
    <!--选择护理单元-->
    <el-dialog title="选择护理单元：" :visible.sync="setDeptVisible" width="1320px" :close-on-click-modal="false">
      <check-dept ref="checkDept" v-if="setDeptVisible" :srcData="deptData"></check-dept>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setDeptVisible = false" round class="pad-cancel">取 消</el-button>
        <el-button type="primary" @click="saveDeptData" round class="pad-primary">确 认</el-button>
      </div>
    </el-dialog>
    <!--end-->
  </div>
</template>

<script>
import BedSelect from '../components/BedSelect'
import RoomSelect from '../components/RoomSelect'
import CheckDept from '../components/CheckDept'
import { $getDepartTree, GetBed, GetRoom } from '../assets/js/departmentApi'
import { AxiosApi, AxiosJsonApi } from '../../../../api/tdms/http'
import { ResultMsg } from '../../../../assets/tdms/js/Message'
export default {
  name: 'Modify',
  components: {
    BedSelect, CheckDept, RoomSelect
  },
  data () {
    return {
      setBedVisible: false,
      setRoomVisible: false,
      deviceId: '',
      deviceType: '',
      orgId: '',
      setDeptVisible: false,
      deptName: '',
      bedName: '',
      roomName: '',
      selectedOldBeds: '',
      selectedOldRooms: '',
      addForm: {
        deptId: '',
        bedId: '',
        roomId: '',
        positions: {
          bedId: '',
          roomId: '',
          bedName: '',
          roomName: ''
        }
      },
      deptData: [],
      bedData: [],
      roomData: [],
      deptObj: {},
      bedObj: {},
      roomObj: {},
      rules: {
        bedId: [
          { required: true, message: '请选择床位', trigger: 'change' }
        ],
        roomId: [
          { required: true, message: '请选择房间', trigger: 'change' }
        ],
        deptId: [
          { required: true, message: '请选择护理单元', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    if (window.androidpims && window.androidpims.getAndroidData) {
      let str = window.androidpims.getAndroidData()
      let obj = JSON.parse(str)
      this.deviceId = obj.deviceId
      this.deviceType = obj.deviceType
      this.orgId = obj.orgId
      console.log('deviceId====' + this.deviceId)
      console.log('deviceType====' + this.deviceType)
      console.log('orgId====' + this.orgId)
      this.getDetailData()
    }
  },
  methods: {
    // 处理护理单元数据
    saveDeptData () {
      this.addForm.deptId = this.$refs.checkDept.deptId
      this.deptName = this.deptObj[this.addForm.deptId] || ''
      this.setDeptVisible = false
    },
    // 处理选择数据
    saveBedData () {
      this.addForm.bedId = this.$refs.checkBed.bedId
      this.bedName = this.bedObj[this.addForm.bedId] || ''
      this.selectedOldBeds = `,${this.addForm.bedId},`
      this.setBedVisible = false
    },
    // 处理选择数据
    saveRoomData () {
      this.addForm.roomId = this.$refs.checkRoom.roomId
      this.roomName = this.roomObj[this.addForm.roomId] || ''
      this.selectedOldRooms = `,${this.addForm.roomId},`
      this.setRoomVisible = false
    },
    // 选择床位
    checkBeds () {
      this.getBeds()
      this.setBedVisible = true
    },
    // 选择房间
    checkRooms () {
      this.getRooms()
      this.setRoomVisible = true
    },
    // 请求房间
    getRooms () {
      if (this.addForm.deptId === '') {
        return false
      }
      GetRoom({
        page: 1,
        size: 1000,
        deptId: this.addForm.deptId,
        orgId: this.orgId
      }).then(res => {
        if (res.status === 200) {
          let d = res.data.list === null ? [] : res.data.list
          this.roomData = d
          d.forEach((item) => {
            this.roomObj[item.roomId] = item.roomName
          })
          this.roomName = this.roomObj[this.addForm.roomId] || ''
        }
      })
    },
    // 请求床位
    getBeds () {
      if (this.addForm.deptId === '') {
        return false
      }
      GetBed({
        page: 1,
        size: 1000,
        deptId: this.addForm.deptId,
        orgId: this.orgId
      }).then(res => {
        if (res.status === 200) {
          let d = res.data.list === null ? [] : res.data.list
          this.bedData = d
          d.forEach((item) => {
            this.bedObj[item.bedId] = item.bedName
          })
          this.bedName = this.bedObj[this.addForm.bedId] || ''
        }
      })
    },
    // 请求护理单元
    getUnit () {
      $getDepartTree({
        size: '999999',
        page: '1',
        orgId: this.orgId
      }).then(res => {
        if (res.status === 200) {
          if (res.data !== null) {
            let d = res.data.list === null ? [] : res.data.list
            this.deptData = d
            this.getChild(d)
            this.deptName = this.deptObj[this.addForm.deptId] || ''
          }
        }
      })
    },
    // 查找子集
    getChild (data) {
      data.forEach((item) => {
        this.deptObj[item.deptId] = item.deptName
        if (item.children && item.children.length > 0) {
          this.getChild(item.children)
        }
      })
    },
    // 请求数据
    getDetailData () {
      AxiosApi('/tdms/app-td/device', {}, 'GET', { orgId: this.orgId, deviceId: this.deviceId }).then(res => {
        this.initModifyData(res.data)
      })
    },
    // 编辑修改信息
    initModifyData (data) {
      if (data !== null) {
        let obj = { ...data }
        if (obj.positions === null || obj.positions === '') {
          obj.positions = '{}'
        }
        let positions = obj.positions
        obj.positions = JSON.parse(positions)
        if (!obj.positions.bedId) {
          obj.positions.bedId = ''
          obj.positions.bedName = ''
        }
        if (!obj.positions.roomId) {
          obj.positions.roomId = ''
          obj.positions.roomName = ''
        }
        obj['bedId'] = obj.positions.bedId
        this.selectedOldBeds = `,${obj.positions.bedId},`
        obj['roomId'] = obj.positions.roomId
        this.selectedOldRooms = `,${obj.positions.roomId},`
        this.addForm = obj
      }
      this.getUnit()
      this.getBeds()
      this.getRooms()
    },
    // 保存数据
    saveData () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          let addData = { ...this.addForm }
          addData.positions.roomName = this.roomName
          addData.positions.bedName = this.bedName
          addData.positions.roomId = this.addForm.roomId
          addData.positions.bedId = this.addForm.bedId
          addData.deptName = this.deptName
          addData.positions = JSON.stringify(addData.positions)
          addData.orgId = this.orgId
          AxiosJsonApi('/tdms/app-td/device/' + addData.deviceId, addData, 'PUT').then(res => {
            if (res.status === 200) {
              if (window.androidpims && window.androidpims.getWebData) {
                window.androidpims.getWebData(JSON.stringify(addData))
              }
            }
            ResultMsg(res, '设置', this.getDetailData)
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.pad-container /deep/{
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background: #f7f7f7;
  padding-top: 230px;
  .el-form-item__error{
    font-size: 18px;
  }
  .span-padding{
    padding-right: 30px;
  }
  .dialog-footer{
    text-align: center;
    .pad-cancel{
      width: 120px;
      border-color: #666666;
      color: #666666;
      padding: 9px 6px;
      font-size: 18px;
    }
    .pad-primary{
      width: 120px;
      border-color: #4597FB !important;
      background: #4597FB !important;
      padding: 9px 6px;
      font-size: 18px;
      margin-left: 60px;
    }
  }
  .el-dialog{
    div{
      box-sizing: border-box;
    }
    border-radius: 10px;
    .el-dialog__header{
      padding-top: 50px;
    }
    .el-dialog__title{
      color: #4094ff;
      padding-left: 62px;
    }
    .el-dialog__close{
      font-size: 24px;
    }
    .el-dialog__body{
      height: 600px;
      overflow: auto;
    }
  }
  .el-form{
    margin-left: 20%;
    .el-form-item__label{
      color: #595959;
      font-size: 24px;
      padding-right: 30px !important;
    }
    .pad-span{
      height: 30px;
      line-height: 30px;
      font-size: 24px;
      color: #595959;
    }
    .pad-btn-sel{
      background: #FF9000 !important;
      width: 100px;
      font-size: 20px;
      padding: 7px !important;
      margin-top: 6px;
    }
    .is-disabled{
      background: #969696 !important;
      border-color: #969696 !important;
    }
    .el-form-item {
      margin-bottom: 40px;
    }
    .el-switch__core {
      width: 80px !important;
      height: 36px;
      border-radius: 20px;
    }
    .el-switch__core:after {
      width: 32px;
      height: 32px;
    }
    .el-switch.is-checked .el-switch__core::after {
      left: 100%;
      margin-left: -34px;
    }
  }
  .pad-footer{
    position: absolute;
    text-align: center;
    width: 100%;
    bottom: 150px;
    .pad-btn-primary{
      background: #3F94FF !important;
      width: 110px;
      font-size: 18px;
      padding: 9px 6px;
    }
    .pad-btn-danger{
      background: #E14D4D !important;
      width: 180px;
      font-size: 18px;
      padding: 9px 6px;
      margin-left: 60px;
    }
  }
}
</style>
