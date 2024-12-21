<!--走廊公告-->
<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="optionType" :detail="detail" @option-changed="optionChangeHandler" />
  </transition>
</template>
<script>
import index from './index'
import ledAddorEdit from './led-addorEdit'
import latticeAddorEdit from './lattice-addorEdit'
import tempNumCall from '@/views/wnms/x28s/Manage/template/tempNumCall'
import tempNumView from '@/views/wnms/x28s/Manage/template/tempNumView'
import tempNumVideo from '@/views/wnms/x28s/Manage/template/tempNumVideo'
export default {
  components: { index, ledAddorEdit, latticeAddorEdit, tempNumCall, tempNumView, tempNumVideo },
  data () {
    return {
      optionType: 'index',
      detail: {}
    }
  },
  methods: {
    optionChangeHandler (optionType = 'index', detail = {}) {
      this.detail = detail
      this.optionType = optionType
    }
  }
}
</script>
