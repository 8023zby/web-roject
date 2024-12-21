<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="optionType" :detail="detail" @option-changed="optionChangeHandler" />
  </transition>
</template>
<script>
import list from './list'

export default {
  components: { list },
  data () {
    return {
      optionType: 'list',
      detail: { type: 'list' }
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
