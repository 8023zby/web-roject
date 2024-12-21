<template>
  <layout>
    <div slot="aside">
      <PatientList @initPatient="initPatient" initRowType="in" initRowIndex="0" ref="patientList"></PatientList>
    </div>
    <div slot="main" class="right">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="/tabs/">
          <component :is="name" :patientType="patientType" :patient="patient" :params="nodeData" @option-changed="changedOptionType" @batch-sign="batchSignJump"/>
        </keep-alive>
      </transition>
    </div>
  </layout>
</template>

<script>
import layout from '../../../components/nrms/layout/aside'
import list from './tabs'
import blood_sugar_chart from './charts/blood_sugar_chart'
import blood_sugar_chart2 from './charts/blood_sugar_chart2'
import chart_tabs from './charts/chart_tabs'
import PatientList from '../../../components/nrms/PatientList'
export default {
  name: 'sign_manage',
  data () {
    return {
      name: 'list',
      activeName: 'first',
      patient: {},
      patientType: 0,
      nodeData: {}
    }
  },
  methods: {
    // hidePatientList (){
    //   this.$refs.patientList.hide();
    // },
    initPatient (patient, type) {
      this.patient = patient
      this.patientType = type
    },
    changedOptionType (name = 'list', data = {}) {
      this.nodeData = data
      this.name = name
    },
    // 体征批量录入页面跳转
    batchSignJump (data) {
      this.$emit('main-option-changed', data)
    }
  },
  components: {
    layout,
    blood_sugar_chart,
    blood_sugar_chart2,
    list,
    PatientList,
    chart_tabs,
    bloodSugarChartShibo: () => import('./charts/blood_sugar_chart_shibo')
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../../assets/nrms/css/self_common";
  .right /deep/ .el-tabs {
    height: 100%;
    position: relative;
  }
  .right /deep/ .el-tabs__content {
    position: absolute;
    top: 47px;
    left: 0;
    right: 0;
    bottom: 0;
    > div {
      height: 100%;
    }
  }
</style>
