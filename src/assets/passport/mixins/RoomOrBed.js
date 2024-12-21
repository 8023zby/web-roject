/**
 * 通用的增删改查用到的方法和变量
 */
import BaseManage from './BaseManageIfms';
import { AxiosApi, AxiosJsonApi } from '../../../api/passport/http';
import { ResultMsg } from '../js/Message';
import deptMixins from "@/assets/passport/js/deptMixins.js";

export default {
  extends: BaseManage,
  mixins: [deptMixins],
  data () {
    return {
      deptData: []
    };
  },
  methods: {
    indexMethod (index) {
      index = (index + 1) + (this.pageInfo.currentPage - 1) * this.pageInfo.size;
      return index;
    },
    // 查询部门
    getDeptList (act = '') {
      if (this.landingEndCode === 'OPEX') {
        AxiosApi(
          '/ifms/web-org/depts',
          {},
          'GET'
        ).then(res => {
          if (res.status === 200) {
            let temp = JSON.stringify(res.data.list);
            temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '');
            this.deptData = JSON.parse(temp);

            this.formSearchData.deptId = this.getDefaultDeptInfo() || this.deptData[0].id;
            if (act === 'room') {
              this.getSearchSelectRoom();
            }
            this.getData();
          }
        });
      } else {
        this.getData();
      }
    },
    // 查询
    async onSearchSubmit (act = '') {
      if (act !== 'page') {
        this.pageInfo.currentPage = 1;
      }
      // 运维端请求部门数据
      this.getData();
    },
    // 保存数据
    saveDataDo (data, act, params = {}, isOne = true, fun) {
      let methodType = 'POST';
      let actMsg = '添加';
      let addData;
      if (!act) {
        act = 'add';
      }
      if (act === 'add') {
        addData = this.filterData(data);
      } else if (act === 'modify') {
        methodType = 'PUT';
        actMsg = '修改';
        addData = data;
      }
      let msg = actMsg + this.modelName;
      this.addVis = true;
      AxiosJsonApi(this.url, addData, methodType, params).then(res => {
        if (res.status !== 200) {
          this.addVis = false;
        } else {
          this.formSearchData.deptId = addData.deptId;
        }
        if (act === 'add') {
          ResultMsg(res, msg, this.reloadAdd);
        } else {
          ResultMsg(res, msg, this.reloadModify);
        }
      });
    },
    // 编辑后的刷新页面
    reloadModify () {
      this.addVis = false;
      this.dialogFormVisible = false;
      this.onSearchSubmit('page');
    },
    // 编辑后的刷新页面
    reloadAdd () {
      this.addVis = false;
      this.dialogFormVisible = false;
      this.formSearchData.roomName = '';
      this.formSearchData.bedName = '';
      this.formSearchData.roomId = '';
      this.formSearchData.area = null;
      this.pageInfo.currentPage = 1;
      this.onSearchSubmit();
    },
    // 刷新页面
    reload () {
      this.formSearchData = this.clearObj(this.formSearchData);
      this.formSearchData.area = null;
      this.pageInfo.currentPage = 1;
      this.getData();
    }
  }
};
