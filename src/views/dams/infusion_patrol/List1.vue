<template>
  <layout v-loading="loading">

    <!-- 查询条件 -->
    <div slot="query" class="query-items">
      <el-form :inline="true" :model="search_form" ref="search_form">
        <el-form-item label="时间" prop="targetDate">
          <el-date-picker
            v-model="search_form.targetDate"
            type="date"
            :clearable="false"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="searchForm()"
          >搜索
          </el-button>
          <el-button type="text" @click="resetForm()"
          >重置
          </el-button>

        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->

    <div slot="right_btn" class="tool-bar">
      <!-- 下一个迭代做 -->
      <el-button type="success" @click="printView"
      >打印
      </el-button>
      <!--<el-button @click="patrolMulti" type="primary"-->
      <!--&gt;巡视-->
      <!--</el-button>-->
      <!--<el-button type="primary" @click="patrolCancelMulti"-->
      <!--&gt;取消巡视-->
      <!--</el-button>-->
    </div>

    <!-- 表格 -->
    <div slot="main" class="main-list">
      <el-table
        ref="table"
        :data="table_data"
        :row-key="getRowKeys"
        highlight-current-row
        @selection-change="handleTableSelectionChange"
        height="100%"
      >
        <el-table-column
          align="center"
          width="50"
          type="selection"
          reserve-selection
          fixed="left"
          :selectable="handleSelectable"
        >
        </el-table-column>
        <el-table-column type="index" fixed="left" label="序号" width="60"></el-table-column>
        <el-table-column
          prop="medicalItemName"
          label="医嘱名称"
          show-overflow-tooltip
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="dosage"
          label="剂量"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="frequencyCode"
          label="频次"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="purpose"
          label="用法"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="startAdviceTime"
          label="计划执行时间"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="patrolTypeDesc"
          label="巡视节点"
          min-width="90"
        >
        </el-table-column>
        <el-table-column
          prop="patrolSpeed"
          label="滴速"
          align="center"
          min-width="60"
        ></el-table-column>
        <el-table-column
          prop="patrolNurse"
          label="巡视护士"
          min-width="100"
        >
          <template slot-scope="scope">
            {{user_data[scope.row.patrolNurse] || '-'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="patrolTime"
          label="巡视时间"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="100"
        ></el-table-column>
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
  </layout>
</template>

<script>
  import layout from '../../../components/dams/layout/list';
  import { doctors_advice_type } from '../../../assets/dams/js/item_config';
  import { ApiInfusionPatrol, ApiUser } from '../../../api/dams/index';
  import moment from 'moment';

  export default {
    name: 'advice_execute_list',
    components: { layout },
    data() {
      return {
        loading: false,
        config: {
          doctors_advice_type,
          patrolType: {
            0: '巡视',
            1: '暂停',
            2: '继续用药',
            3: '结束',
            9999: '执行'
          }
        },
        user_data: [],
        page_current: 1,
        page_total: 1,
        table_data: [],
        //查询表单
        search_form: {
          empId: '',
          patientId: '',
          targetDate: moment().format('YYYY-MM-DD'),
          page: 1,
          size: 10
        },
        //table多选结果
        multipleSelection: []
      };
    },
    props: ['patient', 'patientType'],
    computed: {
      btn_disable: function () {
        // 出院&&非出院召回 || 转科
        if ((this.patientType == 2 && this.patient.outHospitalFlag != 1) || this.patientType == 1) {
          return true;
        }
        return false;
      }
    },
    created() {
      let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {};
      this.search_form.empId = empInfo.empId || '';
      this.getUserData();
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
      // 获取护士用户信息
      getUserData() {
        ApiUser.nurse().then(res => {
          const data = res.data || [];
          for (let i = 0; i < data.length; i++) {
            this.user_data[data[i]['empId']] = data[i]['empName'];
          }
        }).catch(res => {
          this.$message.error(res.message);
        });
      },
      getData() {
        if (!this.hasPatient()) {
          return false;
        }
        this.table_data = [];
        this.loading = true;
        ApiInfusionPatrol.select(this.search_form)
          .then(res => {
            let list = res.data.list;
            //处理数据
            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              let advice = [];
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
                  nItem['executeId'] = item['executeId'];
                  nItem['medicalAdviceId'] = item['medicalAdviceId'];
                  nItem['medicalItemName'] = _d['medicalItemName'];
                  nItem['dosage'] = _d['dosage'];
                  nItem['checkStartStatus'] = item['checkStartStatus'];
                  nItem['checkStopStatus'] = item['checkStopStatus'];
                }
                advice.push(nItem);
              }
              //最后一条状态置为【执行】
              advice[advice.length - 1]['patrolType'] = 9999;
              //处理巡视单数据
              for (let y = 0; y < list[i].patrolList.length; y++) {
                let _d = list[i].patrolList[y];
                advice.push(_d);
              }
              this.table_data.push(...advice);
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
        if (!this.hasPatient()) {
          return false;
        }
        this.handleCurrentChange(1);
      },
      handleTableSelectionChange(val) {
        this.multipleSelection = val;
      },
      printView() {
        if (!this.hasPatient()) {
          return false;
        }
        this.$emit('option-changed', 'print', this.multipleSelection.length > 0 ? this.multipleSelection : null, this.search_form.targetDate);
      },
      resetForm() {
        this.$refs.search_form.resetFields();
        this.handleCurrentChange(1);
      },
      handleSelectable(row) {
        return row.main;
      },
      getRowKeys(row) {
        return row.medicalAdviceId + '-' + row.patrolId + '';
      },
      handleSizeChange(val) {
        this.search_form.size = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.page_current = this.search_form.page = val;
        this.getData();
      },
      hasPatient() {
        if (!this.patient.patientId) {
          this.$message.warning('请先选择患者！');
          return false;
        }
        return true;
      }
    },
    watch: {
      patient(patient) {
        this.search_form.patientId = patient.patientId;
        this.getData();
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/dams/css/self_common";
</style>
