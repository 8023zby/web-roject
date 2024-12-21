import {
  selectDeptInfo,
  selectDeptInfoData,
  formatter,
  getDeptInfo
} from '@/assets/wnms/utils/common'

import * as msgTemplateAPI from '@/api/wnms//msgManage/msgTemplate'
import * as msgPushAPI from '@/api/wnms//msgManage/msgPush'

export default {
	data() {
		return {

		}
	},
	mounted() {

	},
	methods: {
		loadDevice() {

		},
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
        }
      })
    }
	}

}
