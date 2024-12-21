<template>
  <div class="typt-list-main">
    <div class="typt-add-container">
      <div class="typt-add-form ifms-add-bed">
        <el-form  :rules="rules" ref="addFormData" class="from" label-width="150px" :model="addFormData">
          <div class="ifms-tit-content" style="margin-top: 0">房间名称设置</div>
          <div class="ifms-add-content">
            <div class="ifms-add-item">
              <div class="ifms-add-column">
                <el-form-item label="是否设置显示位数：" prop="roomShow">
                  <el-radio-group v-uni="actFormKey + 'fangjianshifoushezhixianshiweishu'" v-model="addFormData.roomShow" @change="roomShowSelect">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1" style="margin-left: 30px">是</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="ifms-add-column marginCls">
                <el-form-item v-if="addFormData.roomShow == 1" label="显示位数：" prop="roomNameLength">
                  <el-input v-uni="actFormKey + 'xianshiweishu'" @blur="initRoom" style="width: 100px" placeholder="请输入" v-model="addFormData.roomNameLength" clearable></el-input>
                  <span class="ifms-intro-span">最大可显示4位，如房间总是不满足补0</span>
                </el-form-item>
              </div>
            </div>
            <div class="ifms-add-item">
              <div class="ifms-add-column">
                <el-form-item label="是否有前缀：" prop="roomNamePrefixShow" label-width="110px">
                  <el-radio-group v-uni="actFormKey + 'shifouyouqianzhui'" v-model="addFormData.roomNamePrefixShow" @change="roomPrefixSelect">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1" style="margin-left: 30px">是</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="ifms-add-column marginCls2">
                <el-form-item v-if="addFormData.roomNamePrefixShow == 1" label="前缀：" prop="roomNamePrefix">
                  <el-input v-uni="actFormKey + 'qianzhui'" style="width: 100px" @blur="initRoom" maxlength="10" placeholder="请输入" v-model="addFormData.roomNamePrefix" clearable></el-input>
                  <span class="ifms-intro-span">不包含在显示位数中</span>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="ifms-tit-content">床位名称设置</div>
          <div class="ifms-add-content">
            <div class="ifms-add-item">
              <div class="ifms-add-column">
                <el-form-item label="是否设置显示位数：" prop="bedShow">
                  <el-radio-group v-uni="actFormKey + 'chuagnweishifouxianshiweishu'" v-model="addFormData.bedShow" @change="bedShowSelect">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1" style="margin-left: 30px">是</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="ifms-add-column marginCls">
                <el-form-item v-if="addFormData.bedShow == 1" label="显示位数：" prop="bedNameLength">
                  <el-input v-uni="actFormKey + 'chuagnweixianshiweishu'" style="width: 100px" placeholder="请输入" v-model="addFormData.bedNameLength" clearable></el-input>
                  <span class="ifms-intro-span">最大可显示4位，如床位总是不满足补0</span>
                </el-form-item>
              </div>
            </div>
            <div class="ifms-add-item">
              <div class="ifms-add-column">
                <el-form-item label="是否有前缀：" prop="bedNamePrefixShow" label-width="110px">
                  <el-radio-group v-uni="actFormKey + 'chuagnweishifouyouqianzhui'" v-model="addFormData.bedNamePrefixShow" @change="bedPrefixSelect">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1" style="margin-left: 30px">是</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="ifms-add-column marginCls2">
                <el-form-item v-if="addFormData.bedNamePrefixShow == 1" label="前缀：" prop="bedNamePrefix">
                  <el-input v-uni="actFormKey + 'chuagnweiqianzhui'" style="width: 100px" maxlength="10" placeholder="请输入" v-model="addFormData.bedNamePrefix" clearable></el-input>
                  <span class="ifms-intro-span">不包含在显示位数中</span>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="ifms-tit-content">数量设置</div>
          <div class="ifms-add-content">
            <el-form-item label="科室：" label-width="110px" v-if="landingEndCode === 'OPEX'" prop="deptId" style="float: left;" class="deptCls">
              <treeselect v-uni="actFormKey + 'keshi'" @input="checkDeptId" placeholder="请选择" v-model="addFormData.deptId" noResultsText="无匹配数据" noOptionsText="暂无数据" :multiple="false" :options="deptData" noChildrenText="无子节点"/>
            </el-form-item>
            <el-form-item v-else-if="orgLevel!==2" label-width="110px" label="关联部门：" prop="deptId" style="float: left;">
              <el-select v-uni="actFormKey + 'guanlianbumen'" v-model="addFormData.deptId" placeholder="请选择" filterable>
                <el-option v-for="item in dataDeptInfoList" :label="item.deptName" :value="item.deptId" :key="item.deptId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="110px" label="房间数量：" prop="roomCount" style="float: left;">
              <el-input v-uni="actFormKey + 'fangjianshuliang'" @blur="initRoom" style="width: 100px" maxlength="4" placeholder="请输入" v-model="addFormData.roomCount" clearable></el-input>
            </el-form-item>
            <el-form-item label-width="110px" label="床位数量：" prop="bedCount" style="clear:both;">
              <span style="color: #666666">每个房间&emsp;</span>
              <el-input v-uni="actFormKey + 'chuangweishuliang'"  maxlength="4" style="width: 150px;" placeholder="请输入" v-model="addFormData.bedCount" clearable></el-input>
              <span style="color: #666666">&emsp;张床，共<span>{{bedAllCount}}</span>张床</span>
              <div class="add-condition" @click="addItem">添加条件</div>
            </el-form-item>
            <div class="numSet" v-if="conditionArr.length>0">
              <div class="ifms-condition-item" v-for="(item, index) in conditionArr" :key="index">
                <span class="condition-span">其中</span>
                <el-select v-uni="actFormKey + 'qizhong-' + index" v-if="selectVis" class="selectCls" :remote-method="remoteMethod" remote v-model="item.roomId" placeholder="请选择" filterable @change="initSelected">
                  <div v-for="item in roomFilter" :key="item.id">
                    <el-option v-if="!selectedObj[item.id]" :label="item.label" :value="item.id" ></el-option>
                  </div>
                </el-select>
                <span class="condition-room">房间</span>
                <el-input v-uni="actFormKey + 'shuliang-' + index" type="number" style="width: 100px" placeholder="请输入" v-model="item.bedCount" clearable @blur="initBedCount"></el-input>
                <span class="condition-bed">张床</span>
                <i class="el-icon-delete remove" @click="removeItem(index)"></i>
              </div>
            </div>
            <div v-if="conditionArr.length>0" style="height: 32px"></div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button v-uni="actKey + 'add'" type="primary" @click="onSubmit()" :loading="addVis">保存</el-button>
    </div>
  </div>
