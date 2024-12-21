<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="/tab/">
      <component @main-reload="mainReload" v-if="isRouterAlive" :is="optionType" :modifyData="modifyData" :params="params" @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
import list from './Tab'
import add from './Add'
import MainItem from '../../../assets/nrms/mixins/MainItem'
export default {
  components: { list, add },
  mixins: [MainItem]
}
</script>
