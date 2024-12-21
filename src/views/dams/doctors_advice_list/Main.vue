<template>
  <layout>
    <div slot="aside">
      <patient-list @initPatient="initPatient" initRowType="in" initRowIndex="0"/>
    </div>
    <div slot="main" class="right">
      <el-tabs :value="activeName" type="card" @tab-click="handleClick" style="width: 100%">
        <el-tab-pane label="长期医嘱" name="first">
          <long_term :patient="patient" :patientType="patientType" />
        </el-tab-pane>
        <el-tab-pane label="临时医嘱" name="second" style="overflow: auto">
          <temporary :patient="patient" :patientType="patientType" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </layout>
</template>

<script>
  import layout from '../../../components/dams/layout/aside'
  export default {
    name: "doctors_advices_manage",
    data() {
      return {
        activeName: "first",
        patient: {},
        patientType: 0
      };
    },
    methods: {
      initPatient(patient, type){
        this.patient = patient;
        this.patientType = type;
      },
      handleClick(tab) {
      }
    },
    components: {
      layout,
      PatientList: () => import("../../../components/dams/PatientList"),
      'long_term': () => import("./long_term/Main"),
      'temporary': () => import("./temporary/Main"),
    }
  };
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../../assets/dams/css/self_common";
  .right /deep/ .el-tabs {
    height: 100%;
    position: relative;
  }
  .right /deep/ .el-tabs__content {
    position: absolute;
    top: 57px;
    left: 0;
    right: 0;
    bottom: 0;
    > div {
      height: 100%
    }
  }
</style>
