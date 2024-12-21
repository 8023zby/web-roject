<template>
  <transition name="component-fade"
              mode="out-in">
    <keep-alive :include="/List/">
      <component :is="optionType"
                 :params="params"
                 :tab="tab"
                 @option-changed="optionChangeHandler"></component>
    </keep-alive>
  </transition>
</template>

<script>
import List from './List'

export default {
  name: 'NurseShiftRecordMain',
  components: { List },
  data () {
    return {
      optionType: 'List',
      params: {},
      tab: {
        activeName: 'frequency'
      }
    }
  },
  methods: {
    // 页面跳转
    optionChangeHandler (optionType = 'List', params = {}, tab = {}) {
      this.optionType = optionType
      this.params = params
      this.tab = tab
    }
  }
}
</script>

<style scoped>

</style>
