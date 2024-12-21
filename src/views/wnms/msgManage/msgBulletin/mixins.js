import {
  selectDeptInfo,
  selectDeptInfoData,
  formatter,
  getAllDeptList,
  newGetSelectData,
  getDeptInfo
} from "@/assets/wnms/utils/common"
import * as msgPushApi from "@/api/wnms/msgManage/msgPush"
export default {
  data () {
    return {
      gridTemplist: [],
      deviceTypeName: {
        bedHead: "床头分机",
        bedSide: "床旁分机",
        PDA: "PDA",
        voice: "医声助手",
        corridor: "走廊显示屏",
        touchScreen: "触屏护理信息看板",
        room: "门口分机"
      },
      deptList: []
    }
  },
  mounted () {
    this.deptList =
      newGetSelectData({
        data: getAllDeptList(), // array
        params: {
          value: "deptId", // el-select 中的value 的值
          label: "deptName" // el-select 中的label  名称
        }
      }) || []
  },
  methods: {
    newGetSelectDatas (data) {
      return newGetSelectData(data)
    },
    // 获取护理单元ID
    selectDeptInfo () {
      return getDeptInfo().deptId
    },

    formatter () {
      return formatter(selectDeptInfoData(), null, {
        label: "deptName",
        flag: false
      })
    },
    initForm () {
      return {
        messageId: "",
        bedIdArr: [],
        timerId: "",
        deptName: "",
        isGenerateAudio: 0, //文字转换语音 1 转换 0不转换
        //   deptId: this.selectDeptInfo(),
        msgType: "0", // 通知类型
        viewType: 0, // 传入后台 0-文字 2-音频 3-视频
        content: "", // 公告内容
        bedDivice: [], // 接收设备
        pushType: 0, // 推送方式
        pushTime: "", // 推送时间
        receiveDevice: [], // 存放设备信息转换后的,
        deptIdList: [],
        msgResource: "MANUAL-NOTICE"
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
          validator: (rule, value, callback) => {
            if (this.form.isGenerateAudio === 1 && value.length < 5) {
              return callback(new Error('请输入5个字符以上。'))
            } else if (!value) {
              return callback(new Error('不能为空'))
            }
            return callback()
          },
          trigger: 'blur'
        }],
        deptIdList: [
          {
            required: true,
            message: "护理单元不能为空",
            trigger: "change"
          }
        ],
        notifyType: [{ required: true, message: "", trigger: "blur" }],

        bedDivice: [
          {
            required: true,
            message: "接收设备不能为空",
            trigger: "change"
          }
        ]
      }
    }
  }
}
