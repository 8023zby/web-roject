/*
 * @Author: 翟冲
 * @Owner: 
 * @Date: 2023-05-06 15:16:09
 * @LastEditTime: 2023-06-08 08:58:27
 * @LastEditors: 翟冲
 * @Description: 
 * @FilePath: \web3.2\src\views\wnms\x28s\device\mixins.js
 */
import { getStorageUser } from '@/assets/wnms/utils/storageUser.js';

import {
  selectDeptInfo,
  getDeptInfo
} from '@/assets/wnms/utils/common';
import outMixins from '../mixins';


import deptMixins from "@/assets/wnms/js/deptMixins.js";
export default {
  data () {
    return {
      //应用到护理单元的数据
      selectDeptId: null,
    };
  },
  mixins: [outMixins, deptMixins],
  mounted () {

    if (this.detail.type == 'list') {
      this.getdeptsList();
    }
  },
  methods: {
    retunTreeList (res) {
      if (res.status === 200 && res.data.list.length > 0) {
        this.dataTree = res.data.list;
        this.selectDeptId = this.getDefaultDeptInfo({ follow: false, notdefault: true }) || this.dataTree[0].deptId;
        this.search.deptId = this.selectDeptId;
        if (this.detail.type == 'list' && this.detail.deptId) {
          this.search.deptId = this.detail.deptId;
          this.selectDeptId = this.detail.deptId;
        }
        this.executeQueryPage();
      }
    },
    selectDeptInfo () {

      return selectDeptInfo();
    },
    initForm () {
      return {
        deviceId: '',
        remark: '', // 备注
        ip: '',
        deptId: '' ///this.selectDeptInfo()
      };
    }
  }
};
