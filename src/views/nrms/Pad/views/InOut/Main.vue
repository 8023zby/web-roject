<template>
  <transition name="fade-transform" mode="out-in">
    <component :patient="patientData" @main-reload="mainReload" v-if="isRouterAlive" :is="optionType" :modifyData="modifyData" :params="params" @option-changed="optionChangeHandler"/>
  </transition>
</template>

<script>
import list from './InOut'
import add from './Add'
import MainItem from '../../../../../assets/nrms/mixins/MainItem'
export default {
  name: 'inOutMain',
  props: ['patientData'],
  components: { list, add },
  mixins: [MainItem]
}
</script>
