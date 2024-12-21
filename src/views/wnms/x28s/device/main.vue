<template>
  <transition name="fade-transform"
              mode="out-in">
    <component :is="optionType"
               :detail="detail"
               @option-changed="optionChangeHandler" />
  </transition>
</template>
<script>
import list from './list'
import addorEdit from './addorEdit'
export default {
  components: { list, addorEdit },
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
