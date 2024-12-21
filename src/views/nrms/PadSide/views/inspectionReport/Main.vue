<template>
  <transition name="fade-transform" mode="out-in">
    <component :patientId="patientId" is="inspectionReport" />
  </transition>
</template>

<script>
import inspectionReport from './inspectionReport'
export default {
  components: { inspectionReport },
  props: ['patientId']
}
</script>
