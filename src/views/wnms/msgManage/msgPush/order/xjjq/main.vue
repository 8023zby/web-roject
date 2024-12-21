<template>
  <transition name="fade-transform"
              mode="out-in">
    <component :is="optionType"
               :detail="detail"
               @option-changed="optionChangeHandler" />
  </transition>
</template>
<script>

import add from './add.vue'
export default {
  components: { add },
  data () {
    return {
      optionType: 'add',
      detail: {}
    }
  },
  methods: {
    optionChangeHandler (optionType = 'add', detail = {}) {
      this.detail = detail
      this.optionType = optionType
    }
  }
}
</script>
