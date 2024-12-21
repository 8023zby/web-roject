/*
 * @Author: 翟冲
 * @Owner: 
 * @Date: 2023-06-03 09:16:11
 * @LastEditTime: 2023-06-07 17:16:19
 * @LastEditors: 翟冲
 * @Description: 
 * @FilePath: \web3.2\src\views\wnms\x28s\mixins\index.js
 */

import * as msgWarnApi from "../../../../api/wnms/msgManage/msgWarn";
import {
  selectDeptInfo,
  selectDeptInfoData,
  formatter,
  dataReduce,
  getDeptInfo
} from '@/assets/wnms/utils/common';

export default {

  data () {
    return {
    };
  },
  mounted () {

  },
  methods: {

    // 获取护理单元ID
    selectDeptInfo () {
      return selectDeptInfo();
    },
    /*获取护理单元*/
    getdeptsList () {
      msgWarnApi.getdepts().then((res) => {
        this.retunTreeList(res);
      });

    },
  }
};
