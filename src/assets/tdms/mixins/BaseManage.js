/**
 * 通用的增删改查用到的方法和变量
 */
import { AxiosApi, AxiosJsonApi } from '../../../api/tdms/http';
import { ResultMsg } from '../js/Message';
import { filterData } from '../js/util';

import deptMixins from '../js/deptMixins';

export default {
  mixins: [deptMixins],
  data () {
    return {
      // 分页需要参数
      pageInfo: {
        currentPage: 1,
        size: 10,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100]
      },
      // 加载项
      loading: false,
      // 加载loading
      addVis: false,
      // 表格数据
      tableData: [],
      // 多选集合
      multipleSelectionArr: [],
      multipleSelection: [],
      // 主键id
      primaryId: 'id',
      authorityObj: {},
      authorityArr: [],
      landingEndCode: '',
      deptData: [],
      formSearchDataStatic: {
        orderBy: ''
      }
    };
  },
  methods: {
    // 获取登录端标识
    getLandingEndCode () {
      let codeStr = localStorage.getItem('selectLandingEndInfo');
      if (codeStr !== '' && codeStr !== null) {
        let tempInfo = JSON.parse(codeStr);
        this.landingEndCode = tempInfo.landingEndCode;
        // this.landingEndCode = 'OPEX'
      }
    },
    // 查询部门
    getDeptList () {
      if (this.landingEndCode === 'OPEX') {
        AxiosApi(
          '/ifms/web-org/depts',
          {},
          'GET'
        ).then(res => {
          if (res.status === 200) {
            let t = res.data.list || [];
            t.unshift({
              id: 'default',
              label: '无科室'
            });
            let temp = JSON.stringify(t);
            temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '');
            this.deptData = JSON.parse(temp);

          }
        });
      }
    },
    // 查询部门
    getDeptListAndSearch (act = '') {
      if (this.landingEndCode === 'OPEX') {
        AxiosApi(
          '/ifms/web-org/depts',
          {},
          'GET'
        ).then(res => {
          if (res.status === 200) {
            let t = res.data.list || [];
            if (act === 'device') {
              t.unshift({
                id: 'default',
                label: '无科室'
              });
            }
            let temp = JSON.stringify(t);
            temp = temp.replace(/deptId/g, 'id').replace(/deptName/g, 'label').replace(/,"children":null/g, '').replace(/,"children":\[\]/g, '');
            this.deptData = JSON.parse(temp);
            this.deptList = JSON.parse(temp);
            if (act == 'device') {
              this.formSearchData.deptId = this.getDefaultDeptInfo({ follow: true }) || this.deptData[0].id;
            } else {
              this.formSearchData.deptId = this.getDefaultDeptInfo({ follow: true, notdefault: true }) || this.deptData[0].id;

            }

            this.firstFlag = false;
            this.onSearchSubmit('page');
          }
        });
      } else {
        this.onSearchSubmit('page');
      }
    },
    // 请求列表中动作权限
    getListAuthority () {
      this.authorityObj = this.checkMoreAuthority(this.authorityArr);
    },
    indexMethod (index) {
      index = (index + 1) + (this.pageInfo.currentPage - 1) * this.pageInfo.size;
      return index;
    },
    // 排序查询查询
    queryByOrder (val) {
      this.formSearchDataStatic.orderBy = val;
      this.onSearchSubmit();
    },
    // 查询
    onSearchSubmit (act = '') {
      if (act !== 'page') {
        this.pageInfo.currentPage = 1;
      }
      this.getData();
    },
    // 请求列表
    getData () {
      // 用于子组件的更新
      if (this.subAssemblyShow !== 'NONE') {
        this.subAssemblyShow = false;
      }
      this.loading = true;
      let pageParam = {
        size: this.pageInfo.size,
        page: this.pageInfo.currentPage
      };
      // 查询条件过滤 空的不传
      let params = Object.assign(pageParam, filterData(this.formSearchData), (this.formSearchDataStatic || {}));
      AxiosApi(this.url, {}, 'GET', params).then(res => {
        this.loading = false;
        if (res.status === 200) {
          let { data } = res;
          let { list, total } = data;
          this.tableData = list;
          this.pageInfo.total = total;
          if (this.subAssemblyShow !== 'NONE') {
            this.subAssemblyShow = true;
          }
        }
      });
    },
    // 保存数据
    saveData () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.saveDataDo(this.addFormData, this.actFlag);
        }
      });
    },
    // 删除
    del (url = this.url, data) {
      this.$confirm(`确定要删除此${this.modelName}?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        AxiosApi(url, data, 'DELETE').then(res => {
          ResultMsg(res, `删除${this.modelName}`, this.reloadDel);
        });
      }).catch(() => { });
    },
    // 删除时候判断是否需要重新分页
    reloadDel () {
      // 如果是最后一页最后一条 跳转上一页
      if ((this.pageInfo.total - (this.pageInfo.currentPage - 1) * this.pageInfo.size) === 1) {
        this.pageInfo.currentPage--;
      }
      if (this.pageInfo.currentPage < 1) {
        this.pageInfo.currentPage = 1;
      }
      this.onSearchSubmit('page');
    },
    // 保存数据
    saveDataDo (data, act, params = {}, isOne = false) {
      let methodType = 'POST';
      let actMsg = '添加';
      let addData;
      if (!act) {
        act = 'add';
      }
      if (act === 'add') {
        addData = filterData(data);
      } else if (act === 'modify') {
        methodType = 'PUT';
        actMsg = '修改';
        addData = data;
      }
      this.addVis = true;
      AxiosJsonApi(this.url, addData, methodType, params).then(res => {
        if (isOne) {
          ResultMsg(res, actMsg + this.modelName, this.reloadUrl);
        } else {
          if (act === 'add') {
            ResultMsg(res, actMsg + this.modelName, this.reloadAdd);
          } else {
            ResultMsg(res, actMsg + this.modelName, this.reloadUrl);
          }
        }
        if (res.status !== 200) {
          this.addVis = false;
        }
      });
    },
    // 添加会列表跳首页
    reloadAdd () {
      let deviceType = this.deviceType || this.formSearchData.deviceType;
      this.$emit('option-changed', 'list', { deviceType: deviceType, fromAdd: true });
    },
    // 清空值
    clearObj (data) {
      let temp = {};
      for (let p in data) {
        if (p === 'deviceType') {
          temp[p] = this.formSearchData.deviceType;
        } else {
          temp[p] = '';
        }
      }
      return temp;
    },
    // 刷新页面
    reload () {
      this.pageInfo.currentPage = 1;
      this.formSearchData = this.clearObj(this.formSearchData);
      this.getData();
    },
    // 返回
    reloadUrl () {
      let deviceType = this.deviceType || this.formSearchData.deviceType;
      this.$emit('option-changed', 'list', { deviceType: deviceType });
    },
    // 页面整体刷新
    reloadMain () {
      this.$emit('main-reload');
    },
    // 通用表格点击样式处理
    handleSelectionChange (val) {
      this.multipleSelection = val;
      let arr = [];
      val.forEach((val) => {
        this.tableData.forEach((v, i) => {
          // id 是每一行的数据id
          if (val[this.primaryId] === v[this.primaryId]) {
            arr.push(i);
          }
        });
      });
      this.multipleSelectionArr = arr;
    },
    tableRowClassName ({ row, rowIndex }) {
      let arr = this.multipleSelectionArr;
      for (let i = 0; i < arr.length; i++) {
        if (rowIndex === arr[i]) {
          return 'typt-row-color';
        }
      }
    }
  }
};
