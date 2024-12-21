<template>
  <keep-alive v-if="$route.meta.keepAlive" :include="/list/">
    <component :is="name" :detail="detail" :actName="actName" @changed="changedRoute"></component>
  </keep-alive>
  <component v-else :is="name" :detail="detail" :actName="actName" @changed="changedRoute"></component>
</template>

<script>
import list from './list'
import add from './edit'

export default {
  name: 'nurse_level_main',
  data () {
    return {
      name: 'list',
      detail: null,
      actName: 'first'
    }
  },
  methods: {
    changedRoute (name = 'list', detail = null, actName = 'first') {
      this.name = name
      this.detail = detail
      this.actName = actName
    }
  },
  components: {
    add, list
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  }
}
</script>

<style scoped>

</style>
