<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="optionType" :detail="detail" @option-changed="optionChangeHandler" />
  </transition>
</template>

<script>
import list from './list.vue'
import add from './add.vue'
import edit from './edit.vue'
import Tlist from './Tlist'

export default {
  components: { list, add, edit, Tlist },
  data () {
    return {
      optionType: 'list',
      detail: { isWard: 1 }
    }
  },
  methods: {
    optionChangeHandler (optionType = 'list', detail = { isWard: 1 }) {
      this.detail = detail
      this.optionType = optionType
    }
  }
}
</script>
