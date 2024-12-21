<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="/list/">
      <component @main-reload="mainReload"
                 v-if="isRouterAlive"
                 :is="optionType"
                 @option-changed="optionChangeHandler"/>
    </keep-alive>
  </transition>
</template>

<script>
import list from './List'
// import add from './Add'

/*
import classify from './ClassifyList'
*/
import MainItem from '../../../assets/nrms/mixins/MainItem'
export default {
  components: { list }, //, add, classify
  mixins: [MainItem]
}
</script>