</template>

<script>
import { AxiosApi, AxiosJsonApi } from '../../../api/passport/http'
import { MsgShow, ResultMsg } from '../../../assets/passport/js/Message'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: {
    Treeselect
  },
  data () {
    let validateCount = (rule, value, callback) => {
      let roomNameLength = this.addFormData.roomNameLength || 99999
      roomNameLength = isNaN(roomNameLength) ? 99999 : roomNameLength
      if (!(/(^[1-9]\d*$)/.test(value))) {
        callback(new Error('请输入正整数'))
      } else if (parseInt(value) < 1) {
        callback(new Error('房间数量至少为1位！'))
      } else if (parseInt(value) > 9999) {
        callback(new Error('房间数量不能大于9999位！'))
      } else if (value.length > parseInt(roomNameLength)) {
        callback(new Error('房间数量的位数必须小于等于房间显示位数！'))
      } else {
        callback()
      }
    }
    let validateBedCount = (rule, value, callback) => {
      let bedStr = this.initBedCount()
      bedStr = isNaN(bedStr) ? 0 : bedStr
      if (!(/(^[1-9]\d*$)/.test(value))) {
        callback(new Error('请输入正整数'))
      } else if (parseInt(value) < 1) {
        callback(new Error('床位数量至少为1位！'))
      } else if (bedStr > 9999) {
        callback(new Error('床位数量不能大于9999位！'))
      } else {
        callback()
      }
    }
    let validateRoomShowCount = (rule, value, callback) => {
      if (!(/(^[1-9]\d*$)/.test(value))) {
        callback(new Error('请输入正整数'))
      } else if (parseInt(value) > 4) {
        callback(new Error('显示位数最大可显示4位！'))
      } else if (parseInt(value) < this.addFormData.roomCount.length) {
        callback(new Error('显示位数必须大于或等于房间数量的位数！'))
      } else {
        callback()
      }
    }
    let validateBedShowCount = (rule, value, callback) => {
      let bedStr = this.initBedCount()
      bedStr = isNaN(bedStr) ? 0 : bedStr
      if (!(/(^[1-9]\d*$)/.test(value))) {
        callback(new Error('请输入正整数'))
      } else if (parseInt(value) > 4) {
        callback(new Error('显示位数最大可显示4位！'))
      } else if (parseInt(value) < bedStr.toString().length) {
        callback(new Error('显示位数必须大于或等于床位数量的位数！'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      addVis: false,
      dataDeptInfoList: [],
      orgLevel: '',
      addFormData: {
        roomCount: '',
        deptId: null,
        bedCount: '',
        roomShow: 0,
        roomNameLength: '',
        roomNamePrefixShow: 0,
        roomNamePrefix: '',
        bedShow: 0,
        bedNameLength: '',
        bedNamePrefixShow: 0,
        bedNamePrefix: ''
      },
      modelName: '批量创建',
      rules: {
        deptId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        bedCount: [
          { required: true, message: '请输入床位数量', trigger: 'blur' },
          { pattern: /^[1-9][0-9]*$/, message: '请输入正整数！', trigger: 'blur' },
          { validator: validateBedCount, trigger: 'blur' }
        ],
        roomCount: [
          { required: true, message: '请输入房间数量', trigger: 'blur' },
          { pattern: /^[1-9][0-9]*$/, message: '请输入正整数！', trigger: 'blur' },
          { validator: validateCount, trigger: 'blur' }
        ],
        roomShow: [
          { required: true, message: '请设置显示位数', trigger: 'change' }
        ],
        roomNameLength: [
          { validator: validateRoomShowCount, trigger: 'blur' }
        ],
        roomNamePrefixShow: [
          { required: true, message: '请设置是否有前缀', trigger: 'change' }
        ],
        roomNamePrefix: [
          { required: true, message: '请输入前缀', trigger: 'blur' },
          { max: 10, message: '前缀长度不能超过10位', trigger: 'blur' }
        ],
        bedShow: [
          { required: true, message: '请设置显示位数', trigger: 'change' }
        ],
        bedNameLength: [
          { validator: validateBedShowCount, trigger: 'blur' }
        ],
        bedNamePrefixShow: [
          { required: true, message: '请设置是否有前缀', trigger: 'change' }
        ],
        bedNamePrefix: [
          { required: true, message: '请输入前缀', trigger: 'blur' },
          { max: 10, message: '前缀长度不能超过10位', trigger: 'blur' }
        ]
      },
      url: '/ifms/web-org/batch/room/bed',
      conditionArr: [],
      roomData: [],
      selectedObj: {},
      selectVis: true,
      roomObj: {},
      bedAllCount: 0,
      deptData: [],
      landingEndCode: '',
      roomFilter: [],
      actFormKey:  'piliangchuangjian__',
      actKey: 'piliangchuangjian_'
    }
  },
  mounted () {
    let dataDeptInfoList = JSON.parse(localStorage.getItem('dataDeptInfoList')) || []
    let orgInfo = JSON.parse(localStorage.getItem('orgInfo')) || []
    this.orgLevel = orgInfo.orgLevel
    this.dataDeptInfoList = dataDeptInfoList
    this.getLandingEndCode()
  },
  methods: {
    // 检测部门是否有值
    checkDeptId () {
      this.$nextTick(() => {
        let dom = document.querySelector('.deptCls .el-form-item__error')
        if (this.addFormData.deptId !== null && this.addFormData.deptId) {
          if (dom) {
            dom.style.display = 'none'
          }
        } else {
          if (dom) {
            dom.style.display = 'block'
          }
          this.addFormData.deptId = null
          this.$refs.addFormData.validateField('deptId')
        }
      })
    },
    // 查询方法
    remoteMethod (query) {
      if (query !== '') {
        this.roomFilter = this.roomData.filter(item => {
          return item.label.indexOf(query) > -1
        })
      } else {
        this.roomFilter = this.getRoomData()
      }
    },
    // 获取登录应用标识
    getLandingEndCode () {
      let codeStr = localStorage.getItem('selectLandingEndInfo')
      if (codeStr !== '' && codeStr !== null) {
        let tempInfo = JSON.parse(codeStr)
        this.landingEndCode = tempInfo.landingEndCode
        // this.landingEndCode = 'OPEX'
      }
      this.getDeptList()
    },
    // 计算床位总数
    initBedCount () {
      let count = 0
      let bedCount = isNaN(this.addFormData.bedCount) ? 0
        : this.addFormData.bedCount === '' ? 0 : parseInt(this.addFormData.bedCount)
      let conCount = 0
      this.conditionArr.forEach((val) => {
        let c = isNaN(val.bedCount) ? 0
          : val.bedCount === '' ? 0 : parseInt(val.bedCount)
        conCount += c
      })
      this.roomData.forEach((item) => {
        if (this.selectedObj[item.id]) {
        } else {
          count += bedCount
        }
      })
      count += conCount
      this.bedAllCount = count
      return count
    },
    // 查询部门
    getDeptList () {
      if (this.landingEndCode === 'OPEX') {
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
      }
    },
    // 形成已经选择的数据
    initSelected () {
      this.selectedObj = {}
      this.conditionArr.forEach((item) => {
        this.selectedObj[item.roomId] = 'yes'
      })
    },
    // 形成房间
    initRoom () {
      this.selectedObj = {}
      this.conditionArr = []
      this.roomData = []
      this.roomObj = {}
      this.bedAllCount = 0
      if (this.addFormData.roomCount === '' || this.addFormData.roomCount === 0 || isNaN(this.addFormData.roomCount)) {
        return false
      }
      let roomNameLength = ''
      let roomCount = parseInt(this.addFormData.roomCount)
      let prefix = ''
      if (this.addFormData.roomShow === 1) {
        if (this.addFormData.roomNameLength === '') {
          roomNameLength = ''
        } else if (isNaN(this.addFormData.roomNameLength)) {
          return false
        } else if (parseInt(this.addFormData.roomNameLength) < this.addFormData.roomCount.length) {
          return false
        } else if (parseInt(this.addFormData.roomNameLength) > 4) {
          return false
        } else {
          roomNameLength = parseInt(this.addFormData.roomNameLength)
        }
      }
      if (this.addFormData.roomNamePrefixShow === 1) {
        prefix = this.addFormData.roomNamePrefix
      }
      for (let i = 0; i < roomCount; i++) {
        if (roomNameLength === '') {
          this.roomData.push({
            id: i + 1,
            label: prefix + (i + 1)
          })
          this.roomObj[i + 1] = prefix + (i + 1)
        } else {
          let roomName = i + 1
          if ((i + 1).toString().length < roomNameLength) {
            let str = ''
            let len = roomNameLength - (i + 1).toString().length
            for (let j = 0; j < len; j++) {
              str += '0'
            }
            roomName = str + (i + 1)
          }
          this.roomData.push({
            id: i + 1,
            label: prefix + roomName
          })
          this.roomObj[i + 1] = prefix + roomName
        }
      }
      this.roomFilter = this.getRoomData()
      this.selectVis = false
      this.$nextTick(() => {
        this.selectVis = true
      })
      this.initBedCount()
    },
    // 添加条件
    addItem () {
      this.conditionArr.push({
        roomId: '',
        bedCount: ''
      })
      this.roomFilter = this.getRoomData()
    },
    // 获取前一百条
    getRoomData () {
      let temp = []
      for (let i = 0; i < 500; i++) {
        if (!this.roomData[i]) continue
        temp.push(this.roomData[i])
      }
      return temp
    },
    removeItem (index) {
      delete this.selectedObj[this.conditionArr[index].roomId]
      this.conditionArr.splice(index, 1)
      this.selectVis = false
      this.$nextTick(() => {
        this.selectVis = true
        this.initBedCount()
      })
    },
    // 房间显示位切换
    roomShowSelect () {
      if (this.addFormData.roomShow === 0) {
        this.addFormData.roomNameLength = ''
      }
    },
    // 前缀切换
    roomPrefixSelect () {
      if (this.addFormData.roomNamePrefixShow === 0) {
        this.addFormData.roomNamePrefix = ''
      }
    },
    // 床位显示位切换
    bedShowSelect () {
      if (this.addFormData.bedShow === 0) {
        this.addFormData.bedNameLength = ''
      }
    },
    // 床位前缀位切换
    bedPrefixSelect () {
      if (this.addFormData.bedNamePrefixShow === 0) {
        this.addFormData.bedNamePrefix = ''
      }
    },
    // 保存设置
    onSubmit () {
      this.$refs['addFormData'].validate((valid) => {
        if (valid) {
          let methodType = 'POST'
          let obj = { ...this.addFormData }
          let roomList = []
          obj.roomCount = parseInt(obj.roomCount)
          obj.bedCount = parseInt(obj.bedCount)
          if (obj.roomNameLength !== '') {
            obj.roomNameLength = parseInt(obj.roomNameLength)
          }
          if (obj.bedNameLength !== '') {
            obj.bedNameLength = parseInt(obj.bedNameLength)
          }
          let flag = false
          // 获取条件数据
          this.conditionArr.forEach((item) => {
            if (item.roomId === '' || item.bedCount === '') {
              flag = true
              return
            }
            roomList.push({
              roomName: this.roomObj[item.roomId],
              bedCount: item.bedCount
            })
          })
          if (flag) {
            MsgShow('warning', '存在房间为空或者床位数量为空的条件数据！', 3000)
            return false
          }
          obj.roomList = roomList
          AxiosJsonApi(this.url, obj, methodType).then(res => {
            ResultMsg(res, this.modelName, () => {
              this.addFormData = {
                roomCount: '',
                deptId: null,
                bedCount: '',
                roomShow: 0,
                roomNameLength: '',
                roomNamePrefixShow: 0,
                roomNamePrefix: '',
                bedShow: 0,
                bedNameLength: '',
                bedNamePrefixShow: 0,
                bedNamePrefix: ''
              }
              this.conditionArr = []
              this.roomData = []
              this.roomFilter = []
              this.selectedObj = {}
              this.selectVis = true
              this.roomObj = {}
              this.bedAllCount = 0
            })
            if (res.status !== 200) {
              this.addVis = false
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
  .ifms-add-bed{
    width: 100%;
    padding-top: 33px;
    padding-left: 22px;
    padding-right: 22px;
  }
  .ifms-tit-content{
    font-size: 20px;
    color: #333333;
    padding-left: 5px;
    margin-top: 36px;
  }
  .ifms-add-content{
    margin-top: 18px;
    min-height: 158px;
    padding-top: 32px;
    background-color: #FAFAFA;
    box-sizing: border-box;
  }
  .ifms-add-item{
    display: flex;
    padding-left: 15px;
  }
  .marginCls{
    margin-left: 70px;
  }
  .marginCls2{
    margin-left: 110px;
  }
  .ifms-intro-span{
    color: #999999;
    margin-left: 7px;
  }
  .condition-span{
    color: #333333;
    font-size: 14px;
    margin-right: 10px;
  }
  .condition-room{
    color: #333333;
    font-size: 14px;
    margin-left: 9px;
    margin-right: 28px;
  }
  .condition-bed{
    color: #333333;
    font-size: 14px;
    margin-left: 9px;
  }
  .plus{
    font-size: 26px;
    color:#1e87f0;
    margin-left: 12px;
    vertical-align: middle;
    cursor: pointer;
  }
  .remove{
    font-size: 18px;
    color: #999999;
    margin-left: 10px;
    vertical-align: middle;
    cursor: pointer;
  }
  .remove:hover{
    color:#1E87F0;
  }
  .numSet{
    display: flex;
    width: 96%;
    background: #ffffff;
    margin-left: auto;
    margin-right: auto;
    padding: 10px;
    margin-top: 20px;
    flex-wrap: wrap;
  }
  .ifms-condition-item{
    height: 50px;
    line-height: 46px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .ifms-condition-item:hover{
    background: #F5F5F5;
  }
  .add-condition{
    display: inline-block;
    cursor: pointer;
    color: #1E87F0;
    margin-left: 25px;
    height: 28px;
    width: 78px;
    line-height: 28px;
  }
  .add-condition:hover{
    color: #ffffff;
    background-color: #1E87F0;
    border-radius: 2px;
    text-align: center;
  }
</style>
<style lang="scss">
  /* 谷歌 */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  /* 火狐 */
  input[type="number"]{
    -moz-appearance: textfield;
  }
  .selectCls{
    .el-input--small{
      width: 100px;
    }
  }
  .ifms-add-bed{
    .el-form-item__error{
      min-width: 300px;
    }
  }
</style>
