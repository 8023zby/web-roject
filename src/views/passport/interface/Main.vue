<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="includeList">
      <component @main-reload="mainReload" v-if="isRouterAlive" :is="optionType" :modifyData="modifyData" :params="params" @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
import list from './List'
import detail from './DetailList'
import MainItem from '../../../assets/passport/mixins/MainItem'
export default {
  components: { list, detail },
  mixins: [MainItem]
}
</script>
