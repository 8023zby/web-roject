/*
 * @Author: 翟冲
 * @Owner:
 * @Date: 2023-02-01 09:20:09
 * @LastEditTime: 2023-05-15 15:52:26
 * @LastEditors: 翟冲
 * @Description:
 * @FilePath: \web3.1.4\src\views\wnms\deviceVersion\mixins.js
 */
import {
  selectDeptInfoData,
  formatter,
  dataReduce,
  getDeptInfo,
  selectDeptInfo
} from '@/assets/wnms/utils/common';
import deptMixins from "@/assets/wnms/js/deptMixins.js";
import { getStorageUser } from '@/assets/wnms/utils/storageUser.js';
import * as msgWarnApi from "@/api/wnms/msgManage/msgWarn";

export default {
  data () {
    return {
      //应用到护理单元的数据
      selectDeptId: localStorage.getItem("tdms_searchDept")
    };
  },
  created () {
    this.getdeptsList();
  },
  mixins: [deptMixins],
  mounted () {

  },
  methods: {

    dataReduce (array, value) {
      return dataReduce(array, value);
    },

    formatter () {
      return formatter(selectDeptInfoData(), null, {
        label: 'deptName',
        flag: false
      });
    },
    /*获取护理单元*/
    async getdeptsList () {
      this.retunTreeList(await msgWarnApi.getdepts());
    },
    retunTreeList (res) {
      if (res.status === 200 && res.data.list.length > 0) {
        let t = res.data.list || [];
        t.unshift({
          id: "default",
          label: "无科室",
        });
        let temp = JSON.stringify(t);
        temp = temp
          .replace(/deptId/g, "id")
          .replace(/deptName/g, "label")
          .replace(/,"children":null/g, "")
          .replace(/,"children":\[\]/g, "");
        this.dataTree = JSON.parse(temp);
        if (this.$data.selectDeptId == "undefined") {
          this.selectDeptId = null;
          this.search.deptId = null;
        } else {
          this.selectDeptId = this.getDefaultDeptInfo({ follow: true }) || this.dataTree[0].id;
          this.search.deptId = this.selectDeptId;
        }
        this.executeQueryPage();
      }
    }
  }
};
