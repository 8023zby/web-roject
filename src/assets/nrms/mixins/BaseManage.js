/**
 * 通用的增删改查用到的方法和变量
 */
import { AxiosApi, AxiosJsonApi } from '../../../api/nrms/http/index';
import { ResultMsg } from '../js/Message';
import moment from 'moment';
export default {
  data () {
    return {
      // 分页需要参数
      pageInfo: {
        currentPage: 1,
        size: 10,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50]
      },
      // 加载项
      loading: false,
      // 提交是加载loading
      addVis: false,
      // 表格数据
      tableData: []
    };
  },
  methods: {
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
      let params = Object.assign(pageParam, this.filterData(this.formSearchData), (this.formSearchDataStatic || {}));
      AxiosApi(this.url, {}, 'GET', params).then(res => {
        let { data } = res;
        if (!data) {
          this.loading = false;
          return;
        }

        let total = data ? data.total : 0;
        let list = data ? data.list : [];
        let index = 1;
        if (list === null || list === undefined) {
          return false;
        }
        for (let i = 0; i < list.length; i++) {
          // 出入量有合并行，单独处理页序号
          if (list[i].rowCount !== 0) {
            list[i]['selfIndex'] = (this.pageInfo.currentPage - 1) * this.pageInfo.size + index;
            index++;
          }
          this.tableData.push(list[i]);
        }
        this.tableData = list;
        // 处理体围数据
        if (this.formObj && (this.formObj.formType === 9 || (this.formObj.formType === 3 && this.formObj.formRelationStyle === '3'))) {
          this.tableData.map((v) => {
            if (this.formObj.formType === 3 && this.formObj.formRelationStyle === '3') {
              v.signList.map((o) => {
                v[o.signId] = o.signValue;
              });
            } else {
              v.signList.map((o) => {
                v[o.signName] = o.signValue;
              });
            }

            // 世博血糖单（新）---处理
            if (v.extend.length > 0) {
              v.extend.map((o) => {
                v[o.extendName] = o.extendValue;
              });
            }
            v.recordTime = v.recordDate;
            return v;
          });
        }

        this.pageInfo.total = total;
        if (this.subAssemblyShow !== 'NONE') {
          this.subAssemblyShow = true;
        }
        this.$forceUpdate();
        this.loading = false;
      }).catch(e => {
        this.loading = false;
      });
    },
    // 获取当前秒数
    getCurrentSecond (time) {
      let s = moment().seconds();
      if (s >= 0 && s <= 9) {
        s = '0' + s;
      }
      time = time.substr(0, 16) + ':' + s;
      return time;
    },
    // 保存数据
    saveData () {
      let _time = this.getCurrentSecond(this.addFormData.recordTime);
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addFormData.recordTime = _time;

          let _nesData = {};
          // 体围数据格式处理
          if (this.formObj.formType === 9 || (this.formObj.formType === 3 && this.formObj.formRelationStyle === '3')) {
            let _a = [];
            let _b = [];
            this.titData.map((v) => {
              if (v.extend) {
                let _s = {
                  extendName: v.prop,
                  extendValue: this.addFormData[v.prop]
                };
                _b.push(_s);
              } else {
                let _s = {};
                if (this.formObj.formType === 3 && this.formObj.formRelationStyle === '3') {
                  _s = {
                    signId: v.prop,
                    signName: v.name,
                    signValue: this.addFormData[v.prop]
                  };
                } else {
                  _s = {
                    signId: v.id,
                    signName: v.prop,
                    signValue: this.addFormData[v.prop]
                  };
                }

                _a.push(_s);
              }
            });

            // 验证，当体围数据都为空时，不允许保存
            _a = _a.filter((v) => {
              if (v.signValue !== '') {
                return v;
              }
            });

            if (_a.length === 0 && this.formObj.formType === 9) {
              this.$message.warning('体征数据不能同时为空！');
              return false;
            }

            _nesData = {
              'patientId': this.addFormData.patientId,
              'recordDate': this.addFormData.recordTime,
              'formId': this.addFormData.formId,
              'deptId': this.addFormData.deptId,
              'orgId': this.addFormData.orgId,
              'extend': _b,
              'signList': _a
            };
            if (this.addFormData.recordId) {
              _nesData.recordId = this.addFormData.recordId;
            }
          } else {
            this.addFormData.recordDate = this.addFormData.recordTime;
            _nesData = this.addFormData;
          }

          this.saveDataDo(_nesData, this.actFlag);
        }
      });
    },
    // 删除
    del (data) {
      this.$confirm(`确认要进行删除吗?`, '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        AxiosApi(this.url, data, 'DELETE').then(res => {
          ResultMsg(res, `删除${this.modelName}`, this.reload);
        });
      });
    },
    filterData (data) {
      let temp = {};
      for (let p in data) {
        if (data[p] === '') {
          continue;
        }
        temp[p] = data[p];
      }
      return temp;
    },
    // 保存数据
    saveDataDo (data, act, params = {}, isOne = true) {
      let methodType = 'POST';
      let actMsg = '添加';
      let addData = data;
      if (!act) {
        act = 'add';
      }
      if (act === 'modify') {
        methodType = 'PUT';
        actMsg = '修改';
        addData = data;
      }

      this.addVis = true;
      AxiosJsonApi(this.url, addData, methodType, params).then(res => {
        if (isOne) {
          ResultMsg(res, actMsg + this.modelName, this.reloadUrl);
        } else {
          ResultMsg(res, actMsg + this.modelName, this.reloadMain);
        }
        if (res.status !== 200) {
          this.addVis = false;
        }
      });
    },
    // 清空值
    clearObj (data) {
      let temp = {};
      for (let p in data) {
        temp[p] = '';
      }
      return temp;
    },
    // 刷新页面
    reload () {
      this.formSearchData = this.clearObj(this.formSearchData);
      this.pageInfo.currentPage = 1;
      this.getData();
      this.getPrintData && this.getPrintData();
    },
    // 返回
    reloadUrl () {
      this.$emit('option-changed', 'list');
    },
    // 页面整体刷新
    reloadMain () {
      this.$emit('main-reload');
    }
  }
};
