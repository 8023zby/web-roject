<template>
  <layout_edit v-loading="loading">
    <div slot="title">批量录入</div>
    <div slot="right_btn">
      <el-button v-uni="'pishiguanli_piliangluru_goback'" @click="close" type="primary">返回</el-button>
    </div>

    <layout_list slot="main">
      <!-- 查询条件 -->
      <div slot="query" class="query-items">
        <el-form :inline="true" :model="search_form" ref="search_form">
          <el-form-item label="开嘱时间" class="date-range">
            <el-date-picker
              v-uni="'pishiguanli_piliangluru_date'"
              v-model="search_form.beginDate"
              value-format="yyyy-MM-dd"
              type="date"
              :clearable="false">
            </el-date-picker>
            <div class="to">至</div>
            <el-date-picker
              v-uni="'pishiguanli_piliangluru_date'"
              v-model="search_form.endDate"
              value-format="yyyy-MM-dd"
              type="date"
              :clearable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              v-uni="'pishiguanli_piliangluru_search'"
              type="primary"
              icon="el-icon-search"
              @click="searchForm()"
            >搜索
            </el-button>
            <el-button v-uni="'pishiguanli_piliangluru_reset'" type="text" @click="resetForm()"
            >重置
            </el-button>

          </el-form-item>
        </el-form>
      </div>

      <!-- 表格 -->
      <div slot="main" class="main-list">
        <el-table
          ref="table"
          :data="table_data"
          :row-key="getRowKeys"
          highlight-current-row
          height="100%"
        >
          <el-table-column
            prop="bedName"
            label="床位"
            align="center"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="patientName"
            label="患者姓名"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="medicalItemName"
            label="医嘱名称"
            header-align="center"
            show-overflow-tooltip
            min-width="200"
          ></el-table-column>
          <el-table-column
            prop="startAdviceTime"
            label="开嘱时间"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              {{scope.row.startAdviceTime ? scope.row.startAdviceTime.split(" ")[0] : ''}}<br/>
              {{scope.row.startAdviceTime ? scope.row.startAdviceTime.split(" ")[1] : ''}}
            </template>
          </el-table-column>
          <el-table-column
            prop="skinTestType"
            label="原液/皮试液"
            min-width="120"
            align="center"
          >
            <template slot-scope="scope">
              {{config.skinTestType[scope.row.skinTestType] || ''}}
            </template>
          </el-table-column>
          <el-table-column
            prop="frequencyCode"
            label="剂量"
            min-width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="purpose"
            label="用法"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="skinTestResult"
            label="皮试结果"
            align="center"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="startTime"
            label="皮试开始时间"
            align="center"
            min-width="120"
          >
            <template slot-scope="scope">
              {{scope.row.startTime ? scope.row.startTime.split(" ")[0] : ''}}<br/>
              {{scope.row.startTime ? scope.row.startTime.split(" ")[1] : ''}}
            </template>
          </el-table-column>
          <el-table-column
            prop="skinTestNurse"
            label="皮试人员"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              {{user_data[scope.row.skinTestNurse] || '-'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="stopTime"
            label="皮试停止时间"
            align="center"
            min-width="120"
          >
            <template slot-scope="scope">
              {{scope.row.stopTime ? scope.row.stopTime.split(" ")[0] : ''}}<br/>
              {{scope.row.stopTime ? scope.row.stopTime.split(" ")[1] : ''}}
            </template>
          </el-table-column>
          <el-table-column
            prop="checkNurse"
            label="复核人员"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              {{user_data[scope.row.checkNurse] || '-'}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="130">
            <template slot-scope="scope">
              <template v-if="scope.row.main">
                <el-button @click="edit(scope.row)" type="text" v-if="!scope.row.skinTestResult">
                  录入
                </el-button>
                <!--<el-button @click="cancelEdit(scope.row)" type="text" v-if="scope.row.skinTestResult && scope.row.checkStatus!==1"-->
                <!--&gt;取消-->
                <!--</el-button>-->
                <!--<el-button type="text" @click="check(scope.row)" v-if="scope.row.checkStatus!==1 && scope.row.skinTestResult"-->
                <!--&gt;复核-->
                <!--</el-button>-->
                <!--<el-button @click="cancelCheck(scope.row)" type="text" v-if="scope.row.checkStatus == 1"-->
                <!--&gt;取消复核-->
                <!--</el-button>-->
              </template>
            </template>

          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div slot="footer" class="page-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page_current"
          :page-size="search_form.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page_total"
        >
        </el-pagination>
      </div>

    </layout_list>

    <template slot>
      <!-- 录入 -->
      <el-dialog title="皮试结果录入" :visible.sync="input_form_visible" width="500px" :show-close="false">
        <el-form :model="input_form" ref="input_form" label-width="120px">
          <el-form-item label="皮试结果" prop="result"
                        :rules="[
              { required: true, message: '请选择皮试结果！', trigger: 'blur' },

            ]">
            <el-select v-model="input_form.result" placeholder="请选择皮试结果">
              <el-option label="阴性" value="阴性"></el-option>
              <el-option label="阳性" value="阳性"></el-option>
              <el-option label="未知" value="未知"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结果记录时间" prop="endTime"
                        :rules="skinTestResultValidate">
            <el-date-picker
              v-model="input_form.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="input_form_visible = false">取消</el-button>
          <el-button type="primary" @click="editSubmit">确认</el-button>
        </div>
      </el-dialog>

      <!-- 复核 -->
      <el-dialog
        class="trial_window"
        title="复核"
        :close-on-click-modal="false"
        :visible.sync="check_form_visible"
        :show-close="false"
        width="300px">
      <span>
        <el-form ref="check_form" label-width="80px">
          <el-form-item label="用户名" prop="account">
            <el-input
              v-model="check_form.account"
              disabled
              placeholder=""
            ></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input
              type="password"
              v-model="check_form.password"
              placeholder=""
              autocapitalize="off"
              required
            ></el-input>
          </el-form-item>
        </el-form>
      </span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="check_form_visible = false">取消</el-button>
        <el-button type="primary" @click="checkSubmit">确认</el-button>
      </span>
      </el-dialog>
    </template>
  </layout_edit>
</template>

<script>
  import { ApiSkinTest, ApiUser } from '../../../api/dams/index';
  import moment from 'moment';
  import layout_list from '../../../components/dams/layout/list';
  import layout_edit from '../../../components/dams/layout/edit';

  export default {
    name: 'skin_test_multi',
    components: { layout_edit, layout_list },
    data() {
      let skinTestValidateFun = ((rule, value, callback) => {
        if (moment(value).isBefore(moment(this.input_form.startTime))) {
          callback(new Error("皮试结果时间不能大于执行时间！"));
        } else {
          callback();
        }
      });
      return {
        loading: false,
        config: {
          skinTestType: {
            0: '原液',
            1: '皮试液'
          }
        },
        empInfo: '',
        user_data: {},
        page_current: 1,
        page_total: 1,
        table_data: [],
        //查询表单
        search_form: {
          empId: '',
          patientId: '',
          beginDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'), //[moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
          page: 1,
          size: 10
        },
        skinTestResultValidate: [
          { required: true, message: '请选择时间！', trigger: 'blur' },
          { validator: skinTestValidateFun, trigger: 'blur' }
        ],
        input_form_visible: false,
        input_form: {
          testId: '',
          result: '',
          startTime: '',
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
        check_form_visible: false,
        check_form: {
          account: '',
          password: ''
        }
      };
    },
    props: ['patient', 'patientType'],
    created() {
      this.empInfo = JSON.parse(localStorage.getItem('empInfo')) || {};
      let userId = localStorage.getItem('userId') || '';
      this.check_form.account = userId;
      this.search_form.beginDate = moment(this.patient.inTime).format('YYYY-MM-DD')
      this.initData();
    },
    activated() {
      this.$nextTick(function () {
        this.$refs.table.doLayout();
      });
    },
    updated() {
      this.$nextTick(function () {
        this.$refs.table.doLayout();
      });
    },
    methods: {
      async initData (){
        let a = this.getUserData();
        let b = this.getData();
        await a;
        await b;
      },
      // 获取护士用户信息
      async getUserData() {
        await ApiUser.nurse().then(res => {
          const data = res.data || [];
          for (let i = 0; i < data.length; i++) {
            this.user_data[data[i]['empId']] = data[i]['empName'];
          }
        }).catch(res => {
          this.$message.error(res.message);
        });
      },
      async getData() {
        this.table_data = [];
        this.loading = true;
        await ApiSkinTest.batch(this.search_form)
          .then(res => {
            let list = res.data.list;
            // 处理数据
            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              for (let x = 0; x < list[i].itemList.length; x++) {
                let _d = list[i].itemList[x];
                let nItem = {};
                if (x === 0) {
                  nItem = { ...item };
                  nItem['medicalItemName'] = _d['medicalItemName'];
                  nItem['dosage'] = _d['dosage'];
                  nItem['purpose'] = _d['purpose'];
                  nItem['main'] = true;
                } else {
                  nItem['medicalItemName'] = _d['medicalItemName'];
                  nItem['dosage'] = _d['dosage'];
                  nItem['checkStartStatus'] = item['checkStartStatus'];
                  nItem['checkStopStatus'] = item['checkStopStatus'];
                }
                this.table_data.push(nItem);
              }
            }
            // this.table_data = res.data.list;
            this.page_total = res.data.total;
            this.loading = false;
          })
          .catch(res => {
            this.loading = false;
            this.$message.error(res.message);
          });
      },
      searchForm() {
        this.handleCurrentChange(1);
      },
      edit(row) {
        this.input_form['testId'] = row.skinTestId;
        this.input_form['endTime'] = row.endTime || '';
        this.input_form['startTime'] = row.startTime || '';
        this.input_form['result'] = row.skinTestResult || '';
        this.input_form_visible = true;
      },
      editSubmit() {
        this.$refs.input_form.validate((valid) => {
          if (valid) {
            ApiSkinTest.edit(this.input_form)
              .then(() => {
                this.$message.success('保存成功！');
                this.input_form_visible = false;
                this.getData();
              })
              .catch(res => {
                this.$message.error(res.message);
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancelEdit(data) {
        this.$confirm('确认取消录入？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false
        }).then(() => {
          ApiSkinTest.cancelEdit({ entity: data, targetDate: moment().format('YYYY-MM-DD') })
            .then(() => {
              this.$message.success('取消成功！');
              this.getData();
            })
            .catch(res => {
              this.$message.error(res.message);
            });
        });
      },
      check(row) {
        let data = JSON.parse(JSON.stringify(row));
        data['checkStatus'] = 1;
        Object.assign(this.check_form, data);
        if (this.check_form.skinTestNurse && this.check_form.skinTestNurse === this.empInfo.empId) {
          this.$alert('复核人与皮试人员为同一人员', '', {
            confirmButtonText: '继续复核',
            callback: action => {
              this.check_form_visible = true;
            }
          });
        } else {
          this.check_form_visible = true;
        }
      },
      checkSubmit() {
        //1。验证用户名密码正确
        ApiUser.verify_password({
          loginName: this.check_form.account,
          loginPassword: this.check_form.password
        }).then(res => {
          if (res.data) {
            //2。组织数据
            ApiSkinTest.check({ entity: this.check_form, targetDate: moment().format('YYYY-MM-DD') })
              .then(() => {
                this.$message.success('操作成功！');
                this.check_form_visible = false;
                this.getData();
              }).catch(res => {
              this.$message.error(res.message);
            });
          } else {
            this.$message.warning('密码错误！');
          }
        }).catch(res => {
          this.$message.error(res.message);
        });
      },
      cancelCheck(data) {
        this.$confirm('是否确认取消复核？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false
        }).then(() => {
          ApiSkinTest.cancelCheck({ entity: data, targetDate: moment().format('YYYY-MM-DD') })
            .then(() => {
              this.$message.success('取消成功！');
              this.getData();
            })
            .catch(res => {
              this.$message.error(res.message);
            });
        });
      },
      resetForm() {
        this.$refs.search_form.resetFields();
        this.handleCurrentChange(1);
      },
      getRowKeys(row) {
        return row.medicalAdviceId;
      },
      handleSizeChange(val) {
        this.search_form.size = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.page_current = this.search_form.page = val;
        this.getData();
      },
      close() {
        this.$emit('option-changed', 'list');
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/dams/css/self_common";

  /deep/ .el-main {
    padding: 0;
  }

  .date-range .el-form-item__content div {
    float: left;
  }

  .date-range .el-form-item__content .to {
    padding: 0 10px;
  }
</style>
