<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="/list/">
      <component :is="optionType" :patient="patient" :detail="detail" @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
  import list from './List'
  import add from './Add'

  export default {
    components: { list, add },
    data() {
      return {
        optionType: 'list',
        patient: {},
        detail: {}
      }
    },
    methods: {
      optionChangeHandler(optionType = 'list', patient = {}, detail = {}) {
        this.patient = patient;
        this.detail = detail;
        this.optionType = optionType
      }
    }
  }
</script>
