<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="/list/">
      <component :is="optionType" :patient="patient" :note="note" @option-changed="optionChangeHandler" />
    </keep-alive>
  </transition>
</template>

<script>
import list from './List'
export default {
  name: 'ClinicalReport',
  components: {
    list
  },
  data () {
    return {
      optionType: 'list',
      patient: {},
      note: {}
    }
  },
  methods: {
    optionChangeHandler (optionType = 'list', patient = {}, note = {}) {
      this.patient = patient
      this.note = note
      this.optionType = optionType
    }
  }
}
</script>
<style scoped>

</style>
