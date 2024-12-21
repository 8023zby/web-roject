import {
  selectDeptInfo,
  selectDeptInfoData,
  formatter,
  getAllDeptList,
  newGetSelectData,
  getDeptInfo
} from "@/assets/wnms/utils/common"
import * as Api from "@/api/wnms/msgManage/NurseEnterLeave"
export default {
  data () {
    return {
      gridTemplist: [],
      deptList: [],
      roomList: []
    }
  },
  created() {
    this.getRoom()
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

    getRoom() {
      Api.queryRoomListApi({
        pageHelper: 2
      }).then(res => {
        this.roomList = newGetSelectData({
          data: res.data, // array
          params: {
            value: "roomId", // el-select 中的value 的值
            label: "roomName" // el-select 中的label  名称
          }
        }) || []
      })
    },

    newGetSelectDatas (data) {
      return newGetSelectData(data)
    },
    // 获取护理单元ID
    selectDeptInfo () {
      return selectDeptInfoData().deptId
    },

    formatter () {
      return formatter(selectDeptInfoData(), null, {
        label: "deptName",
        flag: false
      })
    }

  }
}
