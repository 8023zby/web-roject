
import {
  selectDeptInfo,
  selectDeptInfoData,
  formatter,
  getAllDeptList,
  newGetSelectData,
  getDeptInfo
} from '@/assets/wnms/utils/common'
import * as msgPushApi from '@/api/wnms/msgManage/msgPush'
export default {
  data () {
    return {
      gridTemplist: [],
      deviceTypeName: {
        'bedHead': '床头分机',
        'bedSide': '床旁分机',
        'PDA': '医护人员',
        'corridor': '走廊显示屏',
        'touchScreen': '触屏护理信息看板',
        'room': '门口分机'
      },
      deptList:[]
    }
  },
  mounted () {
   let orgId =  getDeptInfo().orgId
    msgPushApi.getNursinglIist(orgId).then((res) => { 
      if (res.status == 200) {    
        this.deptList =  newGetSelectData({
          data: res.data, // array
          params: {
            value: 'deptId', // el-select 中的value 的值
            label: 'deptName' // el-select 中的label  名称
          }
        }) || []
      }
    })
    
  },
  methods: {
    // 获取床位列表
    getBedList () {
       let _this = this
      let id = null
      if (getDeptInfo() != null) {
        id = getDeptInfo().orgId
      }
      msgPushApi.getBedList({
        deptId: this.selectDeptInfo(),
        orgId: id || ''
      }).then((res) => {
        if (res.status === 200) {
          _this.checkData.bedData = Object.assign({}, res.data)
          this.Bedbulid()
        }
      })
    },
    Bedbulid () {
      let diviceRrr = {
        room: [],
        voice: [],
        PDA: [],
        touchScreen: [],
        corridor: [],
        bedHead: [],
        bedSide: []
      }
      for (let c in this.checkData.bedData) {
        for (let o of this.checkData.bedData[c]) {
          switch (c) {
            case 'bedHead':
              diviceRrr.bedHead.push({
                id: o.patientId,
                name: o.bedName
              })
              break
            case 'bedSide':
              diviceRrr.bedSide.push({
                id: o.patientId,
                name: o.bedName
              })
              break
            case 'room':
              diviceRrr.room.push({
                id: o.roomId,
                name: o.roomName
              })
              break
            case 'voice':
              diviceRrr.voice.push({
                id: o.empId,
                name: o.empName
              })
              break
            case 'PDA':
              diviceRrr.PDA.push({
                id: o.empId,
                name: o.empName
              })
              break
            case 'touchScreen':
              diviceRrr.touchScreen.push({
                id: o.deviceId,
                name: o.deviceName
              })
              break
            case 'corridor':
              diviceRrr.corridor.push({
                id: o.deviceId,
                name: o.deviceName
              })
              break
          }
        }
      }
      let obj = {}
      for (let d in diviceRrr) {
        if (diviceRrr[d].length > 0) { 
          obj[d] = diviceRrr[d]
        }
      }
    
      this.checkData.bedList = obj
        
    },
    // 获取护理单元ID
    selectDeptInfo () {
      return getDeptInfo().deptId
    },
   
    formatter () {
      return formatter(selectDeptInfoData(), null, {
        label: 'deptName',
        flag: false
      })
    },
    initForm () {
      return {
        messageId: '',
        bedIdArr: [],
        timerId: '',
        deptName: '',
        //   deptId: this.selectDeptInfo(),
        msgType: '0', // 通知类型
        viewType: 0, // 传入后台 0-文字 2-音频 3-视频
        content: '', // 公告内容
        bedDivice: [], // 接收设备
        pushType: 0, // 推送方式
        pushTime: '', // 推送时间
        receiveDevice: [], // 存放设备信息转换后的,
        deptIdList: [],
        msgResource: 'MANUAL-NOTICE'
      }
    },
    initCheck () {
      return {
        bedData: {},
        bedList: {},
        cheackAllChecked: false,
        checkArr: [],
        checkCompleteArr: []
      }
    },
    initRules () {
      // const tempContent = (rule, value, callback) => {
      //   debugger
      //   if (!isSpecial(value)) {
      //     callback(new Error('不能含有特殊字符！！'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        content: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 100,
          message: '长度在 1 到 100 个字符'
        }],
        notifyType: [
          { required: true,
            message: '',
            trigger: 'blur' }
        ],

        bedDivice: [{
          required: true,
          message: '接收设备不能为空',
          trigger: 'change'
        }]
      }
    }
  }
}
