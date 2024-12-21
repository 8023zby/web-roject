<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="optionType" :detail="detail" @option-changed="optionChangeHandler" />
  </transition>
</template>
<script>
import list from './list'
import edit from './edit'
export default {
  components: { list, edit },
  data () {
    return {
      optionType: 'list',
      detail: {}
    }
  },
  mounted () {
  },
  methods: {
    optionChangeHandler (optionType = 'list', detail = {}) {
      this.detail = detail
      this.optionType = optionType
    }
  }
}
</script>
