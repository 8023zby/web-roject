<template>
  <transition name="fade-transform" mode="out-in">
    <component :patientType="patientType" :patient="patient" :formObj="formObj" @main-reload="mainReload" v-if="isRouterAlive" :is="optionType" :modifyData="modifyData" :params="params" @option-changed="optionChangeHandler"/>
  </transition>
</template>

<script>
import list from './InOut'
import MainItem from '../../../../assets/nrms/mixins/MainItem'
export default {
  name: 'inOutMain',
  props: ['patient', 'patientType', 'formObj'],
  components: { list },
  mixins: [MainItem]
}
</script>
