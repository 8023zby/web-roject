<template>
  <div class="container">
    <layout-aside v-loading="loading">
      <div slot="aside">
        <patient-list @initPatient="initPatient" initRowType="in" initRowIndex="0"/>
      </div>
      <div slot="main" class="right">
        <component :is="optionType" :patient="patient" :patientType="patientType" :detail="detail" @changed="optionChangeHandler"></component>
      </div>
    </layout-aside>
  </div>
</template>

<script>
import layoutAside from '../../../components/nrms/layout/aside'
import PatientList from '../../../components/nrms/PatientList'
import List from './List'
import Charts from './Charts'

export default {
  name: 'heart_rate_monitoring',
  data () {
    return {
      loading: false,
      patient: {},
      patientType: 0,
      optionType: 'List',
      detail: {}
    }
  },
  components: {
    PatientList,
    layoutAside,
    List,
    Charts
  },
  methods: {
    initPatient (patient, type) {
      this.patient = patient
      this.$set(this.patient, 'patientType', type)
      this.optionType = 'List'
    },
    optionChangeHandler (optionType = 'List', detail = {}) {
      this.detail = detail
      this.optionType = optionType
    }
  }
}
</script>

<style  lang="scss" type="text/scss" scoped>
  @import "../../../assets/nrms/css/self_common";
  .container {
    height: 100%
  }
</style>
