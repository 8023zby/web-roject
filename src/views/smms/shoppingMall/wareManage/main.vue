<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="optionType" :detail="detail" @option-changed="optionChangeHandler" />
  </transition>
</template>

<script>
import list from './list-new.vue'
import add from './add.vue'
import addNew from './add-new.vue'
import edit from './edit.vue'
import editNew from './edit-new.vue'
import check from './check.vue'
export default {
  components: { list, add, addNew, edit, editNew, check },
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
