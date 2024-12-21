<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="includeList">
      <component @main-reload="mainReload" v-if="isRouterAlive" :is="optionType" :modifyData="modifyData" :params="params" @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
import list from './List'
import add from './Modify'
import upload from './Upload'
import MainItem from '../../../../assets/passport/mixins/MainItem'
export default {
  components: { list, add, upload },
  mixins: [MainItem]
}
</script>
