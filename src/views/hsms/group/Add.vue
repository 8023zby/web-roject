<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{titMsg}}分组</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width: 85%;padding-top: 40px;">
        <el-form :model="addFormData" :rules="rules" ref="addForm" label-width="130px">
          <el-form-item :label="name+'姓名：'" prop="accountId">
            <el-select style="width: 300px;"
                       v-model="addFormData.accountId" placeholder="请选择">
              <!--el-option label="请选择" value=""></el-option-->
              <el-option v-for="(item, index) in userData"
                         :key="index"
                         :label="item.empName"
                         :value="item.empId"/>
            </el-select>
          </el-form-item>
          <el-form-item  label="床位列表：" prop="bed_list">
            <bed-list :srcData="bedListData"
                      :disabledBed="disabledBed"
                      @getBedOrRoomVal="setBedVal"
                      :checkData="checkBed"
                      :emptyCheck="emptyCheck"
                      />
          </el-form-item>
          <el-form-item  label="房间列表：">
            <bed-list :srcData="roomListData"
                      :disabledBed="disabledRoom"
                      :checkData="checkRoom"
                      @getBedOrRoomVal="setRoomVal"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="reloadUrl">取消</el-button>
      <el-button type="primary" @click="saveData" :loading="addVis">确定</el-button>
    </div>
  </div>
</template>

<script>
import BaseManage from '../../../assets/hsms/mixins/BaseManage'
import BedList from '../../../components/hsms/BedList'
import { GetModelType, GetRoom, GetBed, GetNurseUserLeader } from '../../../api/hsms'

export default {
  name: 'NurseGroupAdd',
  props: ['modifyData', 'params'],
  components: {
    'bed-list': BedList
  },
  mixins: [BaseManage],
  data () {
    var checkBedList = (rule, value, callback) => {
      if (!this.addFormData.objList) {
        this.emptyCheck = true
        return callback(new Error('请选择床位'))
      }
      this.emptyCheck = false
      callback()
    }
    return {
      userObj: {},
      name: '护士',
      modelName: '分组',
      titMsg: '添加',
      url: '/hsms/web-hs/nursing-group',
      actFlag: 'add',
      businessType: 'NURSE',
      roomListData: [],
      bedListData: [],
      userData: [],
      checkBed: [],
      checkRoom: [],
      disabledBed: '',
      disabledRoom: '',
      emptyCheck: false,
      addFormData: {
        accountName: '',
        accountId: '',
        objList: '',
        roomList: '',
        nurseMode: 'BED'
      },
      rules: {
        accountId: [
          { required: true, message: `请选择${name}姓名！`, trigger: 'change' }
        ],
        bed_list: [
          { required: true, validator: checkBedList, trigger: 'blur' }
        ]
      }
    }
  },
  // 初始化数据
  async created () {
    let obj = this.modifyData
    let key = obj['groupId'] || ''
    this.businessType = this.params.businessType
    if (this.businessType === 'DOCTOR') {
      this.name = '医生'
    }
    if (this.actFlag === 'add') {
      this.initDisabledBed()
    }
    await this.getUser()
    this.getBed()
    this.getRoom()
    if (key) {
      this.actFlag = 'modify'
      this.titMsg = '编辑'
      let temp = { ...obj }
      // 床位
      let strBed = temp.objList
      let arrBed = strBed.split(',')
      arrBed.forEach((item) => {
        this.checkBed.push({
          objId: item
        })
      })
      // 房间
      let strRoom = temp.roomList
      let arrRoom = strRoom.split(',')
      arrRoom.forEach((item) => {
        this.checkRoom.push({
          objId: item
        })
      })
      this.addFormData = temp
      this.initDisabledBed()
    }
  },
  methods: {
    // 初始化不能选择的床位和房间
    initDisabledBed () {
      let tableData = this.params.tableData
      let strBed = ','
      let strRoom = ','
      tableData.forEach((item) => {
        if (this.actFlag === 'add') {
          strBed += item.objList + ','
          strRoom += item.roomList + ','
        } else {
          if (this.addFormData.groupId !== item.groupId) {
            strBed += item.objList + ','
            strRoom += item.roomList + ','
          }
        }
      })
      this.disabledBed = strBed
      this.disabledRoom = strRoom
    },
    // 放床位数据
    setBedVal (item) {
      let str = ''
      item.forEach((val) => {
        str += val.objId + ','
      })
      this.addFormData.objList = str.substr(0, str.length - 1)
    },
    // 放房间数据
    setRoomVal (item) {
      let str = ''
      item.forEach((val) => {
        str += val.objId + ','
      })
      this.addFormData.roomList = str.substr(0, str.length - 1)
    },
    // 保存数据
    saveData () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          let saveData = { ...this.addFormData }
          saveData.accountName = this.userObj[saveData.accountId] || ''
          this.saveDataDo(saveData, this.actFlag)
        }
      })
    },
    // 获取用户
    async getUser () {
      let userType = 'nurseTeamLeader'
      if (this.businessType === 'DOCTOR') {
        userType = 'medicalTeamLeader'
      }

      await GetNurseUserLeader(userType).then(res => {
        this.userData = res
        res.forEach((item) => {
          this.userObj[item.empId] = item.empName
        })
      })
    },
    // 获取床位
    getBed () {
      GetBed().then(res => {
        res.forEach((item, index) => {
          this.bedListData.push({
            objId: item.bedId,
            objName: item.bedName,
            sort: item.sort
          })
        })
      })
    },
    // 获取房间
    getRoom () {
      GetRoom().then(res => {
        res.forEach((item, index) => {
          this.roomListData.push({
            objId: item.roomId,
            objName: item.roomName
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .smallInput {
    width: 150px;
  }

  .iconAddCls {
    font-size: 24px;
    color: #409EFF;
    cursor: pointer;
    margin-left: 10px;
    vertical-align: middle;
  }

  .iconDelCls {
    font-size: 24px;
    color: #F56C6C;
    cursor: pointer;
    margin-left: 10px;
    vertical-align: middle;
  }

  .typt-add-footer button {
    /*padding: 6px 16px !important;*/
    /*border-radius: 2px !important;*/
  }

  /deep/ .el-input--small .el-input__inner {
    height: 34px;
  }
</style>
