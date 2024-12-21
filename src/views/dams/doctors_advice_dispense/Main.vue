<template>
  <transition name="component-fade" mode="out-in">
    <keep-alive :include="/list/">
      <component :is="optionType" :params="params" :patient="patient" @option-changed="optionChangeHandler"></component>
    </keep-alive>
  </transition>
</template>

<script>
import list from './list'
import batchDispense from './batchDispense'
import print from './Print'
import batchPrint from './batchPrint'
export default {
  name: 'Main',
  components: { list, batchDispense , print,batchPrint},
  data () {
    return {
      optionType: 'list',
      params: {},
      patient: {}
    }
  },
  methods: {
    optionChangeHandler (optionType = 'list', params = {}, patient = {}) {
      this.optionType = optionType
      this.params = params
      this.patient = patient
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  .container {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    justify-content: flex-start;
  }
</style>
