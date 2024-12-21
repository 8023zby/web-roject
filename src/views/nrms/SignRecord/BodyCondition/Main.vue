<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="/List/">
      <component
        :patientType="patientType"
        :patient="patient"
        @main-reload="mainReload"
        v-if="isRouterAlive"
        :is="optionType"
        :modifyData="modifyData"
        :params="params"
      />
    </keep-alive>
  </transition>
</template>

<script>
import list from './List'
import MainItem from '../../../../assets/nrms/mixins/MainItem'
export default {
  components: { list },
  props: ['patient', 'patientType'],
  mixins: [MainItem]
}
</script>
