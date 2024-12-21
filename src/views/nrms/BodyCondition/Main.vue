<template>
  <layout>
    <div slot="aside">
      <PatientList @initPatient="initPatient" initRowType="in" initRowIndex="0"></PatientList>
    </div>
    <div slot="main" class="right">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="/tabs/">
          <component :is="name" :patientType="patientType" :patient="patient" @option-changed="changedOptionType"/>
        </keep-alive>
      </transition>
    </div>
  </layout>
</template>

<script>
  import layout from "../../../components/nrms/layout/aside"
  import tabs from './tabs'
  import PatientList from "../../../components/nrms/PatientList"
  export default {
    name: "Main",
    data() {
      return {
        name: 'tabs',
        patient: {},
        patientType: 0,
      };
    },
    methods: {
      initPatient(patient, type){
        this.patient = patient
        this.patientType = type
      },
      changedOptionType (name = 'tabs') {
        this.name = name
      },

    },
    components: {
      layout,tabs,PatientList
    }
  };
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
