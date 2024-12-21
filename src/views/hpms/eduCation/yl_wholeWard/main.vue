<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="optionType" :detail="detail" @option-changed="optionChangeHandler" />
  </transition>
</template>

<script>
import list from '../yl_ward/list'
import add from '../yl_ward/add.vue'
import edit from '../yl_ward/edit.vue'
import Tlist from '../yl_ward/Tlist'
import previewView from '../yl_ward/previewView'
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
