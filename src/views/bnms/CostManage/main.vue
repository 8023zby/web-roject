<template>
  <layout>
    <div slot="aside">
      <PatientList @initPatient="initPatient" initRowType="in" initRowIndex="0"></PatientList>
    </div>
    <div slot="main" class="right">
      <el-tabs :value="activeName" v-uni="'feiyongguanli_changeTab'" @tab-click="handleClick" style="width: 100%" type="card">
        <el-tab-pane label="预交金" name="AdvanceAmount">
          <advanceAmount :patient="patient" ref="advance_amount" />
        </el-tab-pane>
        <el-tab-pane label="费用明细" name="CostDetail">
          <costDetail :patient="patient" ref="cost_detail" />
        </el-tab-pane>
        <el-tab-pane label="费用汇总信息" name="CostAggregation">
          <costAggregation :patient="patient" ref="cost_aggregation" />
        </el-tab-pane>
        <el-tab-pane label="结算信息" name="CostInformation">
          <costInformation :patient="patient" ref="cost_information" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </layout>
</template>

<script>
import layout from '../../../components/bnms/layout/aside'
export default {

  data () {
    return {
      patient: {},
      patientType: {},
      activeName: 'AdvanceAmount'
    }
  },
  components: {
    advanceAmount: () => import('./AdvanceAmount'),
    costDetail: () => import('./CostDetail'),
    costAggregation: () => import('./CostAggregation'),
    costInformation: () => import('./CostInformation'),
    PatientList: () => import('../../../components/bnms/PatientList'),
    layout
  },
  methods: {
    initPatient (patient, type) {
      this.patient = patient || {}
      this.patientType = type
    },
    handleClick (tab) {
      this.activeName = tab.name || ''
      if (this.activeName === 'AdvanceAmount') {
        this.$refs.advance_amount.getAdvanceAmountList()
      } else if (this.activeName === 'CostDetail') {
        this.$refs.cost_detail.getCostDetailList()
      } else if (this.activeName === 'CostAggregation') {
        this.$refs.cost_aggregation.getCostAggregationList()
      } else {
        this.$refs.cost_information.getCostInformationList()
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../../assets/bnms/css/self_common";
  .right  /deep/  .el-tabs {
    height: 100%;
    position: relative;
  }
   .right  /deep/ .el-tabs__content {
    position: absolute;
    top: 57px;
    left: 0;
    right: 0;
    bottom: 0;
    > div {
      height: 100%;
    }
  }
</style>
