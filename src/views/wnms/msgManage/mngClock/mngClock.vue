<template>
  <transition name="fade-transform"
              mode="out-in">
    <!-- <keep-alive exclude="add"> -->
    <component :is="optionType"
               :detail="detail"
               @option-changed="optionChangeHandler" />
    <!-- </keep-alive> -->
  </transition>
</template>

<script>
import list from './list.vue'
import add from './add.vue'
import addBell from './addBell.vue'
import mngBells from './mngBells.vue'

export default {
  components: { list, add, addBell, mngBells },
  data () {
    return {
      optionType: 'list',
      detail: {}
    }
  },
  methods: {
    optionChangeHandler (optionType = 'list', detail = {}) {
      this.optionType = optionType
      this.detail = detail
    }
  }
}
</script>
