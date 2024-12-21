<template>
  <transition name="fade-transform"
              mode="out-in">
    <component :is="optionType"
               :detail="detail"
               @option-changed="optionChangeHandler" />
  </transition>
</template>
<script>

import list from './tmpls/list.vue'
import addorEdit from './tmpls/addorEdit.vue'
export default {
  components: { list, addorEdit },
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
