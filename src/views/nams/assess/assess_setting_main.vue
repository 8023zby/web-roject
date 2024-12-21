<template>
  <transition name="fade-transform"
              mode="out-in">
    <keep-alive :include="/Tab/">
      <component :is="optionType"
                 :assessDetail="assessDetail"
                 @clear-changed="clearChangeHandler"
                 @option-changed="optionChangeHandler" />
    </keep-alive>
  </transition>
</template>

<script>
import Tab from './assess_setting_tab'
import Add from './assess_setting_add'

export default {
  components: { Tab, Add },
  data () {
    return {
      optionType: 'Tab',
      assessDetail: {}
    }
  },
  mounted () {
  },
  methods: {
    optionChangeHandler (optionType = 'Tab', assessDetail = {}) {
      this.optionType = optionType
      this.assessDetail = assessDetail
    },
    clearChangeHandler () {
      this.assessDetail = {}
    }
  }
}
</script>

<style>
</style>
