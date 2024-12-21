<!--
 * @Description: 风险评估
 * @Author: bjp
 * @Date: 2021-03-31 13:31:48
-->
<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include="/list/">
      <component
        @main-reload="mainReload"
        v-if="isRouterAlive"
        :is="optionType"
        :modifyData="modifyData"
        :params="params"
        @option-changed="optionChangeHandler"
      />
    </keep-alive>
  </transition>
</template>

<script>
import list from './List'
import add from './Add'
import MainItem from '@/assets/nrms/mixins/MainItem'
export default {
  components: { list, add }, //, add, classify
  mixins: [MainItem]
}
</script>
