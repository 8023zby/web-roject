import { deepMerge } from "@/assets/wnms/utils"
// import * as businessManageApi from "../../../../api/smms/shopingMall/businessManage";
import getStorageUser from '@/assets/wnms/utils/storageUser'
export default {
  data () {
    return {
      activeColor: "#13ce66",
      inactiveColor: "#ff4949",
      selectDeptId: null,
      // 商家类型 列表
      shopType: [
        {
          label: "餐厅食堂",
          value: 0
        },
        {
          label: "商超便利",
          value: 1
        },
        {
          label: "护工中心",
          value: 2
        }
      ],
    }
  },

  methods: {

  }
}
