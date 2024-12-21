<template>
  <layout>
    <div slot="aside">
      <patient-list @initPatient="initPatient" initRowType="in" initRowIndex="0"/>
    </div>
    <div slot="main">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="/list/">
          <component :is="optionType" :patient="patient" :patientType="patientType" :param="param" :executeDate="executeDate" @option-changed="optionChangeHandler"/>
        </keep-alive>
      </transition>
    </div>
  </layout>
</template>

<script>
  import layout from '../../../components/dams/layout/aside';
  import list from './List';
  import print from './Print';
  import PatientList from '../../../components/dams/PatientList';

  export default {
    data() {
      return {
        optionType: 'list',
        param: '',
        executeDate: '',
        patient: {},
        patientType: {}
      };
    },
    methods: {
      initPatient(patient, type) {
        this.patient = patient;
        this.patientType = type;
      },
      optionChangeHandler(optionType = 'list', param = '', executeDate = '') {
        this.param = param;
        this.optionType = optionType;
        this.executeDate = executeDate;
      }
    },
    components: {
      PatientList, list, print, layout
    }
  };
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/dams/css/self_common";
</style>
