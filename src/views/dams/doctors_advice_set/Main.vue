<template>
  <transition name="component-fade" mode="out-in">
    <keep-alive :include="/list/">
      <component
        :is="optionType"
        :params="params"
        :tab="tab"
        @option-changed="optionChangeHandler">
      </component>
    </keep-alive>
  </transition>
</template>

<script>
import list from './FrequencySettingList'
import add from './FrequencySettingListAdd'

export default {
  name: 'Main',
  components: { add, list },
  // 路由传参 router.js
  props: ['activeName'],
  data () {
    return {
      optionType: 'list',
      params: {},
      tab: {
        activeName: 'frequency'
      }
    }
  },
  created () {
    this.tab.activeName = this.activeName
  },
  methods: {
    // 页面跳转
    optionChangeHandler (optionType = 'Tab', params = {}, tab = {}) {
      this.optionType = optionType
      this.params = params
      this.tab = tab
    }
  }
}
</script>

<style scoped>

</style>
