<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="optionType" :detail="detail" @option-changed="optionChangeHandler" />
  </transition>
</template>

<script>
import list from '../ward/list'
import add from '../ward/add.vue'
import edit from '../ward/edit.vue'
import Tlist from '../ward/Tlist'
import previewView from '../ward/previewView'
export default {
  components: { list, add, edit, Tlist, previewView },
  data () {
    return {
      optionType: 'list',
      detail: { isWard: 0 }
    }
  },
  methods: {
    optionChangeHandler (optionType = 'list', detail = { isWard: 0 }) {
      this.detail = detail
      this.optionType = optionType
    }
  }
}
</script>
