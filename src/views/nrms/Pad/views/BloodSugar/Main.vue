<template>
  <transition name="fade-transform" mode="out-in">
    <component :patient="patientData" @main-reload="mainReload" v-if="isRouterAlive" :is="optionType" :modifyData="modifyData" :params="params" @option-changed="optionChangeHandler"/>
  </transition>
</template>

<script>
import list from './BloodSugar'
import add from './Add'
import MainItem from '../../../../../assets/nrms/mixins/MainItem'
export default {
  components: { list, add },
  props: ['patientData'],
  mixins: [MainItem]
}
</script>
