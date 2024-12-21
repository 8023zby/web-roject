<template>
  <layout_aside v-loading="loading">
    <div slot="aside">
      <patient-list @initPatient="initPatient" initRowType="in" initRowIndex="0"/>
    </div>
    <div slot="main">
      <layout_list>

        <!-- 查询条件 -->
        <div slot="query" class="query-items">
          <el-form :inline="true" :model="search_from" ref="search_form">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="search_from.startTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="search_from.endTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="宣教项目" prop="educationProject">
              <el-input
                clearable
                v-model="search_from.educationProject"
                placeholder="标签名称"
                autocomplete="off"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <div class="typt-search-btn">
                <el-button type="primary" class="el-button-radius" icon="el-icon-search" @click="searchForm" size="small">搜索</el-button>
                <el-button type="text" @click="resetForm">重置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <!-- 操作按钮 -->
        <div slot="left_btn" class="tool-bar">
          <el-button type="warning" icon="el-icon-plus" @click="addEducation" size="small" :disabled="btn_disable"
          >添加
          </el-button>
        </div>
        <div slot="right_btn" class="tool-bar">
          <el-button type="primary" @click="" size="small" @click="evaluate" :disabled="btn_disable"
          >评价
          </el-button>
        </div>


        <div slot="main" class="main-list">
          <el-table
            ref="table"
            highlight-current-row
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
            :data="table_data"
            style="width: 100%"
            height="100%"
          >
            <el-table-column
              type="selection"
              reserve-selection
              width="60"
              align="center"
            ></el-table-column>
            <!-- <el-table-column type="index" label="序号" width="70" align="center">
            </el-table-column> -->
            <el-table-column
              prop="educationTime"
              width="110"
              align="center"
              label="宣教时间"
            >
            </el-table-column>
            <el-table-column
              prop="educationProject"
              width="120"
              label="宣教项目"
            >
            </el-table-column>
            <el-table-column
              prop="educationText"
              show-overflow-tooltip
              min-width="200"
              label="宣教内容"
            >
            </el-table-column>
            <el-table-column
              prop="educationCount"
              width="100"
              label="宣教次数"
            >
            </el-table-column>
            <el-table-column
              prop="educationObject"
              width="100"
              label="宣教对象"
            >
            </el-table-column>
            <el-table-column
              prop="educationType"
              width="100"
              label="宣教方式"
            >
            </el-table-column>
            <el-table-column
              prop="educationUser"
              width="100"
              label="宣教者"
            >
            </el-table-column>
            <el-table-column
              prop="evaluateEffect"
              width="120"
              label="效果评价"
            >
            </el-table-column>
            <el-table-column
              prop="evaluateUser"
              width="100"
              label="评价者"
            >
            </el-table-column>
            <el-table-column
              prop="evaluateTime"
              width="110"
              align="center"
              label="评价时间"
            >
            </el-table-column>

            <el-table-column label="操作" min-width="120" align="center">
              <template slot-scope="scope">
                <el-button @click="editEducation(scope.row)" type="text" :disabled="btn_disable"
                >编辑
                </el-button>
                <el-button
                  type="textred"
                  @click="deleteEducation(scope.row)" :disabled="btn_disable"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div slot="footer" class="page-bar">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="search_from.page"
            :page-size="search_from.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page_total"
          >
          </el-pagination>
        </div>
      </layout_list>
    </div>

    <template slot>
      <el-dialog
        class="content_window"
        title="评价"
        :visible.sync="evaluateDialogVisible"
        width="40%">
        <div>
          <el-form ref="content_form" label-width="80px">
            <el-form-item>
              <el-checkbox-group v-model="content_form">
                <el-checkbox :label="item" v-for="item in ['口述理解', '会演示', '需强化']">{{item}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="evaluateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="evaluateDo">确认</el-button>
      </span>
      </el-dialog>
    </template>
  </layout_aside>
</template>

<script>
  import moment from 'moment';
  import PatientList from '../../../components/nrms/PatientList';
  import layout_aside from '../../../components/nrms/layout/aside';
  import layout_list from '../../../components/nrms/layout/list';
  import { ApiEducationList, ApiUser } from '../../../api/nrms';

  export default {
    name: 'education_list_nrms',
    data() {
      return {
        loading: false,
        table_height: '500px',
        table_index: 0,
        page_total: 0,
        table_data: [],
        //患者信息
        patient: {},
        //查询表单
        search_from: {
          deptId: '',
          patientId: '',
          startTime: '',
          endTime: '',
          educationProject: '',
          size: 10,
          page: 1
        },
        multipleSelection: [],
        empName: '',
        evaluateDialogVisible: false,
        content_form: []
      };
    },
    computed: {
      btn_disable: function () {
        // 出院&&非出院召回 || 转科
        if ((this.patient.patientType == 2 && this.patient.outHospitalFlag != 1) || this.patient.patientType == 1) {
          return true;
        }
        return false;
      }
    },
    created() {
      //初始化
      let deptInfo = JSON.parse(localStorage.getItem('deptInfo')) || {};
      let empInfo = JSON.parse(localStorage.getItem('empInfo')) || {};
      this.search_from.deptId = deptInfo.deptId;
      this.empName = empInfo['empName'];
    },
    activated() {
      this.search_from.patientId && this.getData();
    },
    updated() {
      this.$nextTick(function () {
        this.$refs.table.doLayout();
      });
    },
    methods: {
      initPatient(patient, type) {
        this.patient = patient;
        this.$set(this.patient, 'patientType', type);
        this.search_from.patientId = patient.patientId;
        this.getData();
      },
      getData() {
        this.loading = true;
        ApiEducationList.select(this.search_from).then((res) => {
          let list = res.data.list;
          this.table_data = list;
          this.page_total = res.data.total;
          this.loading = false;
        });
      },
      addEducation() {
        if (!this.patient.patientId) {
          this.$message.warning('请先选择患者！');
          return false;
        }
        this.$emit('option-changed', 'add', this.patient, {});
      },
      editEducation(data) {
        this.$emit('option-changed', 'add', this.patient, data);
      },
      deleteEducation(row) {
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ApiEducationList.delete({ recordId: row.recordId })
            .then(() => {
              this.$message.success('删除成功！');
              this.getData();
            })
            .catch(res => {
              this.$message.error(res.message);
            });
        });
      },
      evaluate() {
        if (this.multipleSelection.length === 0) {
          this.$message.warning("请选择要评价的宣教！");
          return false;
        }
        this.evaluateDialogVisible = true;
      },
      evaluateDo() {
        if (this.content_form.length === 0) {
          this.$message.warning("请选择评价内容！");
          return false;
        }
        let recordIdList = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          recordIdList.push(this.multipleSelection[i].recordId);
        }
        recordIdList = recordIdList.join(',');
        ApiEducationList.evaluate({
          recordIdList: recordIdList,
          evaluateEffect: this.content_form.join(','),
          evaluateUser: this.empName,
          evaluateTime: moment().format('YYYY-MM-DD HH:mm:ss')
        })
          .then(() => {
            this.evaluateDialogVisible = false;
            this.content_form = [];
            this.$message.success('评价成功！');
            this.getData();
          })
          .catch(res => {
            this.$message.error(res.message);
          });
      },
      searchForm() {
        this.handleCurrentChange(1);
      },
      resetForm() {
        this.$refs.search_form.resetFields();
        this.handleCurrentChange(1);
      },
      handleSizeChange(val) {
        this.search_from.size = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.search_from.page = val;
        this.getData();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getRowKeys(row) {
        return row.recordId;
      }
    },
    components: {
      PatientList, layout_aside, layout_list
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";
</style>
