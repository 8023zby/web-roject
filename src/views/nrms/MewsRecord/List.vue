<template>
  <layout v-loading="loading">
    <div slot="aside">
      <!-- 患者列表 -->
      <patient-list @initPatient="initPatient" initRowType="in" initRowIndex="0" />
    </div>
    <listLayout slot="main">
      <div slot="query" class="query-items">
        <el-form v-uni="'mewsrecord_form'" class="demo-form-inline" :inline="true" :model="searchObj" ref="formSearch">
          <el-form-item label="日期:" prop="beginTime">
            <el-date-picker v-uni="'mewsrecord_beginTime'" type="date" v-model="searchObj.beginTime" :clearable="false" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <span class="split">至</span>
          <el-form-item prop="endTime">
            <el-date-picker v-uni="'mewsrecord_endTime'" type="date" v-model="searchObj.endTime" :clearable="false" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="记录人:" prop="recorder">
            <el-input v-uni="'mewsrecord_jiluren'" v-model="searchObj.recorder" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="typt-search-btn">
              <el-button v-uni="'mewsrecord_search'" type="primary" class="el-button-radius" icon="el-icon-search" @click="getData" size="small">搜索</el-button>
              <el-button v-uni="'mewsrecord_reset'" type="text" @click="resetSearchObj">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="main" class="main-list table">
        <!-- 表格 -->
        <el-table :data="dataList" stripe ref="table" height="100%">
          <el-table-column label="时间" width="140" align="center">
            <template slot-scope="scope">
              {{formatTime(scope.row.createTime,'YYYY-MM-DD HH:mm')}}
            </template>
          </el-table-column>
          <el-table-column label="总分" width="120" align="center">
            <template slot-scope="scope">
              <div :style="{color:scope.row.color}">{{scope.row.totalLevel}}</div>
            </template>
          </el-table-column>
          <el-table-column label="体温(℃)" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.temperatureAndScore}}
            </template>
          </el-table-column>
          <el-table-column prop="temperaturePosition" label="体温测量方式" width="120" align="center">
          </el-table-column>
          <el-table-column label="心率(次/分)" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.heartRateAndScore}}
            </template>
          </el-table-column>
          <el-table-column label="呼吸(次/分)" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.breathAndScore}}
            </template>
          </el-table-column>
          <el-table-column label="血压(mmHg)" width="120" align="center">
            <template slot-scope="scope">
              {{scope.row.pressureAndScore}}
            </template>
          </el-table-column>
          <el-table-column prop="pressurePosition" label="测量位置" width="100" align="center">
          </el-table-column>
          <el-table-column prop="pulse" label="脉搏" width="100" align="center">
          </el-table-column>
          <el-table-column label="意识" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.consciousnessAndScore}}
            </template>
          </el-table-column>
          <el-table-column prop="deviceCode" label="设备编号" width="auto" align="center">
          </el-table-column>
          <el-table-column prop="recorder" label="记录人" min-width="100" align="center"></el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div slot="footer" class="page-bar">
        <!--组件页码显示-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchObj.page" :page-sizes="[ 10, 20, 30, 40, 50, 100]" :page-size="searchObj.size" layout="total, sizes, prev, pager, next, jumper" :total="page_total"></el-pagination>
      </div>
    </listLayout>
    <template>
    </template>
  </layout>
</template>
<script>
import layout from '../../../components/nrms/layout/aside';
import listLayout from '../../../components/nrms/layout/list';
import PatientList from '../../../components/nrms/PatientList';
import { ApiMewsManage } from '../../../api/nrms';
import moment from 'moment';

export default {
  name: 'list',
  data () {
    return {
      loading: false,
      page_total: 0,
      patient: {}, // 患者信息,
      dataList: [],
      // 查询参数
      searchObj: {
        beginTime: moment().subtract(6, 'days').format('YYYY-MM-DD HH:mm'),
        endTime: moment().subtract(0, 'days').format('YYYY-MM-DD HH:mm'),
        patientId: '',
        recorder: '',
        size: 10,
        page: 1
      }
    };
  },
  created () {

  },
  methods: {
    getData () {
      this.loading = true;
      this.dataList = [];
      ApiMewsManage.selectRecord(this.searchObj)
        .then(res => {
          let resArr = res.data.list || [];
          resArr.forEach(item => {
            item['totalLevel'] = item['total'] ? item['total'] + '分(' + item['level'] + ')' : '-';

            if (item['temperatureScore'] != null) {
              item['temperatureAndScore'] = item['temperature'] ? item['temperature'] + '(' + item['temperatureScore'] + '分)' : '-';
            } else {
              item['temperatureAndScore'] = item['temperature'] ? item['temperature'] : '-';
            }

            item['temperaturePosition'] = item['temperaturePosition'] || '-';
            item['heartRateAndScore'] = item['heartRate'] ? item['heartRate'] + '(' + item['heartRateScore'] + '分)' : '-';
            item['breathAndScore'] = item['breath'] ? item['breath'] + '(' + item['breathScore'] + '分)' : '-';
            let blood = (item['pressure'] || '-') + '/' + (item['diastolicPressure'] || '-');
            item['pressureAndScore'] = item['pressure'] || item['diastolicPressure'] ? blood + '(' + item['pressureScore'] + '分)' : '-';
            item['pressurePosition'] = item['pressurePosition'] || '-';
            item['pulse'] = item['pulse'] || '-';
            item['consciousnessAndScore'] = item['consciousness'] ? item['consciousness'] + '(' + item['consciousnessScore'] + '分)' : '-';
            item['deviceCode'] = item['deviceCode'] || '-';
            item['recorder'] = item['recorder'] || '-';
            this.dataList.push(item);
          });
          this.page_total = res.data.total;
          this.loading = false;
        })
        .catch(res => {
          this.loading = false;
          this.$message.error(res.message);
        });
    },
    // 初始化
    initPatient (patient, type = 0) {
      this.patient = patient || {};
      this.patientType = type;
    },
    // 处理size变化
    handleSizeChange (val) {
      this.searchObj.size = val;
      this.getData();
    },
    // 分页当前页码变化
    handleCurrentChange (val) {
      this.searchObj.page = val;
      this.getData();
    },
    // 重置搜索参数
    resetSearchObj () {
      this.$refs['formSearch'].resetFields();
      this.handleCurrentChange(1);
    },
    formatTime (time, formatStr = 'YYYY-MM-DD HH:mm:ss') {
      if (!time) {
        return '';
      }
      return moment(time).format(formatStr);
    }
  },
  watch: {
    patient: {
      handler: function (val) {
        this.searchObj.patientId = val.patientId;
        this.searchObj.page = 1;
        val.patientId && this.getData();
      },
      immediate: true
    }
  },
  components: {
    PatientList,
    layout,
    listLayout
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../assets/nrms/css/self_common";
.query-items {
  .split {
    display: inline-block;
    line-height: 32px;
    margin: 12px 0;
  }
}
.operation-type-add {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 20px;
  .operation-type-label {
    padding-top: 5px;
  }
}
.operation-type-radio {
  display: flex;
  flex-direction: column;
  .el-radio {
    margin: 10px;
  }
}
</style>
