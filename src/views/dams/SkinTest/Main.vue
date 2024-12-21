<template>
  <layout>
    <div slot="aside">
      <patient-list @initPatient="initPatient" initRowType="in" initRowIndex="0"/>
    </div>
    <div slot="main">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="/list/">
          <component :is="optionType" :patient="patient" :patientType="patientType" @option-changed="optionChangeHandler"/>
        </keep-alive>
      </transition>
    </div>
  </layout>
</template>

<script>
  import layout from '../../../components/dams/layout/aside';
  import list from './List'
  import multi from './Multi'
  import PatientList from '../../../components/dams/PatientList'

  export default {
    data () {
      return {
        optionType: 'list',
        patient: {},
        patientType: {}
      }
    },
    methods: {
      initPatient (patient, type) {
        this.patient = patient
        this.patientType = type
      },
      optionChangeHandler (optionType = 'list') {
        this.optionType = optionType
      }
    },
    components: {
      PatientList, list, multi, layout
    }
  }
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/dams/css/self_common";
</style>
