/*
 * @Author: 翟冲
 * @Owner:
 * @Date: 2023-02-01 09:20:09
 * @LastEditTime: 2023-05-15 11:08:12
 * @LastEditors: 翟冲
 * @Description:
 * @FilePath: \web3.1.4\src\views\wnms\statistics\mixins.js
 */
import {
  selectDeptInfoData,
  newGetSelectData,
  formatter,
  dataReduce,
  getDeptInfo,
  selectDeptInfo
} from '@/assets/wnms/utils/common';

import { getStorageUser } from '@/assets/wnms/utils/storageUser.js';
import * as msgWarnApi from "@/api/wnms/msgManage/msgWarn";
import deptMixins from "@/assets/wnms/js/deptMixins.js";
export default {
  mixins: [deptMixins],
  data () {
    return {
      callTypeList: []
    };
  },
  created () {

  },
  mounted () {
    this.getCallTypeList();
  },
  methods: {
    async getCallTypeList () {
      let array = await msgWarnApi.getCallTypes();
      let list = newGetSelectData({
        data: array.data, // array
        params: {
          id: "callType", // el-select 中的value 的值
          label: "callTypeDesc" // el-select 中的label  名称
        }
      }) || [];
      this.callTypeList = list;
    }
  }
};
