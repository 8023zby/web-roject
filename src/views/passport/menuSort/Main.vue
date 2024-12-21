<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive include="list">
      <component @main-reload="mainReload" :landingEndId="landingEndId" v-if="isRouterAlive" :is="optionType" :modifyData="modifyData" :params="params" @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
import list from './List'
import MainItem from '../../../assets/passport/mixins/MainItem'
export default {
  props: ['landingEndId'],
  components: { list },
  mixins: [MainItem]
}
</script>
