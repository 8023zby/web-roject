<template>
  <transition name="fade-transform"
              mode="out-in">
    <keep-alive include="list">
      <component :is="optionType"
                 :detail="detail"
                 @option-changed="optionChangeHandler" />
    </keep-alive>
  </transition>
</template>

<script>
import list from './list.vue'
import add from './add.vue'
import edit from './edit.vue'

export default {
  components: { list, add, edit },
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
