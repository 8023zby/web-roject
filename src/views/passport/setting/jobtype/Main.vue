<template>
  <transition name="fade-transform" mode="out-in">
    <component @main-reload="mainReload" v-if="isRouterAlive" :is="optionType" :modifyData="modifyData" :params="params" @option-changed="optionChangeHandler"/>
  </transition>
</template>

<script>
import list from './jobTypeList'
import add from './jobAddModify'
import MainItem from '../../../../assets/passport/mixins/MainItem'
export default {
  components: { list, add },
  mixins: [MainItem]
}
</script>
