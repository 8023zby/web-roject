<template>
  <transition name="fade-transform" mode="out-in">
    <component :patientId="patientId" is="examineReport" />
  </transition>
</template>

<script>
import examineReport from './examineReport'
export default {
  components: { examineReport },
  props: ['patientId']
}
</script>
