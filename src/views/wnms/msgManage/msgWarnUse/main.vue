<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="optionType" :detail="detail" pageFrom="msgWarnUse" @option-changed="optionChangeHandler" />
  </transition>
</template>
<script>
import list from '../msgWarn/list'
import addOrModify from '../msgWarn/addOrModify'
export default {
  components: { list, addOrModify },
  data () {
    return {
      optionType: 'list',
      detail: {}
    }
  },
  methods: {
    optionChangeHandler (optionType = 'list', detail = {}) {
      this.detail = detail
      this.optionType = optionType
    }
  }
}
</script>
