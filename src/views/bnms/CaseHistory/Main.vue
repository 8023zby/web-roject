<template>
  <layout>
    <div slot="aside">
      <patient-list init-row-type="in" init-row-index="0" @initPatient="initPatient" />
    </div>
    <div slot="main">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="/list/">
          <component :is="optionType" :patient="patient" :patient-type="patientType" :detail="detail" @option-changed="optionChangeHandler" />
        </keep-alive>
      </transition>
    </div>
  </layout>
</template>

<script>
import layout from '../../../components/bnms/layout/aside'
import list from './List'
import detail from './Detail'
import PatientList from '../../../components/bnms/PatientList'

export default {
  components: {
    PatientList, list, detail, layout
  },
  data () {
    return {
      optionType: 'list',
      patient: {},
      patientType: {},
      detail: {}
    }
  },
  methods: {
    initPatient (patient, type) {
      this.patient = patient
      this.patientType = type
    },
    optionChangeHandler (optionType = 'list', row) {
      this.optionType = optionType
      this.detail = row
    }
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/bnms/css/self_common";
</style>
