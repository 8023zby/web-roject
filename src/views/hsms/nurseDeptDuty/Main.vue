<template>
  <transition name="fade-transform" mode="out-in">
    <component :is="name" :detail="detail" :type="type" @changed="changedRoute"/>
  </transition>
</template>

<script>
import list from './DeptDuty'
import add from './DeptDutyAdd'

export default {
  components: { list, add },
  data () {
    return {
      name: 'list',
      detail: null,
      type: ''
    }
  },
  methods: {
    changedRoute (name = 'list', detail = null, type) {
      this.name = name
      this.detail = detail
      this.type = type
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  }
}
</script>
