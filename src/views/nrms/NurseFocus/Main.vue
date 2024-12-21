<template>
  <transition name="fade-transform" mode="out-in">
    <component @main-reload="mainReload" v-if="isRouterAlive" :is="optionType" :modifyData="modifyData" :params="params" @option-changed="optionChangeHandler"/>
  </transition>
</template>

<script>
  import list from './MainFocus'
  import add from './Add'
  import MainItem from '../../../assets/nrms/mixins/MainItem'
  export default {
    components: { list, add },
    mixins: [MainItem]
  }
</script>
