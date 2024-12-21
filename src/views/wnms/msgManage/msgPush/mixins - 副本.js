import * as msgTemplateAPI from '@/api/wnms//msgManage/msgTemplate'
import * as msgPushAPI from '@/api/wnms//msgManage/msgPush'
import {
  selectDeptInfo,
  selectDeptInfoData,
  formatter,
  getDeptInfo
} from '@/assets/wnms/utils/common'

export default {
  data () {
    return {
      gridTemplist: [],
      deviceTypeName: {
        'bedHead': '床头分机',
        'bedSide': '床旁分机',
        'voice': '医声助手',
        'PDA': 'PDA',
        'corridor': '走廊显示屏',
        'touchScreen': '触屏护理信息看板',
        'room': '门口分机'
      }
    }
  },
  methods: {
    // 获取护理单元ID
    selectDeptInfo () {
      return selectDeptInfo()
    },
    formatter () {
      return formatter(selectDeptInfoData(), null, {
        label: 'deptName',
        flag: false
      })
    },
    // 获取消息推送的模板列表
    getTemplateList (tempId) {
      msgTemplateAPI.getInfo({
        pageHelp: 0,
        deptId: tempId
      }).then(res => {
        if (res.status === 200) {
          this.gridTemplist = res.data
        }
      })
    },
    // 获取床位列表
    getBedList () {
      let _this = this
      let id = null
      if (getDeptInfo() != null) {
        id = getDeptInfo().orgId
      }
      msgPushAPI.getBedList({
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
        console.log(diviceRrr[d])
        if (diviceRrr[d].length > 0) { 
          obj[d] = diviceRrr[d]
        }
      }
    
      this.checkData.bedList = obj
       
    },
    initForm () {
      return {
        messageId: '',

        bedArray: [],
        bedDesc: [],
        bedIdArr: [],
        timerId: '',

        deptName: '',
        deptId: this.selectDeptInfo(),
        notifyType: 0, // 展示类型
        msgType: 0, // 通知类型
        viewType: 0, // 传入后台 0-文字 2-音频 3-视频
        content: '', // 公告内容
        bedDivice: [], // 接收设备
        pushType: 0, // 推送方式
        pushTime: '', // 推送时间
        receiveDevice: [], // 存放设备信息转换后的,

        roomGateDevices: [],
        voices: [],
        pdaUsers: [],
        touchScreenDevices: [],
        corridorDevices: [],
        bedHeadDevices: [],
        bedSideDevices: [],
        msgResource: 'MANUAL-DEPT-MSG',
        secondsDuration: '', // 文件播放时间秒数
        secondsDurationFormat: '' // 文件播放时间格式化字符串

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
    initVideo () {
      return {
        param: {
          isFile: true, // 是否显示文件,
          name: ''// 文件名字
        },
        dataName: 'video',
        accept: '.mp4,.avi,.3gp,.rmvb,.wmv,.mkv,.mov,.flv,.mp3,.wav,.wma',
        limit: 1,
        Iscallback: true,
        filelist: [],
        video_flag: false
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
        } ],
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
