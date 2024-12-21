<template>
  <transition name="fade-transform"
              mode="out-in">
    <component @main-reload="mainReload"
               v-if="isRouterAlive"
               :is="optionType"
               :modifyData="modifyData"
               :params="params"
               @option-changed="optionChangeHandler"/>
  </transition>
</template>

<script>
  import list from './DeptDuty'
  import add from './DeptDutyAdd'
  import MainItem from '../../../assets/hsms/mixins/MainItem'

  export default {
    components: { list, add },
    mixins: [MainItem]
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/hsms/css/self_common";

</style>
