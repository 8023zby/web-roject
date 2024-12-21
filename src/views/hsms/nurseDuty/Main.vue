<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="name" :detail="detail" @changed="changedRoute"/>
  </transition>
</template>

<script>
import list from './Duty'
import add from './DutyAdd'

export default {
  components: { list, add },
  data () {
    return {
      name: 'list',
      detail: null
    }
  },
  methods: {
    changedRoute (name = 'list', detail = null) {
      this.name = name
      this.detail = detail
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  }
}
</script>
