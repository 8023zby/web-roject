<template>
  <transition name="fade-transform" mode="out-in">
    <component @main-reload="mainReload" v-if="isRouterAlive" :is="optionType" :modifyData="modifyData" :params="params" @option-changed="optionChangeHandler"/>
  </transition>
</template>

<script>
import list from './CallHistorysList'
import MainItem from '../../../assets/ecms/mixins/MainItem'
export default {
  components: { list },
  mixins: [MainItem]
}
</script>
